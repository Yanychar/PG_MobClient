var toolsViewer = {

	init:	function() {

		console.log( "Common Tools List page Init start ..." );

			$( document ).on( "pagecreate","#common_tools_list_page",function(){

				toolsViewer.pageCreated();
			});

			$(document).on( "pagebeforeshow","#common_tools_list_page",function(){

				toolsViewer.pageBeforeShow();
					
			});
				 
			$(document).on( "pageshow","#common_tools_list_page",function(){

				toolsViewer.pageAfterShow();
					
			});
				
		},

		pageCreated:	function() {

			console.log( "Common Tools List page PageCreated start ..." );
				
			// Back button handler
			$( '#common_tools_list_page #back_button' ).on( "click", function() {
				// Return back to Login screen
				$.mobile.navigate( "#main_menu_page", {
				});

			});
			    
		},
			
		pageBeforeShow:	function() {

			console.log( "Common Tools List page PageBeforeShow start ..." );
				
			// Search ...
	    	$( '#common_tools_list_page' ).find( '.ui-input-search input' ).attr( 'placeholder', settingsManager.getLangResource().text.search );
	    	$('input[data-type="search"]').val("");

		    $( '#common_tools_list_page' ).find( '#tools_list' ).listview('refresh');
	    	
		},

		pageAfterShow:	function() {
			console.log( "Common Tools List page PageAfterShow start ..." );
			
		},
			
	
		
		
		
	parameters : {},

	showList:	function( toolsList, params ) {

		console.log( "ShowList started ..." );

		this.parameters = params;

		toolsViewer.sortToolsList( toolsList );
		
		toolsViewer.setHeader();

	    var listControl = $( '#common_tools_list_page' ).find( '#tools_list' );

	    listControl.empty();
			
		$.each( toolsList, function( index, tool ) {

			console.log( "    Tool row [" + index +"] was added" );

			toolsViewer.addToolElement( listControl, tool ); //.listview('refresh');

		});
	      
		
	},
		
	addToolElement:		function( listElement, tool ) {
	
		var categoryChain = this.createCategoriesChainString( tool );

		var element = $(

			"<li><a href='#'>"
				
				+ "<h2>" + (( tool.name ) ? tool.name : "No name")
				+ ", " + this.getNormalizedString( tool.manufacturer )
				+ "</h2>"
				+ "<p>" + (( tool.description && tool.name ) ? tool.description : "" ) + "</p>"
//						 + "<br/>"
	      		+ (( tool.status != undefined ) ? settingsManager.getLangResource().labels.status 
	      										  + ": <b>" + this.showStatus( tool ) + "</b>" 
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

	showStatus:		function( tool ) {

		var resStr = "UNKNOWN";
		
		if ( tool && tool.status ) {
			
			switch ( tool.status ) {
		    	case "INUSE":
		    		resStr = settingsManager.getLangResource().toolstatus.inuse;
		    		break;
		    	case "BROCKEN":
		    		resStr = settingsManager.getLangResource().toolstatus.brocken;
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
	
	getNormalizedString:		function( element ) {
		
		return ( element && element.length > 0 ) ? element : "";
		
	},

	sortToolsList:	function( toolsList ) {
		
		if ( this.parameters && this.parameters.sort ) {
			
		}
		
	},

	setHeader:	function( toolsList ) {
		
		if ( parameters.header && parameters.header.length > 0 ) {

			// Header text
		    $( '#common_tools_list_page .ui-header .ui-title' ).text( parameters.header );
			
		}
		
	},

		
}