var player1Prefab: GameObject;
var targetController : ThirdPersonController;
private var verticalInput : float;
private var horizontalInput : float;



// We store 20 states with "playback" info
private var m_BufferedState: State[] = new State[20];
// Keep track of what slots are used
private var m_TimestampCount: int;

function Awake()
{

	Network.Instantiate(player1Prefab, transform.position, transform.rotation, 0);
	//player1Prefab = gameObject.Find("PenguinPrefab(Clone)");
	//gameObject.Find("Main Camera").GetComponent(ThirdPersonCamera).cameraTransform = 
}

function OnNetworkInstantiate (msg : NetworkMessageInfo) {

	if (Network.isClient)
	{
		gameObject.AddComponent(ThirdPersonController);
		gameObject.AddComponent(ThirdPersonCamera);
		targetController = GetComponent(ThirdPersonController);
	}	
}

function Update()
{
	if (player1Prefab==null)
		player1Prefab = gameObject.Find("PigPrefab(Clone)");
	verticalInput = Input.GetAxisRaw("Vertical");
	horizontalInput = Input.GetAxisRaw("Horizontal");
	if (GetComponent.<NetworkView>() != NetworkViewID.unassigned)
		GetComponent.<NetworkView>().RPC("SendUserInput", RPCMode.Others, horizontalInput, verticalInput);
	
	var lhs: State = m_BufferedState[0];
	//if (!networkView.isMine)
	//{
	if (player1Prefab!=null)
	{
		Debug.Log("player1Prefab: " + player1Prefab);
		Debug.Log("lhs: " + lhs);
		player1Prefab.transform.position = lhs.pos;
		player1Prefab.transform.rotation = lhs.rot;
	}
	//}
}

function OnSerializeNetworkView( stream: BitStream, info: NetworkMessageInfo )
{
	var pos: Vector3;
	var rot: Quaternion;
	// if sending 
	if (stream.isWriting)
	{
		pos = transform.position;
		rot = transform.rotation;
		stream.Serialize( pos );
		stream.Serialize( rot );
	}
	// if receiving
	else
	{
		pos = Vector3.zero;
		rot = Quaternion.identity;
		stream.Serialize( pos );
		stream.Serialize( rot );
		
		// shift the buffer sideways, deleting state 20
		/*for(var i: int = m_BufferedState.Length-1; i>=1; i--)
		{
			m_BufferedState[i] = m_BufferedState[i-1];
		}*/
	
		// Record current state in slot 0
		var state : State;
		state.timestamp = info.timestamp;
		state.pos = pos;
		state.rot = rot;
		m_BufferedState[0] = state;
		
		// Update used slot count, however never exceed the buffer size
		// Slots aren't actually freed so this just makes sure the buffer is
		// filled up and that uninitalized slots aren't used.
		m_TimestampCount = Mathf.Min(m_TimestampCount + 1, m_BufferedState.Length);

		// Check if states are in order, if it is inconsistent you could reshuffel or 
		// drop the out-of-order state. Nothing is done here
		for ( i = 0; i<m_TimestampCount-1; i++)
		{
			if (m_BufferedState[i].timestamp < m_BufferedState[i+1].timestamp)
				Debug.Log("State inconsistent");
		}
	}
}

@RPC
function SendUserInput(h : float, v : float)
{
	Debug.Log("Penguin RPC");
	targetController.horizontalInput = h;
	targetController.verticalInput = v;
}
