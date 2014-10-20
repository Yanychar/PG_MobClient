
function readTools( category, succeedToRead ) {

  console.log( "Read Tools List ..." );

  if ( application.toolsPageDescriptor == undefined ) console.log( "toolsPageDescriptor undef!" );

  var catIdToReq = -1;
  if ( category != undefined && category != null && category.id != undefined ) {
    catIdToReq = category.id;
  } else {
    console.log( "category undef! will read all Tools" );
  }


  $.ajax({
    async : false,
    type: 'GET',
    url: application.getServiceURL() + "/gettools",
    data: {
      sessionid : application.loginInfo.sessionid,
      categoryid : catIdToReq
    },

    dataType: "json",

    success: function ( result, status, xhr ) {

      console.log( "... read Tools SUCCESSfully" );

      application.toolsPageDescriptor.setActive( category, result );

      if ( succeedToRead != undefined ) {
        succeedToRead();
      }

    },

    error: function ( jqXHR ) {

      console.log( "... FAILED to Read Tools: " + jqXHR.status );

      application.toolsPageDescriptor.setActive( category, null );

      if ( succeedToRead != undefined ) {
        succeedToRead();
      }


    },
  });

  console.log( "... return from Read Tools!" );

  return;
}

function showCategoryToolsList( category ) {

    console.log( "showCategoryToolsList start ..." );

    var listControl = $( '#tools_list_page' ).find( '#tools_list' );

//    if ( application.toolsPageDescriptor.category != category ) {

      console.log( "Tools list shall be read!" );

      // Read Tools
      readTools( category, function() {
        // Show toolsList
      showToolsList();

      });
//    } else {
//      console.log( "Tools list is up-to-date!" );
//    }

    console.log( "... showCategoryToolsList end" );

}

function showToolsList() {

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

          addToolElement( listControl, tool ).listview('refresh');

        });
      }

      listControl.listview('refresh');

    } else {
      console.log( "Current Tools Category undefined!" );
    }

    console.log( "... showToolsList end" );

}

function addToolElement( element, tool ) {

  var collapsedName = ( tool.name )? tool.name : tool.description;



  var collpsbl = $(

    "<div data-role=\"collapsible\">"

      + "<h2>" + (( collapsedName ) ? collapsedName : "") + "</h2>"
      + (( tool.description && tool.name ) ? tool.description + "<br/>" : "" )
      + (( tool.currentUser != undefined ) ? "<b>Used by: </b>"
      + tool.currentUser.firstName + " " + tool.currentUser.lastName + "<br/>" : "" )
      + (( tool.responsible != undefined ) ? "<b>Responsible: </b>"
      + tool.responsible.firstName + " " + tool.responsible.lastName + "<br/>" : "" )
      + (( tool.status != undefined ) ? "<b>Status: </b>" + tool.status + "<br/>" : "" )

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

    console.log( "**** 11" );
    // Store selected Tool
    application.currentTool = tool;

    // Move to the Tool Data page
    $.mobile.navigate( "#tool_data_page", {
                            allowSamePageTransition: false,
                            transition: "none"
    });

    console.log( "**** 22" );

  });

  element.append( listElement ).listview('refresh');

  return element;

}

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

function askToBorrow( tool ) {

  var bRes = false;

  console.log( "Send 'Borrow' request ..." );
  console.log( "  Tool: " + tool.name );
  console.log( "  LoginInfo: " + application.loginInfo );
  console.log( "    Not null: " + ( application.loginInfo != null ));

  if ( tool == undefined || tool == null ) console.log( "Tool is not defined!" );


  $.ajax({
    async : false,
    type: 'GET',
    url: application.getServiceURL() + "/reqborrow",
    data: {
      sessionid : application.loginInfo.sessionid,
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

var toolToShow = {

  findByBarCode:  function( barcode, successReturn ) {

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
        sessionid:  application.loginInfo.sessionid,
        barcode:    barcode
      },

      dataType: "json",

      success: function ( result, status, xhr ) {

        console.log( "... Tool was found SUCCESSfully" );

        // TODO: many tools can be returned. It is necessary to provide selection

        if ( successReturn != undefined && successReturn != null ) {
          successReturn( result[0] );
        }

        return result;
      },

      error: function ( jqXHR ) {

        if ( jqXHR.status == 404 ) {
          // It is Ok. Just nothing was found
          alert( "No Tool with '" + barcode + "' found in repository!" );

        } else {
          alert( "Failed with unknown reason. Errorcode = " + jqXHR.status );
        }

        console.log( "... Tool was not found or search failed: " + jqXHR.status );

      }
    });

    console.log( "... return from Read Tools!" );
  },

  presentTool:  function( barcode ) {

    // Read
    this.findByBarCode( barcode, this.showTool );


  },


  showTool: function( tool ) {

    var str = "";
    var flagFirst = true;

    $.each( tool.categoriesTree, function( index, name ) {

      if ( !flagFirst ) {
        str = str  + " > ";
      } else {
        flagFirst = false;
      }

      str = str + name;


    });
/*
    alert( "Place to show Tool: "
          + tool.name + "\n"
          + tool.description + "\n"
          + "Category: " + str
    );
*/

    // Store selected Tool
    application.currentTool = tool;

    // Move to the Tool Data page
    $.mobile.navigate( "#tool_data_page", {
        transition: "fade"
      }
    );






  },

};
