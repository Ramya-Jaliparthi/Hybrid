var scxmlHandler = window.scxmlHandler || {};


scxmlHandler.uploadLogs = function(){
    console.log("Scxml handler : uploading logs");
    if(window.sendCUEMEevent)
        sendCUEMEevent("click", "uploadLogs");
};

scxmlHandler.uploadComplete = function(){
    console.log("Upload complete");
    //    if(window.sendCUEMEevent)
    //        window.SettingsRef.component.uploadComplete();
};

scxmlHandler.writeToCuemeLog = function(data){
	 if(window.sendCUEMEevent) {
	     //sendCUEMEevent("click", "writeCuemeLog", data);
		 sendCUEMEevent("log", data, "error");
	 }
}