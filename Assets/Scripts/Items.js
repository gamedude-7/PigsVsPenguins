//var item : GameObject;
var bullets = 5;
//var prefab : Transform;
//var prefab1:Transform;
var itemGet: boolean = false;
var fish:Texture;
var shield:Texture;
var boost:Texture;
var ammo: int;
var item:int;

var netviewID : NetworkViewID;
function OnNetworkInstantiate(msg: NetworkMessageInfo)
{
	for (var currentSpawnPt in FindObjectsOfType(ItemSpawnPoint))
	{
		if (currentSpawnPt.gameObject.transform.childCount==0)
		{
			transform.parent = currentSpawnPt.transform;			
			break;
		}
	}
	netviewID = gameObject.GetComponent(NetworkView).viewID;
}

function OnTriggerEnter(o : Collider)
{
	var otherPlayer: GameObject; // player who picked up this item
	var indexOfSmallestDist: int;
	var minimumDistance : float;
	var spawnPtArray : Array ;
	item = Random.Range(0,3);
	if (o.gameObject.name.Contains("fish"))
		return;
	Debug.Log("name: " + o.gameObject.name);
	if (!o.gameObject.name.Contains(MainMenu.playerNameInput))
	{
		Debug.Log("name: " + o.gameObject.name);
		otherPlayer = o.gameObject.transform.parent.gameObject;
	}
	else
	{
		otherPlayer = o.gameObject;
	}
	otherPlayer.GetComponent(Character).item = item;
	//otherPlayer.GetComponent(Character).isShieldActivated = false;
	//otherPlayer.GetComponent(FlightControls).isBoostActivated = false;
	
	//Debug.Log(item);
	if(item == 0) // fire
	{
		ammo = Gun.maxBullets;
		if ( gameObject.Find("PigPrefab(Clone)"+MainMenu.playerNameInput)!=null)
			gameObject.Find("PigPrefab(Clone)"+MainMenu.playerNameInput).GetComponent(Character).bulletAmmo = Gun.maxBullets;
		else
			gameObject.Find("PenguinPrefab(Clone)"+MainMenu.playerNameInput).GetComponent(Character).bulletAmmo = Gun.maxBullets;
		Debug.Log(o.gameObject.name);
		if (o.gameObject.name == "PigPrefab(Clone)"+MainMenu.playerNameInput || o.gameObject.name == "PenguinPrefab(Clone)"+MainMenu.playerNameInput )
		{
			if (ammo == 0 ) // so you can't collect both blocks
			{
				//OnGUI();
				Debug.Log("Item get!");
				
				if ( gameObject.Find("PenguinPrefab(Clone)"+MainMenu.playerNameInput)!=null)
					gameObject.Find("PenguinPrefab(Clone)"+MainMenu.playerNameInput).GetComponent(Character).ammo = bullets;
				else
					gameObject.Find("PigPrefab(Clone)"+MainMenu.playerNameInput).GetComponent(Character).ammo = bullets;
				//bullets = 5;
				//itemGet = true;
				//(EditorUtility.GetPrefabParent(this.gameObject) as GameObject).GetComponent(ItemSpawnPoint).isThere = false;
				
				minimumDistance = 99999999.9;
				spawnPtArray = new Array();
			
				var index: int = 0;
				for (var spawnPt in FindObjectsOfType(ItemSpawnPoint))
				{
					
					spawnPtArray.push(spawnPt);
					Debug.Log( "Spawn Pt: " + spawnPt.transform.position + "== item position:" + this.gameObject.transform.position );
					if ( (spawnPt.transform.position - this.gameObject.transform.position).magnitude < minimumDistance )
					{
						indexOfSmallestDist = index;
						minimumDistance = (spawnPt.transform.position - this.gameObject.transform.position).magnitude;
					}
					index++;
				}
				//spawnPtArray[indexOfSmallestDist].isThere = false;
				spawnPtArray[indexOfSmallestDist].timeSinceItemDestroyed = 0;
				
				//Network.Destroy (this.gameObject);
				Debug.Log("net: " + gameObject.GetComponent(NetworkView).viewID);
				
				gameObject.Find("ItemManager").GetComponent(ItemManager).DestroyItem(netviewID);
			}
		}
	}
	else if (item == 1) // boost
	{
		minimumDistance = 99999999.9;
		spawnPtArray = new Array();		
		index = 0;
		for (var spawnPt in FindObjectsOfType(ItemSpawnPoint))
		{
			
			spawnPtArray.push(spawnPt);
			Debug.Log( "Spawn Pt: " + spawnPt.transform.position + "== item position:" + this.gameObject.transform.position );
			if ( (spawnPt.transform.position - this.gameObject.transform.position).magnitude < minimumDistance )
			{
				indexOfSmallestDist = index;
				minimumDistance = (spawnPt.transform.position - this.gameObject.transform.position).magnitude;
			}
			index++;
		}
		spawnPtArray[indexOfSmallestDist].timeSinceItemDestroyed = 0;
		gameObject.Find("ItemManager").GetComponent(ItemManager).DestroyItem(netviewID);
		otherPlayer.GetComponent(FlightControls).boostAmmo = 1;
		Debug.Log("Boost!");
		//Debug.Break();
	}
	else // shield
	{
		minimumDistance = 99999999.9;
		spawnPtArray = new Array();		
		index = 0;
		for (var spawnPt in FindObjectsOfType(ItemSpawnPoint))
		{
			
			spawnPtArray.push(spawnPt);
			Debug.Log( "Spawn Pt: " + spawnPt.transform.position + "== item position:" + this.gameObject.transform.position );
			if ( (spawnPt.transform.position - this.gameObject.transform.position).magnitude < minimumDistance )
			{
				indexOfSmallestDist = index;
				minimumDistance = (spawnPt.transform.position - this.gameObject.transform.position).magnitude;
			}
			index++;
		}
		spawnPtArray[indexOfSmallestDist].timeSinceItemDestroyed = 0;
		gameObject.Find("ItemManager").GetComponent(ItemManager).DestroyItem(netviewID);
		otherPlayer.GetComponent(Character).shieldAmmo = 1;
		Debug.Log("Shield");
		//Debug.Break();
	}
}
function OnGUI()
{	
	var myPlayer: GameObject;
	if ( gameObject.Find("PenguinPrefab(Clone)"+MainMenu.playerNameInput)!=null)
	{
		myPlayer = gameObject.Find("PenguinPrefab(Clone)"+MainMenu.playerNameInput);
		
	}
	else
	{
		myPlayer = gameObject.Find("PigPrefab(Clone)"+MainMenu.playerNameInput);
	}
	if (myPlayer==null)
		return;
	ammo = myPlayer.GetComponent(Character).bulletAmmo;
	item = myPlayer.GetComponent(Character).item;
	if( ammo> 0 && item==0)
	{
		GUI.Box(Rect(Screen.width/2-25,60,50,40),fish);
		GUI.Box(Rect(Screen.width/2-25,40,50,20),ammo.ToString());
	}
	else
		GUI.Box(Rect(0,0,0,0),"");
	
	if (myPlayer!=null)
	{
		if (item == 1 && !myPlayer.GetComponent(FlightControls).isBoostActivated)
		{
	 		GUI.Box(Rect(Screen.width/2-25,60,50,40),boost);
	 	}
	 
		if (item >= 2 && !myPlayer.GetComponent(Character).isShieldActivated)
		{
			GUI.Box(Rect(Screen.width/2-25,60,50,40),shield);
		}
	}
}


function Update()
{		
	transform.Rotate(Vector3.up, Time.deltaTime*360);
}
/*	if (itemGet == true)
	{
		timeSinceItem += Time.deltaTime;
		Debug.Log("TimeSinceItem: " + timeSinceItem);
		if (timeSinceItem > 2)
		{			
			//SpawnItem();
			timeSinceItem = 0;
			itemGet = false;
		}
	}*/


/*function SpawnItem()
{
	Network.Instantiate(item, go.transform.position, Quaternion.identity, 0);
	
		(go as GameObject).SendMessage("OnNetworkLoadedLevel", SendMessageOptions.DontRequireReceiver);
	if (gameObject.Find("item(Clone)") == null && gameObject.Find("item") == null)
		Network.Instantiate (prefab, Vector3(707,31,625), Quaternion.identity, 0);
	if (gameObject.Find("Item 2(Clone)") == null && gameObject.Find("Item 2") == null)
		Network.Instantiate (prefab1, Vector3(707,31,674),Quaternion.identity, 0);
}*/