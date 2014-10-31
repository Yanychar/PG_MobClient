var categoriesTree = null;

function showCategoriesSelection() {

  console.log( "showCategoriesSelection ..." );

  var htmlStr ='';

  if ( categoriesTree == null ) {
    categoriesTree = readCategoriesList(
      function( categoriesTree ) {

      if ( categoriesTree != undefined && categoriesTree.length > 0 ) {

        console.log( "Categories Tree is OK for selection" );
        selectCategory( categoriesTree );

      } else {
        console.log( "Categories Tree is null or empty" );
      }
    });
  } else {

    console.log( "Categories Tree was read. It will be shown" );
    selectCategory( categoriesTree );

  }
}

function readCategoriesList( categoriesWereRead ) {

  console.log( "Read Categories List ..." );

  var retRes;

  $.ajax({
    async : false,
    type: 'GET',
    url: application.getServiceURL() + "/getcategories",
    data: {
      sessionid : loginInfo.sessionid,
    },

    dataType: "json",

    success: function ( result, status, xhr ) {
      console.log( "... SUCCESS return from Read Categories List!" );

      categoriesWereRead( result );
    },

    error: function ( jqXHR ) {
      alert( "Failed!!!" );
//      failed( jqXHR );
    },

  });

  console.log( "... return from Read Categories List!" );

}

function selectCategory( categoryTree, header ) {

//  var passedPrefix = prefix;

  if ( header == undefined ) {
    console.log( "Initial Category selection page" );

/*
    var backButton = $( '#categories_page' ).find( ' .ui-btn-auto' );
    backButton.off().on( "click", function() {
*/

/*
    $( '#categories_page' ).find( '#back_buton' ) // ( .ui-btn-auto' )
     .off().on( "click", function() {
      console.log( "*** Back button pressed!" );

      // Return back
//        categorySelectionStack.push( { "tree": categoryTree, "header" : "AAAA" );
      var prevNode = categorySelectionStack.pop();

      if ( prevNode == undefined ) {
        console.log( "Stack is empty" );

        // Go to MainMenu
        $.mobile.navigate( "#main_menu_page"), {
            transition: "slide"
        });

      } else {

        var prevCategoryTree = prevNode.tree;
        var header = prevNode.header;

        console.log( "Prev Node = " + prevNode );

        console.log( "Stack is NOT empty. First category is: " + prevCategoryTree[0].name + " and Header = " + header);

        // Goto parent category selection
        selectCategory( prevNode.tree, prevNode.header );

        return;
      }

    });
*/
  }

  var selectedCatId = -1;

  $('#catlist').empty();

  showHeader( header );
  $.each( categoryTree, function( index, subCat ) {

/*
    var nameStr =
          (( passedPrefix != undefined && passedPrefix.length > 0 ) ? passedPrefix + ">" : "" )
          + subCat.name;
    console.log( "passedPrefix='"+passedPrefix+"'.  Name='"+nameStr+"'.   Subcategory.name='"+subCat.name+"'" );
*/
    var listElement = $(
          "<li><a href=\"\">"
        + subCat.name
        + "</a></li>"
    );

    listElement.data( "dat", subCat );
    listElement.on( "click", function() {


      console.log( "Category list item has been clicked!" );

      if ( subCat.childs != undefined && subCat.childs.length > 0 ) {
        // Go to subcategory selection

        // 1. Store current categori list in the stack
        var newHeader = (( header != undefined ) ? header + " > " : "" )
                        + subCat.name;

        // 2. Select from childs
        selectCategory( subCat.childs, newHeader );

      } else {
        // Go to Tools selection
        application.selectedCategory = subCat;

        console.log( "*** Navigation to ToolsList was called!" );

        $.mobile.navigate( "#tools_list_page", {
            transition: "pop"
        });

      }

//      alert( "Item pressed. id = " + $(this).data( "dat" ).name );
    });

    $('#catlist').append( listElement );
  });

  $('#catlist').trigger('create');
  $('#catlist').listview('refresh');

  return selectedCatId;
}

function showHeader( header ) {

  $( '#categories_page' ).find( '#toolbar_header' )
      .text(( header != undefined ) ? header : "Tools Categories" );

}

