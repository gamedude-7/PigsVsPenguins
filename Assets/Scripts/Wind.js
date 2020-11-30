var aPlayer: GameObject;

function OnTriggerEnter( other: Collider)
{
	if (other.gameObject.name.Contains("Prefab"))
	{
		if (other.transform.parent!=null)
			aPlayer = other.transform.parent.transform.gameObject;
		else 
			aPlayer = other.gameObject;
	}
}

function OnTriggerExit( other: Collider)
{	
	if (other.gameObject.name.Contains("Prefab"))
	{
		if (other.transform.parent!=null)
			aPlayer = other.transform.parent.transform.gameObject;
		else 
			aPlayer = other.gameObject;
	}
}

function Update () {
	if (aPlayer!=null)
		aPlayer.GetComponent.<Rigidbody>().AddForce(-10,0,4);
}