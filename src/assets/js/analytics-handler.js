var scxmlHandler = window.scxmlHandler || {};

scxmlHandler.sendAnalytics = function (action, linkText, linkHref) {
	/*
	console.log("sendAnalytics for action =" + action +" linkText="+ linkText +" linkHref="+ linkHref);
	if(window._waDataLayer) {
		scxmlHandler.satelliteTrack(action);
		window._waDataLayer.action = action; //'Link Click';		
		window._waDataLayer.linkText = linkText; // 'whatever the link text is here please';		
		window._waDataLayer.linkHref = linkHref; //'whatever the link HREF value is here please';
		
	}
	*/
	scxmlHandler.satelliteTrack(action);
};
scxmlHandler.satelliteTrack = function (action) {
	console.log("satelliteTrack for action " + action);
	if (window._satellite) {
		_satellite.track(action)
	}
};

scxmlHandler.addAnalyticEvent = function (etarget, edataobj) {
	if (window.sendCUEMEevent) {
		sendCUEMEevent("click", "appeventTarget", etarget);
		var analyticData = JSON.stringify(edataobj);
		sendCUEMEevent("click", "sendappEvent", analyticData);
		scxmlHandler.addTestFairyLog(etarget, analyticData);
	}
}

scxmlHandler.addTestFairyLog = function (etarget, logData) {
	if (etarget.indexOf('AppScreen') !== -1) {
		scxmlHandler.setTestfairyScreenName(etarget);
	}
	scxmlHandler.testfairylog(logData);
}