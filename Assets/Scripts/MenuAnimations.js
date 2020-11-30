var startAnime: boolean = false;

function OnMouseOver(collision:Collision) {

	if(Input.GetMouseButtonDown(0)){
		startAnime=true;
	}
		
}


function Update()
{

	if (startAnime )		
	{	
		GetComponent.<Animation>().CrossFade("Animation",1);
		startAnime = false;
	}
	else if (!GetComponent.<Animation>().isPlaying)
		GetComponent.<Animation>().CrossFade("idle",1);
	
}