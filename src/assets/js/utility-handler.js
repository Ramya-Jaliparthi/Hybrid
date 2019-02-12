var scxmlHandler = window.scxmlHandler || {};

scxmlHandler.buildNumber = null;

scxmlHandler.dmId = null;
scxmlHandler.deviceType = null;
scxmlHandler.deviceIdentifier = null;
scxmlHandler.isPlatformReady = false;
scxmlHandler.cuemeReadyIdFired = false;
scxmlHandler.sendHomeScreenEvent = false;
var isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
scxmlHandler.setDMId = function (dmId) {
	this.dmId = dmId;
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'getSwrveUserId');
	}

}

scxmlHandler.getDMId = function () {
	return this.dmId;
}

scxmlHandler.setDeviceIdentifier = function (deviceId) {
	this.deviceIdentifier = deviceId;
}

scxmlHandler.getDeviceIdentifier = function () {
	return this.deviceIdentifier;
}

scxmlHandler.setBuildNumber = function (buildNumber) {
	console.log("build number : " + JSON.stringify(buildNumber));
	//window.AboutPageRef.component.setBuildNumber(buildNumber.version);
	this.buildNumber = buildNumber.version;
	this.deviceIdentifier = buildNumber.deviceId;
};

scxmlHandler.getBuildNumber = function () {
	var buildconfig = cueme_getCuemeInfo();
	return buildconfig.version;
};

scxmlHandler.addContact = function (name, phoneNumber) {
	var contact = {
		name: name,
		phone: phoneNumber,
		email: "",
		company: "",
		notes: "",
		secondary_phone: "",
		secondary_email: "",
		job_title: "",
		data: ""
	};
	if (window.sendCUEMEevent)
		sendCUEMEevent("click", "addContact", JSON.stringify(contact));
};

scxmlHandler.createMetric = function (name, value, customData) {
	var d = new Date();
	return { "dt": new Date().toUTCString(), "an": "MyBlue", "mn": name, "mv": value, "mcd": customData };
}
scxmlHandler.logMetric = function (mName, mValue, mCustomData) {
	var mJson = scxmlHandler.createMetric(mName, mValue, mCustomData);
	console.log('logMetric::appeventdata=' + JSON.stringify(mJson));
	// TODO: add user ID and any other user, device, client, application identifying information and log an appevent to DM
	if (window.sendCUEMEevent)
		sendCUEMEevent('click', 'logappevent', JSON.stringify(mJson));
}

scxmlHandler.closeLoadingMaskWindow = function () {
	//sendCUEMEevent('click', 'closeLoadingMaskWindow');
}

scxmlHandler.openLoadingMaskWindow = function () {
	if (window.sendCUEMEevent)
		sendCUEMEevent('click', 'openLoadingMaskWindow');
}

scxmlHandler.platformReady = function () {
	console.log("IN Platform Ready." + new Date().getTime());
	scxmlHandler.isPlatformReady = true;
	scxmlHandler.raiseCuemeready();



}
scxmlHandler.raiseCuemeready = function (cuemeAppLaunchParams, cuemeAppRestoreParams) {
	console.log("isPlatformReady=" + scxmlHandler.isPlatformReady + '::isCuemeReady=' + scxmlHandler.isCuemeReady + '::firedCuemeReady=' + scxmlHandler.cuemeReadyIdFired);
	if (!scxmlHandler.cuemeReadyIdFired && scxmlHandler.isPlatformReady && scxmlHandler.isCuemeReady) {
		if (window.mmi) {
			scxmlHandler.cuemeReadyIdFired = true;
			var eventsrc = "sendCuemeEvent";
			window.mmi.eventOccured('click', 'cuemeReadyId', '', eventsrc);
		} else if (window.sendCUEMEevent) {
			scxmlHandler.cuemeReadyIdFired = true;
			window.sendCUEMEevent('click', 'cuemeReadyId', '');
		}

		//window.mmi.eventOccured('click','cuemeReadyId', );
		if (window.cuemeLogText)
			console.log(window.cuemeLogText);
		var buildconfig = cueme_getCuemeInfo();
		var authinfo = cueme_getAuthInfo();
		scxmlHandler.buildNumber = buildconfig.version;

		scxmlHandler.dmId = authinfo.USER_ID;
		scxmlHandler.deviceIdentifier = buildconfig.deviceId;

		// initialize evaSecueStorage and migrate data from localStorage first time
		evaSecureStorage.init(buildconfig,
			function () {
				// success callback
				scxmlHandler.showApplication();
				scxmlHandler.disableSecureScreen();
			},
			function () {
				// error callback - show application even in case of error
				scxmlHandler.showApplication();
				scxmlHandler.disableSecureScreen();
			}
		);

		if (scxmlHandler.sendHomeScreenEvent) {
			/*var etarget ='MyBlue App 2.0/Home Screen';
			var edataobj = {"context":"state" };
			scxmlHandler.addAnalyticEvent(etarget, edataobj);*/
		}

		console.log('platform is ready at' + new Date().getTime());
		// "myblue://news?articleId=1
		if (scxmlHandler.cuemeAppLaunchParams) {
			console.log('going to deeplink')
			var deeplink = JSON.parse(scxmlHandler.cuemeAppLaunchParams).deepLink;
			scxmlHandler.cuemeAppLaunchParams = null;
			console.log('deeplink=' + deeplink);
			if (deeplink.indexOf('://') != -1) {
				var aindex = deeplink.indexOf('news/?articleId=');
				if (aindex != -1) {
					var aid = deeplink.substring(aindex + 16);
					window.HealthNewsCardComponentRef.component.readArticleById(aid);
				} else {
					deeplink = deeplink.substring(deeplink.indexOf('://') + 3);
					window.setTimeout(function () {
						window.DashboardPageRef.component.deepLinkRedirect(deeplink);
					}, 400);
				}
			} else {
				// for testing on simulator
				//window.HealthNewsCardComponentRef.component.readArticleById(1);
				// if(window.DashboardPageRef){
				//     var deeplink="evacafestudio://messagecenter?alertid=100";
				//     deeplink = deeplink.substring(deeplink.indexOf('://')+3);
				//     window.DashboardPageRef.component.deepLinkRedirect(deeplink);
				// }

			}
		}
	}

	else {
		// following snippet for testing in chrome on Desktop
	// 	 if ((window.navigator.appVersion.indexOf("Win")!=-1) || (window.navigator.appVersion.indexOf("Mac")!=-1)) {
	// 		var _appVersion = window.navigator.appVersion;
	// 		if ((_appVersion.indexOf("Win") != -1) || (_appVersion.indexOf("Mac") != -1) || _appVersion.indexOf("Linux") != -1) {
	// 			console.log('======DESKTOP TESTING ONLY======');
	// 			var buildconfig = null;
	// 			evaSecureStorage.init(buildconfig,
	// 				function () {
	// 					// success callback
	// 					scxmlHandler.showApplication();
	// 					scxmlHandler.disableSecureScreen();
	// 				},
	// 				function () {
	// 					// error callback - show application even in case of error
	// 					scxmlHandler.showApplication();
	// 					scxmlHandler.disableSecureScreen();
	// 				}
	// 			);
	// 		}
	// 	}
	 }
};

scxmlHandler.showApplication = function () {
	console.log("storage item SHOW_GUIDE=" + evaSecureStorage.getItem("SHOW_GUIDE"));
	scxmlHandler.setTestFairyServer();
	if (evaSecureStorage.getItem("SHOW_GUIDE") != "done") {
		window.AppPageRef.component.showUserGuide();
		scxmlHandler.closeSplash();
	} else {
		window.AppPageRef.component.setDashboardRootPage();
		scxmlHandler.closeSplash();
	}
}

scxmlHandler.closeSplash = function () {
	console.log("scxmlHandler.closeSplash");
	if (window.mmi) {
		var eventsrc = "sendCuemeEvent";
		window.mmi.eventOccured('click', 'closeSplash', '', eventsrc);
	} else if (window.sendCUEMEevent)
		window.sendCUEMEevent('click', 'closeSplash');
	window['AuthenticationServiceRef'].component.initAuthService();

}

scxmlHandler.handleContainerBroadcast = function (eventObj) {
	var deeplink = eventObj.deepLink;

	// for launch the app from background to foreground
	console.log('deeplink=' + deeplink);
	if (deeplink.indexOf('://') != -1) {
		var aindex = deeplink.indexOf('news/?articleId=');
		if (aindex != -1) {
			var aid = deeplink.substring(aindex + 16);
			window.HealthNewsCardComponentRef.component.readArticleById(aid);
		} else {
			deeplink = deeplink.substring(deeplink.indexOf('://') + 3);
			window.DashboardPageRef.component.deepLinkRedirect(deeplink);
		}
	}
}

scxmlHandler.getMessages = function (filter) {
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'getMessages');
		console.log('getMessages from Swrve');
	}
}

scxmlHandler.showMessages = function (result) {
	if (result) {
		window.MsgCtrPageRef.component.setInAppMessages(result);
		console.log('getMessages from Swrve-Success');
	} else {
		console.log('getMessages from Swrve-Failed');
	}
}

scxmlHandler.showMessage = function (msgId) {
	if (window.sendCUEMEevent && msgId) {
		sendCUEMEevent('click', 'showMessage', msgId);
	}
}

scxmlHandler.showMessageSuccess = function (data) {
	console.log("showMessageSuccess : " + JSON.stringify(data));
}

scxmlHandler.showMessageFail = function (data) {
	console.log("showMessageFail : " + JSON.stringify(data));
}

window.cueme_ready = function (cuemeAppLaunchParams, cuemeAppRestoreParams) {
	console.log('cuemeAppLaunchParams=' + cuemeAppLaunchParams);
	scxmlHandler.cuemeAppLaunchParams = cuemeAppLaunchParams;
	scxmlHandler.isCuemeReady = true;
	scxmlHandler.raiseCuemeready(cuemeAppLaunchParams, cuemeAppRestoreParams);

	// for testing on simulator
	/*
	if (cuemeAppLaunchParams)
		scxmlHandler.raiseCuemeready(cuemeAppLaunchParams, cuemeAppRestoreParams);
	else {
		cuemeAppLaunchParams = { deepLink: 'myblue://news?articleId=1'};
		scxmlHandler.raiseCuemeready(cuemeAppLaunchParams, cuemeAppRestoreParams);
	}
	*/

}


scxmlHandler.setTestFairyServer = function () {
	console.log("setTestFairyServer");
	if(window.sendCUEMEevent){
		//commented code for disable testfairy 
		//sendCUEMEevent('click','setServerEndpoint',appConfig.testfairyEndpoint);
	}
}


scxmlHandler.beginTestfairy= function(){
	var config ={appToken : appConfig.testfairyAppToken};
	if(window.sendCUEMEevent){
		//commented code for disable testfairy 
		//sendCUEMEevent('click','beginTestfairy',JSON.stringify(config));
	}
}

scxmlHandler.getTestfairyVersion = function () {
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'getTestfairyVersion');
	}
}

scxmlHandler.setTestfairyUserId = function (pusrid) {
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'setTestfairyUserId', pusrid);
	}
}


scxmlHandler.setTestfairyAttribute = function (pkey, pval) {
	console.log("setTestfairyAttribute : " + JSON.stringify(pval));
	var lattr = { pkey: pval };
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'setTestfairyAttribute', JSON.stringify(lattr));
	}
}

scxmlHandler.setTestfairyScreenName = function (pname) {
	console.log("setTestfairyScreenName : " + JSON.stringify(pname));
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'setTestfairyScreenName', pname);
	}
}

scxmlHandler.showFeedbackDialog = function () {
	console.log("showFeedbackDialog");
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'showFeedbackDialog');
	}
}

scxmlHandler.sendUserFeedback = function (pfeedback) {
	console.log("sendUserFeedback : " + JSON.stringify(pfeedback));
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'sendUserFeedback', pfeedback);
	}
}

scxmlHandler.takeScreenshot = function () {
	console.log("takeScreenshot");
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'takeScreenshot');
	}
}

scxmlHandler.hideWebViewElements = function () {
	console.log("hideWebViewElements");
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'hideWebViewElements');
	}
}

scxmlHandler.pauseTestfairy = function () {
	console.log("pauseTestfairy");
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'pauseTestfairy');
	}
}


scxmlHandler.disableSecureScreen = function () {
	console.log("disableSecureScreen");
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'disableSecureScreen');
	}
}

scxmlHandler.resumeTestfairy = function () {
	console.log("resumeTestfairy");
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'resumeTestfairy');
	}
}

scxmlHandler.stopTestfairy = function () {
	console.log("stopTestfairy");
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'stopTestfairy');
	}
}

scxmlHandler.testfairylog = function (plog) {
	console.log("testfairylog" + JSON.stringify(plog));
	if (window.sendCUEMEevent) {
		sendCUEMEevent('click', 'testfairylog', plog);
	}
}

scxmlHandler.setBadgeCount = function (badgeCount) {
	//console.log("setBadgeCount===>",badgeCount);
	if (window.sendCUEMEevent && isiOS) {
		sendCUEMEevent('click', 'setBadgeCount', badgeCount);
	}
}

scxmlHandler.clearBadgeCount = function () {
	if (window.sendCUEMEevent && isiOS) {
		sendCUEMEevent('click', 'clearBadgeCount');
	}
}

