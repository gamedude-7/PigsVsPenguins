var raceTextCube: GameObject;
var battleTextCube: GameObject;

var raceTextCubeStartingPoints:Vector3;
var battleTextCubeStartingPoints:Vector3;

raceTextCube.GetComponent.<Renderer>().material.color = Color.black;
raceTextCubeStartingPoints = Vector3(raceTextCube.transform.position.x, raceTextCube.transform.position.y, raceTextCube.transform.position.z);

battleTextCube.GetComponent.<Renderer>().material.color = Color.black;
battleTextCubeStartingPoints = Vector3(battleTextCube.transform.position.x, battleTextCube.transform.position.y, battleTextCube.transform.position.z);

var buttonAudio: AudioClip;

var increment: float = 0;

function Update () {
    
}

function OnGUI()
{
	if (gameObject.Find("RaceText").GetComponent.<Renderer>().enabled)
	{
		if(GUI.Button(Rect(40,10,150,20), "Back to main menu") ){
			HideGameTypeMenu();
		//gameObject.Find("Code").GetComponent(GameLobby).showNameMenu = false;
			gameObject.Find("Code").GetComponent(MultiplayerMenu).showMenu = true;
		}
	}
}

function OnMouseEnter () {
	
	if (gameObject.name == "RaceText") {
		raceTextCube.GetComponent.<Renderer>().material.color = Color.red;
		gameObject.Find("MainCamera").GetComponent.<AudioSource>().PlayOneShot(buttonAudio);
	}
	if (gameObject.name == "BattleText") {
		battleTextCube.GetComponent.<Renderer>().material.color = Color.red;
		gameObject.Find("MainCamera").GetComponent.<AudioSource>().PlayOneShot(buttonAudio);
	}
	
}

function OnMouseOver() {

	if (gameObject.name == "RaceText") {
		if (raceTextCube.transform.position.z > -4) {
			increment += 0.0001;
			raceTextCube.transform.position.z -= increment;
		}
		
	}
	
	if (gameObject.name == "BattleText") {
		if (battleTextCube.transform.position.z > -4) {
			increment += 0.0001;
			battleTextCube.transform.position.z -= increment;
		}
		
	}

}


function OnMouseExit()
{
	increment = 0;
	
	raceTextCube.GetComponent.<Renderer>().material.color = Color.black;
	raceTextCube.transform.position = raceTextCubeStartingPoints;
	
	battleTextCube.GetComponent.<Renderer>().material.color = Color.black;
	battleTextCube.transform.position = battleTextCubeStartingPoints;
	
}

function OnMouseUp ()
{	
	if (gameObject.name == "RaceText")
		gameObject.Find("Code").GetComponent(GameLobby).levelToLoad = 1;
	else
		gameObject.Find("Code").GetComponent(GameLobby).levelToLoad = 2;
	HideGameTypeMenu();
	ShowLevelMenu();	
}

function HideGameTypeMenu()
{
	// hide game type menu
	gameObject.Find("GameTypeMenu").GetComponent.<Renderer>().enabled  = false;
	gameObject.Find("TitleText").GetComponent.<Renderer>().enabled  = false;
	gameObject.Find("BattleText").GetComponent.<Renderer>().enabled  = false;
	gameObject.Find("RaceText").GetComponent.<Renderer>().enabled  = false;	
	gameObject.Find("BattleTextCube").GetComponent.<Renderer>().enabled  = false;
	gameObject.Find("RaceTextCube").GetComponent.<Renderer>().enabled  = false;	
	Destroy(gameObject.Find("RaceText").GetComponent(BoxCollider));
	Destroy(gameObject.Find("BattleText").GetComponent(BoxCollider));
}

function ShowLevelMenu()
{
	// show level menu
	//gameObject.Find("LevelMenu").renderer.enabled  = true;
	Debug.Log("ChooseLevelText: " + gameObject.Find("ChooseLevelText") );
	gameObject.Find("ChooseLevelText").GetComponent.<Renderer>().enabled  = true;
	gameObject.Find("FarmText").GetComponent.<Renderer>().enabled  = true;
	gameObject.Find("ArcticText").GetComponent.<Renderer>().enabled  = true;
	gameObject.Find("ArcticTextCube").GetComponent.<Renderer>().enabled = true;
	gameObject.Find("FarmTextCube").GetComponent.<Renderer>().enabled = true;
	gameObject.Find("FarmText").AddComponent(BoxCollider);
	gameObject.Find("ArcticText").AddComponent(BoxCollider);
}