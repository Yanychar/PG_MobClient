
var settingsManager = {

	storage	: 	null,
	wasRead	:	false,

	supportedLangs:	[ "fi", "en" ],
	currentLang:	"fi",
	langResource:	resource_fi_FI,
	
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
		
	},
	
	pageCreate:	function() {
		
	},
	
	pageCreate:	function() {
		
	},
	
	initStorage:	function() {
		
		this.storage = window.localStorage;
		
	},
	
	readSettings:	function() {

		if ( !this.wasRead ) {
			console.log( "Persistant Storage will be read!")
		
			this.lang = this.storage.getItem( "mob.inventory.lang" ); 
			console.log( "New Language read from storage: " + this.lang )
			if ( !this.lang ) {
				this.lang = "fi";
				this.storage.setItem( "mob.inventory.lang", this.lang ); 
				console.log( "Read invalid. Will be default: " + this.lang )

			}
				
			wasRead = true;
		}
		
	},

	getLanguage:	function() {

		readSettings();
		
		return this.lang;
		
	},

	setLanguage:	function( newLang ) {

		if ( validLang( newLang ) && newLang != this.lang ) {
		
			this.lang = newLang;
			
			switch( newLang ) {
				case "fi":
					this.langResource = resource_fi_FI;
					break;
				case "en":
					this.langResource = resource_en_EN;
					break;
				default:
					this.langResource = resource_fi_FI;
					break;
			}
		
			 this.storage.setItem( "mob.inventory.lang", this.lang ); 
			 console.log( "New Language stored: " + this.lang )
		}
		
	},

	validLang:	function( newLang ) {
		
		console.log( "Is New Language valid: " + ( newLang && this.supportedLangs.indexOf( newLang.trim().toLowerCase()) >= 0 ) );

		return ( newLang && this.supportedLangs.indexOf( newLang.trim().toLowerCase()) >= 0 );
			
	},

//	var currentResource = resource_fi_FI;
	getLangResource: function() {
		
		return this.langResource;
		
	} 
	
}
	

	
