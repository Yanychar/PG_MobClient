/*
function fillToolDialog( tool ) {

  var content = $( '#tool_data_page' ).find( '#tool_descr_dynamic' );

  // Clear current content
  content.empty();

  content.append( "<h3>" + (( tool.name != undefined && tool.name != null && tool.name.length > 0 ) ? tool.name : "" ) + "</h2>" );

  content.append(
    (( tool.description != undefined && tool.description.length > 0 ) ? tool.description  + "<br/>": "" )
      + "<hr/>"
      + (( tool.currentUser != undefined ) ? "<b>Used by: </b>"
      + tool.currentUser.firstName + " " + tool.currentUser.lastName + "<br/>" : " " )
      + (( tool.responsible != undefined ) ? "<b>Responsible: </b>"
      + tool.responsible.firstName + " " + tool.responsible.lastName + "<br/>" : " " )
      + "<hr/>"
      + (( tool.status != undefined ) ? "<b>Status: </b>" + tool.status + "<br/>" : " " )
  );

}
*/
function askToBorrow( tool ) {

  var bRes = false;

  console.log( "Send 'Borrow' request ..." );
  console.log( "  Tool: " + tool.name );
  console.log( "  LoginInfo: " + loginInfo );
  console.log( "    Not null: " + ( loginInfo != null ));

  if ( tool == undefined || tool == null ) console.log( "Tool is not defined!" );


  $.ajax({
    async : false,
    type: 'GET',
    url: application.getServiceURL() + "/reqborrow",
    data: {
      sessionid : loginInfo.sessionid,
      toolid : tool.id
    },

//    dataType: "json",

    success: function ( result, status, xhr ) {

      console.log( "... request to 'Borrow' was sent successfully!" );

      bRes = true;
    },

    error: function ( jqXHR ) {

      console.log( "... failed to sent request to 'Borrow'!" );
      console.log( "      " + jqXHR.status );
      console.log( "      " + jqXHR.statusText );
      console.log( "      " + jqXHR.statusCode() );

      bRes = false;

    },
  });

  console.log( "... return from Send 'Borrow' request. Success? " + bRes );

  return bRes;

}

