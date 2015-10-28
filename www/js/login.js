// Login info
var	loginInfo = {

//		sessionid:	null,
}

var loginRunning = false;

$( document ).on( "pagecreate","#login_page",function() {

	// Login button click
	$("#login_button").on( "click", function() {

		if ( !loginRunning ) {
			console.log( "loginRunning: " + loginRunning + ". Shall be login");
			
			loginRunning = true;

			console.log("Sign In button clicked!");
		
			loginUser( $("#usrname").val(), $("#passwd").val(),
				// If succeeded
				function(result) {
					console.log("Authentication succeeded!");
					loginInfo = result;
	
					settingsManager.login( $("#usrname").val(), $("#passwd").val());

					// Go to MainMenu
					$.mobile
							.navigate(
									"#main_menu_page",
									{
										transition : "pop"
									});

					loginRunning = false;

				},
				// If failed
				function(jqXHR) {

					settingsManager.loginFailed();
					
					switch (jqXHR.status) {
	
						case 0:
							// Network error
							console.log("No network connection!");
							alert( settingsManager.getLangResource().errors.noconection );
							break;
	
						case 404:
							// Not found.
							// Authentication
							// failure
							console.log("Wrong username and/or password were specified!");
							alert( settingsManager.getLangResource().errors.authfailed );
							break;
	
						default:
							// Unknown reason
							console.log("Authentication Failed because unknown reason. Code = " + jqXHR.status);
							alert( settingsManager.getLangResource().errors.loginfailed + jqXHR.status);
							break;
					}
					
					loginRunning = false;
	
				}
			);
					
			// Enable fields: name&pwd
			$( "#usrname" ).textinput('enable');
			$( "#passwd" ).textinput('enable');
			
		} else {
			console.log( "loginRunning: " + loginRunning + ". Shall NOT be login");
			
		}

	});
});

$( document ).on( "pagebeforeshow","#login_page",function() {

	// Set resource strings
	$( "#login_page .ui-header .ui-title" ).text( settingsManager.getLangResource().headers.login );
	$( "#login_page #usrnamelabel" ).text( settingsManager.getLangResource().labels.username + ":" );
	$( "#login_page #passwdlabel" ).text( settingsManager.getLangResource().labels.pwd + ":" );
	$( "#login_page #login_button").text( settingsManager.getLangResource().buttons.signin );

	// If Logged in than try to login automatically
	
	if ( settingsManager.loggedin) {
		console.log( "Will be logged automatically" );

		$( "#usrname" ).val( settingsManager.usrname );
		$( "#passwd" ).val( settingsManager.pwd );
		
		// disable fields: name&pwd
		$( "#usrname" ).textinput('disable');
		$( "#passwd" ).textinput('disable');
//		$( "#login_button" ).button({ disabled: true });

		// emulate click of button
		$( "#login_button" ).trigger('click');
		
	} else {
		console.log( "Log-In page shall be shown" );
		
		// Enable fields: name&pwd
		$( "#usrname" ).textinput('enable');
		$( "#passwd" ).textinput('enable');
//		$( "#login_button" ).button({ enabled: true });
	}
});

function loginUser(usrname, pwd, loggedIn, failed) {

	console.log("Login attemptD: " + configuration.getServiceURL());

	$.ajax({
		async : false,
		type : 'GET',
		url : configuration.getServiceURL() + "/authenticate",
		data : {
			name : usrname,
			pwd : pwd
		},

		dataType : "json",

		success : function(result, status, xhr) {

			loggedIn(result);

		},
		error : function(jqXHR, text) {
			console.log("Failed to authenticate: ", jqXHR.status, text);

			failed(jqXHR);
		},

	});

	console.log("Return from synchronous Ajax call");

}