
var tornadoVelocity: float;
var accelStrengthMax: float = 20.0f;
var velStrengthMax: float = 10.0f;
private var centripedalAcceleration: Vector3;
private var tangentVelocity: Vector3;
private var tornadoAcceleration: float;
private var timeSinceTriggered: float = 0.0;
private var insideTornado: boolean;
private var tornadoRadius: float;
private var incr: boolean = false;
 var accelStrength: float = 1.72956;
 var velStrength: float = 1.475855;
var cylinder: CapsuleCollider;
function OnTriggerEnter(o:Collider)
{
	var prefabPos: Vector3;
	if (o.gameObject.name.Contains(MainMenu.playerNameInput)) 
	{
		insideTornado = true;	
		prefabPos = o.transform.position;
		prefabPos.y = transform.position.y; 	
		tornadoRadius = Mathf.Abs((o.transform.position - transform.position).magnitude);
	}	
}

function OnTriggerExit(o:Collider)
{
	if (o.gameObject.name.Contains(MainMenu.playerNameInput)) 
	{	
		insideTornado = false;
	}
}

function FixedUpdate () {
	//static var r: float; // radiusFromPlayerToCenterOfTornado
	var eyeOfTornado: Vector3; // center of tornado				
	
	if (insideTornado)
	{
		for ( var go in FindObjectsOfType(Character))
		{
			
			if (go.gameObject.name.Contains(MainMenu.playerNameInput)) {
				eyeOfTornado = transform.position;
				eyeOfTornado.y = go.transform.position.y;
				//centripedalAcceleration = go.transform.position - eyeOfTornado;
				centripedalAcceleration = eyeOfTornado - go.transform.position;
				//var quat : Quaternion = Quaternion.AngleAxis(90,Vector3.up);			
				//tangentVelocity = quat * centripedalAcceleration;				
				
				tangentVelocity = Vector3.Cross(centripedalAcceleration,Vector3.up);
				
				if ( tornadoRadius > 100)
				{
					tornadoRadius-=100;// = centripedalAcceleration.magnitude--;
					//accelStrength = Mathf.Lerp(accelStrengthMax, 1, accelStrength);
					//velStrength = Mathf.Lerp(velStrengthMax, 1, velStrength);
				}
				else
				{
					tornadoRadius = 100;
				}
			/*	else if (tornadoRadius < 100)
				{
					incr = true;
				}
				else if (tornadoRadius > centripedalAcceleration.magnitude)
				{
					incr = false;
				}
				else if (incr == true)
				{
					tornadoRadius+=100;
					accelStrength = Mathf.Lerp(1,accelStrengthMax, accelStrength);
					velStrength = Mathf.Lerp(1,velStrengthMax, velStrength);
				}*/
				tornadoAcceleration = tornadoVelocity*tornadoVelocity/tornadoRadius; // (a = v^2)/r
				go.gameObject.GetComponent.<Rigidbody>().freezeRotation = false;	
				Debug.Log("centripedalAcceleration: " + centripedalAcceleration);
				Debug.Log("tornadoAcceleration: " + tornadoAcceleration);
				Debug.Log("accelStrength: " + accelStrength);
				go.gameObject.GetComponent.<Rigidbody>().AddForce(centripedalAcceleration.normalized*tornadoAcceleration*accelStrength, ForceMode.Acceleration);
				go.gameObject.GetComponent.<Rigidbody>().AddForce(tangentVelocity.normalized*tornadoVelocity*velStrength, ForceMode.VelocityChange);
				go.gameObject.GetComponent.<Rigidbody>().AddForce(Vector3.up*5, ForceMode.VelocityChange);						
			}			
		}
	}
	else
	{
		for ( var go in FindObjectsOfType(Character))
		{
			if (go.gameObject.name.Contains(MainMenu.playerNameInput)) {
				go.GetComponent.<Rigidbody>().freezeRotation = true;
			}
		}
	}
	
}

function OnGUI()
{
	for ( var go in FindObjectsOfType(Character))
	{
		Debug.DrawLine(go.transform.position, go.transform.position+centripedalAcceleration.normalized*tornadoAcceleration, Color.white);
	}
}