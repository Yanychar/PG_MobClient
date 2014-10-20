function loginUser( usrname, pwd, loggedIn, failed ) {


  if ( application.testing && !usrname ) {
    usrname = "sev";
    pwd = "sev";
  }

  console.log( "Login attemptD: " + application.getServiceURL());

  $.ajax({
    async : false,
    type: 'GET',
    url: application.getServiceURL() + "/authenticate",
    data: {
      name : usrname,
      pwd : pwd
    },

    dataType: "json",

    success: function ( result, status, xhr ) {

      loggedIn( result );

    },
    error: function ( jqXHR, text ) {
      consele.log( "Failed to authenticate: ", jqXHR.status, text );

      failed( jqXHR );
    },

  });

  console.log( "Return from synchronous Ajax call" );

}