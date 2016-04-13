// include all the JS helper functionality, data storage, etc.

// change fields if necessary ?? 
// display = binary array containing settings of younger user (email vs. text, etc.)
function addContact (name, photo_file_path, relation, phone_num, email_addr, display) {
	var id_num = contacts.contact_info.length;
	contacts.contact_info.push({id: id_num, name: name, photo_file_path: photo_file_path, 
		relation: relation, phone_num: phone_num, email_addr: email_addr, display: display});

	saveContacts();

	// make sure the contact list html is updated
	var html = getContactListHTML(id_num);
	var zoomhtml = getZoomPageHTML(id_num);
	$("#contact_list").append(html);
	$("#contact_list").listview('refresh');
	$("body").append(zoomhtml);
}

/* adding contacts for comfort setting 1 */
function popupAddContact() {
	// parse all info from the pop-up fields
	var name = $("#popup_name").text();
	var relation = $("#popup_relation").text();
	var photo_src = $("#popup_photo").attr('src');
	var phone_num = stringToNum($("#popup_number").text())
	var email = $("#popup_email").text().split(" ")[1]
	addContact (name, photo_src, relation, phone_num, email, 1);
}


/* helper function to stringify any passed in numbers/string numbers
	PLEASE USE THIS TO FORMAT ANY STRING PHONE NUMBERS FOR CONSISTENCY */
function formatPhoneNumber (num) {
	var formatted_num = "";
	// if already a string, clean out any non-numbers for more standardized formatting
	if (typeof(num) != "number") {
		num = stringToNum(num);
	}
	// make a pure number into a string version, so one process for formatting
	else {
		num = num.toString();
	}

	// format num as (xxx) xxx - xxxx
	if (num.length == 10) {
		formatted_num = '(' + num.substring(0,3) + ') ' + num.substring(3,6) + ' - ' + num.substring(6,10)
	}
	// US country code included 
	else if (num.length == 11 && num[0]=="1") {
		formatted_num = num[0] + ' (' + num.substring(1,4) + ') ' + num.substring(4,7) + ' - ' + num.substring(7,11)
	}
	// format as +#..# - ### - ### - ####
	else {
		// handle varying country code lengths, zero-indexed
		var end_index = ((num.length - 4) % 3);
		if (end_index == 0) {
			end_index += 3;
		}
		var start_index = 0;
		formatted_num += "+"
		while (start_index < num.length - 4) {
			formatted_num += num.substring(start_index, end_index) + ' - ';
			start_index = end_index;
			end_index += 3;
		}
		formatted_num += num.substring(start_index, num.length);
	}
	return formatted_num;

}


/* function that will change the fields of the contact popup*/
function renderPopupRequest (name, relation, photo_src, phone_num, email) {
	$("#popup_name").html(name);
	$("#popup_relation").html(relation);
	$("#popup_photo").html(photo_src);
	//$("#popup_number").html(phone_num);
	// need to parse phone number first
	var email_str = "Email: " + email
	$("$#popup_email").html(email_str);
}



/* turns number of format (###) ### - #### to 
	#########, code from StackOverflow (see acknowledgements) */
function stringToNum (stuff){
	return (stuff.replace(/\D/g,''));
}


/* for comfort setting 2 */
function userAddContact () {
	var name = $("#new_name_field").val();
	// relation = --> figure out how to get the radio button form input
	var default_pic = "woman.png"
	//addContact(name, default_pic, relation, phone_num, email_addr, display);
}


/* helper function to prevent spelling errors, ensure consistency??? */
function getRelation (rel_code) {
	var rels = ["Mother", "Father", "Daughter", "Son", "Granddaughter", "Grandson", "Cousin", "Friend"];
	return rels[rel_code]
}


/* function that saves contact list to html5 local storage*/
function saveContacts () {
	if (typeof(Storage) !== "undefined") {
		// store the most contacts state
		localStorage.setItem("contacts", JSON.stringify(contacts));
	}
	else {
		// need a backup plan !!!
		document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
	}
}


/* loads contacts stored in html5 local storage if it exists
	or if it does not exist, creates new contact list. */
function loadContacts () {
	var stuff = JSON.parse(localStorage.getItem("contacts"));
	// make sure not null, if no contacts
	return stuff ? stuff : {contact_info:[]}
}

/* simple helper that returns a contact given id_number */
function getContact (id_num) {
	return contacts.contact_info[id_num];
}

/* helper function that returns the html string of the header */
function getStringHeader () {
	var html = ""
	html += '<div class ="ui-header ui-bar-a" data-swatch="a" data-theme="a" data-form = "ui-bar-a" data-role = "header" role= "banner">'
	html += '<a href="#home" class= "ui-btn-left ui-btn-corner-all ui-btn ui-icon-back ui-btn-icon-notext ui-shadow" title="Back" data-form = "ui-icon" data-role= "button" role= "button"></a>'
	html += '<hi href="#home" class = "ui-title" tabindex = "0" role="heading" aria-level = "1"> SIMPL </h1>'
	html += '<a href="#inbox" class = "ui-btn-right ui-btn-corner-all ui-btn ui-icon-mail ui-btn-icon-notext ui-shadow" title="Inbox" data-form="ui-icon" data-role = "button" role= "button"></a>'
	html += '</div>'
	return html
}


/* helper function that adds a contact to the main display list*/
function getContactListHTML (id) {
	var html = "";
	html += '<li class="ui-li-has-thumb ui-first-child">'
	html += '<a href="#zoomcontact' + id+ '">'
	html += '<img src=' + contacts.contact_info[id].photo_file_path + ' />'
	html += '<h1>' + contacts.contact_info[id].name + '</h1>'
	html += '<p>' + contacts.contact_info[id].relation + '</p>' // maybe take this out if needbe, or add a condition/make it optional
	html += '<div class="ui-li-aside"><a href="#zoomcontact' + id + '" data-role="button"> View Contact </a></div>' 
	html += '</a></li>'
	//$("#contact_list").append(html);
	return html;

}


/* helper function that creates zoom pages for a contact id=i*/
function getZoomPageHTML(id) {
	var zoomhtml = "";
	zoomhtml += '<div data-role="page" id="zoomcontact' + id + '">';
	zoomhtml += getStringHeader();
	zoomhtml += '<div class="zoom_profile" data-role="content">'
	zoomhtml += '<div class="zoom_heading ui-title" data-role="header"><h3>' + contacts.contact_info[id].name + '</h3></div>'
	zoomhtml += '<div><img src=' + contacts.contact_info[id].photo_file_path + ' alt="profile picture" style="width: 80%;"></div>'
	zoomhtml += '<ui data-role="listview">'
	zoomhtml += '<li><a href="#call" class="ui-btn ui-icon-phone ui-btn-icon-left"><h3>Call</h3></a></li>'
	zoomhtml += '<li><a href="#video" class="ui-btn ui-icon-video ui-btn-icon-left"><h3>Video Call</h3></a></li>'
	zoomhtml += '<li><a href="#message" class="ui-btn ui-icon-mail ui-btn-icon-left"><h3>Message</h3></a></li>'
	zoomhtml += '</ui></div></div>'
	return zoomhtml;
	//$("body").append(zoomhtml);
}


/* initializes Simpl contacts list and creates necessary zoom pages*/
function initializeSimpl () {
	var html = "";
	var zoomhtml = "";

	// for testing only!! --> the buttons for popup and add new contact
	html += '<li><a href="#contact_popup" data-transition="pop" data-rel="dialog">New Contact Request Popup Test </a></li>'
	html += '<li><a href="#add_contact"> Add Contact (Setting 2) Test </a></li>'

	for (var i = 0; i < contacts.contact_info.length; i++) {
		html += getContactListHTML(i);
		zoomhtml += getZoomPageHTML(i);
		// if (contacts.contact_info.display[i]) 
			// display phone/video? this may be for way later
	}
	$("#contact_list").html(html);
	$("body").append(zoomhtml);
}


/* DEFUNCT DO NOT USE, USE addZoomPage!!
	if time: modify to render zoomed-in contact page at #zoomedcontact1 
	to conserve resources, not write obscenely huge html files*/
function displayContactProfile () {
	console.log($(this).attr("data-index"));
	id_num = $(this.attr("data-index"));
	var html = ""
	html += '<div class="zoom_heading ui-title" data-role="header"><b>'
	html += contacts.contact_info[id_num].name + '</b></div>'
	html += '<div><img src=' + contacts.contact_info[id_num].photo_file_path + ' alt="profile picture" style="width: 70%;"></div>'
	html += '<ui data-role="listview" class= "ui-listview">'
	html += '<li><a href="#call" class="ui-btn ui-icon-phone ui-btn-icon-left">Call</a></li>'
	html += '<li><a href="#video" class="ui-btn ui-icon-video ui-btn-icon-left">Video Call</a></li>'
	html += '<li><a href="#message" class="ui-btn ui-icon-mail ui-btn-icon-left">Message</a></li></ui>'
	$("#zoomed_info").html(html);
		// change the html stored at that page any time a contact is clicked 
		// link every contact to that same page though, but change info displayed at that location
}

$(function() {
	contacts = loadContacts();
	// for testing : 
	//addContact("Homer Simpson", "images/02.jpg", "Son", 5555555555, "hsimps@aol.com", 0);
	//addContact("Lisa Simpson", "images/03.jpg", "Granddaughter", 5555555555, "lsimps@aol.com", 0);
	//addContact("Marge Simpson", "images/04.jpg", "Daugher-in-law", 5555555555, "msimps@aol.com", 0);
	initializeSimpl();
});