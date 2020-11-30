var target : Transform;
function Update () {
	// Early out if we don't have a target
	if (!target)
		return;
	
	var vec: Vector3;	
	if (Input.GetAxis("Fire2"))
	{
		vec = target.position - target.forward*10;
	}
	else
	{
		transform.position = target.position - target.forward*10;
	}
	

	
	//transform.position -=  target.eulerAngles.y * Vector3.forward * 10;
	// Always look at the target
	if (Input.GetAxis("Fire2"))
	{
		transform.position = target.position;
		transform.LookAt(vec);
	}
	else
	{
		transform.LookAt (target);
	}
	
	transform.position.y +=2;
}