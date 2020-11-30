var bullet : GameObject;
var timeSinceBulletSpawned: float;
function OnCollisionEnter (o:Collision) 
{
	Debug.Log(o.gameObject);
	if(o.gameObject.name != "ART_FRM_whitebox1" && o.gameObject.name != "PigPrefab(Clone)" && o.gameObject.name != "bullet(Clone)" && o.gameObject.name !="item" && o.gameObject.name !="Enemy" && o.gameObject.name !="Terrain")
	{
	Network.Destroy(this.gameObject);
		//if (o.gameObject.name != gameObject.Find("PigPrefab(Clone)Remote"))
		//Network.Destroy(o.gameObject);
	// Slowly rotate the object around its X axis at 1 degree/second.
	
//o.gameObject.transform.Rotate(Vector3.right * Time.deltaTime);
		
		//o.gameObject.rigidbody.isKinematic = true;
		//if (o.gameObject.name =="PigPrefab(Clone)Remote")
		
			//o.gameObject.GetComponent(FlightControls).EnableUserInput(false);
	}
	if (o.gameObject.name != "bullet(Clone)")
	{
	Debug.Log(o.gameObject.name);
		Network.Destroy(this.gameObject);
	}
	
}

function Start()
{
	timeSinceBulletSpawned = 0;
}

function Update()
{
	timeSinceBulletSpawned+=Time.deltaTime;
	if ( timeSinceBulletSpawned > 10)
	{
		Network.Destroy(this.gameObject);
	}
}