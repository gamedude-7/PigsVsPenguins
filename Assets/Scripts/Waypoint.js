//static var waypointsReached:int = 0;

static var triggered:boolean = false;


function OnTriggerEnter (other: Collider) {
		
	/*var otherCharacter: Character = other.gameObject.GetComponent(Character);
	GetComponent(BoxCollider).isTrigger = false;
	print("WaypointCount: " + waypointsReached);		
	
	if (waypointsReached % (gameObject.Find("WaypointManager").transform.childCount+1)==0)
	{	
    	otherCharacter.lapCount++;		
		for (var way  in FindObjectsOfType(Waypoint))
		{
			way.GetComponent(BoxCollider).isTrigger = true;
		}
	}*/
	
	if (other.gameObject.name.Contains(MainMenu.playerNameInput) && GameObject.Find("Waypoints").GetComponent("Race").wrongWay == false) {
	
		triggered = true;
		other.GetComponent("Character").passedWaypoints.Push(gameObject.name);
		
	}
	
}

function OnTriggerExit (other: Collider) {

	
}