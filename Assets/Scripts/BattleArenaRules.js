var battleStarted: boolean = false;
private var startTime: float;
private var restSeconds: float;
private var roundedRestSeconds: int;
private var displaySeconds: float;
private var displayMinutes: float;
public var CountDownSeconds: int = 3;
private var Timeleft: float;
var isBattleStartedOnServerAlready: boolean = false;
var positionTimeStyle : GUIStyle;
function Start()
{
	startTime = Time.time;
}
function Update () {
}

function OnGUI()
{
	Timeleft= Time.time-startTime;

	restSeconds = CountDownSeconds-(Timeleft);

	roundedRestSeconds=Mathf.CeilToInt(restSeconds);
	displaySeconds = roundedRestSeconds % 60;
	displayMinutes = (roundedRestSeconds / 60)%60;

	timetext = (displayMinutes.ToString()+":");
	
	if (displaySeconds > 9)
	{
		timetext = timetext + displaySeconds.ToString();
	}
	else 
	{
		timetext = "0" + displaySeconds.ToString();
	}
	
	if (displaySeconds > 0 ) {
		if (displaySeconds==1)
		{
			positionTimeStyle.normal.textColor = Color.yellow;
		}
		GUI.Label(Rect(Screen.width/2 - 60, Screen.height/2 - 100, 150,100), timetext, positionTimeStyle);
	}
	if (displaySeconds == 0 && Time.time < 60) { // check timeSinceRaceStarted < 10 to make sure it doesn't say go again on the next minute
		battleStarted = true;			
		if (Network.isServer)
			gameObject.Find("Code").GetComponent(GameLobby).isBattleStartedOnServerAlready = true;															
		positionTimeStyle.normal.textColor = Color.green;
		GUI.Label(Rect(Screen.width/2 - 60, Screen.height/2 - 100, 150,100), "GO", positionTimeStyle);
	}
}

