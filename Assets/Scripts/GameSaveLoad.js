import System;
import System.Collections;
import System.Xml;
import System.Xml.Serialization;
import System.IO;
import System.Text;

// Anything we want to store in the XML file, we define it here
class Data
{

	var keyboard : boolean;
	var mouse : boolean;
	var controller : boolean;
}

// UserData is our custom class that holds our defined objects we want to store in XML format
 class UserData
 {
    // We have to define a default instance of the structure
   public var _iUser : Data = new Data();
    // Default constructor doesn't really do anything at the moment
   function UserData() { }
}

private var _FileLocation : String;
private var _FileName : String = "Settings.pvp";

private var myData : UserData;
private var _data : String;

function Awake () { 
       
      // Where we want to save and load to and from
      _FileLocation=Application.dataPath;
      
          
      // we need soemthing to store the information into
      myData=new UserData();
	  
	 if (Application.loadedLevelName == "Arctic") {
	  
		 // LoadXML();
		  
		  //if(_data.ToString() != "")
		  //{
		
			//myData = DeserializeObject(_data);
			 
			//keyboardInput = myData._iUser.keyboard;
			//kyboard = myData._iUser.keyboard;

			//mouse = myData._iUser.mouse;
			
		  //}
	}
	
}
   
   
function Update()
{   
	
//Debug.Log("MouseInput: " + mouseInput);
			if (myData._iUser.keyboard == true) {
				for ( var go in FindObjectsOfType(Character))
				{
					if (go.gameObject.name.Contains(MainMenu.playerNameInput)) {
						if (go.GetComponent(FlightControls)!=null)
						{
							go.GetComponent(FlightControls).keyboardInput = true;
						}
						go.GetComponent(MotorControls).keyboardInput = true;
					}
				}
			}
			if (myData._iUser.mouse == true) {
				for ( var go in FindObjectsOfType(Character))
				{
					if (go.gameObject.name.Contains(MainMenu.playerNameInput)) {
						go.GetComponent(FlightControls).mouseInput = true;
					}
				}
			}
			if (myData._iUser.controller == true) {
				for ( var go in FindObjectsOfType(Character))
				{
					if (go.gameObject.name.Contains(MainMenu.playerNameInput)) {
						go.GetComponent(FlightControls).controllerInput = true;
					}
				}
			}
   // ***************************************************
   // Saving The Player...
   // **************************************************  
   if (Application.loadedLevelName == "Lobby") {
   
	   //if(gameObject.Find("KeyboardText").GetComponent(ControllerSetup).keyboard == true) {
				
		  //myData._iUser.name = _PlayerName;
		  
		if (gameObject.Find("KeyboardText").GetComponent(ControllerSetup).keyboard == true) {
			myData._iUser.keyboard = true;
		}
		
		if (gameObject.Find("MouseText").GetComponent(ControllerSetup).mouse == true) {
			myData._iUser.mouse = true;
		}
		
		if (gameObject.Find("ControllerText").GetComponent(ControllerSetup).controller == true) {
			myData._iUser.controller = true;
		}
//		_data = SerializeObject(myData);
//		CreateXML();
	}

}
   
/* The following metods came from the referenced URL */
//string UTF8ByteArrayToString(byte[] characters)
/*function UTF8ByteArrayToString(characters : byte[] )
{     
   var encoding : UTF8Encoding  = new UTF8Encoding();
   var constructedString : String  = encoding.GetString(characters);
   return (constructedString);
}

//byte[] StringToUTF8ByteArray(string pXmlString)
function StringToUTF8ByteArray(pXmlString : String)
{
   var encoding : UTF8Encoding  = new UTF8Encoding();
   var byteArray : byte[]  = encoding.GetBytes(pXmlString);
   return byteArray;
}
   
   // Here we serialize our UserData object of myData
   //string SerializeObject(object pObject)
function SerializeObject(pObject : Object)
{
   var XmlizedString : String  = null;
   var memoryStream : MemoryStream  = new MemoryStream();
   var xs : XmlSerializer = new XmlSerializer(typeof(UserData));
   var xmlTextWriter : XmlTextWriter  = new XmlTextWriter(memoryStream, Encoding.UTF8);
   xs.Serialize(xmlTextWriter, pObject);
   memoryStream = xmlTextWriter.BaseStream; // (MemoryStream)
   XmlizedString = UTF8ByteArrayToString(memoryStream.ToArray());
   return XmlizedString;
}

   // Here we deserialize it back into its original form
   //object DeserializeObject(string pXmlizedString)
function DeserializeObject(pXmlizedString : String)   
{
   var xs : XmlSerializer  = new XmlSerializer(typeof(UserData));
   var memoryStream : MemoryStream  = new MemoryStream(StringToUTF8ByteArray(pXmlizedString));
   var xmlTextWriter : XmlTextWriter  = new XmlTextWriter(memoryStream, Encoding.UTF8);
   return xs.Deserialize(memoryStream);
}

   // Finally our save and load methods for the file itself
function CreateXML()
{
   var writer : StreamWriter;
   //FileInfo t = new FileInfo(_FileLocation+"\\"+ _FileName);
   var t : FileInfo = new FileInfo(_FileLocation+"/"+ _FileName);
   if(!t.Exists)
   {
      writer = t.CreateText();
   }
   else
   {
      t.Delete();
      writer = t.CreateText();
   }
   writer.Write(_data);
   writer.Close();
   Debug.Log("File written.");
}
   
function LoadXML()
{
   //StreamReader r = File.OpenText(_FileLocation+"\\"+ _FileName);
   var r : StreamReader = File.OpenText(_FileLocation+"/"+ _FileName);
   var _info : String = r.ReadToEnd();
   r.Close();
   _data=_info;
   Debug.Log("File Read");
}*/

//}