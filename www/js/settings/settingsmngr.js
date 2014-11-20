
var settingsManager = {

	storage	: 	null,
	wasRead	:	false,

	supportedLangs	:	[ "English", "Suomi", "Русский" ],		// Do not touch
	
	currentLang:	"Suomi",
	
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
//		e.preventDefault();
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
//				+ ( lang === this.currentLang ? " selected='selected' " : "" )
				+ ">" + lang + "</option>"

		  );

//		  selectElement.append( selectItem );
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
			console.log( "New Language read from storage: " + this.currentLang )
			if ( !this.currentLang ) {
				console.log( "Read invalid. Will be default: " + this.currentLang )
				setLanguage( "Suomi" );

			}
				
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
		
		console.log( "Is New Language valid: " + ( newLang && this.supportedLangs.indexOf( newLang.trim()) >= 0 ) );
		console.log( "  New Language: " + newLang );
		console.log( "  Is it supported? " + ( this.supportedLangs.indexOf( newLang.trim()) >= 0 ));

		return ( newLang && this.supportedLangs.indexOf( newLang.trim()) >= 0 );
			
	},

//	var currentResource = resource_fi_FI;
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
		
	} 
	
}
	

	
