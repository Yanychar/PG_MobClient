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

		console.log( "Selected category: " + application.selectedCategory.name );
	      
	    // Header text
		$( "#tools_list_page .ui-header .ui-title" ).text( currentResource.headers.toollist );
		// Search ...
    	$( '#tools_list_page' ).find( '.ui-input-search input' ).attr( 'placeholder', currentResource.text.search + " ..."  );
		
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
		    url: application.getServiceURL() + "/gettools",
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

		    	console.log( "... FAILED to Read Tools: " + jqXHR.status );

		    	application.toolsPageDescriptor.setActive( category, null );

		    	toolsManager.showTools();
		    	
		    },
		});

		console.log( "... return from Read Tools!" );

		return;
	},

	showCategory:		function( category ) {
		
	    console.log( "showCategoryToolsList start ..." );

//	    var listControl = $( '#tools_list_page' ).find( '#tools_list' );

//	    if ( application.toolsPageDescriptor.category != category ) {

	      console.log( "Tools list shall be read!" );

	      // Read Tools
	      this.read( category );
//	    } else {
//	      console.log( "Tools list is up-to-date!" );
//	    }

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

				+ "<h2>" + (( collapsedName ) ? collapsedName : "") + "</h2>"
	      
				+ categoryChain + "<br/>"
	      
//				+ (( tool.description && tool.name ) ? tool.description + "<br/>" : "" )

				+ (( tool.currentUser != undefined ) ? currentResource.labels.usedby + ": "
				+ tool.currentUser.firstName + " " + tool.currentUser.lastName + "<br/>" : "" )
//	      		+ (( tool.responsible != undefined ) ? "<b>Responsible: </b>"
//	      		+ tool.responsible.firstName + " " + tool.responsible.lastName + "<br/>" : "" )
//	      		+ (( tool.status != undefined ) ? "<b>Status: </b>" + tool.status + "<br/>" : "" )

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


}

