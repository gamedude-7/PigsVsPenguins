var pigPrefab: GameObject;
var peguinPrefab: GameObject;

function OnNetworkLoadedLevel ( ) {
	Cursor.visible = false;
	gameObject.Find("Code").GetComponent("LobbyChat").CloseChatWindow();
	//if (Network.isServer)
		//Network.maxConnections = 0; // Don't allow any more players

	var index: int = 0;
	for (var currentPlayer: PlayerInfo in GameLobby.playerList) {
		//for (var go in FindObjectsOfType(Character)) {
		
			if (currentPlayer.username.Contains(MainMenu.playerNameInput))
			{
				break;
			}
			index++;
		//}
	}
	var index2: int = 0;
	var netID: NetworkViewID = GetComponent(NetworkView).viewID;
	for (var currentSpawnPt in FindObjectsOfType(PlayerSpawn))
	{
		if (index2 == index)
		{
			var aCharacter: String = gameObject.Find("Code").GetComponent(GameLobby).playerCharacter;
			//networkView.RPC("ClientInstantiate", RPCMode.All,aCharacter,currentSpawnPt.transform.position, currentSpawnPt.transform.rotation, netID);

			if ( aCharacter == "Penguin" )	
				Network.Instantiate(peguinPrefab,currentSpawnPt.transform.position, currentSpawnPt.transform.rotation,0);
			else
				Network.Instantiate(pigPrefab,currentSpawnPt.transform.position, currentSpawnPt.transform.rotation,0);
			break;
		}
		index2++;
	}
	
	/*if (Network.isServer )
	{
		ServerSpawnAtNextAvailableSpace();		
	}
	else
	{
		networkView.RPC("ClientSpawnAtNextAvailableSpace", RPCMode.Server );
	}*/
}

@RPC
function ClientInstantiate(characterType: String, pos: Vector3, rot: Quaternion, id: NetworkViewID)
{
	var netID: NetworkViewID = GetComponent(NetworkView).viewID; 
	if (netID == id)
	{
		if ( characterType == "Penguin" )	
			Network.Instantiate(peguinPrefab,pos, rot,0);
		else
			Network.Instantiate(pigPrefab,pos, rot,0);
	}
}

function OnPlayerDisconnected(player: NetworkPlayer)
{
	Debug.Log("Server destroying player");
	var kickPlayer: String;
	var found: boolean;
	if (Application.loadedLevelName == "Artic")
	{
		playerPositions = gameObject.Find("Waypoints").GetComponent("Race").playerNumber;
		for (var i: int = 0; i < playerPositions.length; i++) {
			found = false;
			for (var currentPlayer: PlayerInfo in GameLobby.playerList) {
				Debug.Log("currentPlayer.username: " + currentPlayer.username);
				if (currentPlayer.player==playerPositions.playerName)
				{
					found = true;
				}
			}
			if (!found)
			{
				kickPlayer = playerPositions[i].playerName;
			}
		}
		Debug.Log("kickPlayer: " + kickPlayer);
		
		for (var j: int = 0; j < playerPositions.length; j++)
		{
			Debug.Log("playerPosition[" + j + "].playerName : " + playerPositions[j].playerName);
			if ((playerPositions[j] as PlayerPositionData).playerName==kickPlayer)
			{
				playerPositions.RemoveAt(j);
				gameObject.Find("Waypoints").GetComponent.<NetworkView>().RPC("RemovePlayerNumberAt", RPCMode.Others, j);
			}
		}
		
		//Debug.Break();
	}
	Network.RemoveRPCs(player,0);
	Network.DestroyPlayerObjects(player);
}
/*
@RPC
function Mark( spawnPtPos: Vector3)
{
	for (var currentSpawnPt in FindObjectsOfType(PlayerSpawn))
	{
		if (currentSpawnPt.transform.position == spawnPtPos )
		{
			currentSpawnPt.GetComponent(PlayerSpawn).occupied = true;
		}
	}
}

@RPC
function ServerSpawnAtNextAvailableSpace()
{
	for (var currentSpawnPt in FindObjectsOfType(PlayerSpawn))
	{
		// if current character spawn point to check is not occupied
		if (!currentSpawnPt.GetComponent(PlayerSpawn).occupied)
		{
			var aCharacter: String = gameObject.Find("Code").GetComponent(GameLobby).playerCharacter;
			
			if ( aCharacter == "Penguin" )	
				Network.Instantiate(peguinPrefab,currentSpawnPt.transform.position, currentSpawnPt.transform.rotation,0);
			else
				Network.Instantiate(pigPrefab,currentSpawnPt.transform.position, currentSpawnPt.transform.rotation,0);
			break;
		}
	}
}

@RPC
function ClientSpawnAtNextAvailableSpace()
{
	for (var currentSpawnPt in FindObjectsOfType(PlayerSpawn))
	{
		// if current character spawn point to check is not occupied
		if (!currentSpawnPt.GetComponent(PlayerSpawn).occupied)
		{
			var aCharacter: String = gameObject.Find("Code").GetComponent(GameLobby).playerCharacter;
			
			if ( aCharacter == "Penguin" )	
				Network.RPC(
			else
				Network.Instantiate(pigPrefab,currentSpawnPt.transform.position, currentSpawnPt.transform.rotation,0);
			break;
		}
	}
}*/
