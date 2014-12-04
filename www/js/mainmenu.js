var mainMenu = {

		init:	function() {

			console.log( "Main Menu page Init start ..." );

			$( document ).on( "pagecreate","#main_menu_page",function(){

				mainMenu.pageCreated();
			});

			$(document).on( "pagebeforeshow","#main_menu_page",function(){

				mainMenu.pageBeforeShow();
					
			});
				 
			$(document).on( "pageshow","#main_menu_page",function(){

				mainMenu.pageAfterShow();
					
			});
				
		},
		
		pageCreated:	function() {

			console.log( "Main Menu page PageCreated start ..." );
				
			scanner.initialize();

	      	$("#main_menu_page #scan_button").on("click",function(){
	        	scanner.scan();
	        });

			$( '#main_menu_page #logoff_buton' ).on( "click", function() {

				settingsManager.logoff();

      		});

			$( '#main_menu_page #own_tools_button' ).on( "click", function() {
				
				mainMenu.gotoOwnTools();
			});

			$( '#main_menu_page #search-free-text' ).change(function() {
				
				mainMenu.freeSearch( $(this).val());
			});

			    
		},
			
		pageBeforeShow:	function() {

			console.log( "Main Menu page PageBeforeShow start ..." );
				
			// Header text
			$( "#main_menu_page .ui-header .ui-title" ).text( settingsManager.getLangResource().headers.mainmenu );
			// Scan button text
			$("#main_menu_page #scan_button").text( settingsManager.getLangResource().buttons.scan );

			$("#main_menu_page #version_info").text( "Ver. " + settingsManager.version

			);

	    	$( '#main_menu_page' ).find( '.ui-input-search input' ).attr( 'placeholder', settingsManager.getLangResource().text.quicksearch );
			$("#main_menu_page .ui-footer #search-free-btn").text( settingsManager.getLangResource().buttons.go );

			
		},

		pageAfterShow:	function() {
			console.log( "Main Menupage PageAfterShow start ..." );
			
		},

		gotoOwnTools:	function( searchStr ) {
			
	    	$.mobile.navigate( "#common_tools_list_page", {
//                transition: "slide"
	    	});

//	    	ownBasket.showOwnBasket();
	    	
			var parameters = {
					method : "gettools",
					sessionid : loginInfo.sessionid,
					userid : loginInfo.user.id,
					header : settingsManager.getLangResource().headers.ownbasket,
					search : false,
				      
				};

				communicator.readTools( parameters, toolsViewer.showList );
	    	
		},

		freeSearch:	function( searchStr ) {
			
	    	$.mobile.navigate( "#common_tools_list_page", {
//                transition: "slide"
	    	});

//	    	ownBasket.showOwnBasket();
	    	
			var parameters = {
					method : "gettools",
					sessionid : loginInfo.sessionid,
					userid : loginInfo.user.id,
					header : settingsManager.getLangResource().headers.ownbasket,
					search : false,
				      
				};

				communicator.readTools( parameters, toolsViewer.showList );
	    	
		},
}		

