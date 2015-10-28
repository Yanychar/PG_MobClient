
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


	},

	pageBeforeShow:	function() {

		// setup correct header
	    $("#tool_data_page .ui-header .ui-title").text( settingsManager.getLangResource().headers.tooldata );

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

//    	$( '#tool_data_page #todo_button' ).prop('disabled', true );
//    	$( '#tool_data_page #dialog_btns' ).prop('disabled', true );

		// Setup buttons
		this.setDialogButtons( tool );
		
//    	$( '#tool_data_page #todo_button' ).prop('disabled', true );
//    	$( '#tool_data_page #dialog_btns' ).prop('disabled', true );
		

	},

	setDialogContent:		function( tool ) {

		var contentElement = $( '#tool_data_page #dialog_content' );

//		var content = $( '#tool_data_page' ).find( '#tool_descr_dynamic' );

		// Clear current content
		contentElement.empty();

		contentElement.append(
				  "<b>" + this.createCategoriesChainString( tool ) + "</b>"
				+ "<h3>" + this.getNormalizedString( tool.name  ) + "<br/>"
				+ this.getNormalizedString( tool.manufacturer ) + " "
				+ this.getNormalizedString( tool.model )
				+ "</h3>"
				+ this.getNormalizedString( tool.description  )
			    + "<hr/>"
			    + ( tool.currentUser ? settingsManager.getLangResource().labels.usedby + ": "
			    + "<b>" + tool.currentUser.firstName + " " + tool.currentUser.lastName + "</b><br/>" : "" )
			    + ( tool.personalFlag ? settingsManager.getLangResource().text.personaltool + "<br/>" : "" )

//			    + settingsManager.getLangResource().labels.status + ": " + "<b>" + this.showStatus( tool.status ) + "</b>"
				+ ( tool.status ? settingsManager.getLangResource().labels.status
						+ ": "


						+ "<b "
						+ this.getColorAttribute( tool.status )
						+ ">"
						+ this.showStatus( tool.status )
						+ "</b>"


					: "" )






			    + "<hr/>"

			    + ( tool.serialNumber ? settingsManager.getLangResource().labels.sn + ": "
			    + "<b>" + tool.serialNumber + "</b><br/>" : "" )
			    + ( tool.barcode ? settingsManager.getLangResource().labels.barcode + ": "
			    					+ "<b>" + tool.barcode + "</b><br/>" : "" )
			    + "<br/>"

			);

	    if ( tool.location ) {

	    	// TODO: Add button to show location in the map
	    	// Temporarily just show text
	    	contentElement.append( settingsManager.getLangResource().buttons.nolocationdata );

	    }

	},

	setDialogButtons:		function( tool ) {

		var contentElement = $( '#tool_data_page #dialog_btns' );

		// Name todo button from resource
		var button = contentElement.find( "#todo_button" ).html( settingsManager.getLangResource().buttons.todo );

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
	    $("#todoMenu .ui-header .ui-title").text( settingsManager.getLangResource().headers.select );

	    // If user owns the tool
	    if ( tool.currentUser && tool.currentUser.id == loginInfo.user.id ) {

	    	console.log( "User owns selected tool: " + tool.name );

//			??? button.button( "enable" );
	    	
	    	this.fillOwnToDoMenu( menuContent, tool.status );

	    } else if ( loginInfo.user.id ) {

	    	console.log( "User does not own selected tool: " + tool.name );
	    	
//			button.button( "disable" );
	    	

	    	this.fillAnothersToDoMenu( menuContent, tool.status );

	    } else {

	    }




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

		$( "#tool_data_page #todoMenu" ).popup( "close" );

//		$( "#tool_data_page " ).popup( "close" );

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

		$( "#tool_data_page #todoMenu" ).popup( "close" );

		toolItemMngr.setDialogContent( toolItemMngr.selectedTool );

//		$("#myPopup").popup("open");

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

//		$( "#tool_data_page #todoMenu" ).popup( "close" )

	},

	inUseHandler:	function() {
		toolItemMngr.changeStatus( "INUSE");
	},

	brokenHandler:	function() {
		toolItemMngr.changeStatus( "BROKEN")
	},

	repairHandler:	function() {
		toolItemMngr.changeStatus( "REPAIRING");
	},

	stolenHandler:	function() {
		toolItemMngr.changeStatus( "STOLEN");
	},

	changeStatus:	function( newStatus ) {

		console.log( "'" + newStatus + "' button has been pressed" );

		// Send Release request
		if ( communicator.sendUpdateStatusRequest( toolItemMngr.selectedTool, newStatus )) {
			// Change the tool user and tool status
			console.log( "Successful result received from server after UpdateStatus request" );

			toolItemMngr.selectedTool.status = newStatus;

			toolItemMngr.setDialogButtons( toolItemMngr.selectedTool );

		} else {
			console.log( "Failure result received from server after UpdateStatus request" );
		};

		$( "#tool_data_page #todoMenu" ).popup( "close" );

		toolItemMngr.setDialogContent( toolItemMngr.selectedTool );

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

		$( "#tool_data_page #todoMenu" ).popup( "close" )

		toolItemMngr.setDialogContent( toolItemMngr.selectedTool );

//		$("#resultPopup").popup();
//		$("#resultPopup").popup("open");

	},

	emptyHandler:	function() {
		console.log( "'No operation' button has been pressed" );

		$( "#tool_data_page #todoMenu" ).popup( "close" )

//		toolItemMngr.setDialogContent( toolItemMngr.selectedTool );

//		$("#resultPopup").popup();
//		$("#resultPopup").popup("open");

	},
	addButton:		function( placeHolder, itemCaption, handler ) {


		var button = $(
				"<a href=\"#\" id=\"releaseButton\" 	class=\"ui-btn ui-btn-a\">"
				+ itemCaption
				+ "</a>"
		);

/*
		var button = $(
				"<a href='#popupBasic' data-rel='popup' class='ui-btn ui-corner-all ui-shadow ui-btn-inline' data-transition='pop'>"
				+ itemCaption
				+ "</a>"
		);

		var popper = $(
				+ "<a data-role=\"popup\" id=\"popupBasic\"><p>This is a completely basic popup, no options set.</p></a>"
		);
*/
		if ( handler ) {
			button.off().on( "click", handler );
		} else {
			button.off().on( "click", this.emptyHandler );
		}

	    placeHolder.append( button );
//	    placeHolder.append( popper );
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

	showStatus:						function( status ) {

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
			url: configuration.getServiceURL() + "/gettools",
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
			        alert( settingsManager.getLangResource().errors.toolnotfound+ ". Barcode: '" + barcode + "'!" );

			    } else {
			    	alert( settingsManager.getLangResource().errors.searchfailed + jqXHR.status );
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
	},

	fillOwnToDoMenu:	function( menuContent ) {

    	console.log( "Menu shall has items to change status only. Current status: " + this.selectedTool.status );

		switch ( this.selectedTool.status ) {
	    	case "INUSE":
//	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.release,  this.releaseHandler );
    			this.addButton( menuContent, settingsManager.getLangResource().buttons.broken,		this.brokenHandler );
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.repair,		this.repairHandler );
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.stolen,		this.stolenHandler );
	    		break;
	    	case "BROKEN":
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.inUse,		this.inUseHandler );
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.repair,		this.repairHandler );
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.stolen,		this.stolenHandler );
	    		break;
	    	case "REPAIRING":
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.inUse,		this.inUseHandler );
    			this.addButton( menuContent, settingsManager.getLangResource().buttons.broken,		this.brokenHandler );
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.stolen,		this.stolenHandler );
	    		break;
	    	case "STOLEN":
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.inUse,		this.inUseHandler );
    			this.addButton( menuContent, settingsManager.getLangResource().buttons.broken,		this.brokenHandler );
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.repair,		this.repairHandler );
	    		break;
	    	case "RESERVED":
	    	case "FREE":
	    	default:
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.inUse,		this.inUseHandler );
    			this.addButton( menuContent, settingsManager.getLangResource().buttons.broken,		this.brokenHandler );
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.repair,		this.repairHandler );
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.stolen,		this.stolenHandler );

	    		break;
		};
	},

	fillAnothersToDoMenu:	function( menuContent ) {
/*
		switch ( this.selectedTool.status ) {
	    	case "INUSE":
	    	case "RESERVED":
	    	case "FREE":
//	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.request,  this.requestHandler );
	    		this.addButton( menuContent, settingsManager.getLangResource().buttons.takeOver, this.takeOverHandler );
	    		break;
		};
*/
		this.addButton( menuContent, settingsManager.getLangResource().buttons.takeOver, this.takeOverHandler );
//		this.addButton( menuContent, "No operation", null );


	},

}


function notify(message) {

    console.log( "!!!!! Came into the popup!!!" );

	var id = "popupid";
    try {$("#"+id).remove();} catch(e) {}
    var popup = document.createElement('div');
    popup.setAttribute("data-role", "popup");
    popup.setAttribute("data-transition", "pop");
    popup.setAttribute("data-theme", "a");
    popup.setAttribute("data-overlay-theme", "c");
    popup.setAttribute( "data-dismissible", "false" );
    popup.setAttribute("id", id);
    popup.innerHTML = "<p style='margin:1em 2em 1em 2em'>" + message + "</p>";
    $('div[data-role="content"]').append(popup);
    $("#"+id).popup();
    $("#"+id).popup("open");
};

