var scxmlHandler = window.scxmlHandler || {};



scxmlHandler.touchId = {
		targetName: 'My Blue',
		isTouchBiodataSaved: "false",
		biotouchData: '',
		isTouchBiodataFeatureSupported : true, 
		touchBiodataNotsupportedReason : '',
		//tidtitle : "Touch ID for \\\"BCBSMA\\\"",
		tidtitle :"Touch ID for \"BCBSMA\"",
		
		setdeviceBiometricConfig: function(){
			var config = {
				readOptions : {description: "Use Fingerprint to Read", title: this.tidtitle},
				saveOptions : {description: "Sign in with Fingerprint", title: this.tidtitle}	
			};
			if (window.sendCUEMEevent)
				sendCUEMEevent('click','setdeviceBiometricConfig', JSON.stringify(config));
		},
		saveTouchBiodata: function(pBiodata){
			if (window.sendCUEMEevent) {
				var userId = pBiodata.userId;
				
				var usrmask = userId.substring(0,4) + '****';
				var readmsg = "Sign in with the Username "+usrmask;
				var savemsg = "Saving the Username "+usrmask;
				var config = {
		                    readOptions : {description: readmsg, title: this.tidtitle,"fallbackButtonTitle":"Password"},
		                    saveOptions : {description: savemsg, title: this.tidtitle},
		                    keyName : this.targetName
		                };
		        
		    sendCUEMEevent('click','setTargetName', JSON.stringify(config));
			//sendCUEMEevent('click','setTargetName', this.targetName);		
			sendCUEMEevent('click','save', JSON.stringify(pBiodata));
			}
		},
		
		readTouchBiodata: function(usrmask){
			this.biotouchData = ''; 
			if (window.sendCUEMEevent) {
				
				var readmsg = "Sign in with the Username "+usrmask;
				var savemsg = "Saving the Username "+usrmask;
				var config = {
		                    readOptions : {description: readmsg, title: this.tidtitle},
		                    saveOptions : {description: savemsg, title: this.tidtitle},
		                    keyName : this.targetName
		                };
		        
		    sendCUEMEevent('click','setTargetName', JSON.stringify(config));
			sendCUEMEevent('click', 'read');
			}
		},
		
		deleteTouchBiodataKey: function(){
			if (window.sendCUEMEevent) {
			sendCUEMEevent('click', 'setTargetName', this.targetName);		
			sendCUEMEevent('click', 'delete');
			}
		},
		
		deleteAllTouchBiodata: function(){
			if (window.sendCUEMEevent)
			sendCUEMEevent('click', 'deleteAll');
		},
		
		isTouchBiodataKeySaved: function(){
			if (window.sendCUEMEevent) {
			sendCUEMEevent('click', 'setTargetName', this.targetName);		
			sendCUEMEevent('click', 'isKeySaved');
			}
			
		},
		
		touchBiodataKeySaved: function(kflag) {
			console.log('touchBiodataKeySaved');
			this.isTouchBiodataSaved = kflag;
			window.LoginComponentRef.component.touchIdKeyData(kflag);
		},
		readTouchBiodataError: function(bderr)
		{
			console.log('readTouchBiodataError ::');
			console.log(bderr);	
			window.LoginComponentRef.component.readTouchidFailed(bderr);
		},
		readTouchBiodataSuccess: function(bdsts)
		{
			console.log('readTouchBiodataSuccess ::');
			console.log(bdsts);
			this.biotouchData = bdsts;
			
			window.LoginComponentRef.component.readTouchIdSuccess(bdsts);
		},
		saveTouchBiodataError: function(bderr)
		{
			console.log('saveTouchBiodataError ::');
			console.log(bderr);
			window.LoginComponentRef.component.saveTouchidFailed(bderr);
		},
		saveTouchBiodataSuccess: function(bdsts)
		{
			console.log('saveTouchBiodataSuccess ::');
			console.log(bdsts);
			window.LoginComponentRef.component.saveTouchidSuccess(bdsts);
		},
		deleteTouchBiodataSuccess: function(bdsts)
		{
			console.log('deleteTouchBiodataSuccess ::');
			console.log(bdsts);
			window.LoginComponentRef.component.deleteTouchidSuccess(bdsts);
		},
		deleteTouchBiodataError: function(bderr)
		{
			console.log('deleteTouchBiodataError ::');
			console.log(bderr);
			window.LoginComponentRef.component.deleteTouchidFailed(bderr);
		},
		deleteAllTouchBiodataSuccess: function(bdsts)
		{
			console.log('deleteAllTouchBiodataSuccess ::');
			console.log(bdsts);
		},
		deleteAllTouchBiodataError: function(bderr)
		{
			console.log('deleteAllTouchBiodataError ::');
			console.log(bderr);
			window.LoginComponentRef.component.deleteTouchidFailed(bderr);
		},

		getSupportedBiometricsData:function(){
			if (window.sendCUEMEevent) {
					
					sendCUEMEevent("click", 'getSupportedBiometrics');
			}
		},
		
		getSupportedBiometricsDataResponse: function(bdata)
		{
			console.log('getSupportedBiometricsData ::'+bdata);
			var isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
			
			//alert(bdata);
			if (bdata == null || bdata == '')
				this.isTouchBiodataFeatureSupported = false;
			else if (bdata instanceof Array) {
				// android
				this.dectType = bdata[0].name;
				if (bdata.length > 0 && bdata[0].name == 'fingerprint') {
					if (bdata[0].isHardwareDetected && (bdata[0].isFingerprintEnrolled || bdata[0].isEnrolled)
						&& bdata[0].isLockScreenSecured ) {
						// window.LoginComponentRef.component.isTouchBiodataFeatureSupported(true);
						this.isTouchBiodataFeatureSupported = true;
						//this.setdeviceBiometricConfig();
					} else {
						// window.LoginComponentRef.component.isTouchBiodataFeatureSupported(false);
						this.isTouchBiodataFeatureSupported = false;
						if (!bdata[0].isHardwareDetected) {
							if (isiOS)
								this.touchBiodataNotsupportedReason = 'Touch ID is not set up on your device. Please go to your device settings and set up Touch ID.';
							else
								this.touchBiodataNotsupportedReason = 'Fingerprint Hardware not detected on your device';
						} else if (bdata[0].isEnrolled != undefined && !bdata[0].isEnrolled)
							this.touchBiodataNotsupportedReason = 'Touch ID is not set up on your device. Please go to your device settings and set up Touch ID.';
						else if (bdata[0].isFingerprintEnrolled != undefined && !bdata[0].isFingerprintEnrolled)
							this.touchBiodataNotsupportedReason = 'Touch ID is not set up on your device. Please go to your device settings and set up Touch ID.';
						//else if (!bdata[0].isUseFingerprintPermissionEnabled)
							//this.touchBiodataNotsupportedReason = 'Fingerprint permission was not enabled on your device';
						else if (bdata[0].isLockScreenSecured)
							this.touchBiodataNotsupportedReason = 'Fingerprint lock screen was not secured on your device';
					}
					
				}else if (bdata.length > 0 && bdata[0].name == 'face') {
					if (bdata[0].isHardwareDetected 
							&& bdata[0].isLockScreenSecured && bdata[0].isEnrolled) {
							this.isTouchBiodataFeatureSupported = true;
				} else {
							this.isTouchBiodataFeatureSupported = false;
							if (bdata[0].isHardwareDetected != undefined && !bdata[0].isHardwareDetected) {
								if (isiOS)
									this.touchBiodataNotsupportedReason = 'Face ID is not set up on your device. Please go to your device settings and set up Face ID.';
								else
									this.touchBiodataNotsupportedReason = 'Face ID Hardware not detected on your device';
							} else if (bdata[0].isEnrolled != undefined && !bdata[0].isEnrolled)
								this.touchBiodataNotsupportedReason = 'Face ID is not set up on your device. Please go to your device settings and set up Face ID.';
							else if (bdata[0].isLockScreenSecured != undefined && bdata[0].isLockScreenSecured)
								this.touchBiodataNotsupportedReason = 'Face ID lock screen was not secured on your device';
						}
					} 
				else {
					// window.LoginComponentRef.component.isTouchBiodataFeatureSupported(false);
					this.isTouchBiodataFeatureSupported = false;
				}
			} else {
				
				this.isTouchBiodataFeatureSupported = false;
				
			}

			window.LoginComponentRef.component.onSupportedBiometricsData();
		}
	  };

	  scxmlHandler.cards = {
		  save: function(targetJson, base64Data){	
				if (window.sendCUEMEevent) {
					sendCUEMEevent("click", 'saveFileTarget', JSON.stringify(targetJson));
					sendCUEMEevent("click", 'saveCard', base64Data);
				}else{
					console.log('scxmlHandler : unable to save file. The "sendCUEMEevent" method is missing.');
				}
			},			
			email:function(emailInfoJson){	
				if (window.sendCUEMEevent) {
					 var evtData = JSON.stringify(emailInfoJson);
				     evtData = evtData.replace(/\\n/g, "\\n");
				     sendCUEMEevent("click", 'email', evtData ); 
					//sendCUEMEevent("click", 'email', JSON.stringify(emailInfoJson));
				}else{
					console.log('scxmlHandler : unable to send email. The "sendCUEMEevent" method is missing.');
				}	
			},
			print:function(printInfoJson){
				if(window.sendCUEMEevent){
					sendCUEMEevent("click", 'print', JSON.stringify(printInfoJson));
				}else{
					console.log('scxmlHandler : unable to print file. The "sendCUEMEevent" method is missing.');
				}	
			},
			loadImgUrl: function(url) {
				alert('Save image/pdf success:'+url);				
			}
	};

	scxmlHandler.postNewindow = function(aurl,header, postdatajson) {

        if(window.sendCUEMEevent){

            var winobj = { url: aurl, 

                           showClose: true,

                           method : "POST",                                                                    

                           postData: postdatajson,

                           toolbar: { 

                                "padding-top":"10px",

                                "padding-bottom":"10px",

                                title: {

                                    text: header,     // $host shows the host name as title. or provide a string

                                    backgroundColor: '#DDDDDD',

                                    textColor: '#000000',

                                    style: 'normal'

                                },

                                closeButton: {

                                    visible: true,         // true|false. defaults: true

                                    text: 'Back',         // Shows a button with text. On iOS it defaults to "Done", on Android a close icon is shown

                                    showIcon: false,     // true|false. Shows an image. If text is provided a text button is shown

                                    align: 'left',        // 'left'|'right'. Defaults to left

                                    textColor: '#1866A3',

                                    style: 'normal'                                    

                                },

                                progressBar : {                            

									indefinite : true,   
									visible: true                    

                                }   

                            }                           

                         };

            cueme_openWindow(JSON.stringify(winobj), "_newindow");
			//scxmlHandler.openExternalWindow(JSON.stringify(winobj));
            window.DashboardPageRef.component.isChildWindowShown = true;           

        }

    };
	  
	scxmlHandler.openNewindow = function(aurl,header) {
		if(window.sendCUEMEevent){

			var winobj = { url: aurl, 
						 showClose: true,
						 progressBar : {     
						   visible: true                  
						  },
						   toolbar: { 
							    "padding-top":"10px",
		                        "padding-bottom":"10px",
					            title: {
					                text: header,     // $host shows the host name as title. or provide a string
					                backgroundColor: '#DDDDDD',
					                textColor: '#000000',
					                style: 'normal'
					            },
					            closeButton: {
					                visible: true,         // true|false. defaults: true
					                text: 'Back',         // Shows a button with text. On iOS it defaults to "Done", on Android a close icon is shown
					                showIcon: false,     // true|false. Shows an image. If text is provided a text button is shown
					                align: 'left',        // 'left'|'right'. Defaults to left
					                textColor: '#1866A3',
					                style: 'normal'
					                
					            }
					        } 
						 };
			
			cueme_openWindow(JSON.stringify(winobj), "_newindow");
			window.DashboardPageRef.component.isChildWindowShown = true;
			//sendCUEMEevent("click", 'viewurl', aurl);
		}
	}; 
	
	scxmlHandler.playSoundWithHapticFeedback = function() {
		window.IdleTimerServiceRef.component.restartIdleTimer();
		if(window.sendCUEMEevent && window.cueme_playSoundWithHapticFeedback){
			 cueme_playSoundWithHapticFeedback('tap','click');
		}
	};

	scxmlHandler.openExternalWindow = function(aurl) {
		console.log("opening new window"); 
        if(window.sendCUEMEevent){ 
			console.log("send cume event-" + aurl); 
			sendCUEMEevent("click", 'viewurl', aurl); 
			console.log("after cume event-" + aurl);
        } 
    }; 


