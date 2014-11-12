/**
 *	 This is resource file for English Language Pack
 */

var resource_en_EN = { 
	
	locale	:	"en_EN",
	

/**
 *	Headers
 *
 *		There are headers of all screens in application except Message Dialog headers (see next)
 */

	headers	:  {
		login	:	"Login",
		mainmenu:	"Main Menu",
		catlist	:	"Tools Categories",
		toollist:	"Tools",
		tooldata:	"Tool Info",
		msglist	:	"Messages",
	},

/**
 *	 Message dialog Headers 
 *
 *		Message Dialog generates different headers depend on message type
 */

	msgheaders	:  {
		empty		:	"Unknown Message",		// For failure situation. Not used
		text		:	"Text Message",
		request		:	"Request",
		agreement	:	"Agreement",
		rejection	:	"Rejection",
		confirmation:	"Confirmation",
		info		:	"Info Message",

	},
	

/**
 *	Buttons 
 *
 *		There are different buttons text 
 */

	buttons : {
		on			:	"On",
		off			:	"Off",
		signin		:	"Sign In",
		scan		:	"Scan",
		askborrow	:	"Ask to Borrow",
		ok			:	"OK",
		cancel		:	"Cancel",
		back		:	"Back",
		agree		:	"Agree",
		reject		:	"Reject",
		borrow		:	"Borrow",
		notneeded	:	"Not needed",
		todo		:	"To Do",
		
		request		:	"Request",
        takeOver	:	"Take Over",
        validate	:	"Validate",
        release		:	"Release",
        recover		:	"Recover",
		
	},


/**
 *	Labels 
 *
 *		Caption of input fields
 *		For example field to input username has caption "Username:"
 */

	labels : {
		username	:	"Username",
		pwd 		:	"Password",
		remember	:	"Remember",
		usedby		:	"User",
		respb		:	"Responsible",
		status		:	"Status",
		
	},
	

/**
 *	Messages in the Lists
 *
 *	Templates. There are templates for messages in the Messages List. They will be modified according to message type
 */

	msgListTemplates : {

		empty		:	"Empty message",
		request		:	"Tool requested by",
		agreement	:	"Approved by",
		rejection	:	"Rejected by",
		confirmation:	"Confirmed by",
		
	},

	/**
	 *	Content of Message Dialog
	 *
	 *	Templates. There are templates for the Message Dialogs. They will be modified according to message type
	 */

	msgContentTemplates : {

		request		:	"Request to borrow",
		agreement	:	"Tool may be borrowed",
		rejection	:	"Rejected to borrow",
		confirmation:	"Was borrowed",
		info		:	"New user of ",
		
	},


	/**
	 *	Tool Data
	 *
	 *	Different text strings used in Tool Data dialog
	 * 
	 */
	
	toolstatus	:	{
		
		free	:	"Not used",
		inuse	:	"In-use",
		brocken	:	"Brocken",
		repair	:	"Under repairing",
		stolen	:	"Stolen",
		reserved:	"Reserved",
		
	},
	
	
	/**
	 *	Other Text Strings
	 *
	 *	Different text strings
	 */
	
	text :	{
		
		personaltool:	"Personal Tool",
		nolocationdata:	"No location data",
		progressing	:	"Progressing ...",
		readiness	:	"DEVICE IS READY!",
		init		:	"Before init ...",
		unknown		:	"unknown",
		
// NOT NECESSARY TO TRANSLATE BELOW
//		copyright	:	"Copyright © 2014. All rights reserved",
//		copyright	:	"Uisko Nordic Oy. Copyright " + "&#xa9" + " 2014",
		
	},

	errors : {
	
		scanfailure	:	"Scanning failed",
		noconection	:	"No network connection",
		authfailed	:	"Wrong username and/or password were specified!",
		loginfailed	:	"Authentication Failed because unknown reason. Code = ",
		categoriesfailed	:	"Read categories list failed!",
        toolnotfound		:	"Tool was not found in the Inventory!" );
		searchfailed		:	"Search Failed because unknown reason. Code = ",
		
	
	},
}
