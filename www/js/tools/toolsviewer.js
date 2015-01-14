var toolsViewer = {

	selectedElement: null,
		
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

	    	
    		if ( toolsViewer.selectedElement ) {
    			toolsViewer.updateElement();
			}
	    		
	    	
	    	
		    $( '#common_tools_list_page' ).find( '#tools_list' ).listview('refresh');
	    	
		},

		pageAfterShow:	function() {
			console.log( "Common Tools List page PageAfterShow start ..." );
			
		},
			
	
		
		
		
//	parameters : {},

	showList:	function( toolsList, params ) {

		console.log( "ShowList started ..." );

//		this.parameters = params;

		var listControl = $( '#common_tools_list_page' ).find( '#tools_list' );
		
	    listControl.empty();
		
		toolsViewer.setHeader( params );
		
		if ( toolsList && toolsList.length ) {
			
			toolsViewer.sortToolsList( toolsList, params );
				
			$.each( toolsList, function( index, tool ) {
	
				console.log( "    Tool row [" + index +"] was added" );
	
				toolsViewer.addToolElement( listControl, tool ); //.listview('refresh');
	
			});
		}
		
	},
		
	addToolElement:		function( listElement, tool ) {
	
		var categoryChain = this.createCategoriesChainString( tool );

		var element = $(

			"<li><a href='#'>"
				
				+ "<h2>" 
				+ this.getNormalizedString( tool.name ) + " "  
				+ this.getNormalizedString( tool.manufacturer ) + " "
				+ this.getNormalizedString( tool.model )
				+ "</h2>"
				+ "<p>" + (( tool.description && tool.name ) ? tool.description : "" ) + "</p>"
				+ "<p>"
				+ (( tool.currentUser != undefined ) ? settingsManager.getLangResource().labels.usedby + ": "
						+ "<b id='current_user_field'>"
						+ tool.currentUser.firstName + " " + tool.currentUser.lastName : "" )
						+ "</b>"
				+ "&nbsp;&nbsp;&nbsp;&nbsp;"
				
				+ ( tool.status ? settingsManager.getLangResource().labels.status 
													+ ": "
																					
						
													+ "<b id='status_field' "
													+ "style='"
													+ this.getColorAttribute( tool.status )
													+ "' "
													+ ">"
													+ this.showStatus( tool.status )
													+ "</b>" 
						
						
												: "" )
				
				
				+ "</p>"
	      	+ "</li>"
		);

		element.data( "dat", tool );

		element.on( "click", function() {
			
		    // Store selected Tool
		    toolItemMngr.selectedTool = tool;
	
		    toolsViewer.selectedElement = $( this ).closest( "li" ); 
				    
		    // Move to the Tool Data page
			    $.mobile.navigate( "#tool_data_page", {
					                    allowSamePageTransition: false,
					                    transition: "none"
			    					}
			    );
			

		});

		listElement.append( element );
		
	},

	updateElement: function() {

		var current_user_field = $( toolsViewer.selectedElement ).find( "#current_user_field" );
		if ( current_user_field ) {

			$( current_user_field ).text( 
					toolItemMngr.selectedTool.currentUser.firstName + " " + toolItemMngr.selectedTool.currentUser.lastName );
			
		}
		
		var status_field = $( toolsViewer.selectedElement ).find( "#status_field" );
		if ( status_field ) {
		
			$( status_field ).text( toolsViewer.showStatus( toolItemMngr.selectedTool.status ));
			$( status_field ).attr( "style", this.getColorAttribute( toolItemMngr.selectedTool.status ));
			
		}

	    $( '#common_tools_list_page' ).find( '#tools_list' ).listview('refresh');
		
	    toolsViewer.selectedElement = null; 
	    
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

	getColorAttribute:	function( status ) {

		if ( status ) {
			switch( status ) {
				case "FREE":
//					return "style='color:green'"; 
					return "color:green"; 
										
				case "RESERVED":
				case "BROKEN":
				case "REPAIRING":
				case "STOLEN":
				case "UNKNOWN":
//					return "style='color:red'"; 
					return "color:red"; 
				case "INUSE":
//					return "style='color:#F9A825'"; 
					return "color:#F9A825"; 
	
			}
				
		}
		
		return ""; 
	},

	showStatus:		function( status ) {

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
	
	getNormalizedString:		function( element ) {
		
		return ( element && element.length > 0 ) ? element : "";
		
	},

	sortToolsList:	function( toolsList, params ) {
		
		if ( toolsList ) {
			
		}
		
	},

	setHeader:	function( params ) {
		
		if ( params && params.header ) {

			// Header text
		    $( '#common_tools_list_page .ui-header .ui-title' ).text( params.header );
			
		}
		
	},

		
}