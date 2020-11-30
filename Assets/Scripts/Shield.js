
private var decr: boolean;



function Start()
{
	decr = false;
	GetComponent.<Renderer>().material.color.a = 1;
}

function Update () {
	for ( var currentPlayer in FindObjectsOfType(Character) )
	{
		if (currentPlayer.timeSinceShieldActivated < currentPlayer.shieldTime && currentPlayer.isShieldActivated)
		{			
			currentPlayer.enableShieldRenderer();
		}
		else if (currentPlayer.timeSinceShieldActivated >= currentPlayer.shieldTime)
		{
			currentPlayer.isShieldActivated = false;
			
			currentPlayer.disableShieldRenderer();
		}
		if (currentPlayer.isShieldActivated)
		{			
			currentPlayer.timeSinceShieldActivated+=Time.deltaTime;		
			Debug.Log("Time: " + currentPlayer.timeSinceShieldActivated);
		}
		//renderer.enabled = currentPlayer.isShieldActivated;
		toggleAlpha(0.3,1);
	}
	transform.Rotate(Vector3.up, Time.deltaTime*1080);
}

// toggle transparency or not
function toggleAlpha ( minV:float, maxV:float) {
	if(GetComponent.<Renderer>().material.color.a > minV && decr)
	{
		GetComponent.<Renderer>().material.color.a -= 1 * Time.deltaTime;
	}
	else
	{
		GetComponent.<Renderer>().material.color.a += 1 * Time.deltaTime;
	}
	
	if (GetComponent.<Renderer>().material.color.a > maxV)
	{
		decr = true;
	}
	else if ( GetComponent.<Renderer>().material.color.a < minV)
	{
		decr = false;
	}
	
}