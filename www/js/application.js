
var SupportedDeviceType = {
	EMU_OR_DEVICE:	0,
	BROWSER:	      1
};

var SupportedEnvironments = {
    LOCAL:  0,
    DEMO:   1,
    PROD:   2
};

var supportedURL = {
  LOCAL:  "http://192.168.255.11:8080/InventoryServer/rest",
//  LOCAL:  "http://localhost:8080/InventoryServer/rest",
  DEMO:   "http://toolsdemo.uisko.com/tools/rest"
}

var application = {

	configuration : {

		deviceType  : SupportedDeviceType.BROWSER,
//		deviceType  : SupportedDeviceType.EMU_OR_DEVICE,

//		environment : SupportedEnvironments.LOCAL,
		environment : SupportedEnvironments.DEMO,

		consolelog  : true,



	},

	/*
	 * Global variables declarations
	 */

	// used to move through Category page(-s)
	toolsPageDescriptor: {
	    category: null,
	    toolsList: null,

	    setActive: function( cat, tl ) {
	      console.log( "SetActive[category, toolslist]:" + cat + ", " + tl );

	      this.category=cat;
	      this.toolsList = tl;
	    }

	},

	// Category selected in Category Selection
	selectedCategory: null,

	// Tool selected in Toolselection view for Tool Details view
//	currentTool: null,

	getServiceURL:	function() {
		if ( this.configuration.environment == SupportedEnvironments.LOCAL ) {
			  return supportedURL.LOCAL;
		} else if ( this.configuration.environment == SupportedEnvironments.DEMO ) {
			  return supportedURL.DEMO;
		} else {
			  alert( "Wrong Environment set up in the Configuration!" );
		}

		return "";
	},

	getDeviceType: function() {

  	return this.configuration.deviceType;

	},

	// Application Constructor
	initialize: function() {

		$( '#readiness_page' ).find( '.devicestatus' ).text( settingsManager.getLangResource().text.progressing );


	    this.initGlobal();

	    if ( this.getDeviceType() != SupportedDeviceType.BROWSER ) {
	    	console.log( "Readyness of real device will be listened!!!" );


	    	document.addEventListener( "deviceready", this.onDeviceReady, false);

	    } else {

	    	console.log( "Web Browser is used as client. Device readyness will be sent automatically!!!" );

	    	this.onDeviceReady();
	    }

	  },

	  initGlobal: function() {

	  },

	  listenDeviceReadyness: function() {
	  },

	  onDeviceReady: function() {

		$( '#readiness_page' ).find( '.devicestatus' ).text( settingsManager.getLangResource().text.readiness );

		console.log( "Before switch login page" );
		// Go to Login Page
		$.mobile.navigate( "#login_page", {
		    transition: "fade"
		  }
		);

		console.log( "After switch login page" );

	  }

};
