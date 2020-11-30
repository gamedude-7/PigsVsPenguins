private var enableInput: boolean = true;

var keyboardInput : boolean;
var mouseInput : boolean;
var controllerInput: boolean;

//--------------------------------------------------------------------------------------------------
public var maxSpeed : float =10.0;	// m/s
public var maxAcceleration : float = maxSpeed / 4.0;	// m/s^2
public var maxDecceleration: float = 0.1;
public var maxBraking : float = maxSpeed / 2.0;	// m/s^2

public var maxPitchDegrees : float = 45;
public var minPitchDegrees : float = -45;

public var headingDegreesPerSecond : float = 120.0;
public var pitchDegreesPerSecond : float = 60;
public var rollDegreesPerSecond : float = 15;

//--------------------------------------------------------------------------------------------------
public var inputThreshold : float = 0.05;
var inputThrust : boolean;
var inputBrake : boolean;
var inputReverse : boolean;
var inputPitch : float;
var inputHeading : float;
var inputDrift: boolean;
var mouseInputHeading: float;
var mouseInputPitch: float;
var controllerInputHeading: float;
var controllerInputPitch: float;
//--------------------------------------------------------------------------------------------------
var desiredSpeed : float = 0;
private var desiredVelocity : Vector3;
var frictionCoefficient: float = .5;
var isBoostActivated: boolean = false;
var boostAmmo: int = 0;
var timeSinceBoostActivated: float = 0;
var boostTime: int = 2;
var start: boolean = false;
var driftDamping: float = 100;
var gravityDamp: float = -98;
var turn: int=0;
var driftBar: float =0;
var maxBar: float = 5;
var level2: float;
var level1: float;
var driftHeading: float;
var particleMaxSize: float = 50;
private var prevHeading: float = 0;
private var originalMinSizeOfFireParticleEmitter: float = 0;
//--------------------------------------------------------------------------------------------------
function Start() 
{
	  Application.targetFrameRate = 60;
	  Time.captureFramerate = 60;
	  //QualitySettings.vSyncCount = 1;
	  QualitySettings.currentLevel = QualityLevel.Fastest;
	  GetComponent.<Rigidbody>().isKinematic = true;
	  Physics.gravity = Vector3(0,gravityDamp,0);
	  level2 = Mathf.Sqrt(maxBar);
	  level1 = Mathf.Sqrt(level2);
	  originalMinSizeOfFireParticleEmitter = transform.FindChild("Fire1").transform.FindChild("OuterCore").GetComponent.<ParticleEmitter>().minSize;
}
//--------------------------------------------------------------------------------------------------
function FixedUpdate() 
{
	var currentSpeed : float;
	
	//var d: float;
	//var prevDistance: float;
	if (!enableInput)
		return;
	if (gameObject.Find("Code").GetComponent(GameLobby).levelToLoad == 1) 
		start = gameObject.Find("Waypoints").GetComponent(Race).raceStarted;
	else if  (gameObject.Find("Code").GetComponent(GameLobby).levelToLoad == 2) 
		start = gameObject.Find("BattleArenaRules").GetComponent("BattleArenaRules").battleStarted;
	else 
		start = true;
	if (start) {
		currentSpeed = GetComponent.<Rigidbody>().velocity.magnitude;
		GetComponent.<Rigidbody>().isKinematic = false;	
		inputHeading = Input.GetAxis("Heading");
		inputPitch = Input.GetAxis("Pitch");
		
		inputMouseHeading =  Input.GetAxis("Mouse X");
		inputMousePitch =  Input.GetAxis("Mouse Y");
		
		inputControllerHeading = Input.GetAxis("ControlStickX");
		inputControllerPitch = Input.GetAxis("ControlStickY");

		inputThrust = Input.GetButton("Throttle");
		inputBrake = Input.GetButton("Brake");
		inputReverse = Input.GetButton("Reverse");
		inputDrift = Input.GetButton("Drift");

		if (keyboardInput == true)
		{
			
				
			//modnation style drifting or mario kart style drifting ( not sure if its like mario kart, but i think it is)
			if ( (inputBrake || inputDrift) && inputThrust)	
			{
				if (turn==0)
				{
				//	driftHeading = transform.rotation.eulerAngles.y;
					if (inputHeading>0) // if turn right
						turn = 1;
					else if (inputHeading<0) // if turn left
						turn = -1;
				}
				transform.Rotate(Vector3.up, inputHeading * headingDegreesPerSecond * Time.deltaTime, Space.World);	
				/*var nextRotation: float = transform.rotation.eulerAngles.y + inputHeading * headingDegreesPerSecond * Time.deltaTime ;

				if ( nextRotation > (driftHeading-30) && nextRotation < (driftHeading+30))
				{
					transform.Rotate(Vector3.up, inputHeading * headingDegreesPerSecond * Time.deltaTime, Space.World);	
				}
				else
				{
					transform.eulerAngles.y = Mathf.Clamp(transform.eulerAngles.y,driftHeading-30,driftHeading+30);
				}*/
				if (turn<0) // if turning left 
				{
					transform.position+=inputHeading*transform.right*inputHeading*driftDamping*Time.deltaTime;
				}
				if (turn>0)
				{
					transform.position-=inputHeading*transform.right*inputHeading*driftDamping*Time.deltaTime; 
				}
				if (turn!=0)
				{
					var incr: float;
			
					if ( prevHeading!=inputHeading)
					{
						incr=100;
						//Debug.Log("level3: " + incr);
					}
					else if (turn!=inputHeading)
					{
						incr=(Time.deltaTime*100)*(Time.deltaTime*100);
						//Debug.Log("level2: " + incr);
					}
					else 
					{
						incr=(Time.deltaTime*100);
						//Debug.Log("level1: " + incr);
					}
					driftBar+=incr;
				}
				
				
				if (driftBar>level1 && driftBar<level2)
				{
					transform.FindChild("Fire1").transform.FindChild("OuterCore").GetComponent.<Renderer>().material.SetColor("_TintColor",Color.yellow);
					transform.FindChild("Fire2").transform.FindChild("OuterCore").GetComponent.<Renderer>().material.SetColor("_TintColor",Color.yellow);
				}
				else if (driftBar>=level2 && driftBar<maxBar)
				{
					transform.FindChild("Fire1").transform.FindChild("OuterCore").GetComponent.<Renderer>().material.SetColor("_TintColor",Color.blue);
					transform.FindChild("Fire2").transform.FindChild("OuterCore").GetComponent.<Renderer>().material.SetColor("_TintColor",Color.blue);
				} 
				else if (driftBar>=maxBar)
				{
					transform.FindChild("Fire1").transform.FindChild("OuterCore").GetComponent.<Renderer>().material.SetColor("_TintColor",Color.red);
					transform.FindChild("Fire2").transform.FindChild("OuterCore").GetComponent.<Renderer>().material.SetColor("_TintColor",Color.red);
				}
				prevHeading = inputHeading;
				
				
			}		
			else // drift and gas button is not pressed
			{
				transform.Rotate(Vector3.up, inputHeading * headingDegreesPerSecond * Time.deltaTime, Space.World);	
				if ( transform.FindChild("Fire1").transform.FindChild("OuterCore").GetComponent.<Renderer>().material.GetColor("_TintColor") == Color.red)
				{
					
					isBoostActivated = true;
					timeSinceBoostActivated = 0;
					transform.FindChild("Fire1").transform.FindChild("OuterCore").GetComponent.<ParticleEmitter>().minSize=particleMaxSize;
					transform.FindChild("Fire2").transform.FindChild("OuterCore").GetComponent.<ParticleEmitter>().minSize=particleMaxSize;
					
					//Debug.Log("max size particle: " + particleMaxSize );
					//Debug.Break();
				}
			
					
				
				// need to let go of drift to drift the other way
				turn = 0;
				driftBar=0;
				transform.FindChild("Fire1").transform.FindChild("OuterCore").GetComponent.<Renderer>().material.SetColor("_TintColor",Color.gray);
				transform.FindChild("Fire2").transform.FindChild("OuterCore").GetComponent.<Renderer>().material.SetColor("_TintColor",Color.gray);
			}
			if (transform.FindChild("Fire1").transform.FindChild("OuterCore").GetComponent.<ParticleEmitter>().minSize>originalMinSizeOfFireParticleEmitter)
			{
				Debug.Log("particleMaxSize: " + particleMaxSize + " origsize: " + originalMinSizeOfFireParticleEmitter + " deltatime: " + Time.deltaTime);
				transform.FindChild("Fire1").transform.FindChild("OuterCore").GetComponent.<ParticleEmitter>().minSize-=((particleMaxSize-originalMinSizeOfFireParticleEmitter)*Time.deltaTime);
				transform.FindChild("Fire2").transform.FindChild("OuterCore").GetComponent.<ParticleEmitter>().minSize-=((particleMaxSize-originalMinSizeOfFireParticleEmitter)*Time.deltaTime);
				
			}
			else
			{
				transform.FindChild("Fire1").transform.FindChild("OuterCore").GetComponent.<ParticleEmitter>().minSize=originalMinSizeOfFireParticleEmitter;
				transform.FindChild("Fire2").transform.FindChild("OuterCore").GetComponent.<ParticleEmitter>().minSize=originalMinSizeOfFireParticleEmitter;
			}
		}
		else if (mouseInput == true)
		{
			transform.Rotate(Vector3.right, inputPitch * pitchDegreesPerSecond * Time.deltaTime);
			transform.Rotate(Vector3.up, inputHeading * headingDegreesPerSecond * Time.deltaTime, Space.World);		
			transform.Rotate(Vector3.forward, -inputHeading * rollDegreesPerSecond * Time.deltaTime*(GetComponent.<Rigidbody>().velocity.z/10), Space.World);			
			if (inputMousePitch != 0 )
			{
					transform.Rotate(Vector3.right, -inputMousePitch * pitchDegreesPerSecond * Time.deltaTime);
			}
			if (inputMouseHeading != 0 )
			{
					transform.Rotate(Vector3.up, inputMouseHeading *  Mathf.LerpAngle(0, headingDegreesPerSecond, Time.time) * Time.deltaTime, Space.World);
					transform.Rotate(Vector3.forward, -inputMouseHeading * Mathf.LerpAngle(0, rollDegreesPerSecond, Time.time) * Time.deltaTime*(GetComponent.<Rigidbody>().velocity.z/10), Space.World);
			}
		}
		else if (controllerInput == true)
		{
			transform.Rotate(Vector3.right, inputControllerPitch * pitchDegreesPerSecond * Time.deltaTime);
			transform.Rotate(Vector3.up, inputControllerHeading * headingDegreesPerSecond * Time.deltaTime, Space.World);		
			transform.Rotate(Vector3.forward, -inputControllerHeading * rollDegreesPerSecond * Time.deltaTime*(GetComponent.<Rigidbody>().velocity.z/10), Space.World);		
		}
	/*	if (inputPitch > 0)
			transform.position.y-=Time.deltaTime*20;
		else if (inputPitch < 0)
			transform.position.y+=Time.deltaTime*20;
		*/
			

		RestrictPitch();
		RestrictRoll();
	//	Debug.Log("xaxis: " + inputHeading + "yaxis: " + inputPitch );
	//	Debug.Log("Pitch: " + transform.eulerAngles.x + " Roll: " + transform.eulerAngles.z);
		//RestrictRoll();
		
		
		desiredSpeed = currentSpeed;
		
		
		for ( var go in FindObjectsOfType(Character))
		{
			if (go.gameObject.name.Contains(MainMenu.playerNameInput)) {
				if (go.GetComponent(Character).isFinished == false) {
					if (inputThrust)
					{
						desiredSpeed += maxAcceleration;
					}
				}
				else {
					desiredSpeed -= maxBraking;
				}
			}
		}
		
		if (inputThrust)
		{
			desiredSpeed +=  maxAcceleration;
		}		
		else if (inputBrake )
		{
			desiredSpeed -= maxBraking;
		}
		else
		{
			desiredSpeed -= maxDecceleration;
		}
	
		if (inputReverse && !inputThrust)
		{
			desiredSpeed -= 50;
		}
	
		desiredSpeed = Mathf.Clamp(desiredSpeed, -100, maxSpeed);
		if (isBoostActivated && timeSinceBoostActivated < boostTime)
		{		
			desiredSpeed=maxSpeed;
			timeSinceBoostActivated+=Time.deltaTime;
			
		}
		else
		{
			
			if (gameObject.Find("Code").GetComponent(GameLobby).playerCharacter == "Penguin" && isBoostActivated)
			{
				transform.FindChild("Fire1").transform.FindChild("OuterCore").GetComponent.<ParticleEmitter>().minSize/=10;
			}
			else if (isBoostActivated)
			{
				if (!transform.FindChild("PvP_MDL_Pig(BETA)").GetComponent.<Animation>().IsPlaying("idle"))
				{
					transform.FindChild("PvP_MDL_Pig(BETA)").GetComponent.<Animation>().CrossFade("idle");
				}
			}
			isBoostActivated = false;
		}
		desiredVelocity = transform.forward * desiredSpeed;
		
		
		var deltaV : Vector3 = desiredVelocity - GetComponent.<Rigidbody>().velocity;

		if (Mathf.Abs(deltaV.magnitude) > 0.1)
		{
			GetComponent.<Rigidbody>().AddForce(deltaV, ForceMode.VelocityChange);
		}
	

		/*if (keyboardInput)
		{
			if( !inputPitch)
			{
				revertPitchToLevel();
			}
			if (!inputHeading)
			{
				revertRollToLevel();
			}
		}
		else if (mouseInput)
		{
			if( !inputMousePitch && !inputPitch)
			{
				revertPitchToLevel();				
			}
			if (!inputMouseHeading && !inputHeading)
			{
				revertRollToLevel();
			}
		}
		else if (controllerInput)
		{
			if( !inputControllerPitch)
			{
				revertPitchToLevel();				
			}
			if (!inputControllerHeading)
			{
				revertRollToLevel();
			}
		}*/

		
	}
	
}

//--------------------------------------------------------------------------------------------------
function Update() 
{
	// Draw local axes
	Debug.DrawLine(transform.position, transform.position + transform.forward, Color.blue);
	Debug.DrawLine(transform.position, transform.position + transform.up, Color.green);
	Debug.DrawLine(transform.position, transform.position + transform.right, Color.red);

	// Draw desired velocity
	Debug.DrawLine(transform.position, transform.position + desiredVelocity, Color.cyan);
	
	// Draw velocity
	Debug.DrawLine(transform.position, transform.position + GetComponent.<Rigidbody>().velocity, Color.yellow);
	
	// Draw difference between desired and current velocity
	Debug.DrawLine(transform.position + GetComponent.<Rigidbody>().velocity, transform.position + desiredVelocity, Color.magenta);
	
}

//---------------------------------------------------------------------------------------------------------
function RestrictPitch()
{
	// 0/360 degrees is when player is pointing forward, as it rises it goes down from 360 but when it dives it increments from 0
	
	if(transform.eulerAngles.x > 180 && transform.eulerAngles.x < 360)
	{
		// too much rising
		if (transform.eulerAngles.x < 330)
			transform.eulerAngles.x = 330;
	}
	else
	{
		// too much diving
		transform.eulerAngles.x = Mathf.Clamp(transform.eulerAngles.x, 0, 30);
	}
}

function RestrictRoll()
{

	if(transform.eulerAngles.z > 180 && transform.eulerAngles.z < 360)
	{
		// too much rising
		if (transform.eulerAngles.z < 330)
			transform.eulerAngles.z = 330;
	}
	else
	{
		// too much diving
		transform.eulerAngles.z = Mathf.Clamp(transform.eulerAngles.z, 0, 30);
	}

	/*if(transform.eulerAngles.z > 330 && transform.eulerAngles.z < 360)
	{
		transform.eulerAngles.z = Mathf.Clamp(transform.eulerAngles.z, 330, 360);
	}
	else if(transform.eulerAngles.z > 0 && transform.eulerAngles.z < 30)
	{
		transform.eulerAngles.z = Mathf.Clamp(transform.eulerAngles.z, 0, 30);
	}*/
}

//---------------------------------------------------------------------------------------------------------
function revertPitchToLevel()
{
	if(transform.eulerAngles.x > 180 && transform.eulerAngles.x < 359)
	{
		transform.Rotate(Vector3.right, pitchDegreesPerSecond * Time.deltaTime );
	}
	else if(transform.eulerAngles.x > 1 && transform.eulerAngles.x < 179 )
	{
		transform.Rotate(Vector3.right, -pitchDegreesPerSecond * Time.deltaTime );
	}		
}

function revertRollToLevel()
{
	if(transform.eulerAngles.z > 180 && transform.eulerAngles.z < 359 )
	{
		transform.Rotate(Vector3.forward, Time.deltaTime * (rollDegreesPerSecond ) * 2);
	}
	else if(transform.eulerAngles.z > 1 && transform.eulerAngles.z < 179 )
	{
		transform.Rotate(Vector3.forward, Time.deltaTime * (-rollDegreesPerSecond ) * 2);
	}
}

//---------------------------------------------------------------------------------------------------------

function OnGUI() {
	// Draw local axes
	Debug.DrawLine(transform.position, transform.position + transform.forward, Color.blue);
	Debug.DrawLine(transform.position, transform.position + transform.up, Color.green);
	Debug.DrawLine(transform.position, transform.position + transform.right, Color.red);

	// Draw desired velocity
	Debug.DrawLine(transform.position, transform.position + desiredVelocity, Color.cyan);
	
	// Draw velocity
	Debug.DrawLine(transform.position, transform.position + GetComponent.<Rigidbody>().velocity, Color.yellow);
	
	// Draw difference between desired and current velocity
	Debug.DrawLine(transform.position + GetComponent.<Rigidbody>().velocity, transform.position + desiredVelocity, Color.magenta);	
}

function EnableUserInput( enable: boolean)
{
	enableInput = enable;
	if (enable)
	{
		//rigidbody.WakeUp();
		GetComponent.<Rigidbody>().isKinematic = false;
	}
	else
	{
		//rigidbody.Sleep();
		GetComponent.<Rigidbody>().isKinematic = true;
	}
//	GetComponent(Pig).state.dizzy = enable;
}