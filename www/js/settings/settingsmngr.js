// 1.0.4	13.12.2014	Bug fixing
// 1.0.5	14.01.2015	Resources updated, bug fixing
// 1.0.6	14.01.2015	Messaging improved
// 1.0.7	11.02.2015	Footer in MainMenu changed (bug) + small resources changes
// 1.0.8	18.02.2015	Tools generated resources was used. No new functionality
// 1.0.9	25.02.2015	version to test Play Store automatic update


var settingsManager = {

	storage	: 	null,
	wasRead	:	false,

	supportedLangs	:	[ "Suomi", "English", "Русский" ],		
	defaultLang		:	"Suomi",
	
	currentLang		:	this.defaultLang,
	usrname			:	"",
	pwd				:	"",
	loggedin		:	false,
	
	version			:	"1.0.9",
	
	init:	function() {

		this.initStorage();
		this.readSettings();
		
	    $( document ).on( "pagecreate","#settings_page",function(){

	    	settingsManager.pageCreate();
	    });

	    $(document).on( "pagebeforeshow","#settings_page",function(){

	    	settingsManager.pageBeforeShow();
			
	    });
		 
	    $(document).on( "pageshow","#settings_page",function(){

	    	settingsManager.pageAfterShow();
			
	    });
	    
	},
	
	pageCreate:	function() {

		console.log( "Settings page has been created" );
		
		// Fill Language Combo/Menu
		this.fillLangMenu();
	},
	
	pageBeforeShow:	function() {

		console.log( "Settings page will be shown" );
		console.log( "  Language: " + this.currentLang );
		
		// Setup Header
	    $("#settings_page .ui-header .ui-title").text( settingsManager.getLangResource().headers.settings );
		
		// Setup field's labels
	    $("#settings_page #settings-lang").text( settingsManager.getLangResource().labels.lang + ":" );
		
	    this.setSelected();
	    
		
	},

    setSelected:	function() {
    	
		var selectElement = $( '#settings_page #select-lang' );
		
		selectElement.val( this.currentLang );
		selectElement.selectmenu( "refresh" );

    },
	
	fillLangMenu:	function() {

		var selectElement = $( '#settings_page #select-lang' ); 
		
		selectElement.empty();

		$.each( this.supportedLangs, 
				function( index, lang ) {
					settingsManager.addLangToMenu( selectElement, lang );
        		}
		);
		
		selectElement.selectmenu( "refresh" );
		
	},
	
	addLangToMenu:	function( selectElement, lang ) {

		var selectItem = $(

				"<option value=" + "'" + lang + "'" 
				+ ">" + lang + "</option>"

		  );

		  selectItem.appendTo( selectElement );
		
	},
	
	pageAfterShow:	function() {
		
	},
	
	initStorage:	function() {
		
		this.storage = window.localStorage;
		
	},
	
	readSettings:	function() {

		if ( !this.wasRead ) {
			console.log( "Persistant Storage will be read!")
		
			this.currentLang = this.storage.getItem( "mob.inventory.lang" ); 
			console.log( "New Language read from storage: " + this.currentLang );
			
			if ( this.validLang( this.currentLang )) {
				
				console.log( "Lang was read successfully: " + this.currentLang );
				
			} else {
				console.log( "Read invalid. Will be default: " + this.defaultLang );
				this.currentLang = this.defaultLang;

			}
			
			this.usrname = this.storage.getItem( "mob.inventory.usrname" );
			this.pwd = this.storage.getItem( "mob.inventory.pwd" );
			this.loggedin = this.storage.getItem( "mob.inventory.loggedin" );
			
			console.log( "New usrname from storage: " + this.usrname );
			console.log( "New pwd read from storage: " + this.pwd );
			console.log( "New loggedin in read from storage: " + this.loggedin );
			
				
			wasRead = true;
		}
		
	},

	getLanguage:	function() {

		readSettings();
		
		return this.currentLang;
		
	},

	setLanguage:	function( newLang ) {
		 console.log( "SetLanguage was call with newLang: " + newLang );

		if ( this.validLang( newLang ) && newLang != this.currentLang ) {
		
			this.currentLang = newLang;
			
			this.storage.setItem( "mob.inventory.lang", this.currentLang ); 
			console.log( "New Language stored: " + this.currentLang );
			 
			this.pageBeforeShow();
		}
		
	},

	validLang:	function( newLang ) {
		
		res = ( newLang && this.supportedLangs.indexOf( newLang.trim()) >= 0 );
		console.log( "Is New Language valid: " + ( newLang && this.supportedLangs.indexOf( newLang.trim()) >= 0 ) );
		console.log( "  New Language: " + newLang );
		if ( res )
			console.log( "  Is it supported? " + ( this.supportedLangs.indexOf( newLang.trim()) >= 0 ));

		return res;
			
	},

	getLangResource: function() {
		
		switch( this.currentLang ) {
			case "Suomi":
				return resource_fi_FI;
			case "English":
				return resource_en_EN;
			case "Русский":
				return resource_ru_RU;
		}

		return resource_fi_FI;
		
	}, 

	logoff:	function() {

		this.loggedin = false;
		
		this.loggedin = this.storage.setItem( "mob.inventory.loggedin", false );
		
		loginInfo = {};

    	// Return back to Login screen
    	$.mobile.navigate( "#login_page", {
//	                                  transition: "slide"
		});
		
	},
	
	login:	function( newUsrname, newPwd ) {

		this.usrname = newUsrname;
		this.pwd = newPwd;
		this.loggedin = true;
		
		this.storage.setItem( "mob.inventory.usrname", this.usrname );
		this.storage.setItem( "mob.inventory.pwd", this.pwd );
		this.storage.setItem( "mob.inventory.loggedin", true );
		
	},
	
	loginFailed:	function() {

		this.loggedin = false;
		
		this.storage.setItem( "mob.inventory.loggedin", false );
		
	}
	
	
}
	

	
