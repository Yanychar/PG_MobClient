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

		result = this.sendSyncGetRequest( "updatestatus",
				  					{
		      							sessionid : loginInfo.sessionid,
		      							toolid : tool.id,
		      							status : "FREE"
				  					}
		);

		if ( result ) {
			console.log( "'Release' request was sent successfully!" );
		};

		return result;

	},
/*
	sendInUseRequest:	function( tool ) {
		
		return sendUpdateStatusRequest( tool, "INUSE" );
		
	},
*/
	
	
	sendUpdateStatusRequest:	function( tool, newStatus ) {

		var result = false;

		if ( !tool ) {
			console.log( "Tool is not defined!" );
		};

		result = this.sendSyncGetRequest( "updatestatus",
					{
						sessionid : loginInfo.sessionid,
						toolid : tool.id,
						status : newStatus
					}
		);

		if ( result ) {
			console.log( "'" + newStatus + "' request was sent successfully!" );
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

	readTools:	function( parameters, showFunction ) {
		
		console.log( "Ajax call to read Tools List ..." );

		$.ajax({
			async:	false,
		    type: 	'GET',
		    url: 	application.getServiceURL() + "/" + parameters.method,

		    data:	{
		    	sessionid 	: parameters.sessionid,
		    	userid 		: parameters.userid,
				searchs     : parameters.searchStr,
				categoryid 	: parameters.categoryid
		    	
		    },

		    dataType: "json",

		    success: function ( result, status, xhr ) {

		    	console.log( "... read Tools SUCCESSfully" );

		    	showFunction( result, { header : parameters.header, search : parameters.search } );

		    },

		    error: function ( jqXHR ) {
		    	
		    	if ( jqXHR.status==401 ) {
			    	console.log( "... No Tools found" );

					settingsManager.logoff();
		    		
		    	} else if ( jqXHR.status==404 ) {
			    	console.log( "... No Tools found" );

			    	showFunction( null, { header : parameters.header, search : parameters.search } );
			    	
		        } else {
			    	console.log( "... FAILED to Read Tools: " + jqXHR.status );

			    	showFunction( null, { header : parameters.header, search : parameters.search } );
		        }
		    	
		    },
		});

		console.log( "... return from Read Tools!" );

	},

}