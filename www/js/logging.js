if( !window.console
  ||
    !application.configuration.logging ) {
	
    window.console = {log: function(){} };
    
}