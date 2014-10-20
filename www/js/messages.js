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
    url: application.getServiceURL() + "/getmessages",
    data: {
      sessionid : application.loginInfo.sessionid,
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
                      + createMsgText( msg )
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

  var str = "Empty message";
  switch ( msg.type ) {
    case "REQUEST":
    case "AGREEMENT":
      str = '<img src=\"img/attention.png\" alt=\"A\" class=\"ui-li-icon\">';
      break;
    default:
      str = '<img src=\"img/info.png\" alt=\"i\" class=\"ui-li-icon\">';
      break;
  }

  return str;
}

function createMsgText( msg ) {

  var defText = "";

  if ( msg.text != undefined && msg.text != null && msg.text.length > 0 ) {
    console.log ( "Msg text presented" );
    defText = msg.text;
  }

  var str = "Empty message";
  switch ( msg.type ) {
    case "TEXT":
      str = defText;
      break;
    case "REQUEST":
      str =
        "Tool requested by "
        msg.from.firstName + " " + msg.from.lastName;
      break;
    case "AGREEMENT":
      str =
        "Approved by "
        + msg.from.firstName + " " + msg.from.lastName;
      break;
    case "REJECTION":
		  str =
        "Rejected by "
        + msg.from.firstName + " " + msg.from.lastName;
      break;
    case "CONFIRMATION":
		  str =
        "Confirmed by "
        + msg.from.firstName + " " + msg.from.lastName;

      break;
    case "INFO":
      str = defText;
      break;
  }

  return str;
}

function prepareMsgDialog( msg ) {

  console.log( "Prepare Msg Dialog start ...   Msg is NOT null? " + ( msg != undefined && msg != null ));

  // Setup Header
  setMsgDialogHeader( $( '#message_data_page #header h1' ), msg );

  // Setup Content
  setMsgDialogContent( $( '#message_data_page #message_content' ), msg );

    $( '#message_data_page #message_content' ).append( $( "Dddd" ));

    //  $( '#message_data_page #message_content' ).refresh();

  // Setup buttons
  setupDlgButtons( $( '#message_data_page .ui-content' ), msg );

  console.log( "... left *** 1 msg" );
}

function setMsgDialogHeader( header, msg ) {

    var headerStr = "";

    switch ( msg.type ) {
      case "TEXT":
        headerStr = "Text Message";
        break;
	    case "REQUEST":
        headerStr = "Request";
        break;
	    case "AGREEMENT":
        headerStr = "Agreement";
        break;
	    case "REJECTION":
        headerStr = "Rejection";
        break;
	    case "CONFIRMATION":
        headerStr = "Confirmation";
        break;
	    case "INFO":
        headerStr = "Info Message";
        break;
    }

    console.log( "  setMsgDialogHeader ...   Header: " + headerStr );

    header.text( headerStr );
}

function setMsgDialogContent( contentElement, msg ) {

  console.log( "*** 3 " + msg );
  var sender = msg.from.firstName + " " + msg.from.lastName;
  var tool = ( msg.item != undefined ) ? msg.item.name : "Unknown";

  contentElement.empty();

  contentElement.append(
      "From: " + "<b>" + sender + "</b><br/><hr/>"
  );

  switch ( msg.type ) {
    case "TEXT":
      contentElement.append(
          msg.text
        + "<br/><br/>"
      );
      break;
    case "REQUEST":
      contentElement.append(
          "Request to borrow"+ "<br/>"
        + "<h3>" + tool + "</h3>"
        + "<br/><br/>"
      );
      break;
    case "AGREEMENT":
      contentElement.append(
          "Tool may be borrowed"+ "<br/>"
        + "<h3>" + tool + "</h3>"
        + "<br/><br/>"
      );
      break;
    case "REJECTION":
      contentElement.append(
          "Reject to borrow"+ "<br/>"
        + "<h3>" + tool + "</h3>"
        + "<br/><br/>"
      );
      break;
    case "CONFIRMATION":
      contentElement.append(
          "Was borrowed"+ "<br/>"
        + "<h3>" + tool + "</h3>"
        + "<br/><br/>"
      );
      break;
    case "INFO":
      contentElement.append(
          "New user of "
        + "<h3>" + tool + "</h3>"
        + "<br/><br/>"
      );
      break;
  }
  console.log( "*** 6 " );

}

function setupDlgButtons( contentElement, msg ) {

console.log( "Enter into setupDlgButtons... message.status = " + msg.status );

  var buttonElements = null;

  emptyButtons( contentElement );

  if ( msg.status == "UNREAD" ) {
    switch ( msg.type ) {
      case "REQUEST":
        addButtons( contentElement,
                    "Agree",
                    function() {
                      console.log( "AGREE button pressed" );
                      agreeToBorrow( msg.item, msg.from );
                      updateMessage( msg, "RESPONDED" );
                      parent.history.back();
                    },
                    "Reject",
                    function() {
                      console.log( "REJECT button pressed" );
                      rejectToBorrow( msg );
                      updateMessage( msg, "RESPONDED" );
                      parent.history.back();
                    }
        );
        break;
      case "AGREEMENT":
        addButtons( contentElement,
                    "Borrow",
                    function() {
                      console.log( "BORROW button pressed" );
                      confirmBorrow( msg.item, msg.from );
                      console.log( "BEFORE UPDATE message.status = " + msg.status );
                      updateMessage( msg, "RESPONDED" );
                      console.log( "AFTER UPDATE message.status = " + msg.status );
                      parent.history.back();
                    },
                    "Not Needed",
                    function() {
                      console.log( "NOT NEEDED button pressed" );

                  //  Cancel reservation shall be done
                  //  ????( msg );

                      updateMessage( msg, "READ" );
                      parent.history.back();
                    }
        );
        break;
      case "REJECTION":
      case "TEXT":
      case "CONFIRMATION":
      case "INFO":
        addButtons( contentElement,
                    "OK",
                    function() {
                      console.log( "OK button pressed" );
                      updateMessage( msg, "READ" );
                      parent.history.back();
                  }
        );
        break;
    }
}
}

function emptyButtons( placeHolder ) {

  $( "#msg_dlg_button_1" ).remove();
  $( "#msg_dlg_button_2" ).remove();

}
function addButtons( placeHolder, text_1, onclick_1, text_2, onclick_2 ) {

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

  }
}

function updateMessage( msg, newStatus ) {

  console.log( "Update Message Ajax request ..." );

  if ( newStatus != undefined ) {

    console.log( "Message will be updated to " + newStatus );
    msg.status = newStatus;

  } else {
    console.log( "No status specified ==>> No update message performed" );

    return;
  }

  $.ajax({
    async : false,
    type: 'GET',
    url: application.getServiceURL() + "/updatemessage",
    data: {
      sessionid : application.loginInfo.sessionid,
      msgid     : msg.id,
      status    : newStatus
    },

//    dataType: "json",

    success: function ( result, status, xhr ) {

      console.log( "... message updated SUCCESSfully" );

    },

    error: function ( jqXHR ) {

      console.log( "... FAILED to Update Message: " + jqXHR.status );
      console.log( "      " + jqXHR.status );
      console.log( "      " + jqXHR.statusText );
      console.log( "      " + jqXHR.statusCode() );

      return jqXHR;

    },
  });

  console.log( "... return from Update Message!" );

  return;

}

function agreeToBorrow( item, requester ) {

  console.log( "Agreement Ajax request ..." );

  if ( item == undefined || item == null ) {
    console.log( "Tool Item is not specified! Cannot create AGREEMENT to borrow" );
    return;
  }
  if ( requester == undefined || requester == null ) {
    console.log( "Requester is not specified! Cannot create AGREEMENT to borrow" );
    return;
  }

  $.ajax({
    async : false,
    type: 'GET',
    url: application.getServiceURL() + "/agreement",
    data: {
      sessionid : application.loginInfo.sessionid,
      toolid    : item.id,
      userid    : requester.id
    },

//    dataType: "json"

    success: function ( result, status, xhr ) {

      console.log( "... Agreement handled successfully!" );


    },

    error: function ( jqXHR ) {

      console.log( "... FAILED to handle Agreement: " + jqXHR.status );
      console.log( "      " + jqXHR.status );
      console.log( "      " + jqXHR.statusText );
      console.log( "      " + jqXHR.statusCode() );

      return jqXHR;

    },
  });

  console.log( "... return from Agreement!" );

  return;

 }

function rejectToBorrow( item, requester ) {

  console.log( "Rejection Ajax request ..." );

  if ( item == undefined || item == null ) {
    console.log( "Tool Item is not specified! Cannot create REJECTION to borrow" );
    return;
  }
  if ( requester == undefined || requester == null ) {
    console.log( "Requester is not specified! Cannot create REJECTION to borrow" );
    return;
  }

  $.ajax({
    async : false,
    type: 'GET',
    url: application.getServiceURL() + "/rejection",
    data: {
      sessionid : application.loginInfo.sessionid,
      toolid    : item.id,
      userid    : requester.id
    },

//    dataType: "json",

    success: function ( result, status, xhr ) {

      console.log( "... Rejection handled successfully!" );


    },

    error: function ( jqXHR ) {

      console.log( "... FAILED to handle Rejection: " + jqXHR.status );
      console.log( "      " + jqXHR.status );
      console.log( "      " + jqXHR.statusText );
      console.log( "      " + jqXHR.statusCode() );

      return jqXHR;

    },
  });

  console.log( "... return from Rejection!" );

  return;

}

function confirmBorrow( item, oldOwner ) {

  console.log( "Borrow Ajax request ..." );

  if ( item == undefined || item == null ) {
    console.log( "Tool Item is not specified! Cannot create CONFIRM request" );
    return;
  }
  if ( oldOwner == undefined || oldOwner == null ) {
    console.log( "Requester is not specified! Cannot create CONFIRM request" );
    return;
  }

  $.ajax({
    async : false,
    type: 'GET',
    url: application.getServiceURL() + "/confirm",
    data: {
      sessionid : application.loginInfo.sessionid,
      toolid    : item.id,
      userid    : oldOwner.id
    },

//    dataType: "json",

    success: function ( result, status, xhr ) {

      console.log( "... CONFIRM performed successfully!" );


    },

    error: function ( jqXHR ) {

      console.log( "... FAILED to perform CONFIRM: " + jqXHR.status );
      console.log( "      " + jqXHR.status );
      console.log( "      " + jqXHR.statusText );
      console.log( "      " + jqXHR.statusCode() );

      return jqXHR;

    },
  });

  console.log( "... return from CONFIRM!" );

  return;

}
