function showMessages( msgList ) {

    if ( msgList == undefined ) {

        console.log( "Entered into Show Messages. NO msgList specified. Will be read" );

        readMessages( "UNREAD" );
        
    } else {
        console.log( "Entered into Show Messages. msgList specified! Will be SHOWN" );

        var listControl = $( '#msg_list_page' ).find( '#msglist' );
        listControl.empty();

        // Fill Messages List
        $.each( msgList, function( index, msg ) {

            console.log( "    Msg [index, text]:" + index+", '"+msg.text+"'" );

            addMsgElement( listControl, msg ); //.listview('refresh');

        });

      listControl.listview('refresh');


    }

    console.log( "... exit from Show Messages." );

    return;
}

function readMessages( msgStatus ) {

  console.log( "Read Messages List Ajax request ..." );

  if ( msgStatus != undefined ) {
    console.log( status+" messages only will be read!" );
  } else {
    console.log( "All messages will be read!" );
    msgStatus = "UNKNOWN";
  }

  $.ajax({
    async : false,
    type: 'GET',
    url: configuration.getServiceURL() + "/getmessages",
    data: {
      sessionid : loginInfo.sessionid,
      status : msgStatus
    },

    dataType: "json",

    success: function ( result, status, xhr ) {

      console.log( "... read Messages SUCCESSfully" );

      showMessages( result );

    },

    error: function ( jqXHR ) {

      console.log( "... FAILED to Read Messages: " + jqXHR.status );
      console.log( "      " + jqXHR.status );
      console.log( "      " + jqXHR.statusText );
      console.log( "      " + jqXHR.statusCode() );

	  	if ( jqXHR.status==401 ) {
	
			settingsManager.logoff();
			
		};
      
      return jqXHR;

    },
  });


  return;

  console.log( "... return from Read Messages!" );
  return;
}

function addMsgElement( listControl, msg ) {


  var listElement = $( '<li>'
                      + '<a href="#">'
                      + createIconTag( msg )
                      + createDateStr( msg )
                      + createShortMsgText( msg )
                      + '</a>'
                      + '</li>'
  );

  listElement.data( "dat", msg );
  listElement.on( "click", function() {

    console.log( "**** Message text: " + $(this).data( "dat" ).text );

    // Move to the Message Dialog page
    $("#message_data_page").data( "dat", msg );
    $.mobile.navigate( "#message_data_page", {
                         allowSamePageTransition: false,
                         transition: "pop"
    });

  });

  listControl.append( listElement );// .listview('refresh');

  return listControl;

}

function createIconTag( msg ) {

  var str;
  switch ( msg.type ) {
    case "REQUEST":
    case "AGREEMENT":
    case "REJECTION":
      str = '<img src=\"img/attention.png\" alt=\"A\" class=\"ui-li-icon\">';
      break;
    default:
      str = '<img src=\"img/info2.png\" alt=\"i\" class=\"ui-li-icon\">';
      break;
  }

  return str;
}

function createDateStr( msg ) {

	var str;
	
	if ( msg && msg.date && dateIsValid( msg.date )) {
		
		str = " " 
			+ msg.date.substr( 0, 2 )
			+ "."
			+ msg.date.substr( 2, 2 ) 
			+ "."
			+ msg.date.substr( 4, 4 ) 
			+ ". ";
	} else {
		str = "          ";
	}
	
	  return str;
}



function dateIsValid( dateStr ) {
	var dateRegExp = new RegExp( "[0-3]\\d[0-1]\\d[2][0][1-3]\\d", "" );
	
	var res =  dateStr && dateStr.length == 8 && dateRegExp.test( dateStr );

	return res;
}

function createShortMsgText( msg ) {

	console.log ( "Short message descr will be created. Msg.Type = " + msg.type );
	
	var defText = "";

  if ( msg.text != undefined && msg.text != null && msg.text.length > 0 ) {
    console.log ( "Msg text presented. Type = " + msg.type );
    defText = msg.text;
  }

  var str = msg.from.firstName + " " + msg.from.lastName + ": ";
  switch ( msg.type ) {
    case "REQUEST":
      str = str + settingsManager.getLangResource().msgListTemplates.request + " "
  			+ ( msg.item != undefined  ? msg.item.name + ", " + msg.item.manufacturer : "" );
      break;
    case "AGREEMENT":
    	str = str + settingsManager.getLangResource().msgListTemplates.agreement + " "
			+ ( msg.item != undefined  ? msg.item.name + ", " + msg.item.manufacturer : "" );
		break;
    case "REJECTION":
        str = str + settingsManager.getLangResource().msgListTemplates.rejection + " "
		+ ( msg.item != undefined  ? msg.item.name + ", " + msg.item.manufacturer : "" );
        break;
    case "CONFIRMATION":
        str = str + settingsManager.getLangResource().msgListTemplates.confirmation + " "
		+ ( msg.item != undefined  ? msg.item.name + ", " + msg.item.manufacturer : "" );
        break;
	case "NOTNEEDED":
        str = str + settingsManager.getLangResource().msgListTemplates.notneeded + " "
		+ ( msg.item != undefined  ? msg.item.name + ", " + msg.item.manufacturer : "" );
      break;
    case "INFO":
    	str = defText;
      break;
    case "TEXT":
    	str = str + defText;
        break;
  }

  return str;
}

function prepareMsgDialog( msg ) {

	console.log( "Prepare Msg Dialog start ...   Msg is NOT null? " + ( msg != undefined && msg != null ));

	// Setup Header
	setMsgDialogHeader( $( '#message_data_page #header h1' ), msg );

	// Setup Content
	setMsgDialogContent( $( '#message_data_page #dialog_content' ), msg );

  // Setup buttons
  setupDlgButtons( $( '#message_data_page .ui-content' ), msg );

  console.log( "... left *** 1 msg" );
}

function setMsgDialogHeader( header, msg ) {

    var headerStr = "";

    switch ( msg.type ) {
    	case "REQUEST":
	        headerStr = settingsManager.getLangResource().msgheaders.request;
	        break;
	    case "AGREEMENT":
	        headerStr = settingsManager.getLangResource().msgheaders.agreement;
	        break;
	    case "REJECTION":
	        headerStr = settingsManager.getLangResource().msgheaders.rejection;
	        break;
	    case "CONFIRMATION":
	        headerStr = settingsManager.getLangResource().msgheaders.confirmation;
	        break;
		case "NOTNEEDED":
	        headerStr = settingsManager.getLangResource().msgheaders.notneeded;
	        break;
	    case "INFO":
	        headerStr = settingsManager.getLangResource().msgheaders.info;
	        break;
    	case "TEXT":
	        headerStr = settingsManager.getLangResource().msgheaders.text;
	        break;
    }

    console.log( "  setMsgDialogHeader ...   Header: " + headerStr );

    header.text( headerStr );
}

function setMsgDialogContent( contentElement, msg ) {

	var sender = msg.from.firstName + " " + msg.from.lastName;
//	var tool = ( msg.item != undefined ) ? msg.item.name : settingsManager.getLangResource().text.unknown;
	var tool = ( msg.item != undefined ) ? msg.item : { name : "", manufacturer : "" };

	contentElement.empty();

	contentElement.append(
			settingsManager.getLangResource().labels.from + ": " 
			+ "<b>" + sender + "</b>" 
			+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
			+ "Date: " 
			+ "<b>" + createDateStr( msg ) + "</b>" 
			+ "<br/><hr/>"
	);

	switch ( msg.type ) {
    	case "REQUEST":
    		contentElement.append(
    				settingsManager.getLangResource().msgContentTemplates.request
//					+ "<br/>"
					+ "<h3>" + this.getNormalizedString( tool.name  ) + "<br/>" 
					+ this.getNormalizedString( tool.manufacturer )
					+ "</h3>"
//					+ "<br/><br/>"
					+ "<br/>"
    		);
    		break;
    	case "AGREEMENT":
    		contentElement.append(
    				settingsManager.getLangResource().msgContentTemplates.agreement
  //  				+ "<br/>"
					+ "<h3>" + this.getNormalizedString( tool.name  ) + "<br/>" 
					+ this.getNormalizedString( tool.manufacturer )
					+ "</h3>"
//					+ "<br/><br/>"
					+ "<br/>"
    		);
    		break;
	    case "REJECTION":
	    	contentElement.append(
	    			settingsManager.getLangResource().msgContentTemplates.rejection
	    			  //  				+ "<br/>"
					+ "<h3>" + this.getNormalizedString( tool.name  ) + "<br/>" 
					+ this.getNormalizedString( tool.manufacturer )
					+ "</h3>"
//					+ "<br/><br/>"
					+ "<br/>"
	    	);
	    	break;
	    case "CONFIRMATION":
	    	console.log( "Tool valid? " + (tool != undefined && tool != null ));
	    	console.log( "Tool name: " + tool.name );
	    	contentElement.append(
	    			settingsManager.getLangResource().msgContentTemplates.confirmation + ": "
	    			+ "<br/>"
					+ "<h3>" + this.getNormalizedString( tool.name  ) + "<br/>" 
					+ this.getNormalizedString( tool.manufacturer )
					+ "</h3>"
//					+ "<br/><br/>"
					+ "<br/>"
	    	);
	    	break;
	    case "NOTNEEDED":
	    	contentElement.append(
	    			settingsManager.getLangResource().msgContentTemplates.notneeded
	    			  //  				+ "<br/>"
					+ "<h3>" + this.getNormalizedString( tool.name  ) + "<br/>" 
					+ this.getNormalizedString( tool.manufacturer )
					+ "</h3>"
//					+ "<br/><br/>"
					+ "<br/>"
	    	);
	    	break;
	    case "INFO":
	    	contentElement.append(
	    			settingsManager.getLangResource().msgContentTemplates.info
	    			  //  				+ "<br/>"
					+ "<h3>" 
//					+ this.getNormalizedString( tool.name  ) + "<br/>" 
//					+ this.getNormalizedString( tool.manufacturer )
					+ this.getNormalizedString( msg.text )
					+ "</h3>"
//					+ "<br/><br/>"
					+ "<br/>"
	    	);
	    	break;
    	case "TEXT":
    		contentElement.append(
    				msg.text
    				+ "<br/><br/>"
    		);
    		break;
	}

}

function setupDlgButtons( contentElement, msg ) {

	console.log( "Enter into setupDlgButtons... "  );
	console.log( "    Message.Type = " + msg.type );
	console.log( "    Message.status = " + msg.status );

	var buttonElements = null;

	emptyButtons( contentElement );

//	if ( msg.status == "UNREAD" ) {
		switch ( msg.type ) {
			case "REQUEST":
    	
		        addButtons( contentElement,
		        			settingsManager.getLangResource().buttons.agree,
		
		        			function() {
		                      console.log( "AGREE button pressed" );
		                      answered( msg, "true" );
		                      msg.status = "RESPONDED";
		                      parent.history.back();
		                    },
		
		        			settingsManager.getLangResource().buttons.reject,
		                    function() {
		                      console.log( "REJECT button pressed" );
		                      answered( msg, "false" );                      
		                      msg.status = "RESPONDED";
		                      parent.history.back();
		                    }
		        );
		        
		        break;
			case "AGREEMENT":
				addButtons( contentElement,
		    				settingsManager.getLangResource().buttons.borrow,
		                    function() {
		                      console.log( "BORROW button pressed" );
		                      answered( msg, "true" );                      
		                      msg.status = "RESPONDED";
		                      parent.history.back();
		                    },
		    				settingsManager.getLangResource().buttons.notneeded,
		                    function() {
		                      console.log( "NOT NEEDED button pressed" );
		                      answered( msg, "false" );                      
		                      msg.status = "RESPONDED";
		                      parent.history.back();
		                    }
		        );
		        break;
			case "REJECTION":
			case "CONFIRMATION":
			case "NOTNEEDED":
			case "INFO":
			case "TEXT":
				console.log( "OK button will be added "  );
				addButtons( contentElement,
							settingsManager.getLangResource().buttons.ok,
		                    function() {
		                      console.log( "OK button pressed" );
		                      answered( msg, "true" );                      
		                      msg.status = "READ";
		                      parent.history.back();
		                  }
		        );
		        break;
//		}
	}
}

function emptyButtons( placeHolder ) {

  $( "#msg_dlg_button_1" ).remove();
  $( "#msg_dlg_button_2" ).remove();

}
function addButtons( placeHolder, text_1, onclick_1, text_2, onclick_2 ) {

	console.log( "addButons entered ..." );
	
  var buttonElement_1 = $(
              "<a id=\"msg_dlg_button_1\" "
            + " href=\"#\" "
            + "class=\"ui-btn ui-btn-inline ui-btn-b\">"
            + text_1
            + "</a>"

  );

  if ( onclick_1 != undefined && onclick_1 != null )
    buttonElement_1.off().on( "click", onclick_1 );

  placeHolder.append( buttonElement_1 );
  console.log( "Button '" + text_1 + "' was added" );

  if ( text_2 != undefined ) {

    var buttonElement_2 = $(
        "<a id=\"msg_dlg_button_2\" "
      + " href=\"#\" "
      + "class=\"ui-btn ui-btn-inline ui-btn-a\">"
      + text_2
      + "</a>"

    );

    if ( onclick_2 != undefined && onclick_2 != null )
      buttonElement_2.off().on( "click", onclick_2 );

    placeHolder.append( buttonElement_2 );
    console.log( "Button '" + text_2 + "' was added" );

  }
}

function answered( msg, answer ) {

	  console.log( "ANSWER Ajax request ..." );

	  if ( !msg || !answer ) {
	    console.log( "Msg or Answer are not specified! Cannot send answer!" );
	    return;
	  }
	  
	  $.ajax({
	    async : false,
	    type: 'GET',
	    url: configuration.getServiceURL() + "/msganswer",
	    data: {
	      sessionid	: loginInfo.sessionid,
	      msgid		: msg.id,
	      answer	: answer
	    },

//	    dataType: "json",

	    success: function ( result, status, xhr ) {

	      console.log( "... ANSWER was sent successfully!" );


	    },

	    error: function ( jqXHR ) {

	      console.log( "... FAILED to send ANSWER: " + jqXHR.status );
	      console.log( "      " + jqXHR.status );
	      console.log( "      " + jqXHR.statusText );
	      console.log( "      " + jqXHR.statusCode() );

	      return jqXHR;

	    },
	  });

	  console.log( "... return from ANSWER!" );

	  return;
	  
}

function getNormalizedString( str ) {

	return ( str && str.length > 0 ) ? str : "";
	
}

