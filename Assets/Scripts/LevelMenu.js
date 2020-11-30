var ArcticTextCube: GameObject;
var FarmTextCube: GameObject;

var ArcticTextCubeStartingPoints:Vector3;
var FarmTextCubeStartingPoints:Vector3;

ArcticTextCube.GetComponent.<Renderer>().material.color = Color.black;
ArcticTextCubeStartingPoints = Vector3(ArcticTextCube.transform.position.x, ArcticTextCube.transform.position.y, ArcticTextCube.transform.position.z);

FarmTextCube.GetComponent.<Renderer>().material.color = Color.black;
FarmTextCubeStartingPoints = Vector3(FarmTextCube.transform.position.x, FarmTextCube.transform.position.y, FarmTextCube.transform.position.z);

var buttonAudio: AudioClip;

var increment: float = 0;

function OnGUI()
{
	if (gameObject.Find("ChooseLevelText").GetComponent.<Renderer>().enabled)
	{
		if(GUI.Button(Rect(40,10,150,20), "Back to main menu") ){
			HideLevelMenu();
			gameObject.Find("Code").GetComponent(MultiplayerMenu).showMenu = true;
		}
	}
}

function OnMouseEnter () {

	if (gameObject.name == "ArcticText") {
		ArcticTextCube.GetComponent.<Renderer>().material.color = Color.red;
		gameObject.Find("MainCamera").GetComponent.<AudioSource>().PlayOneShot(buttonAudio);
	}
	if (gameObject.name == "FarmText") {
		FarmTextCube.GetComponent.<Renderer>().material.color = Color.red;
		gameObject.Find("MainCamera").GetComponent.<AudioSource>().PlayOneShot(buttonAudio);
	}
	
}

function OnMouseOver() {

	if (gameObject.name == "ArcticText") {
		if (ArcticTextCube.transform.position.z > -4) {
			increment += 0.0001;
			ArcticTextCube.transform.position.z -= increment;
		}
	}
	
	if (gameObject.name == "FarmText") {
		if (FarmTextCube.transform.position.z > -4) {
			increment += 0.0001;
			FarmTextCube.transform.position.z -= increment;
		}
	}

}

function OnMouseExit()
{
	increment = 0;
	
	ArcticTextCube.GetComponent.<Renderer>().material.color = Color.black;
	ArcticTextCube.transform.position = ArcticTextCubeStartingPoints;
	
	FarmTextCube.GetComponent.<Renderer>().material.color = Color.black;
	FarmTextCube.transform.position = FarmTextCubeStartingPoints;
}

function OnMouseUp ()
{	
	Debug.Log("text: " + gameObject.name);

	if (gameObject.name == "ArcticText")
		gameObject.Find("Code").GetComponent(GameLobby).levelToLoad = 1;
	else if (gameObject.Find("Code").GetComponent(GameLobby).levelToLoad!=2)
		gameObject.Find("Code").GetComponent(GameLobby).levelToLoad = 3;

	HideLevelMenu();
	ShowCharacterMenu();
}

function HideLevelMenu()
{
	// hide level menu
	//gameObject.Find("LevelMenu").renderer.enabled = false;
	gameObject.Find("ArcticText").GetComponent.<Renderer>().enabled = false;
	gameObject.Find("FarmText").GetComponent.<Renderer>().enabled = false;
	gameObject.Find("ArcticTextCube").GetComponent.<Renderer>().enabled = false;
	gameObject.Find("FarmTextCube").GetComponent.<Renderer>().enabled = false;
	gameObject.Find("ChooseLevelText").GetComponent.<Renderer>().enabled = false;
	Destroy(gameObject.Find("ArcticText").GetComponent(BoxCollider));
	Destroy(gameObject.Find("FarmText").GetComponent(BoxCollider));
}

function ShowCharacterMenu()
{
	//gameObject.Find("CharacterMenu").renderer.enabled = true;
	gameObject.Find("Penguin").GetComponent.<Renderer>().enabled = true;
	gameObject.Find("Pig").GetComponent.<Renderer>().enabled = true;
	gameObject.Find("PenguinTextCube").GetComponent.<Renderer>().enabled = true;
	gameObject.Find("PigTextCube").GetComponent.<Renderer>().enabled = true;
	gameObject.Find("Pig").AddComponent(BoxCollider);
	gameObject.Find("Penguin").AddComponent(BoxCollider);
	gameObject.Find("ChooseCharacterText").GetComponent.<Renderer>().enabled = true;
}