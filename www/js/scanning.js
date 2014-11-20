
var scanner = {

	initialize: function() {

	},

	scan: function() {

		if ( application.getDeviceType() == SupportedDeviceType.EMU_OR_DEVICE ) {

			console.log( "Call for BarcodeScanner.scan..." );

			cordova.plugins.barcodeScanner.scan(
					this.successScan,
					this.failedScan
			);

		} else {
			console.log( "Emulate result return from BarcodeScanner.scan..." );

			var result = {
  			text:       "2000000000008",
			  format:     "EAN13",
			  cancelled:  false
		  };

		  this.successScan( result );
		}
	},

	successScan: function( result ) {

		var s = "Result: " + result.text + "\n" +
//			"Format: " + result.format + "<br/>" +
			"Cancelled: " + result.cancelled;

		if ( !result.cancelled ) {

			console.log( "... exit from BarcodeScanner.scan. Scan successful. Barcode: '" + result.text + "'" );

			toolItemMngr.findAndShowTool( result.text );


		} else {
			console.log( "... exit from BarcodeScanner.scan. Scan had been canceled" );
		}

		return result;
	},

	failedScan: function( error ) {

		console.log( "... exit from BarcodeScanner.scan with failure!" );

		alert( settingsManager.getLangResource().errors.scanfailure + ": " + error );
	},


};

