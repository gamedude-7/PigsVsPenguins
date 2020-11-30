var itemPrefab: GameObject;
var respawnTime: int = 2;
function Update () {
	if (!Network.isServer)
		return;
	for (var currentSpawnPt in FindObjectsOfType(ItemSpawnPoint))
	{
		
//		Debug.Log("spawntpt: " + currentSpawnPt.gameObject.transform.childCount);
		//Debug.Log("timesinceItem: " + currentSpawnPt.GetComponent(ItemSpawnPoint).timeSinceItemDestroyed );
		//if ( !currentSpawnPt.GetComponent(ItemSpawnPoint).isThere &&		
		if (currentSpawnPt.gameObject.transform.childCount==0 &&	
		currentSpawnPt.GetComponent(ItemSpawnPoint).timeSinceItemDestroyed > respawnTime)
		{
//			Debug.Log(currentSpawnPt.transform.position);
			var itemSpawned: GameObject = Network.Instantiate(itemPrefab, currentSpawnPt.transform.position, Quaternion.identity, 0);
			//Debug.Log("Item: " + itemSpawned);
			//currentSpawnPt.GetComponent(ItemSpawnPoint).isThere = true;			
		}
		else		
		{
			currentSpawnPt.GetComponent(ItemSpawnPoint).timeSinceItemDestroyed+=Time.deltaTime;
		}
		
		//Debug.Log("spawn position: " + go.transform.position);
	}
}

function DestroyItem(netviewID : NetworkViewID)
{
	if (Network.isServer)
		DestroyBox(netviewID);
	else
		GetComponent.<NetworkView>().RPC("DestroyBox",RPCMode.Server, netviewID);
}

@RPC
function DestroyBox(netviewID: NetworkViewID)
{
	if (Network.isServer)
	{
		for (var currentItem in FindObjectsOfType(Items))
		{
			//Debug.Log( "NetworkView ID: " + currentItem.GetComponent(NetworkView).viewID );
			//Debug.Log( "netviewID: " + netviewID );
			if (currentItem.GetComponent(NetworkView)!=null)
			{
				if ( currentItem.GetComponent(NetworkView).viewID == netviewID)
				{
				//Debug.Log("Parent: " + currentItem.transform.parent);
					currentItem.transform.parent.GetComponent(ItemSpawnPoint).timeSinceItemDestroyed = 0;
					Network.Destroy(netviewID);
				}
			}
		}
	}
}