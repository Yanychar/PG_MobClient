// Login info
var	loginInfo = {

		sessionid:	null,
}



$( document ).on( "pagecreate","#login_page",function() {

	// Set resource strings
	$( ".ui-header .ui-title" ).text( currentResource.headers.login + ":" );
	$( "#login_page #usrnamelabel" ).text( currentResource.labels.username + ":" );
	$( "#login_page #passwdlabel" ).text( currentResource.labels.pwd + ":" );
	$( "#login_page #rememberswitchlabel" ).text( currentResource.labels.remember + ":" );
	$( "#login_page #remember_switch" ).flipswitch( "option", "onText", currentResource.labels.on );
	$( "#login_page #remember_switch" ).flipswitch( "option", "offText", currentResource.labels.off );
	$( "#login_page #login_button").text( currentResource.buttons.signin );

	// Login button click
	$("#login_button").on( "click", function() {
		console.log("Sign In button clicked!");

		loginUser( $("#usrname").val(), $("#passwd").val(),
			// If succeeded
			function(result) {
				console.log("Authentication succeeded!");
				loginInfo = result;

				// Go to MainMenu
				$.mobile
						.navigate(
								"#main_menu_page",
								{
									transition : "pop"
								});
			},
			// If failed
			function(jqXHR) {

				switch (jqXHR.status) {

					case 0:
						// Network error
						console.log("No network connection!");
						alert( currentResource.errors.noconection );
						break;

					case 404:
						// Not found.
						// Authentication
						// failure
						console.log("Wrong username and/or password were specified!");
						alert( currentResource.errors.authfailed );
						break;

					default:
						// Unknown reason
						console.log("Authentication Failed because unknown reason. Code = " + jqXHR.status);
						alert( currentResource.errors.loginfailed + jqXHR.status);
						break;
				}

			}
		);

	});
});

function loginUser(usrname, pwd, loggedIn, failed) {

	if (application.configuration.autologin && !usrname) {
		usrname = "sev";
		pwd = "sev";
	}

	console.log("Login attemptD: " + application.getServiceURL());

	$.ajax({
		async : false,
		type : 'GET',
		url : application.getServiceURL() + "/authenticate",
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