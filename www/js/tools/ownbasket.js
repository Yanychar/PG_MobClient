var ownBasket = {

	init:	function() {

		console.log( "OwnBasket page Init start ..." );

		$( document ).on( "pagecreate","#own_basket_page",function(){

			ownBasket.pageCreated();
		});

		$(document).on( "pagebeforeshow","#own_basket_page",function(){

			ownBasket.pageBeforeShow();
				
		});
			 
		$(document).on( "pageshow","#own_basket_page",function(){

			ownBasket.pageAfterShow();
				
		});
			
	},

	pageCreated:	function() {

		console.log( "OwnBasket page PageCreated start ..." );
			
		// Back button handler
		$( '#own_basket_page #back_button' ).on( "click", function() {
			// Return back to Login screen
			$.mobile.navigate( "#main_menu_page", {
			});

		});
		    
	},
		
	pageBeforeShow:	function() {

		console.log( "OwnBasket page PageBeforeShow start ..." );
			
	    // Header text
	    $( '#own_basket_page .ui-header .ui-title' ).text( settingsManager.getLangResource().headers.ownbasket );
		// Search ...
    	$( '#own_basket_page' ).find( '.ui-input-search input' ).attr( 'placeholder', settingsManager.getLangResource().text.search + " ..."  );
		
		this.readAndShowList();

	},

	pageAfterShow:	function() {
		console.log( "OwnBasket page PageAfterShow start ..." );
		
	},
		
	readAndShowList:	function() {
		
	      this.read( this.showList );
		
	},
		
	read:	function( showFunction ) {
		
		console.log( "Ajax call to read Tools List ..." );

		$.ajax({
			async : false,
		    type: 'GET',
		    url: application.getServiceURL() + "/gettools",
		    data: {
		      sessionid : loginInfo.sessionid,
		      userid : loginInfo.user.id
		    },

		    dataType: "json",

		    success: function ( result, status, xhr ) {

		    	console.log( "... read Tools SUCCESSfully" );

		    	showFunction( result );

		    },

		    error: function ( jqXHR ) {

		    	console.log( "... FAILED to Read Tools: " + jqXHR.status );

		    	application.toolsPageDescriptor.setActive( category, null );

		    	toolsManager.showTools();
		    	
		    },
		});

		console.log( "... return from Read Tools!" );

	},
	
	showList:	function( toolsList ) {

    	console.log( "ShowToolList after read ..." );
		
//			sort( toolsList );

	    var listControl = $( '#own_basket_page' ).find( '#tools_list' );
		
		$.each( toolsList, function( index, tool ) {

			console.log( "    Tool row [" + index +"] was added" );

			ownBasket.addToolElement( listControl, tool ); //.listview('refresh');

		});
	      
		listControl.listview('refresh');
		
	},
	
	addToolElement:		function( listElement, tool ) {
	
		var categoryChain = this.createCategoriesChainString( tool );

		var element = $(

			"<li><a href='#'>"
				
				+ "<h2>" + (( tool.name ) ? tool.name : "No name")
				+ ", " + this.getNormalizedString( tool.manufacturer )
				+ "</h2>"
				+ "<p>" + (( tool.description && tool.name ) ? tool.description : "" ) + "</p>"
//					 + "<br/>"
	      		+ (( tool.status != undefined ) ? settingsManager.getLangResource().labels.status 
	      										  + ": <b>" + tool.status + "</b>" 
	      										: "" )
	      	+ "</li>"
		);

		element.data( "dat", tool );

		element.on( "click", function() {
			
		    // Store selected Tool
		    toolItemMngr.selectedTool = tool;
			
		    // Move to the Tool Data page
			    $.mobile.navigate( "#tool_data_page", {
					                    allowSamePageTransition: false,
					                    transition: "none"
			    					}
			    );
			

		});

		listElement.append( element );
		
	},

	createCategoriesChainString:	function( tool ) {
		 
		var resStr = "";
		 
		if ( tool && tool.categoriesTree ) {

			$.each( tool.categoriesTree, function( index, category ) {

				if ( category && category.length > 0 ) {
					 
					resStr = resStr 
						+ ( resStr.length > 0 ? " &#x25B6 " : "" )
                        + category;
				}

			});
			 
		}
		 
		return resStr; 
		 
	},

	getNormalizedString:		function( element ) {
		
		return ( element && element.length > 0 ) ? element : "";
		
	},
	
		 
}
