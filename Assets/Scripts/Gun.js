var muzzleFlash : GameObject;
var bullet : Rigidbody;
var speed : int = 10;
var prefab : Transform;
var prefab1:Transform;
static var maxBullets: int = 10;
function Update () 
{
	//if(Input.GetButtonDown("Fire1") && Items.bullets > 0)
	//{
		//var tFlash : GameObject = Instantiate(muzzleFlash,transform.position,transform.rotation); 
		//tFlash.transform.Rotate(-90,0,0);
		
		

		//if (gameObject.Find("item(Clone)") == null && gameObject.Find("item") == null)
			//Network.Instantiate (prefab, Vector3(707,31,625), Quaternion.identity, 0);
		//if (gameObject.Find("Item 2(Clone)") == null && gameObject.Find("Item 2") == null)
			//Network.Instantiate (prefab1, Vector3(707,31,674),Quaternion.identity, 0);
		//Destroy( tFlash,0.03);
	//}
}

function Shoot()
{
	var velocity: Vector3;
	GetComponent.<AudioSource>().Play();
	Debug.Log("You are shooting");
	var tBullet :Rigidbody =  Network.Instantiate(bullet,transform.position,transform.rotation,0);
	velocity = transform.TransformDirection(Vector3.forward) * speed;
	tBullet.transform.Rotate(270,0,0);	
	//var quat : Quaternion = Quaternion.AngleAxis(270,Vector3.up);			
	//velocity = quat * velocity;			
	tBullet.AddForce(velocity, ForceMode.VelocityChange);
	//tBullet.velocity = transform.TransformDirection(Vector3.forward) * speed;
	
	// Calls the function ApplyDamage with a value of 5
	//gameObject.SendMessageUpwards ("LoseAmmo", 1);
}