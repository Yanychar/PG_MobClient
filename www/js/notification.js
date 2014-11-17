
var Notification = {

	show:	function( message ) {
			
		this.runtimePopupStatic( message );
	},

	runtimePopup	:	function( message, popupafterclose) {
		
		var template = "<div data-role='popup' class='ui-content messagePopup' data-position-to='window'>" 
		      + "<a href='#' data-rel='back' class='ui-btn ui-corner-all ui-shadow ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-left'>"
		      + 	"Close"
		      + "</a>"
		      + "<span> " + message + " </span> </div>";
		
		  
		popupafterclose = popupafterclose ? popupafterclose : function () {};
		 
		$.mobile.activePage.append(template).trigger("create");

		console.log( "Pupup has been started" );
		
		$.mobile.activePage.find(".closePopup").bind("tap", function (e) {
		    $.mobile.activePage.find(".messagePopup").popup("close");
		});
		 
		$.mobile.activePage.find(".messagePopup").popup().popup("open").bind({
			popupafterclose: function () {
				$(this).unbind("popupafterclose").remove();
				popupafterclose();
		    }
		});
	},

	runtimePopupStatic	:	function( message, popupafterclose) {
		
		var template = "<div data-role='popup' class='ui-content messagePopup' data-position-to='window'>" 
		      + "<a href='#' data-rel='back' class='ui-btn ui-corner-all ui-shadow ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-left'>"
		      + 	"Close"
		      + "</a>"
		      + "<span> " + message + " </span> </div>";
		
		  
		popupafterclose = popupafterclose ? popupafterclose : function () {};
		 
		$.mobile.activePage.append(template).trigger("create");

		console.log( "Pupup has been started" );
		
		$.mobile.activePage.find(".closePopup").bind("tap", function (e) {
		    $.mobile.activePage.find(".messagePopup").popup("close");
		});
		 
		$.mobile.activePage.find(".messagePopup").popup().popup("open").bind({
			popupafterclose: function () {
				$(this).unbind("popupafterclose").remove();
				popupafterclose();
		    }
		});
	},

}