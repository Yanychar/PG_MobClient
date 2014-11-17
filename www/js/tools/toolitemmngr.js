
var toolItemMngr = {

	selectedTool:	null,
		
	init:	function() {

	    $( document ).on("pagecreate","#tool_data_page",function(){

	    	toolItemMngr.pageCreated();
	    });

	    $(document).on("pagebeforeshow","#tool_data_page",function(){

	    	toolItemMngr.pageBeforeShow();
			
	    });
		 
	    $(document).on("pageshow","#tool_data_page",function(){

	    	toolItemMngr.pageAfterShow();
			
	    });
		
	},

	pageCreated:	function() {

		// setup correct header
	    $("#tool_data_page .ui-header .ui-title").text( currentResource.headers.tooldata );
		
	},
	
	pageBeforeShow:	function() {

		this.prepareToolDialog( toolItemMngr.selectedTool );

	},

	pageAfterShow:	function() {
		
	},
	
	selectTool:			function( tool ) {
		
//		selectedTool = Object.create( tool );
		toolItemMngr.selectedTool = tool;
		
	},

	prepareToolDialog:		function( tool ) {

		if ( tool ) {
			this.selectTool( tool );
		}
		
		this.setDialogContent( tool );

	  // Setup buttons
		this.setDialogButtons( tool );
		
	},

	setDialogContent:		function( tool ) {
	
		var contentElement = $( '#tool_data_page #dialog_content' ); 
		
//		var content = $( '#tool_data_page' ).find( '#tool_descr_dynamic' );
		
		// Clear current content
		contentElement.empty();
		
		contentElement.append( 
				  "<b>" + this.createCategoriesChainString( tool ) + "</b>"
				+ "<h3>" + this.getNormalizedString( tool.name  ) + "</h3>"
				+ this.getNormalizedString( tool.description  )
			    + "<hr/>"
			    + ( tool.currentUser ? currentResource.labels.usedby + ": "
			    + "<b>" + tool.currentUser.firstName + " " + tool.currentUser.lastName + "</b><br/>" : "" )
			    + ( tool.personalFlag ? currentResource.text.personaltool + "<br/>" : "" )
			    + currentResource.labels.status + ": " + "<b>" + this.showStatus( tool ) + "</b>"
			    + "<hr/>"
			);
			
	    if ( tool.location ) {
	    	
	    	// TODO: Add button to show location in the map
	    	// Temporarily just show text
	    	contentElement.append( currentResource.buttons.nolocationdata ); 
	    	
	    }
		
	},
	
	setDialogButtons:		function( tool ) {

		var contentElement = $( '#tool_data_page #dialog_btns' ); 
		
		// Name todo button from resource
		var button = contentElement.find( "#todo_button" ).html( currentResource.buttons.todo );
		
		// Fill popup menu and assign operations to buttons
		//   Avail buttons: Request to Borrow, Take Over, Validate, Release
		var menuContent = $( "#tool_data_page #todoMenuContent" );
		
		if ( !menuContent ) {
			console.log( "Menu content element is not found" );
			return;
		}
		
		// Clear current content
		menuContent.empty();

		// setup correct header
	    $("#todoMenu .ui-header .ui-title").text( currentResource.headers.select );
		
		switch ( tool.status ) {
	    	case "INUSE":
	    		this.addButton( menuContent, currentResource.buttons.request,  this.requestHandler );
	    		this.addButton( menuContent, currentResource.buttons.takeOver, this.takeOverHandler );
	    		this.addButton( menuContent, currentResource.buttons.release,  this.releaseHandler );
//	    		this.addButton( menuContent, currentResource.buttons.validate, this.validateHandler );
	    		break;
	    	case "BROCKEN":
	    	case "REPAIRING":
	    	case "STOLEN":
	    		this.addButton( menuContent, currentResource.buttons.validate, this.releaseHandler );
//	    		this.addButton( menuContent, currentResource.buttons.validate, this.validateHandler );
	    		break;
	    	case "RESERVED":
	    		this.addButton( menuContent, currentResource.buttons.release,  this.releaseHandler );
//	    		this.addButton( menuContent, currentResource.buttons.validate, this.validateHandler );
	    		break;
	    	case "FREE":
	    	default:
	    		this.addButton( menuContent, currentResource.buttons.request,	this.requestHandler );
	    		this.addButton( menuContent, currentResource.buttons.takeOver,	this.takeOverHandler );
	    		this.addButton( menuContent, currentResource.buttons.inUse,		this.inUseHandler );
//	    		this.addButton( menuContent, currentResource.buttons.validate,	this.validateHandler );
	    		break;
	    		break;
		};
		
		
		
	},

	requestHandler:		function() {
		console.log( "'Request' button has been pressed" );
		
		// Send borrow request
			
		if ( communicator.sendBorrowRequest( toolItemMngr.selectedTool )) {		
			console.log( "Successful result received from server after 'borrow' request" );

			toolItemMngr.setDialogButtons( toolItemMngr.selectedTool );
			
		} else {
			console.log( "Failure result received from server after 'borrow' request" );
		};

		
		Notification.show( "AAA" );
		
		$( "#tool_data_page #todoMenu" ).popup( "close" );

	},
	
	takeOverHandler:	function() {
		console.log( "'Take Over' button has been pressed" );
		
		// Send takeOver request
		if ( communicator.sendTakeOverRequest( toolItemMngr.selectedTool )) {		
			// Change the tool user and tool status
			console.log( "Successful result received from server after 'takeOver' request" );

			toolItemMngr.selectedTool.currentUser = loginInfo.user;
			toolItemMngr.selectedTool.status = "INUSE";
			
			toolItemMngr.setDialogButtons( toolItemMngr.selectedTool );
			
		} else {
			console.log( "Failure result received from server after 'takeOver' request" );
		};
		
		Notification.show( "BBB" );
		
		$( "#tool_data_page #todoMenu" ).popup( "close" );
		
		toolItemMngr.setDialogContent( toolItemMngr.selectedTool );

		
	},
	
	validateHandler:	function() {
		console.log( "'Validate' button has been pressed" );

		// Send Validate request
		if ( communicator.sendValidationMsg( toolItemMngr.selectedTool,
				toolItemMngr.dateTimeToStr( new Date()),
											{
												latitude : 0,
												longitude: 0,
												accuracy : 0
											},
											"UNKNOWN" )) {
			
			console.log( "Successful result received from server after 'validation' request" );

		} else {
			console.log( "Failure result received from server after 'validation' request" );
		};
		
		Notification.show( "CCC" );
	
//		$( "#tool_data_page #todoMenu" ).popup( "close" )
		
		
	},
	
	releaseHandler:	function() {
		console.log( "'Release' button has been pressed" );

		// Send Release request
		if ( communicator.sendReleaseRequest( toolItemMngr.selectedTool )) {		
			// Change the tool user and tool status
			console.log( "Successful result received from server after 'Release' request" );

			toolItemMngr.selectedTool.status = "FREE";
			
			toolItemMngr.setDialogButtons( toolItemMngr.selectedTool );
			
		} else {
			console.log( "Failure result received from server after 'Release' request" );
		};

		Notification.show( "DDD" );
		
		
		$( "#tool_data_page #todoMenu" ).popup( "close" )

		toolItemMngr.setDialogContent( toolItemMngr.selectedTool );
		
		
	},

	inUseHandler:	function() {
		
		console.log( "'In Use' button has been pressed" );

		// Send Release request
		if ( communicator.sendInUseRequest( toolItemMngr.selectedTool )) {		
			// Change the tool user and tool status
			console.log( "Successful result received from server after 'Release' request" );

			toolItemMngr.selectedTool.status = "INUSE";
			
			toolItemMngr.setDialogButtons( toolItemMngr.selectedTool );
			
		} else {
			console.log( "Failure result received from server after 'Release' request" );
		};

		Notification.show( "DDD" );
		
		
		$( "#tool_data_page #todoMenu" ).popup( "close" )

		toolItemMngr.setDialogContent( toolItemMngr.selectedTool );
		
		
	},

	addButton:		function( placeHolder, itemCaption, handler ) {
		
		var button = $(
				"<a href=\"#\" id=\"releaseButton\" 	class=\"ui-btn ui-btn-a\">"
				+ itemCaption
				+ "</a>"
		);
		
		if ( handler ) {
		      button.off().on( "click", handler );
		}
		
	    placeHolder.append( button );
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
		
	showStatus:						function( tool ) {

		var resStr = "UNKNOWN";
		
		if ( tool && tool.status ) {
			
			switch ( tool.status ) {
		    	case "INUSE":
		    		resStr = currentResource.toolstatus.inuse;
		    		break;
		    	case "BROCKEN":
		    		resStr = currentResource.toolstatus.brocken;
		    		break;
		    	case "REPAIRING":
		    		resStr = currentResource.toolstatus.repair;
		    		break;
		    	case "STOLEN":
		    		resStr = currentResource.toolstatus.stolen;
		    		break;
		    	case "RESERVED":
		    		resStr = currentResource.toolstatus.reserved;
		    		break;
		    	case "FREE":
		    	default:
		    		resStr = currentResource.toolstatus.free;
		    		break;
			}
			 
		}
		 
		return resStr; 
		
	},

	getNormalizedString:		function( element ) {

		return ( element && element.length > 0 ) ? element : "";
		
	},

	findAndShowTool:  function( barcode ) {
		
		this.selectTool( null );

		// Read
		this.findByBarCode( barcode ); //, this.showTool );

		console.log( "toolItemMngr.selectedTool: " + ( toolItemMngr.selectedTool ? "OK" : "empty" ));
		console.log( "toolItemMngr.selectedTool.description: " + ( toolItemMngr.selectedTool.description ? "OK" : "empty" ));
		console.log( "toolItemMngr.selectedTool: " + ( toolItemMngr.selectedTool.description ? toolItemMngr.selectedTool.description : "empty" ));
//		console.log( "toolItemMngr.selectedTool: " + ( toolItemMngr.selectedTool.description ? toolItemMngr.selectedTool.description : "empty" ));
		
		if ( toolItemMngr.selectedTool ) {
	
//			toolItemMngr.selectedTool = this.selectedTool; 
			
			// Send Validate request
			if ( communicator.sendValidationMsg( toolItemMngr.selectedTool,
					toolItemMngr.dateTimeToStr( new Date()),
												{
													latitude : 0,
													longitude: 0,
													accuracy : 0
												},
												"UNKNOWN" )) {
				
				console.log( "Successful result received from server after 'validation' request" );

			} else {
				console.log( "Failure result received from server after 'validation' request" );
			};
			
			console.log( "Must show the Tool" );
//			this.showTool( this.selectedTool );
			
		} else {
			console.log( "Canceled. Noting to show" );
		}

	},

	findByBarCode:  function( barcode ) { //}, successReturn ) {

		console.log( "findByBarCode ..." );

		if ( barcode == undefined ) {
			
			console.log( "Barcode is not specified. Tool cannot be found" );
			return;
			
		}

		// Send request to find the tool
		$.ajax({
			async : false,
			type: 'GET',
			url: application.getServiceURL() + "/gettools",
			data: {
				sessionid:  loginInfo.sessionid,
			    barcode:    barcode
			},

			dataType: "json",

			success: function ( result, status, xhr ) {

				console.log( "... Tool was found SUCCESSfully" );

			        // TODO: many tools can be returned. It is necessary to provide selection

//				toolItemMngr.selectTool( result[0] );
				
				toolItemMngr.showTool( result[0] );
				
		        return result[0];
			},

			error: function ( jqXHR ) {

				if ( jqXHR.status == 404 ) {
					// It is Ok. Just nothing was found
			        alert( currentResource.errors.toolnotfound+ ". Barcode: '" + barcode + "'!" );

			    } else {
			    	alert( currentResource.errors.searchfailed + jqXHR.status );
			    }

			        console.log( "... Tool was not found or search failed: " + jqXHR.status );

			}
		});

		console.log( "... return findByBarCode!" );
	},

	showTool: function( tool ) {

		console.log( "Start ShowTool..." );
	    // Store selected Tool
	    toolItemMngr.selectedTool = tool;
	
	    // Move to the Tool Data page
	    $.mobile.navigate(  "#tool_data_page", 
	    					{
	        					transition: "fade"
	      					}
	    );

	},

	
	dateTimeToStr:		function( date ) {
		
		if ( date ) {
			var dayStr = ( date.getDate() > 9 ) ? date.getDate() : "0" + date.getDate(); 
			var monthStr = (( date.getMonth() + 1 ) > 9 ) ? ( date.getMonth() + 1 ) : "0" + ( date.getMonth() + 1 ); 
			var yearStr = date.getFullYear(); 
			
			var hoursStr = ( date.getHours() > 9 ) ? date.getHours() : "0" + date.getHours(); 
			var minsStr = ( date.getMinutes() > 9 ) ? date.getMinutes() : "0" + date.getMinutes(); 
			
			return "" + dayStr+monthStr+yearStr+hoursStr+minsStr;
		} 
		
		return "";
	}
}


