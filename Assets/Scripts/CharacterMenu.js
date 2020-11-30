var PenguinTextCube: GameObject;
var PigTextCube: GameObject;

var PenguinTextCubeStartingPoints:Vector3;
var PigTextCubeStartingPoints:Vector3;

PenguinTextCube.GetComponent.<Renderer>().material.color = Color.black;
PenguinTextCubeStartingPoints = Vector3(PenguinTextCube.transform.position.x, PenguinTextCube.transform.position.y, PenguinTextCube.transform.position.z);

PigTextCube.GetComponent.<Renderer>().material.color = Color.black;
PigTextCubeStartingPoints = Vector3(PigTextCube.transform.position.x, PigTextCube.transform.position.y, PigTextCube.transform.position.z);

var buttonAudio: AudioClip;

var increment: float = 0;

function OnGUI()
{
	if (gameObject.Find("Penguin").GetComponent.<Renderer>().enabled)
	{
		if(GUI.Button(Rect(40,10,150,20), "Back to main menu") ){
			HideCharacterMenu();
			gameObject.Find("Code").GetComponent(MultiplayerMenu).showMenu = true;
		}
	}
}

function OnMouseEnter () {

	if (gameObject.name == "Penguin") {
		PenguinTextCube.GetComponent.<Renderer>().material.color = Color.red;
		gameObject.Find("MainCamera").GetComponent.<AudioSource>().PlayOneShot(buttonAudio);
	}
	if (gameObject.name == "Pig") {
		PigTextCube.GetComponent.<Renderer>().material.color = Color.red;
		gameObject.Find("MainCamera").GetComponent.<AudioSource>().PlayOneShot(buttonAudio);
	}
	
}

function OnMouseOver() {

	if (gameObject.name == "Penguin") {
		if (PenguinTextCube.transform.position.z > -4) {
			increment += 0.0001;
			PenguinTextCube.transform.position.z -= increment;
		}
	}
	
	if (gameObject.name == "Pig") {
		if (PigTextCube.transform.position.z > -4) {
			increment += 0.0001;
			PigTextCube.transform.position.z -= increment;
		}
	}

}

function OnMouseExit()
{
	increment = 0;
	
	PenguinTextCube.GetComponent.<Renderer>().material.color = Color.black;
	PenguinTextCube.transform.position = PenguinTextCubeStartingPoints;
	
	PigTextCube.GetComponent.<Renderer>().material.color = Color.black;
	PigTextCube.transform.position = PigTextCubeStartingPoints;
}

function OnMouseUp ()
{	
	HideCharacterMenu();
	
	gameObject.Find("Code").GetComponent(GameLobby).playerCharacter = gameObject.name;
	
	ShowControllerSetup();
}

function HideCharacterMenu()
{
	// disable character menu
	gameObject.Find("CharacterMenu").GetComponent.<Renderer>().enabled = false;
	gameObject.Find("Penguin").GetComponent.<Renderer>().enabled = false;
	gameObject.Find("Pig").GetComponent.<Renderer>().enabled = false;
	gameObject.Find("PenguinTextCube").GetComponent.<Renderer>().enabled = false;
	gameObject.Find("PigTextCube").GetComponent.<Renderer>().enabled = false;
	Destroy(gameObject.Find("Penguin").GetComponent(BoxCollider));
	Destroy(gameObject.Find("Pig").GetComponent(BoxCollider));
	gameObject.Find("ChooseCharacterText").GetComponent.<Renderer>().enabled = false;
}

function ShowControllerSetup()
{
	// show level menu
	//gameObject.Find("ControllerSetup").renderer.enabled  = true;
	//Debug.Log("ChooseLevelText: " + gameObject.Find("ChooseLevelText") );
	gameObject.Find("ControllerTitleText").GetComponent.<Renderer>().enabled  = true;
	gameObject.Find("KeyboardText").GetComponent.<Renderer>().enabled  = true;
	gameObject.Find("MouseText").GetComponent.<Renderer>().enabled  = true;
	gameObject.Find("ControllerText").GetComponent.<Renderer>().enabled = true;
	gameObject.Find("KeyboardTextCube").GetComponent.<Renderer>().enabled  = true;
	gameObject.Find("MouseTextCube").GetComponent.<Renderer>().enabled  = true;
	gameObject.Find("ControllerTextCube").GetComponent.<Renderer>().enabled = true;
	gameObject.Find("KeyboardText").AddComponent(BoxCollider);
	gameObject.Find("MouseText").AddComponent(BoxCollider);
	gameObject.Find("ControllerText").AddComponent(BoxCollider);
}

