/**
 *	 This is resource file for Finnish Language Pack
 */

var resource_fi_FI = {

	locale	:	"fi_FI",		// Do not touch

/**
 *	Headers
 *
 *		There are headers of all screens in application except Message Dialog headers (see next)
 */

	headers	:  {
		login		:	"Kirjaudu",
		mainmenu	:	"P\u00e4\u00e4valikko",
		catlist		:	"Ty\u00f6kaluryhm\u00e4t",
		toollist	:	"Ty\u00f6kalut",
		tooldata	:	"Info",
		msglist		:	"Viestit",
		select		:	"Valitse",
		settings	:	"Asetukset",
		ownbasket	:	"Ty\u00f6kaluni",

	},

/**
 *	 Message dialog Headers
 *
 *		Message Dialog generates different headers depend on message type
 */

	msgheaders	:  {

		request		:	"Pyyd\u00e4",
		agreement	:	"Sovittu",
		rejection	:	"Hyl\u00e4tty",
		confirmation	:	"Vahvistus",
		notneeded	:	"Hyl\u00e4tty",
		info		:	"Tiedote",
		text		:	"Teksti viesti",
		empty		:	"Tuntematon viesti",

	},


/**
 *	Buttons
 *
 *		There are different buttons text
 */

	buttons : {
		on		:	"P\u00e4\u00e4lle",
		off		:	"Pois",
		signin		:	"Sis\u00e4\u00e4nkirjautuminen",
		scan		:	"Lue viivakoodi",
		askborrow	:	"Kysy lainaksi",
		ok		:	"OK",
		cancel		:	"Peru",
		back		:	"Takaisin",
		agree		:	"Hyv\u00e4ksy",
		reject		:	"\u00c4l\u00e4 hyv\u00e4ksy",
		borrow		:	"Lainaa",
		notneeded	:	"En tarvitse",
		todo		:	"Teht\u00e4v\u00e4t",
		go		:	"Etsi",
		request		:	"Pyynt\u00f6",
		takeOver	:	"Ota k\u00e4ytt\u00f6\u00f6si",
		validate	:	"Tarkista ty\u00f6kalun tiedot",
		release		:	"Vapauta",
		available	:	"Saatavissa",
		inUse		:	"Varattu",
		broken		:	"Ep\u00e4kunnossa",
		repair		:	"Huollossa",
		stolen		:	"Varastettu",
		nooperation	:	"Ei mit\u00e4\u00e4n tekemist\u00e4",

	},


/**
 *	Labels
 *
 *		Caption of input fields
 *		For example field to input username has caption "Username:"
 */

	labels : {

		username	:	"K\u00e4ytt\u00e4j\u00e4tunnus",
		pwd		:	"Salasana",
		remember	:	"Talleta tunnukset",
		usedby		:	"K\u00e4ytt\u00e4j\u00e4",
		respb		:	"Vastuuhenkil\u00f6",
		status		:	"Status",
		lang		:	"Kieli",
		from		:	"L\u00e4hett\u00e4j\u00e4",
		barcode		:	"Viivakoodi",
		sn		:	"S/N",

	},


/**
 *	Messages in the Lists
 *
 *	Templates. There are templates for messages in the Messages List. They will be modified according to message type
 */

	msgListTemplates : {

		request		:	"Ty\u00f6kalupyynt\u00f6",
		agreement	:	"K\u00e4ytt\u00f6 hyv\u00e4ksytty",
		rejection	:	"Pyynt\u00f6 hyl\u00e4tty",
		confirmation	:	"Vahvistettu",
		notneeded	:	"Ty\u00f6kalupyynt\u00f6 peruttu",
		info		:	"Info",
		empty		:	"",

	},

	/**
	 *	Content of Message Dialog
	 *
	 *	Templates. There are templates for the Message Dialogs. They will be modified according to message type
	 */

	msgContentTemplates : {

		request		:	"Lainapyynt\u00f6",
		agreement	:	"Ty\u00f6kalun voi lainata",
		rejection	:	"Ei saa lainata",
		confirmation	:	"Oli lainattu",
		notneeded	:	"Ty\u00f6kalupyynt\u00f6 peruttu",
		info		:	"",
		empty		:	"",

	},


	/**
	 *	Tool Data
	 *
	 *	Different text strings used in Tool Data dialog
	 *
	 */

	toolstatus	:	{

		free		:	"Vapaa",
		inuse		:	"K\u00e4yt\u00f6ss\u00e4",
		broken		:	"Ep\u00e4kunnossa",
		repair		:	"Huollossa",
		stolen		:	"Varastettu",
		reserved	:	"Varattu",

	},


	/**
	 *	Other Text Strings
	 *
	 *	Different text strings
	 */

	text :	{

		personaltool	:	"Henkil\u00f6kohtainen ty\u00f6kalu",
		nolocationdata	:	"Ei sijaintitietoa",
		progressing	:	"Etenee...",
		readiness	:	"LAITE ON VALMIS!",
		init		:	"Before init ...",
		unknown		:	"Ei tiedossa",
		search		:	"Haku ...",
		quicksearch	:	"Pikahaku ... ",


	},

	errors : {

		scanfailure	:	"Viivakoodin luku ep\u00e4onnistui",
		noconection	:	"Ei verkkoyhteytt\u00e4",
		authfailed	:	"V\u00e4\u00e4r\u00e4 k\u00e4ytt\u00e4j\u00e4tunnus ja/tai salasana!",
		loginfailed	:	"Tunnistus ep\u00e4onnistui tuntemattomasta syyst\u00e4. Koodi = ",
		categoriesfailed:	"Read categories list failed!",
		toolnotfound	:	"Ty\u00f6kalu ei l\u00f6ytynyt varastolistasta!",
		searchfailed	:	"Haku ep\u00e4onnistui tuntemattomasta syyst\u00e4. Koodi = ",


	},

// NOT NECESSARY TO TRANSLATE BELOW
//	copyright	:	"Copyright \u00a9 2014. All rights reserved",
//	copyright	:	"Uisko Nordic Oy. Copyright " + "&#xa9" + " 2014",
	copyright : {
		organisation	:	"Uisko Nordic Oy",
		symbol			:	"&#xa9",
		year			:	"2014",
	}

}
