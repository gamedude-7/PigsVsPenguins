var ice: GameObject;
function OnCollisionEnter ( o:Collision) {
	Debug.Log("Ice collided with " + o.gameObject.name);
	//Debug.Break();
	if (o.gameObject.name == "polySurface56")
	{
		Network.Destroy(this.gameObject);	
	}
}