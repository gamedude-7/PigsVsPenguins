var playerPrefab: GameObject;
var targetController : ThirdPersonController;
private var verticalInput : float;
private var horizontalInput : float;
var timeSinceShot :float;

// We store 20 states with "playback" info
private var m_BufferedState: State[] = new State[20];
// Keep track of what slots are used
private var m_TimestampCount: int;

public var m_InterpolationBackTime : float = 0.1;
public var  m_ExtrapolationLimit : float = 0.5;
var pos: Vector3;
var rot: Quaternion;
var dizzy: boolean = false;

var passedWaypoints: Array;
var waypointsReached:int = 0;
var distanceBetweenPlayerAndWaypoint:float = 0;
var finishedTime: float = 99999;
var playerHeading:Vector3;

var lapCount:int = 0;
var finishCount:int = 0;
var playerRank:int = 0;
var myRank:int = 0;
var isFinished:boolean = false;

var bulletAmmo : int = 0;
var shieldAmmo : int = 0;

var item: int = -1;
var timeSinceShieldActivated: float = 0;
var isShieldActivated: boolean = false;
var shieldTime: int = 10;
var hitPoints: int = 3;
var penguinParticles: ParticleRenderer[];

class State
{
	var timestamp: float; 
	var pos: Vector3;
	var velocity: Vector3;
	var rot: Quaternion;
}

function Start()
{

	passedWaypoints = new Array();
	
	for (var go in FindObjectsOfType(Character))
	{		
		for (var currentPlayer: PlayerInfo in GameLobby.playerList )
		{
			if ( go.gameObject.name.Contains( currentPlayer.username))
			{
				if (gameObject.Find("Code").GetComponent(GameLobby).levelToLoad == 1)
				{
					gameObject.Find("Waypoints").GetComponent(Race).playersInGame.Push(go.gameObject.name);
				}
				go.gameObject.Find("playerName").GetComponent(TextMesh).text = currentPlayer.username;
			}
		}
	}	
}

function OnCollisioEnter(o: Collision)
{
	o.rigidbody.velocity = Vector3.zero;
}
function Update () {

		if ( Input.GetKey("escape")) {
			Application.Quit();
		}
		// This is the target playback time of the rigid body
		var interpolationTime: float = Network.time - m_InterpolationBackTime;
		
		if (m_BufferedState[0]!=null)
		{
			// Use interpolation if the target playback time is present in the buffer
			if (m_BufferedState[0].timestamp > interpolationTime)
			{
				// Go through buffer and find correct state to play back
				for (var i:int=0;i<m_TimestampCount;i++)
				{
					if (m_BufferedState[i].timestamp <= interpolationTime || i == m_TimestampCount-1)
					{
						// The state one slot newer (<100ms) than the best playback state
						var rhs: State = m_BufferedState[Mathf.Max(i-1, 0)];
						// The best playback state (closest to 100 ms old (default time))
						var lhs: State = m_BufferedState[i];
						
						// Use the time between the two slots to determine if interpolation is necessary
						var length:float = rhs.timestamp - lhs.timestamp;
						var t: float = 0.0F;
						// As the time difference gets closer to 100 ms t gets closer to 1 in 
						// which case rhs is only used
						// Example:
						// Time is 10.000, so sampleTime is 9.900 
						// lhs.time is 9.910 rhs.time is 9.980 length is 0.070
						// t is 9.900 - 9.910 / 0.070 = 0.14. So it uses 14% of rhs, 86% of lhs
						if (length > 0.0001)
							t = ((interpolationTime - lhs.timestamp) / length);
						
						// if t=0 => lhs is used directly
						transform.localPosition = Vector3.Lerp(lhs.pos, rhs.pos, t);
						transform.localRotation = Quaternion.Slerp(lhs.rot, rhs.rot, t);
						return;
					}
				}
			}
			// Use extrapolation
			else
			{
				var latest: State = m_BufferedState[0];
				
				var extrapolationLength:float = (interpolationTime - latest.timestamp);
				// Don't extrapolation for more than 500 ms, you would need to do that carefully
				if (extrapolationLength < m_ExtrapolationLimit)
				{
				//	float var axisLength: float = extrapolationLength * latest.angularVelocity.magnitude * Mathf.Rad2Deg;
					//Quaternion angularRotation = Quaternion.AngleAxis(axisLength, latest.angularVelocity);
					
					transform.position = latest.pos;// + latest.velocity * extrapolationLength;
					transform.rotation = latest.rot;
					GetComponent.<Rigidbody>().velocity = latest.velocity;
					//rigidbody.angularVelocity = latest.angularVelocity;
				}
			}
		}
		
	
	if (dizzy)
	{

		timeSinceShot += Time.deltaTime;
		if (hitPoints>0)		
			transform.Rotate(Vector3.right,Time.deltaTime*1080);
		if(timeSinceShot > 1)
		{		
			if (gameObject.Find("Code").GetComponent(GameLobby).levelToLoad==2)
			{
					hitPoints--;
					timeSinceShot=0;
					dizzy = false;
			}
			if (GetComponent.<NetworkView>().isMine)
			{												
				if (hitPoints <= 0 && gameObject.Find("Code").GetComponent(GameLobby).levelToLoad==2)
				{					
					Debug.Log("You Lose");					
					if (gameObject.name.Contains("Pig"))
					{
						transform.FindChild("PvP_MDL_Pig(BETA)").FindChild("Body").gameObject.GetComponent.<Renderer>().enabled = false;
						transform.FindChild("PvP_MDL_Pig(BETA)").FindChild("Helm2").gameObject.GetComponent.<Renderer>().enabled = false;
					}
					else
					{
						transform.FindChild("polySurface59").gameObject.GetComponent.<Renderer>().enabled = false;
						transform.FindChild("Fire1").FindChild("OuterCore").GetComponent.<Renderer>().enabled = false;
						transform.FindChild("Fire2").FindChild("OuterCore").GetComponent.<Renderer>().enabled = false;		
					}
				}
				else
				{				
					GetComponent(FlightControls).EnableUserInput(true);					
					Debug.Log(hitPoints);
				}
			}
			else
			{
				if (hitPoints <= 0 && gameObject.Find("Code").GetComponent(GameLobby).levelToLoad==2)
				{		
					if (gameObject.name.Contains("Pig"))
					{
						transform.FindChild("PvP_MDL_Pig(BETA)").FindChild("Body").gameObject.GetComponent.<Renderer>().enabled = false;
						transform.FindChild("PvP_MDL_Pig(BETA)").FindChild("Helm2").gameObject.GetComponent.<Renderer>().enabled = false;
					}
					else
					{
						transform.FindChild("polySurface59").gameObject.GetComponent.<Renderer>().enabled = false;
						transform.FindChild("Fire1").FindChild("OuterCore").GetComponent.<Renderer>().enabled = false;
						transform.FindChild("Fire2").FindChild("OuterCore").GetComponent.<Renderer>().enabled = false;
					}
				}
			}
		}
		
	}
	
	if (hitPoints>0)
	{
		if(Input.GetButtonDown("Fire1"))
		{
			if ( bulletAmmo > 0 && !isFinished && item == 0 )
			{
				bulletAmmo--;				
				transform.BroadcastMessage("Shoot");
			}
			else if (item == 1 && !GetComponent(FlightControls).isBoostActivated)
			{
				GetComponent(FlightControls).isBoostActivated = true;
				GetComponent(FlightControls).boostAmmo = 0;
				GetComponent(FlightControls).timeSinceBoostActivated = 0;
				if (gameObject.Find("Code").GetComponent(GameLobby).playerCharacter == "Penguin")
					transform.FindChild("Fire1").transform.FindChild("OuterCore").GetComponent.<ParticleEmitter>().minSize*=100;
				else
					transform.FindChild("PvP_MDL_Pig(BETA)").GetComponent.<Animation>().Play("flyfast");
				item = -1;
			}
			else if (item >= 2 && !isShieldActivated)
			{
				if (GetComponent.<NetworkView>().isMine)
				{
					ActivateShieldOnMyCharacter();
				}
			}  
		}
	}
}

function OnNetworkInstantiate (msg : NetworkMessageInfo) {
	Debug.Log("Player spawned at " + transform.position);
	
	// This is our own player
	if (GetComponent.<NetworkView>().isMine)
	{				
		if (GetComponent("FlightControls")!=null)
		{
			GetComponent("FlightControls").EnableUserInput(true);
		}
		var aCharacter: String = gameObject.Find("Code").GetComponent(GameLobby).playerCharacter;
		if (gameObject.Find("Code").GetComponent(GameLobby).levelToLoad == 3)
			Camera.main.GetComponent("SmoothFollow").target = gameObject.Find("PenguinCarPrefab(Clone)").transform;				
		else if ( aCharacter == "Penguin" )
			Camera.main.GetComponent("Cam").target = gameObject.Find("PenguinPrefab(Clone)").transform;				
		else
			Camera.main.GetComponent("Cam").target = gameObject.Find("PigPrefab(Clone)").transform;
		name += ""+ MainMenu.playerNameInput;
	
		if (gameObject.Find("Code").GetComponent(GameLobby).levelToLoad == 1) // if in artic racing level
		{
			gameObject.Find("Waypoints").GetComponent(Race).myPlayer = gameObject;
			gameObject.Find("Waypoints").GetComponent(Race).myPlayerName = gameObject.name;
			gameObject.Find("Waypoints").GetComponent(Race).myPlayer.GetComponent(Character).lapCount = 1;
			gameObject.Find("Waypoints").GetComponent(Race).myPlayer.GetComponent(Character).finishCount = 1;
		}
	}
	// This is just some remote controlled player, don't execute direct
	// user input on this
	else
	{
		GetComponent("FlightControls").EnableUserInput(false);		
		for (var currentRemotePlayer:PlayerInfo in GameLobby.playerList)
		{
			if (currentRemotePlayer.player.ToString() ==  msg.sender.ToString())
			{
				name += "Remote"+currentRemotePlayer.username;				
				break;
			}
		}
	}
}



function OnSerializeNetworkView( stream : BitStream, info : NetworkMessageInfo)
{
	// Always send transform (depending on reliability of the network view)
	if (stream.isWriting)
	{
		pos = transform.position;
		velocity = GetComponent.<Rigidbody>().velocity;
		rot = transform.rotation;
		stream.Serialize( pos );
		stream.Serialize( velocity );
		stream.Serialize( rot);

		Debug.Log("Writing position: " + pos);
	}
	// When receiving, buffer the information
	else
	{
		pos = Vector3.zero;
		velocity = Vector3.zero;
		rot = Quaternion.identity;
		stream.Serialize( pos );
		stream.Serialize( velocity );
		stream.Serialize( rot );
		
		Debug.Log("Reading position: " + pos);
		// shift the buffer sideways, deleting state 20
		for(var i: int = m_BufferedState.Length-1; i>=1; i--)
		{
			m_BufferedState[i] = m_BufferedState[i-1];
		}
	
		// Record current state in slot 0
		var state : State = new State();
		state.timestamp = info.timestamp;
		state.pos = pos;
		state.velocity = velocity;
		state.rot = rot;

		state.timestamp = info.timestamp;
		Debug.Log("Reading state position: " + state.pos);
		Debug.Log("Reading state rotation: " + state.rot);
		m_BufferedState[0] = state;
		Debug.Log("Buffered state position: " + m_BufferedState[0].pos);
		Debug.Log("Buffered state rotation: " + m_BufferedState[0].rot);
		// Update used slot count, however never exceed the buffer size
		// Slots aren't actually freed so this just makes sure the buffer is
		// filled up and that uninitalized slots aren't used.
	
		m_TimestampCount = Mathf.Min(m_TimestampCount + 1, m_BufferedState.Length);

		// Check if states are in order, if it is inconsistent you could reshuffel or 
		// drop the out-of-order state. Nothing is done here
		for ( i = 0; i<m_TimestampCount-1;i++)
		{
			if (m_BufferedState[i].timestamp < m_BufferedState[i+1].timestamp)
				Debug.Log("State inconsistent");
		}
		
		//transform.position =  m_BufferedState[0].pos;
		//transform.rotation =  m_BufferedState[0].rot;
	}
}

function OnGUI()
{
	if(GetComponent.<NetworkView>().isMine)
	{
		if (hitPoints <= 0 && gameObject.Find("Code").GetComponent(GameLobby).levelToLoad==2)
			GUI.Box(Rect(0,0,Screen.width,Screen.height), "You Lost!");
		else if (gameObject.Find("Code").GetComponent("GameLobby").gameStarted && gameObject.Find("Code").GetComponent(GameLobby).levelToLoad==2)
			GUI.Box(Rect(Screen.width/2-50, Screen.height/2+150,100,25), "Hit Points: " + hitPoints.ToString());
	}	
}

function OnConnectedToServer() {
	for (var go in FindObjectsOfType(GameObject))
	{
		Debug.Log("go: " + go.name);
		(go as GameObject).SendMessage("OnNetworkLoadedLevel", SendMessageOptions.DontRequireReceiver);
	}
}

function OnCollisionEnter(o:Collision)
{
	//if (networkView.isMine)
	//{
		if (o.gameObject.name == "fish bullet(Clone)" || o.gameObject.name == "FallingIce(Clone)")
		{
			if (!isShieldActivated)
			{			
				GetComponent(FlightControls).EnableUserInput(false);
				SetDizzyOnCharacter();
			}
		}
	//}
	Debug.Log("Collided with " + o.gameObject.name);
	//Debug.Break();
}


function ActivateShieldOnMyCharacter()
{
	
	var playerID: NetworkViewID = GetComponent(NetworkView).viewID;
	if (Network.isServer)
	{		
		
		ActivateShield(playerID);
		GetComponent.<NetworkView>().RPC("ActivateShield", RPCMode.Others, playerID);
	}
	else
		GetComponent.<NetworkView>().RPC("ServerActivateShieldOnPlayer",RPCMode.Server, playerID);
}

function enableShieldRenderer()
{
	GetComponentInChildren(Shield).transform.GetComponent.<Renderer>().enabled = true;
}

function disableShieldRenderer()
{
	GetComponentInChildren(Shield).transform.GetComponent.<Renderer>().enabled = false;
}
@RPC
function ServerActivateShieldOnPlayer(netviewID: NetworkViewID)
{
	GetComponent.<NetworkView>().RPC("ActivateShield",RPCMode.All, netviewID);
}

@RPC
function ActivateShield(netviewID : NetworkViewID)
{
	for (var currentPlayer in FindObjectsOfType(Character))
	{
		if ( currentPlayer.GetComponent(NetworkView).viewID == netviewID)
		{
			currentPlayer.GetComponent(Character).isShieldActivated = true;
			currentPlayer.GetComponent(Character).timeSinceShieldActivated = 0;
			currentPlayer.GetComponent(Character).shieldAmmo = 0;
			currentPlayer.GetComponent(Character).item = -1;
			break;
		}
	}
}


function SetDizzyOnCharacter()
{	
	var playerID: NetworkViewID = GetComponent(NetworkView).viewID;
	if (Network.isServer)
	{							
		ServerSetDizzyOnPlayer(playerID);
		GetComponent.<NetworkView>().RPC("ServerSetDizzyOnPlayer", RPCMode.Others, playerID);
	}
	else
		GetComponent.<NetworkView>().RPC("ServerSetDizzyOnPlayer", RPCMode.Server, GetComponent.<NetworkView>().viewID);
}

@RPC
function ServerSetDizzyOnPlayer(netviewID: NetworkViewID)
{
	GetComponent.<NetworkView>().RPC("SetDizzy",RPCMode.All, netviewID);
}

@RPC
function SetDizzy(netviewID : NetworkViewID)
{
	for (var currentPlayer in FindObjectsOfType(Character))
	{
		if ( currentPlayer.GetComponent(NetworkView).viewID == netviewID)
		{
			currentPlayer.GetComponent(Character).dizzy = true;
			break;
		}
	}
}

