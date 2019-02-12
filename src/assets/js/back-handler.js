var scxmlHandler = window.scxmlHandler || {};

scxmlHandler.keyPressed = function(key){
	console.log("Button pressed : "+key);
	if(window.DashboardPageRef){
		window.DashboardPageRef.component.onAndroidBackButton();
	}
	
	// window.MyDoctorsPageRef.component.onAndroidBackButton();
	// window.MyMedicationsPageRef.component.onAndroidBackButton();
	// window.MyClaimsPageRef.component.onAndroidBackButton();
	// window.MyCardsPageRef.component.onAndroidBackButton();
};

scxmlHandler.exitApplication = function(){
	console.log("Exiting application");
	if(window.sendCUEMEevent){
		//scxmlHandler.stopTestfairy();
		sendCUEMEevent("click", "exitApplication");
	}
};