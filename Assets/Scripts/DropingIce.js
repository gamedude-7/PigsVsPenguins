var ice : GameObject;
var speed : int = 10;
var random:int;
var prefab1 : Transform;
var prefab2:Transform;
var prefab3:Transform;
var prefab4:Transform;
var iceTime:float = 0;

function OnTriggerExit()
{
var tIce :Rigidbody;
//q.LookRotate(-Vector3.forward, -Vector3.up);
random = Random.Range(1,5);
if(random ==1)
	{
		iceTime+=Time.deltaTime;
		if (iceTime >= 1)
		{
		tIce =  Network.Instantiate(ice,prefab1.transform.position,Quaternion.Euler(180,0,0),0).GetComponent.<Rigidbody>();
		tIce.velocity = transform.TransformDirection(Vector3.down) * speed;
		tIce.transform.Rotate(0,0,0);
		iceTime = 0;
		}
	}
else if(random ==2)
	{
		tIce  =  Network.Instantiate(ice,prefab2.transform.position,Quaternion.identity,0).GetComponent.<Rigidbody>();
		tIce.velocity = transform.TransformDirection(Vector3.down) * speed;
		tIce.transform.Rotate(0,0,0);
	}
else if(random ==3)
	{
		tIce =  Network.Instantiate(ice,prefab3.transform.position,Quaternion.identity,0).GetComponent.<Rigidbody>();
		tIce.velocity = transform.TransformDirection(Vector3.down) * speed;
		tIce.transform.Rotate(0,0,0);
	}
else if(random >= 4)
{
		iceTime+=Time.deltaTime;
		if (iceTime >= 1)
		{
		tIce  =  Network.Instantiate(ice,prefab4.transform.position,Quaternion.identity,0).GetComponent.<Rigidbody>();
		tIce.velocity = transform.TransformDirection(Vector3.down) * speed;
		tIce.transform.Rotate(0,0,0);
		//iceTime+=Time.deltaTime;
		iceTime = 0;
		}
	
	}
}