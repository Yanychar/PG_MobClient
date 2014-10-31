var communicator = {

	test:	function() {
		console.log( "Test function was call!" );
	},



	sendBorrowRequest:	function( tool ) {

		var result = false;

		if ( !tool ) {
			console.log( "Tool is not defined!" );
		};

		result = this.sendSyncGetRequest( "reqborrow",
				  					{
		      							sessionid : loginInfo.sessionid,
		      							toolid : tool.id
				  					}
		);

		if ( result ) {
			console.log( "'Borrow' request was sent successfully!" );
		};

		return result;

	},

	sendTakeOverRequest:	function( tool ) {

		var result = false;

		if ( !tool ) {
			console.log( "Tool is not defined!" );
		};

		result = this.sendSyncGetRequest( "takeover",
				  					{
		      							sessionid : loginInfo.sessionid,
		      							toolid : tool.id
				  					}
		);

		if ( result ) {
			console.log( "'TakeOver' request was sent successfully!" );
		};

		return result;

	},

	sendReleaseRequest:	function( tool ) {

		var result = false;

		if ( !tool ) {
			console.log( "Tool is not defined!" );
		};

		result = this.sendSyncGetRequest( "release",
				  					{
		      							sessionid : loginInfo.sessionid,
		      							toolid : tool.id
				  					}
		);

		if ( result ) {
			console.log( "'Release' request was sent successfully!" );
		};

		return result;

	},

	sendValidationMsg:	function( tool, date, location, status ) {

		var result = false;

		if ( !tool ) {
			console.log( "Tool is not defined!" );
		};

		// Convert Date to DateString
//		var dateStr = "";


		result = this.sendSyncGetRequest( "validated",
				  					{
		      							sessionid 	: loginInfo.sessionid,
		      							toolid 		: tool.id,
		      							date		: date,
		      							latitude	: location.latitude,
		      							longitude	: location.longitude,
			      						accuracy	: location.accuracy,
			      						status		: status,
				  					}
		);

		if ( result ) {
			console.log( "'Validation' request was sent successfully!" );
		};

		return result;

	},

	successResult: null,
	failureResult: null,
	sendSyncGetRequest:	function( command, dataObj ) { //}, , succeeded, failed )

		var res = false;

    	console.log( "sendSyncGetRequest start ..." );

		this.tmpResult = null;
    	this.failureResult = null;

		$.ajax({
		    async : false,
		    type: 'GET',
		    url: application.getServiceURL() + "/" + command,
		    data: dataObj,

//		    dataType: "json",

		    success: function ( result, status, xhr ) {

		    	console.log( "  sendSyncGetRequest succeeded!" );

		    	communicator.successResult = result;

		    	res = true;
		    },

		    error: function ( jqXHR ) {

				console.log( "  sendSyncGetRequest failed!" );
				console.log( "      " + jqXHR.status );
				console.log( "      " + jqXHR.statusText );
				console.log( "      " + jqXHR.statusCode() );

		    	communicator.failureResult = jqXHR;

		    },
		  });

    	console.log( "... end sendSyncGetRequest with result: " + res );

    	return res;
	},
}