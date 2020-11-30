static var decr: boolean;
var box: GameObject;
static var minimumVelocity: int = 30;
static var maximumVelocity: int = 100;
static var showGeyser: boolean = true;
var waterTime: float = 0.0;
static var maximumHeight: float = 0.0;
static var timeItTakesToReachMaxHeight: float = 0.0;
var prevMaxHeight: float;
var accel: float;

var timeTable: Array = new Array();

class Geyser
{
	var t: float;
	var h: float;	
}

function Awake()
{
/*
	var waterGeyser: Geyser;
//	timeTable = new Array();	
	var i: int = 0;
	var t: float = 0.5;
	for (var v: float = minimumVelocity; i<maximumVelocity; v+=0.5)
	{
		t = -v/Physics.gravity.y;
		maximumHeight = v*t + (0.5*Physics.gravity.y*t*t);
		timeItTakesToReachMaxHeight = (2 * maximumHeight)/v;
		waterGeyser = new Geyser();
		waterGeyser.t = timeItTakesToReachMaxHeight;
		waterGeyser.h = maximumHeight;
		timeTable.Push(waterGeyser);
		Debug.Log( "t: " + timeTable[i].t + "h: " + timeTable[i].h);
		i++;
		
	}
Debug.Break();
	decr = false;
	waterTime =0.0;
	*/
}

function GetHeightAtTime( t: float ) : float
{
	var waterGeyser: Geyser;
	for (var i: int; i < timeTable.length; i++)
	{
		waterGeyser = timeTable[i];
		if ( Mathf.Abs(waterGeyser.t - t) < 0.5 )
			return waterGeyser.h;
	}
}

function Update () {
	//riseWater(minimumVelocity,maximumVelocity);
	//renderer.enabled = showGeyser;
	if(GetComponent.<ParticleEmitter>().localVelocity.y > minimumVelocity && decr)
	{
		waterTime -= Time.deltaTime/2;
		GetComponent.<ParticleEmitter>().localVelocity.y -= 10 * Time.deltaTime;
	}
	else
	{
		waterTime += Time.deltaTime/2;
		GetComponent.<ParticleEmitter>().localVelocity.y += 10 * Time.deltaTime;
	}
	//particleEmitter.localVelocity.y = Mathf.Clamp(minimumVelocity,maximumVelocity);
	if (GetComponent.<ParticleEmitter>().localVelocity.y > maximumVelocity)
	{
	//	showGeyser=false;
		decr = true;
		//Debug.Break();
	}
	else if ( GetComponent.<ParticleEmitter>().localVelocity.y  < minimumVelocity)
	{
	//	showGeyser =true;

		decr = false;
	}
//	box.transform.position.y = transform.position.y+GetHeightAtTime(waterTime);
	box.transform.position.y = transform.position.y+10*waterTime;
}

function OnGUI()
{
	//GUI.Label(Rect(50,50,100,50), totalVelocity.ToString());
}
// toggle transparency or not
function riseWater ( minV:float, maxV:float) {
	if(GetComponent.<ParticleEmitter>().localVelocity.y > minV && decr)
	{
		GetComponent.<ParticleEmitter>().localVelocity.y -= 10 * Time.deltaTime;
	}
	else
	{
		GetComponent.<ParticleEmitter>().localVelocity.y += 10 * Time.deltaTime;
	}
	
	if (GetComponent.<ParticleEmitter>().localVelocity.y > maxV)
	{
		GetComponent.<Renderer>().enabled =false;
		decr = true;
	}
	else if ( GetComponent.<ParticleEmitter>().localVelocity.y  < minV)
	{
		GetComponent.<Renderer>().enabled =true;
		decr = false;
	}
	
	
}