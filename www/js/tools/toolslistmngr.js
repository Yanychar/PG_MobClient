var toolsManager = {
	
	init:	function() {
		
	    $( document ).on("pagecreate","#tools_list_page",function(){

			toolsManager.pageCreated();
	    });

	    $(document).on("pagebeforeshow","#tools_list_page",function(){

			toolsManager.pageBeforeShow();
			
	    });
		 
	    $(document).on("pageshow","#tools_list_page",function(){

			toolsManager.pageAfterShow();
			
	    });
	},
		
	pageCreated:	function() {

		console.log( "ToolsList pageCreated handler start ..." );

		
	    $( '#tools_list_page #back_buton' ).on( "click", function() {
	    	
	    	console.log( "*** Back button pressed!" );

	    	// Return back to Login screen
	    	$.mobile.navigate( "#categories_page", {
//	                            transition: "slide"
	    	});

	    });

	    console.log( "... ToolsList pageCreated handler end." );
	      
	},
	
	pageBeforeShow:	function() {

		console.log( "ToolsList pageBeforeShow handler start ..." );

		if ( application.selectedCategory && application.selectedCategory.name ) {
			console.log( "Selected category: " + application.selectedCategory.name );
		}
	      
	    // Header text
		$( "#tools_list_page .ui-header .ui-title" ).text( settingsManager.getLangResource().headers.toollist );
		
		// Search ...
    	$( '#tools_list_page' ).find( '.ui-input-search input' ).attr( 'placeholder', settingsManager.getLangResource().text.search );
    	$('input[data-type="search"]').val("");

    	
		this.showCategory( application.selectedCategory );

		console.log( "... ToolsList pageBeforeShow handler end." );
	      
	},

	pageAfterShow:	function() {
		
	},

	read:		function( category ) {

		console.log( "Ajax call to read Tools List ..." );

		if ( application.toolsPageDescriptor == undefined ) 
			console.log( "toolsPageDescriptor undef!" );

		var catIdToReq = -1;
		
		if ( category != undefined && category != null && category.id != undefined ) {
			catIdToReq = category.id;
		} else {
			console.log( "category undef! will read all Tools" );
		}


		$.ajax({
			async : false,
		    type: 'GET',
		    url: configuration.getServiceURL() + "/gettools",
		    data: {
		      sessionid : loginInfo.sessionid,
		      categoryid : catIdToReq
		    },

		    dataType: "json",

		    success: function ( result, status, xhr ) {

		    	console.log( "... read Tools SUCCESSfully" );

		    	application.toolsPageDescriptor.setActive( category, result );

		    	toolsManager.showTools();

		    },

		    error: function ( jqXHR ) {

		    	if ( jqXHR.status==401 ) {

					settingsManager.logoff();
		    		
		    	} else {
			    	console.log( "... FAILED to Read Tools: " + jqXHR.status );
	
			    	application.toolsPageDescriptor.setActive( category, null );
	
			    	toolsManager.showTools();
		    	}
		    	
		    },
		});

		console.log( "... return from Read Tools!" );

		return;
	},

	showCategory:		function( category ) {
		
	    console.log( "showCategoryToolsList start ..." );

	    // Read Tools
	    this.read( category );
	      

	    console.log( "... showCategoryToolsList end" );

	},

	showTools:			function () {

	    console.log( "showToolsList start ..." );

	    var listControl = $( '#tools_list_page' ).find( '#tools_list' );

	    if ( application.toolsPageDescriptor.category != undefined ) {

	      console.log( "Tools list shall be updated!" );

	      // Clear current content
	      listControl.empty();
	      console.log( "  Tools list was cleared" );

	      // Fill Tools List
	      if ( application.toolsPageDescriptor.toolsList != null ) {
	        $.each( application.toolsPageDescriptor.toolsList, function( index, tool ) {

	          console.log( "    Tool row [" + index +"] was added" );

	          toolsManager.addToolElement( listControl, tool ).listview('refresh');

	        });
	      }

	      listControl.listview('refresh');

	    } else {
	      console.log( "Current Tools Category undefined!" );
	    }

	    console.log( "... showToolsList end" );

	},

	addToolElement:			function( element, tool ) {

		var collapsedName = ( tool.name )? tool.name : tool.description;

		var categoryChain = this.createCategoriesChainString( tool );
	  	  
		var collpsbl = $(

			"<div data-role=\"collapsible\">"

				+ "<h2>" 
				+ this.getNormalizedString( tool.name ) + " "  
				+ this.getNormalizedString( tool.manufacturer ) + " "
				+ this.getNormalizedString( tool.model )
				+ "</h2>"
	      
//				+ categoryChain + "<br/>"
				+ "<p>"
				+ this.getNormalizedString( tool.description ) 
				+ "</p>"
	      
//				+ (( tool.description && tool.name ) ? tool.description + "<br/>" : "" )

				+ "<p>"
				+ (( tool.currentUser != undefined ) ? settingsManager.getLangResource().labels.usedby + ": "
				+ "<b>"
				+ tool.currentUser.firstName + " " + tool.currentUser.lastName : "" )
				+ "</b>"
				+ "&nbsp;&nbsp;&nbsp;&nbsp;"
				
				+ ( tool.status ? settingsManager.getLangResource().labels.status 
													+ ": "
																					
						
													+ "<b "
													+ this.getColorAttribute( tool.status )
													+ ">"
													+ this.showStatus( tool.status )
													+ "</b>" 
						
						
												: "" )
				
				
				+ "</p>"
				
		+ "</div>"
			  
	  );

	  var aRefElement = $( '<a href=\"#\"></a>' );

	  var listElement = $( '<li></li>'
	  );

	  collpsbl.collapsible();
	  aRefElement.append( collpsbl );

	  listElement.append( aRefElement );


	  listElement.data( "dat", tool );
	  listElement.on( "click", function() {

	    // Store selected Tool
	    toolItemMngr.selectedTool = tool;

	    // Move to the Tool Data page
	    $.mobile.navigate( "#tool_data_page", {
	                            allowSamePageTransition: false,
	                            transition: "none"
	    });

	  });

	  element.append( listElement ).listview('refresh');

	  return element;

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

	getColorAttribute:	function( status ) {

		if ( status ) {
			switch( status ) {
				case "FREE":
					return "style='color:green'"; 
					
				case "RESERVED":
				case "BROKEN":
				case "REPAIRING":
				case "STOLEN":
				case "UNKNOWN":
					return "style='color:red'"; 
				case "INUSE":
					return "style='color:#F9A825'"; 
	
			}
				
		}
		
		return ""; 
	},

	showStatus:	function( status ) {

		var resStr = "UNKNOWN";
		
		if ( status ) {
			
			switch ( status ) {
		    	case "INUSE":
		    		resStr = settingsManager.getLangResource().toolstatus.inuse;
		    		break;
		    	case "BROKEN":
		    		resStr = settingsManager.getLangResource().toolstatus.broken;
		    		break;
		    	case "REPAIRING":
		    		resStr = settingsManager.getLangResource().toolstatus.repair;
		    		break;
		    	case "STOLEN":
		    		resStr = settingsManager.getLangResource().toolstatus.stolen;
		    		break;
		    	case "RESERVED":
		    		resStr = settingsManager.getLangResource().toolstatus.reserved;
		    		break;
		    	case "FREE":
		    	default:
		    		resStr = settingsManager.getLangResource().toolstatus.free;
		    		break;
			}
			 
		}
		 
		return resStr; 
		
	},
	
}

