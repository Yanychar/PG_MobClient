

var application = {

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


	// Application Constructor
	initialize: function() {

		$( '#readiness_page' ).find( '.devicestatus' ).text( settingsManager.getLangResource().text.progressing );


	    this.initGlobal();

	    if ( configuration.getDeviceType() != SupportedDeviceType.BROWSER ) {
	    	console.log( "Readyness of real device will be listened!!!" );


	    	document.addEventListener( "deviceready", this.onDeviceReady, false);

	    } else {

	    	console.log( "Web Browser is used as client. Device readyness will be sent automatically!!!" );

	    	this.onDeviceReady();
	    }

	  },

	  initGlobal: function() {

	    	mainMenu.init();
	    	catgrsManager.init();
			toolsManager.init();
			toolItemMngr.init();
			toolsViewer.init();

		  
	  },

	  listenDeviceReadyness: function() {
	  },

	  onDeviceReady: function() {
		console.log( "onDeviceReady ... " );

		$( '#readiness_page' ).find( '.devicestatus' ).text( settingsManager.getLangResource().text.readiness );

		console.log( "Before switch login page" );
		// Go to Login Page
		$.mobile.navigate( "#login_page", {
		    transition: "fade"
		  }
		);

		console.log( "After switch login page" );
/*
if (window.history && window.history.pushState) {
	console.log( "History is OK" );

    window.history.pushState('forward', null, 'null');

    $(window).on('popstate', function() {
      alert('Back button was pressed.');
    });

} else {
	console.log( "History is NOT OK" );

}	
*/

// Bind to the navigate event
$( window ).on( "navigate", function( event, data ) {
//	event.preventDefault();
  console.log( "navigated!" );
  console.log( "Event: " + event );
    console.log( data.state.info );
    console.log( data.state.direction );
    console.log( data.state.url );
    console.log( data.state.hash );  
  
});		
	  }

};
