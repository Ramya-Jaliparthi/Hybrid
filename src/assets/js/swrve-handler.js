var scxmlHandler = window.scxmlHandler || {};
var swrveUserId = '';

scxmlHandler.getSwrveUserId = function(){
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click','getSwrveUserId');
	}
};

scxmlHandler.getSwrveUserIdSuccess = function(data) {
	this.swrveUserId = data;
	console.log('swrve userid='+data);
	//this.successAlert(data);
};

scxmlHandler.getSwrveUserIdError = function(data) {
	
	this.failureAlert(data);
};

scxmlHandler.setUserProperties = function(){
	 var userProps = {"group": "TestGroup"};
	 if (window.sendCUEMEevent) {
		 sendCUEMEevent('click','setSwrveUserProperties', JSON.stringify(userProps));
	 }
};

scxmlHandler.setUserPropertiesSuccess = function() {
	this.successAlert("Set User Properties Success");
};

scxmlHandler.setUserPropertiesFailed = function(data) {
	this.successAlert("Set User Properties Error " + JSON.stringify(data));
};

scxmlHandler.successAlert = function(data){
	
	if( typeof data !== 'string'){
		data = JSON.stringify(data);
	}
	alert(data);
};

scxmlHandler.failureAlert = function(data){
	if( typeof data !== 'string'){
		data = JSON.stringify(data);
	}
	
	alert(data);
};

scxmlHandler.getUserIdFromSwrve = function(){
	if (this.swrveUserId == "") {
		console.log("swrveUserId is invalid. Retrying...");
		scxmlHandler.getSwrveUserId();
	}
	return this.swrveUserId;
}
	
