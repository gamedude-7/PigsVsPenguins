var occupied: boolean = false;
var pigPrefab: GameObject;
var peguinPrefab: GameObject;

function OnNetworkLoadedLevel ( ) {
	//Debug.Log("Loading level...");
	var aCharacter: String = gameObject.Find("Code").GetComponent(GameLobby).playerCharacter;
	Cursor.visible = false;
	if ( aCharacter == "Penguin" )	
		Network.Instantiate(peguinPrefab,transform.position, transform.rotation,0);
	else
		var pig = Network.Instantiate(pigPrefab,transform.position, transform.rotation,0);
	gameObject.Find("Code").GetComponent("LobbyChat").CloseChatWindow();
	//Debug.Break();
	//gameObject.Find("item").GetComponent(Items).SpawnItem();
}

function OnPlayerDisconnected(player: NetworkPlayer)
{
	Debug.Log("Server destroying player");
	Network.RemoveRPCs(player,0);
	Network.DestroyPlayerObjects(player);
}