var satelliteDish : GameObject;
//var satellitePosition : Vector3 = Vector3(0,0,0);

function Start() {

	//satellitePosition = satelliteDish.transform.position;

}

function Update () {

	//satelliteDish.transform.eulerAngles.y += 1;
	satelliteDish.transform.Rotate(Vector3.up * 20 * Time.deltaTime, Space.Self);
	//satelliteDish.transform.position = satellitePosition;
	//satelliteDish.transform.position = Vector3(0,0,0);
	
}