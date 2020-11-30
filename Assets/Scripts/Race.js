class PlayerPositionData {

	var playerName: String;
	var onLap: int = 0;
	var onWaypoint: int = 0;
	var distanceFromLastWaypoint: int = 0;
	var timeFinished: float = 99999;
}

static var numOfLaps:int = 0; // total # of laps
var raceStarted: boolean;

var chat : boolean = false;

var trackDirection:Vector3;
var nextWaypointT:Vector3;
var currentWaypoint:Vector3;
var totalTrackDistance:int = 0;

var wrongWay:boolean = false;

var waypointArray:Array;
var destroyLastWaypoint:boolean = false;

var myPlayerName: String;
var myPlayer: GameObject;
var playersInGame:Array;

var playerNumber: Array;
var currentPositionByLap: Array;
var currentPositionByWaypoint: Array;
var currentPositionByDistance: Array;
var finishList:Array;

private var startTime: float;
private var restSeconds: float;
private var roundedRestSeconds: int;
private var displaySeconds: float;
private var displayMinutes: float;
public var CountDownSeconds: int = 3;
private var Timeleft: float;
private var waypointCnt: GameObject;
private var myPlayerWaypointsReached: int; 
private var timeSinceRaceStarted: float = 0.0;
var timeText: String;
var myRaceWindowRect : Rect;
var skin : GUISkin;
var positionBoxStyle : GUIStyle;
var positionNameStyle : GUIStyle;
var positionTimeStyle : GUIStyle;
var timerStyle: GUIStyle;
var wrongWayTexture : Texture;

function Start() {

	numOfLaps = 2;
	
	waypointArray = new Array();
	
	playersInGame = new Array();
	
	playerNumber = new Array(PlayerPositionData);
	
	currentPositionByLap = new Array(PlayerPositionData);
	
	currentPositionByWaypoint = new Array(PlayerPositionData);
	
	currentPositionByDistance = new Array(PlayerPositionData);
	
	for ( var way in FindObjectsOfType(Waypoint))
	{
		waypointArray.Push(way.gameObject.name);
		way.GetComponent(Renderer).enabled = false;
	}
	//waypointArray.Sort();

	var wayCnt:int = 1;
	for (var dist:int = 0; dist < waypointArray.length-1; dist++) {
		
		var currentWaypointDistance:float = Vector3.Distance((gameObject.Find("Waypoint"+wayCnt).transform.position), (gameObject.Find("Waypoint"+(wayCnt+1)).transform.position));
		totalTrackDistance += currentWaypointDistance;
		wayCnt++;
		
	}
	
	myRaceWindowRect  = Rect (Screen.width/2 - 150,Screen.height/2-100,250,200);

	playerNumber = new Array();
	
	finishList  = new Array();
	
	startTime = Time.time;		
}


function sortByOnLap(a, b) {
	return b.onLap - a.onLap;
}

function sortByOnWaypoint(a, b) {
	return b.onWaypoint - a.onWaypoint;
}

function sortByDistance(a, b) {
	return b.distanceFromLastWaypoint - a.distanceFromLastWaypoint;
}

function sortByPlayerLapWaypointAndDistance(a, b) {
	Debug.Log("a: " + a.playerName + "b: " + b.playerName);
	if (b.timeFinished < 99999 || a.timeFinished < 99999)
	{
		return a.timeFinished - b.timeFinished; // lowest time gets closer to first place so its reversed
	}	
	else if ( b.onLap == a.onLap && b.onWaypoint == a.onWaypoint)
	{
		return b.distanceFromLastWaypoint - a.distanceFromLastWaypoint;
	}
	else if ( b.onLap == a.onLap )
	{
		return b.onWaypoint - a.onWaypoint;
	}
	else
	{
		return b.onLap - a.onLap;
	}
}

@RPC
function SetPlayerNumber( index: int,  playerName: String,  lap: int, wayPt: int, dist: float, time: float )
{
	playerNumber[index] = new PlayerPositionData();
	playerNumber[index].playerName = playerName;
	playerNumber[index].onLap = lap;
	playerNumber[index].onWaypoint= wayPt;
	playerNumber[index].distanceFromLastWaypoint = dist;
	playerNumber[index].timeFinished = time;
}

function SetPlayerNumberListOnClients( list: Array)
{
	var pName: String;
	var lap: int;
	var wayPt: int;
	var dist: float;
	var time: float;
	var playerPosition: PlayerPositionData;
	
	for (var i: int =0; i< list.length; i++)
	{
		playerPosition = (list[i] as PlayerPositionData);
		pName = playerPosition.playerName;
		lap = playerPosition.onLap;
		wayPt = playerPosition.onWaypoint;
		dist = playerPosition.distanceFromLastWaypoint;
		time = playerPosition.timeFinished;
		GetComponent.<NetworkView>().RPC("SetPlayerNumber",RPCMode.Others, i, pName, lap, wayPt, dist, time);
	}
}

@RPC
function RemovePlayerNumberAt( index: int )
{
	playerNumber.RemoveAt(index);
}

function Update () {	
	if (Network.isServer)
	{
		if (raceStarted)
		{
			Network.maxConnections = 0;
			timeSinceRaceStarted +=Time.deltaTime;
			SetTimer(timeSinceRaceStarted);
		}
	}
			
	if (myPlayer!=null)
	{
	
	if (!chat && Input.GetButton("chat")) {
		GameObject.Find("Code").GetComponent(LobbyChat).ShowChatWindow();
		chat = true;
	}
	else
		GameObject.Find("Code").GetComponent(LobbyChat).CloseChatWindow();
		
	if (chat && Input.GetButton("chat")) {
		GameObject.Find("Code").GetComponent(LobbyChat).CloseChatWindow();
		chat = false;
	}
	
	SetCurrentDistance(myPlayer.GetComponent(Character).distanceBetweenPlayerAndWaypoint);
	
	var tempArray: Array = new Array();
	
	if (Network.isServer)
	{
		var i: int;
		for (var currentPlayer: PlayerInfo in GameLobby.playerList) {
			i = 0;
			for (var go in FindObjectsOfType(Character)) {
				if (go.gameObject.name.Contains(currentPlayer.username)) {
							playerNumber[i] = new PlayerPositionData();
					
							playerNumber[i].playerName = currentPlayer.username;
							playerNumber[i].onLap = go.GetComponent(Character).lapCount;
							playerNumber[i].onWaypoint = go.GetComponent(Character).waypointsReached;
							playerNumber[i].distanceFromLastWaypoint = go.GetComponent(Character).distanceBetweenPlayerAndWaypoint;
							playerNumber[i].timeFinished = go.GetComponent(Character).finishedTime;
							Debug.Log(currentPlayer.username + " finished with a time of " + go.GetComponent(Character).finishedTime);
				}
				i++;		
			}
		}
		playerNumber.Sort(sortByPlayerLapWaypointAndDistance);
		SetPlayerNumberListOnClients(playerNumber);				
	}

	for (var cnt:int = 0; cnt < waypointArray.length; cnt++)
	{
		myPlayerWaypointsReached = myPlayer.GetComponent(Character).waypointsReached;
		if(myPlayerWaypointsReached == cnt) {
			waypointCnt = gameObject.Find("Waypoint"+(cnt+1));
			waypointCnt.AddComponent(BoxCollider);
			waypointCnt.GetComponent(BoxCollider).isTrigger = true;
		}
	}
	if (myPlayer.GetComponent(Character).waypointsReached == waypointArray.length )
	{
		gameObject.Find("Waypoint1").AddComponent(BoxCollider);
		gameObject.Find("Waypoint1").GetComponent(BoxCollider).isTrigger = true;
	}
	
	if (myPlayer.GetComponent(Character).passedWaypoints.length > 0 && myPlayer.GetComponent(Character).passedWaypoints.length < transform.childCount) {
		trackDirection = (gameObject.Find("Waypoint"+(myPlayer.GetComponent(Character).passedWaypoints.length+1)).transform.position) - (gameObject.Find("Waypoint"+(myPlayer.GetComponent(Character).passedWaypoints.length)).transform.position);
	}
	else if (myPlayer.GetComponent(Character).passedWaypoints.length == transform.childCount)
	{
		trackDirection = gameObject.Find("Waypoint1").transform.position - gameObject.Find("Waypoint" + transform.childCount).transform.position;
	}
	
	if(Waypoint.triggered == true) {
	
		if(myPlayer.GetComponent(Character).waypointsReached == (waypointArray.length) && myPlayer.GetComponent(Character).lapCount < (numOfLaps + 1)) {			
			myPlayer.GetComponent(Character).lapCount += 1;
			myPlayer.GetComponent(Character).finishCount += 1;
			SetCurrentLap(myPlayer.GetComponent(Character).lapCount);
		}
			
		if (!wrongWay) {
			destroyLastWaypoint = true;
			Waypoint.triggered = false;
			myPlayer.GetComponent(Character).waypointsReached += 1;
			myPlayerWaypointsReached = myPlayer.GetComponent(Character).waypointsReached;
			SetCurrentWaypoint(myPlayer.GetComponent(Character).waypointsReached); // update right away
		}
	}
		
	// check if your own player hasn't loaded yet
	
		if( myPlayer.GetComponent(Character).lapCount == (numOfLaps + 1) && !myPlayer.GetComponent(Character).isFinished && myPlayer.GetComponent.<NetworkView>().isMine) {
			myPlayer.GetComponent(Character).isFinished = true;
			
			myPlayer.GetComponent(Character).finishedTime = timeSinceRaceStarted;
			SetFinishedTime(timeSinceRaceStarted);
			myPlayer.GetComponent(Character).lapCount = numOfLaps;
			SetCurrentLap(myPlayer.GetComponent(Character).lapCount);
			//Debug.Log("finish time is " +
		}
	
	
	if(destroyLastWaypoint == true) {
		
		for(var lastWay:int = 0; lastWay < myPlayer.GetComponent(Character).passedWaypoints.length; lastWay++) {
			Destroy(gameObject.Find(myPlayer.GetComponent(Character).passedWaypoints[lastWay]).GetComponent(BoxCollider));
		}
		destroyLastWaypoint = false;	
	}
	
	
	if(myPlayer.GetComponent(Character).passedWaypoints.length > 0 ) {
		
		if (myPlayer.GetComponent(Character).passedWaypoints.length == (transform.childCount+1)) {
			myPlayer.GetComponent(Character).playerHeading = (gameObject.Find(myPlayerName).transform.position) - (gameObject.Find("Waypoint1").transform.position);
			myPlayer.GetComponent(Character).distanceBetweenPlayerAndWaypoint = Vector3.Distance(gameObject.Find("Waypoint1").transform.position, gameObject.Find(myPlayerName).transform.position);
		}
		else {
			myPlayer.GetComponent(Character).playerHeading = (gameObject.Find(myPlayerName).transform.position) - (gameObject.Find("Waypoint" + myPlayer.GetComponent(Character).passedWaypoints.length).transform.position);
			myPlayer.GetComponent(Character).distanceBetweenPlayerAndWaypoint = Vector3.Distance(gameObject.Find("Waypoint" + myPlayer.GetComponent(Character).passedWaypoints.length).transform.position, gameObject.Find(myPlayerName).transform.position);
		}
		
		//Vector3.Dot(myPlayer.GetComponent(Character).playerHeading, trackDirection);
		//print ("Distance: " + myPlayer.GetComponent(Character).distanceBetweenPlayerAndWaypoint);
		if (Vector3.Dot(gameObject.Find(myPlayerName).transform.forward, trackDirection) < 0) 
		{
			
			wrongWay = true;
		}
		else {
			wrongWay = false;
		}	
	}
	
	if(myPlayer.GetComponent(Character).waypointsReached == (waypointArray.length+1)){
			
		myPlayer.GetComponent(Character).passedWaypoints.Clear();
		myPlayer.GetComponent(Character).passedWaypoints.Push(waypointArray[0]);
		myPlayer.GetComponent(Character).waypointsReached = 1;
		
	}
	
	for ( var go in FindObjectsOfType(Character))
	{
		if (go.gameObject.GetComponent(Character).finishedTime < 99999.0)
		{
			if (go.gameObject.name.Contains(playerNumber[0].playerName)) {
				if (go.gameObject.name.Contains("Pig"))
				{
					if (!go.transform.FindChild("PvP_MDL_Pig(BETA)").GetComponent.<Animation>().IsPlaying("Animation"))
						go.transform.FindChild("PvP_MDL_Pig(BETA)").GetComponent.<Animation>().CrossFade("Animation");
				}
				else
				{					
					if (go.transform.FindChild("Fire1")!=null)												
						go.transform.FindChild("Fire1").FindChild("OuterCore").GetComponent.<Renderer>().enabled = false;																					
					if (go.transform.FindChild("Fire2")!=null)	
						go.transform.FindChild("Fire2").FindChild("OuterCore").GetComponent.<Renderer>().enabled = false;			
						
					if (!go.transform.FindChild("PVP_CHR_PenguinTitle(001-336)-Ex-").GetComponent.<Animation>().IsPlaying("Animation"))
					{						
						go.transform.FindChild("polySurface59").GetComponent.<Renderer>().enabled = false;
						go.transform.FindChild("PVP_CHR_PenguinTitle(001-336)-Ex-").localScale = Vector3 (0.03,0.03,0.03);
						go.transform.FindChild("PVP_CHR_PenguinTitle(001-336)-Ex-").GetComponent.<Animation>().CrossFade("Animation");		
						go.transform.FindChild("PVP_CHR_PenguinTitle(001-336)-Ex-").FindChild("joint1").FindChild("Fire3").FindChild("OuterCore").GetComponent.<Renderer>().enabled = true;
						go.transform.FindChild("PVP_CHR_PenguinTitle(001-336)-Ex-").FindChild("joint1").FindChild("Fire4").FindChild("OuterCore").GetComponent.<Renderer>().enabled = true;
						//for (var z: int = 105; z<=112; z++)
					//	{
						//	go.transform.FindChild("PVP_CHR_PenguinTitle(001-336)-Ex-").transform.FindChild("polySurface105").renderer.enabled = true;	
						//}
						//go.transform.FindChild("PVP_CHR_PenguinTitle(001-336)-Ex-").FindChild("polySurface137" + z.ToString()).renderer.enabled = true;	
						//go.transform.FindChild("PVP_CHR_PenguinTitle(001-336)-Ex-").FindChild("polySurface138" + z.ToString()).renderer.enabled = true;
						//go.transform.FindChild("PVP_CHR_PenguinTitle(001-336)-Ex-").FindChild("Fire3").transform.position = go.transform.FindChild("PVP_CHR_PenguinTitle(001-336)-Ex-").FindChild("joint1").transform.position;
						//go.transform.FindChild("PVP_CHR_PenguinTitle(001-336)-Ex-").FindChild("Fire4").transform.position = go.transform.FindChild("PVP_CHR_PenguinTitle(001-336)-Ex-").FindChild("joint1").transform.position;
					}
				}
			}			
		}
	}
		
	}
}


function OnGUI() {
	var timeToDisplay: float;
	var timeFinishedToDisplay: float;
	var timerRestSeconds : float;
	var timerRestMinutes: float;
	if (myPlayer==null)
		return;
	Timeleft= Time.time-startTime;			

	
	if (raceStarted )
	{
		restSeconds = -timeSinceRaceStarted;
	}
	else
	{
		restSeconds = CountDownSeconds-(Timeleft);
	}
	/*if (raceStarted)
	{
		roundedRestSeconds =Mathf.CeilToInt(timeSinceRaceStarted);
	}
	else
	{*/
		roundedRestSeconds=Mathf.CeilToInt(restSeconds);
	//}
	displaySeconds = roundedRestSeconds % 60;
	displayMinutes = (roundedRestSeconds / 60)%60;

	timetext = (displayMinutes.ToString()+":");
	timerRestSeconds = -displaySeconds;
//	timeToDisplay =  (displayMinutes.ToString()+":");
	
	if (displaySeconds > 9)
	{
		timetext = timetext + displaySeconds.ToString();
	}
	else
	{
		timetext = "0" + displaySeconds.ToString();
	}
	
	
	if (myPlayer!=null)
	{
	
		var strPlayerPositions: String = "\n\n";
		var lapCount: String = "";
		var lastRect: Rect;
		timeToDisplay = Mathf.Round(timeSinceRaceStarted*100)/100 ; 
		
		if (timerRestSeconds>0)
		{
			if ( displayMinutes<0)
			{
				displayMinutes=Mathf.Abs(displayMinutes);
			}
			if (timerRestSeconds<10)			
				GUI.Label(Rect(Screen.width/2-40,10,300,80), (displayMinutes).ToString() + ":0" + timerRestSeconds.ToString() , timerStyle);
			else
				GUI.Label(Rect(Screen.width/2-40,10,300,80), (displayMinutes).ToString() + ":" + timerRestSeconds.ToString() , timerStyle);
		}
		else
		{
			if ( displayMinutes<0)
			{
				displayMinutes=Mathf.Abs(displayMinutes);
			}
			GUI.Label(Rect(Screen.width/2-40,10,300,80), displayMinutes.ToString() + ":00" , timerStyle);
		}


		/*if (finishList.length > 0)
		{
			for (var fList:int = 0; fList < finishList.length; fList++) {
				GUI.Label(Rect(40,200,300,20), "Finishing Positions");
				GUI.Label(Rect(40,(230+(fList*20)),300,20), finishList[fList]);
			}
		}*/
		GUILayout.BeginArea (Rect (0,0,Screen.width,Screen.height));
			GUILayout.BeginVertical();
				
				GUILayout.Space(10);

				GUILayout.BeginHorizontal();
					GUILayout.FlexibleSpace();
					lapCount = "LAP " + myPlayer.GetComponent(Character).lapCount + "/" + numOfLaps;
					GUILayout.Label(lapCount, positionNameStyle);
					GUILayout.Space(100);
				GUILayout.EndHorizontal();
				
				GUILayout.BeginHorizontal();
					GUILayout.FlexibleSpace();
					if (displaySeconds > 0 ) {
						if (displaySeconds==1)
						{
							positionTimeStyle.normal.textColor = Color.yellow;
						}
						GUI.Label(Rect(Screen.width/2 - 60, Screen.height/2 - 100, 150,100), timetext, positionTimeStyle);
					}
					if (displaySeconds == 0 && timeSinceRaceStarted < 10) { // check timeSinceRaceStarted < 10 to make sure it doesn't say go again on the next minute
						SetCurrentLap(myPlayer.GetComponent(Character).lapCount);
						raceStarted = true;									
						if (Network.isServer)
							gameObject.Find("Code").GetComponent(GameLobby).isRaceStartedOnServerAlready = true;															
						positionTimeStyle.normal.textColor = Color.green;
						GUI.Label(Rect(Screen.width/2 - 60, Screen.height/2 - 100, 150,100), "GO", positionTimeStyle);
					}
					GUILayout.Space(100);
					
				GUILayout.EndHorizontal();
				
				GUILayout.BeginHorizontal();

				
					GUILayout.FlexibleSpace();


						for (var l: int = 0; l < playerNumber.length; l++) {
							strPlayerPositions+= (l+1) + ". " + playerNumber[l].playerName + " "; 					
							//if (myPlayer.GetComponent(Character).lapCount == (numOfLaps+1))
							/*if (playerNumber[l].timeFinished!=99999)
							{
								timeFinishedToDisplay =Mathf.Round(playerNumber[l].timeFinished*100)/100;
								strPlayerPositions+=timeFinishedToDisplay;
							}*/
							strPlayerPositions+="\n";
						}	
						positionBoxStyle.normal.textColor = Color.black;						
						GUILayout.Box(strPlayerPositions, positionBoxStyle, GUILayout.Width(210), GUILayout.Height(270));					
						lastRect = GUILayoutUtility.GetLastRect();
						lastRect.x +=2;
						lastRect.y -=2;
						positionBoxStyle.normal.textColor = Color.red;
						GUI.Box(lastRect, strPlayerPositions, positionBoxStyle);
						
						GUILayout.Space(10);

				
				GUILayout.EndHorizontal();

				GUILayout.FlexibleSpace();

			GUILayout.EndVertical();
			

			
		GUILayout.EndArea();
	
	}

	if(wrongWay) {
		GUI.DrawTexture(Rect(Screen.width/2 - 256, 50, 512,256),wrongWayTexture, ScaleMode.ScaleToFit, true, 3.0f);
		//GUI.Label(Rect(40,150,400,20), "Wrong Way");
	}
	

	
}


function positionsGUI(id : int){
GUILayout.Label("              ");
	/*GUILayout.BeginVertical();
	GUILayout.Space(10);
	GUILayout.EndVertical();
	
	GUILayout.BeginHorizontal();
	GUILayout.Space(10);	
	GUILayout.Label("");
	GUILayout.Space(10);
	GUILayout.EndHorizontal();
	
	GUILayout.BeginVertical();
			GUILayout.Space(20);
			GUILayout.BeginHorizontal();
				GUILayout.FlexibleSpace();
				
				GUILayout.Space(10);
			GUILayout.EndHorizontal();
			GUILayout.FlexibleSpace();
		GUILayout.EndVertical();*/
}


// Sets which lap the character is on
// netviewid - id of the player on the network
// lapNumber - what lap is the character on
@RPC
function SetLapCount( netviewID: NetworkViewID, lapNumber : int )
{
	var thePlayer: GameObject;
	
	// loop through every character to find player of who to set the current lap 
	for ( var currentPlayer in FindObjectsOfType(Character) )
	{
		// find player with the ID that was passed in
		if (currentPlayer.gameObject.GetComponent(NetworkView).viewID == netviewID )
		{
			thePlayer = currentPlayer.gameObject;
		}
	}
	
	// set that character's current lap
	thePlayer.GetComponent(Character).lapCount = lapNumber;
	thePlayer.GetComponent(Character).finishCount = lapNumber;

	// loop through playerList which just has player name
	for (var currentPlayer: PlayerInfo in GameLobby.playerList )
	{
		var strCurrentPlayer: String = currentPlayer.player.ToString();
		var strNetID: String = netviewID.owner.ToString();
		// find player with the player name that was passed in
		if (strCurrentPlayer ==  strNetID )
		{
			if (thePlayer.GetComponent(Character).finishCount == (numOfLaps + 1) ) {								
				finishList.Push(currentPlayer.username);				
				thePlayer.GetComponent(Character).finishCount = 0;
			}
		}
	}	
}

@RPC
function ServerSetLapCount(netviewID: NetworkViewID, lapNumber : int)
{
	GetComponent.<NetworkView>().RPC("SetLapCount", RPCMode.All, netviewID, lapNumber);
}

function SetCurrentLap(currentLap: int)
{
	var playerID: NetworkViewID = myPlayer.GetComponent(NetworkView).viewID;

	if (Network.isServer)
	{
		if (playersInGame.length > 1)
		{
			SetLapCount(playerID, myPlayer.GetComponent(Character).lapCount);
			GetComponent.<NetworkView>().RPC("SetLapCount", RPCMode.Others, playerID, currentLap);
		}
		else
		{
			SetLapCount(playerID, myPlayer.GetComponent(Character).lapCount);
		}
	}
	else
	{
		GetComponent.<NetworkView>().RPC("ServerSetLapCount", RPCMode.Server, playerID, currentLap);
	}
}


@RPC
function SetWaypointsReached( netviewID: NetworkViewID, WaypointsReached : int)
{
	var thePlayer: GameObject;
	
	// loop through every character to find player of who to set the current lap 
	for ( var currentPlayer in FindObjectsOfType(Character) )
	{
		// find player with the ID that was passed in
		if (currentPlayer.gameObject.GetComponent(NetworkView).viewID == netviewID )
		{
			thePlayer = currentPlayer.gameObject;
		}
	}
	
	// set that character's current Waypoint
	thePlayer.GetComponent(Character).waypointsReached = WaypointsReached;
	
}

@RPC
function ServerSetWaypointsReached(netviewID: NetworkViewID, WaypointsReached : int)
{
	GetComponent.<NetworkView>().RPC("SetWaypointsReached", RPCMode.All, netviewID, WaypointsReached);
}

function SetCurrentWaypoint(CurrentWaypoint: int)
{
	var playerID: NetworkViewID = myPlayer.GetComponent(NetworkView).viewID;

	if (Network.isServer)
	{
		if (playersInGame.length > 1)
		{
			SetWaypointsReached(playerID, myPlayer.GetComponent(Character).waypointsReached);
			GetComponent.<NetworkView>().RPC("SetWaypointsReached", RPCMode.Others, playerID, CurrentWaypoint);
		}
		else
		{
			SetWaypointsReached(playerID, myPlayer.GetComponent(Character).waypointsReached);
		}
	}
	else
	{
		GetComponent.<NetworkView>().RPC("ServerSetWaypointsReached", RPCMode.Server, playerID, CurrentWaypoint);
	}
}


@RPC
function SetDistance( netviewID: NetworkViewID, DistanceBetweenPlayerAndWaypoint: float )
{
	var thePlayer: GameObject;
	
	// loop through every character to find player of who to set the current distance
	for ( var currentPlayer in FindObjectsOfType(Character) )
	{
		// find player with the ID that was passed in
		if (currentPlayer.gameObject.GetComponent(NetworkView).viewID == netviewID )
		{
			thePlayer = currentPlayer.gameObject;
		}
	}
	
	// set that character's current Waypoint
	thePlayer.GetComponent(Character).distanceBetweenPlayerAndWaypoint = DistanceBetweenPlayerAndWaypoint;
	
}

@RPC
function ServerSetDistance(netviewID: NetworkViewID, DistanceBetweenPlayerAndWaypoint : float)
{
	GetComponent.<NetworkView>().RPC("SetDistance", RPCMode.All, netviewID, DistanceBetweenPlayerAndWaypoint);
}

function SetCurrentDistance(CurrentDistance: float)
{
	var playerID: NetworkViewID = myPlayer.GetComponent(NetworkView).viewID;

	if (Network.isServer)
	{
		if (playersInGame.length > 1)
		{
			SetDistance(playerID, myPlayer.GetComponent(Character).distanceBetweenPlayerAndWaypoint);
			GetComponent.<NetworkView>().RPC("SetDistance", RPCMode.Others, playerID, CurrentDistance);
		}
		else
		{
			SetDistance(playerID, myPlayer.GetComponent(Character).distanceBetweenPlayerAndWaypoint);
		}
	}
	else
	{
		GetComponent.<NetworkView>().RPC("ServerSetDistance", RPCMode.Server, playerID, CurrentDistance);
	}
}

// Sets time the character is on
// netviewid - id of the player on the network
// lapNumber - what lap is the character on
@RPC
function SetTimeFinished( netviewID: NetworkViewID, time : float )
{
	var thePlayer: GameObject;
	
	// loop through every character to find player of who to set the current lap 
	for ( var currentPlayer in FindObjectsOfType(Character) )
	{
		// find player with the ID that was passed in
		if (currentPlayer.gameObject.GetComponent(NetworkView).viewID == netviewID )
		{
			thePlayer = currentPlayer.gameObject;
		}
	}
	
	// set that character's current lap
	//thePlayer.GetComponent(Character).lapCount = lapNumber;
	//thePlayer.GetComponent(Character).finishCount = lapNumber;

	// loop through playerList which just has player name
	for (var currentPlayer: PlayerInfo in GameLobby.playerList )
	{
		var strCurrentPlayer: String = currentPlayer.player.ToString();
		var strNetID: String = netviewID.owner.ToString();
		// find player with the player name that was passed in
		if (strCurrentPlayer ==  strNetID )
		{								
			thePlayer.GetComponent(Character).finishedTime = time;			
		//	Debug.Log(currentPlayer.username + " finished with a time of " + thePlayer.GetComponent(Character).finishedTime);
		//	Debug.Break();
		}
	}	
}

@RPC
function ServerSetTimeFinished(netviewID: NetworkViewID, time : float)
{
	GetComponent.<NetworkView>().RPC("SetTimeFinished", RPCMode.All, netviewID, time);
}

function SetFinishedTime(time: float)
{
	var playerID: NetworkViewID = myPlayer.GetComponent(NetworkView).viewID;

	if (Network.isServer)
	{
		if (playersInGame.length > 1)
		{
			SetTimeFinished(playerID, time);
			GetComponent.<NetworkView>().RPC("SetTimeFinished", RPCMode.Others, playerID, time);
		}
		else
		{
			SetTimeFinished(playerID, time);
		}
	}
	else
	{
		GetComponent.<NetworkView>().RPC("ServerSetTimeFinished", RPCMode.Server, playerID, time);
	}
}

function SetTimer(time: float)
{	
	GetComponent.<NetworkView>().RPC("SetRaceTimer", RPCMode.All, time);
}

@RPC 
function SetRaceTimer(time: float)
{
	timeSinceRaceStarted = time;
}

function OnPlayerDisconnected(player: NetworkPlayer)
{
	
}