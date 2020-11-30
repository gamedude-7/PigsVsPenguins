var keyboard:boolean = false;
var mouse:boolean = false;
var controller:boolean = false;

var keyboardTextCube: GameObject;
var mouseTextCube: GameObject;
var controllerTextCube: GameObject;

var keyboardTextCubeStartingPoints:Vector3;
var mouseTextCubeStartingPoints:Vector3;
var controllerTextCubeStartingPoints:Vector3;

keyboardTextCube.GetComponent.<Renderer>().material.color = Color.black;
keyboardTextCubeStartingPoints = Vector3(keyboardTextCube.transform.position.x, keyboardTextCube.transform.position.y, keyboardTextCube.transform.position.z);

mouseTextCube.GetComponent.<Renderer>().material.color = Color.black;
mouseTextCubeStartingPoints = Vector3(mouseTextCube.transform.position.x, mouseTextCube.transform.position.y, mouseTextCube.transform.position.z);

controllerTextCube.GetComponent.<Renderer>().material.color = Color.black;
controllerTextCubeStartingPoints = Vector3(controllerTextCube.transform.position.x, controllerTextCube.transform.position.y, controllerTextCube.transform.position.z);

var buttonAudio: AudioClip;

var increment: float = 0;
var showNameMenu: boolean = false;

function OnGUI()
{
	if (gameObject.Find("KeyboardText").GetComponent.<Renderer>().enabled)
	{
		if(GUI.Button(Rect(40,10,150,20), "Back to main menu") ){
			HideControllerSetup();
			gameObject.Find("Code").GetComponent(MultiplayerMenu).showMenu = true;
		}
	}
}

function OnMouseEnter () {

	if (gameObject.name == "KeyboardText") {
		keyboardTextCube.GetComponent.<Renderer>().material.color = Color.red;
		gameObject.Find("MainCamera").GetComponent.<AudioSource>().PlayOneShot(buttonAudio);
	}
	if (gameObject.name == "MouseText") {
		mouseTextCube.GetComponent.<Renderer>().material.color = Color.red;
		gameObject.Find("MainCamera").GetComponent.<AudioSource>().PlayOneShot(buttonAudio);
	}
	if (gameObject.name == "ControllerText" && (Input.GetJoystickNames().Length > 0)) {
		controllerTextCube.GetComponent.<Renderer>().material.color = Color.red;
		gameObject.Find("MainCamera").GetComponent.<AudioSource>().PlayOneShot(buttonAudio);
	}
}

function OnMouseOver() {

	if (gameObject.name == "KeyboardText") {
		if (keyboardTextCube.transform.position.z > -4) {
			increment += 0.0001;
			keyboardTextCube.transform.position.z -= increment;
		}
	}
	
	if (gameObject.name == "MouseText") {
		if (mouseTextCube.transform.position.z > -4) {
			increment += 0.0001;
			mouseTextCube.transform.position.z -= increment;
		}
	}

	if (gameObject.name == "ControllerText" && (Input.GetJoystickNames().Length > 0)) {
		if (mouseTextCube.transform.position.z > -4) {
			increment += 0.0001;
			controllerTextCube.transform.position.z -= increment;
		}
	}

}

function OnMouseExit()
{
	GetComponent.<Renderer>().material.color = Color.white;increment = 0;
	
	keyboardTextCube.GetComponent.<Renderer>().material.color = Color.black;
	keyboardTextCube.transform.position = keyboardTextCubeStartingPoints;
	
	mouseTextCube.GetComponent.<Renderer>().material.color = Color.black;
	mouseTextCube.transform.position = mouseTextCubeStartingPoints;
	
	controllerTextCube.GetComponent.<Renderer>().material.color = Color.black;
	controllerTextCube.transform.position = controllerTextCubeStartingPoints;
}

function OnMouseUp ()
{	

	if (gameObject.name == "KeyboardText") {
		keyboard = true;
		HideControllerSetup();
		showNameMenu = true;
		gameObject.Find("Code").GetComponent(MainMenu).requirePlayerName = true;
	}
	else if (gameObject.name == "MouseText") {
		mouse = true;
		HideControllerSetup();
		showNameMenu = true;
		gameObject.Find("Code").GetComponent(MainMenu).requirePlayerName = true;
	}
	else if (gameObject.name == "ControllerText" && (Input.GetJoystickNames().Length > 0)) {
		controller = true;
		HideControllerSetup();
		showNameMenu = true;
		gameObject.Find("Code").GetComponent(MainMenu).requirePlayerName = true;
	}
	
/*	if(MultiplayerMenu.isHost)
		gameObject.Find("Code").GetComponent(MultiplayerMenu).ShowHostMenu();
	else
		gameObject.Find("Code").GetComponent(MultiplayerMenu).ShowJoinMenu();
*/
	
}

function HideControllerSetup()
{
	// hide game type menu
	gameObject.Find("ControllerSetup").GetComponent.<Renderer>().enabled  = false;
	gameObject.Find("ControllerTitleText").GetComponent.<Renderer>().enabled  = false;
	gameObject.Find("KeyboardText").GetComponent.<Renderer>().enabled  = false;
	gameObject.Find("MouseText").GetComponent.<Renderer>().enabled  = false;
	gameObject.Find("ControllerText").GetComponent.<Renderer>().enabled  = false;
	gameObject.Find("KeyboardTextCube").GetComponent.<Renderer>().enabled  = false;
	gameObject.Find("MouseTextCube").GetComponent.<Renderer>().enabled  = false;
	gameObject.Find("ControllerTextCube").GetComponent.<Renderer>().enabled  = false;
	Destroy(gameObject.Find("MouseText").GetComponent(BoxCollider));
	Destroy(gameObject.Find("KeyboardText").GetComponent(BoxCollider));
	Destroy(gameObject.Find("ControllerText").GetComponent(BoxCollider));
}