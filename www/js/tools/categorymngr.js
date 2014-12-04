var catgrsManager = {

	categoriesTree : null,
	
	needToReadead : null,
		
	init:	function() {
		
	    $( document ).on( "pagecreate","#categories_page",function(){

	    	catgrsManager.pageCreated();
	    });

	    $(document).on( "pagebeforeshow","#categories_page",function(){

	    	catgrsManager.pageBeforeShow();
			
	    });
		 
	    $(document).on( "pageshow","#categories_page",function(){

	    	catgrsManager.pageAfterShow();
			
	    });
	    
	    this.needToReadead = true;
	},
	
	pageCreated:	function() {
		console.log( "CategoriesList pageCreated handler start ..." );
		
		$( '#categories_page #back_buton' ).on( "click", function() {

			// Return back to Login screen
			$.mobile.navigate( "#main_menu_page", {
//	                                    transition: "slide"
			});

    	});
		
	},
	
	pageBeforeShow:	function() {

    	$( '#categories_page' ).find( '#toolbar_header' ).text( settingsManager.getLangResource().headers.catlist );
    	
    	$( '#categories_page' ).find( '.ui-input-search input' ).attr( 'placeholder', settingsManager.getLangResource().text.search );
    	$('input[data-type="search"]').val("");

    	
		if ( this.needToReadead ) {
			
			this.read();
			
		}

		
		
	},
	
	pageAfterShow:	function() {
		
	},

	read:	function() {
		console.log( "Read Categories List ..." );

		var retRes;

		$.ajax({
			async : false,
		    type: 'GET',
		    url: application.getServiceURL() + "/getcategories",
		    data: {
			      sessionid : loginInfo.sessionid,
			      all : "false",
		    },

		    dataType: "json",

		    success: function ( result, status, xhr ) {
		    	console.log( "... SUCCESS return from Read Categories List!" );
		    	
		    	this.categoriesTree = result;
		    	
		    	catgrsManager.showCategories( result );
		    	
				this.needToReadead = false;
		    },

		    error: function ( jqXHR ) {
		    	
		    	if ( jqXHR.status==401 ) {

					settingsManager.logoff();
		    		
		    	} else {
		    	
		    		alert( settingsManager.getLangResource().errors.categoriesfailed );
		    	}
		    	
				this.needToReadead = true;
				
		    },

		});

		console.log( "... return from Read Categories List!" );

	},

    showCategories:	function( catTree ) {
    	
    	$('#catlist').empty();

    	console.log( "Num of entries in CategoriesList = " + catTree.length );
    	
        this.addOneLevel( $('#catlist'), catTree, null );
    	
		$('#catlist').trigger('create');
		$('#catlist').listview('refresh');

    	
    },

    addOneLevel:		function( list, catTree, prefix ) {

    	$.each( catTree, function( index, cat ) {

    	    list.append( catgrsManager.createOneItem( cat, prefix ));

        	if ( cat.childs && cat.childs.length > 0 ) {
        		
//        		console.log( "Childs shall be added for category: '" + cat.name + "', prefix: " + prefix );
        		var newPrefix;
				if ( prefix && prefix.length > 0 ) {
					newPrefix = prefix + " &#x25B6 " + cat.name;
				} else {
					newPrefix = cat.name;
				}
        		
        		catgrsManager.addOneLevel( list, cat.childs, newPrefix );
        		
        	}
    	    
    	});

    },
    
    createOneItem:		function( cat, prefix ) {
    	
		var listElement = $(
	  	          "<li><a href=\"\">"
				
				+ ( prefix && prefix.length > 0 ? prefix + " &#x25B6 " : "" )
	  	        + cat.name
	  	        + "</a></li>"
	  	);
		
	    listElement.data( "dat", cat );

	    listElement.on( "click", function() {

	    	console.log( "Category list item has been clicked!" );

			// Go to Tools selection
			application.selectedCategory = cat;
			
			console.log( "*** Navigation to ToolsList was called!" );
			
			$.mobile.navigate( "#tools_list_page", {
						transition: "pop"
			});


//  	      alert( "Item pressed. id = " + $(this).data( "dat" ).name );
  	    });
	    
	    return listElement;
    },
    
}
