// 1.0.11	31.08.2015	PhoneGap v.6.4.6 has been deployed

var SupportedDeviceType = {
	EMU_OR_DEVICE:	0,
	BROWSER:	    1
};

var SupportedEnvironments = {
    LOCAL:  {
        server   : "10.0.0.23",
        restPath : "/InventoryServer/rest"
    },
    DEMO:     {
        server   : "tools.uisko.com",
        restPath : "/tools/rest"
    },
    PROD:     {
        server   : "tools.uisko.com",
        restPath : "/tools/rest"
    }
};

var Connections = {
    nonsecure   : {
        protocol    :   "http://",
        port        :   ":8080"
    },
    secure   : {
        protocol    :   "https://",
        port        :   ":8443"
    }
}

var	configuration = {

	consolelog  : true,
    
    activeEnv   : SupportedEnvironments.LOCAL,

    deviceType  : SupportedDeviceType.EMU_OR_DEVICE,
    
    getActiveEnv    : function() { return this.activeEnv;	},
    getDeviceType   : function() { return this.deviceType;	},
    getProtocol  	: function( secured ) {
        if ( secured && activeEnv != SupportedEnvironments.LOCAL ) {
            return Connections.secure.protocol;
        } else {
            return Connections.nonsecure.protocol;
        }
    },
    getPort  	: function( secured ) {
        if ( secured && activeEnv != SupportedEnvironments.LOCAL ) {
            return Connections.secure.port;
        } else {
            return Connections.nonsecure.port;
        }
    },
    getServer  	: function() { return this.activeEnv.server; },
    getRestPath	: function() { return this.activeEnv.restPath; },
        
    
  	getServiceURL  	: function( secured ) {
    
        if ( secured === undefined ) {
            secured = false;    
        }
        
        url = 
            this.getProtocol( secured )
        +   this.getServer( secured )
        +   this.getPort( secured )
        +   this.getRestPath();
        
        return url;

    },
    
};





