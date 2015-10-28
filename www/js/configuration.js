var SupportedDeviceType = {
	EMU_OR_DEVICE:	0,
	BROWSER:	    1
};

var SupportedEnvironments = {
    LOCAL:  0,
    DEMO:   1,
    PROD:   2
};

var	configuration = {

	consolelog  : true,

	getDeviceType: function() {

		return SupportedDeviceType.BROWSER;
//		return SupportedDeviceType.EMU_OR_DEVICE;

	},
		
  	getServiceURL	: function() {
		
		return supportedURL.LOCAL;
//		return supportedURL.DEMO;
//		return supportedURL.PROD;
	},
		
		
};



var supportedURL = {
//  LOCAL:  "http://192.168.255.11:8080/InventoryServer/rest",
  LOCAL:  "http://10.0.0.25:8080/InventoryServer/rest",
  DEMO:   "http://toolsdemo.uisko.com/tools/rest",
  PROD:   "http://tools.uisko.com/tools/rest"
}

