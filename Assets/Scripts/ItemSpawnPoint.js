var isThere: boolean = false;  // does this spawn point has an item
var timeSinceItemDestroyed : float;

function Update () {

	if (isThere == false)
	{
		timeSinceItemDestroyed += Time.deltaTime;
//		Debug.Log("timeSinceItemDestroyed: " + timeSinceItemDestroyed);
		//if (timeSinceItem > 2)
		//{			
			//SpawnItem();
		//	timeSinceItem = 0;
		//}
	}
}