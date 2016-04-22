// include all the JS helper functionality, data storage, etc.


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~USER CONTACT FUNCTIONLITY ~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
 
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


// for web app --> create web_app page; have that page allow user to fill in fields, "FB verify" and then sends popup request which will show up 


/* turns number of format (###) ### - #### to 
	#########, code from StackOverflow (see acknowledgements) */
function stringToNum (stuff){
	return (stuff.replace(/\D/g,''));
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


/* for comfort setting 2 */
function userAddContact () {
	var name = $("#new_name_field").val();
	var phone_num = formatPhoneNumber($("#add_contact_number").val());
	var email_addr = $("#new_email_field");
	// handle no relation being selected
	var relation = $('input[name=radio-choice-h-2]:checked').val()
	if (!relation) {
		relation = "";
	}
	var default_pic = "images/01.jpg"

	addContact(name, default_pic, relation, phone_num, email_addr, 1);
}

/* reset adding contact text fields */
function clearAddContactFields () {
	$("#new_name_field").val("");
	$("#add_contact_number").val("");
	$("#new_email_field").val("");  
	$('input[name=radio-choice-h-2]').removeAttr('checked');
}


/* helper function to prevent spelling errors, ensure consistency??? */
function getRelation (rel_code) {
	var rels = ["Mother", "Father", "Daughter", "Son", "Granddaughter", "Grandson", "Cousin", "Friend"];
	return rels[rel_code]
}


/* function that saves contact list to html5 local storage*/
function saveContacts () {
	if (typeof(Storage) !== "undefined") {
		// store the most recent contacts state
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
	// if null
	var starter_pack = {contact_info: 
		[{id: 0, name: "Eela Nagaraj", photo_file_path:"images/eela.png", relation: "Granddaughter", phone_num: "6507966950", email_addr: "eelanagaraj@gmail.com", display:0},
		 {id: 1, name: "Charlene Hwang", photo_file_path:"images/charlene.png", relation: "Granddaughter", phone_num: "7146582560", email_addr:" charlenehwang@college.harvard.edu", display:0},
		 {id: 2, name: "Bowen Guo", photo_file_path:"images/bowen.png", relation: "Grandson", phone_num:"8574988899", email_addr:"bog13@gmail.com", display:0}
		]}
	return stuff ? stuff : starter_pack
}


/* simple helper that returns a contact given id_number */
function getContact (id_num) {
	return contacts.contact_info[id_num];
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~REMOTE USER ADD CONTACT~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* function that will change the fields of the contact popup*/
function renderPopupRequest (name, relation, photo_src, phone_num, email) {
	$("#popup_name").html(name);
	$("#popup_relation").html(relation);
	$("#popup_photo").html(photo_src);
	var phone_str = "Phone: " + formatPhoneNumber(phone_num);
	$("#popup_number").html(phone_str);
	var email_str = "Email: " + email;
	$("#popup_email").html(email_str);
}


/* on submit, render the popup request, then clear the remote user form fields*/
function sendRequest () {
	var name = $("#input_name").val();
	var phone_num = $("#input_phonenum").val();
	var email_addr = $("#input_email").val();
	var relation = $("#input_relation").val();
	//note does not actually render image (would need backend)
	var file_path = $("#input_photo_file").val();
	renderPopupRequest (name, relation, file_path, phone_num, email_addr);
}

/* reset web interface fields */
function clearWebInterfaceFields() {
	$("#input_name").val("");
	$("#input_phonenum").val("");
	$("#input_email").val("");
	$("#input_relation").val("");
	$("#input_photo_file").val("");
}



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~MESSAGE SAVING FUNCTIONALITY~~~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* loads all sent and received messages stored in local storage
	if it exists, or if it does not exist, creates new message threads */
function testerMessages () {
	var eelamsg = "Dear grandma, miss you lots! How are you doing? Hope everything is fine with you! I have been doing well and am enjoying school a lot, though I really can't wait until the next time I get to visit you! Love, Eela"
	var charlenemsg = "Hi! can't wait to see you the next time I visit! How are you doing? Can you give me a call sometime in the near future? I really do miss you and would love to talk to you very soon! Miss you lots! xoxo Charlene"
	var bowenmsg = "Hello! How are you doing? Hope everything is fine with you! I have been doing well and am enjoying school a lot, though I really can't wait until the next time I get to visit you! -Bowen"
	var now1 = (new Date ()).toDateString();
	var now2 = (new Date ()).toDateString();
	var now3 = (new Date ()).toDateString();
	return [{message_r_id: 0, date_time: now3, read: false, from: 0, content: eelamsg}, {message_r_id: 1, date_time: now2, read: false, from: 1, content: charlenemsg}, {message_r_id: 2, date_time: now1, read: true, from: 2, content: bowenmsg}]
}


function loadMessages () {
	var stuff = JSON.parse(localStorage.getItem("messages"));
	// make sure not null, and if so create new threads
	var starter_pack = testerMessages()

	return stuff ? stuff : {sent: [], received: starter_pack}
}


/* helper function for saving messages */
function saveMessages () {
	if (typeof(Storage) !== "undefined") {
		// store messages database
		localStorage.setItem("messages", JSON.stringify(messages));
	}
	else {
		// not supported
		document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
	}
}

/* helper function for calculator delete button,
	returns string with last character truncated */
function stringOneShorter (str) {
	return (str.length) ? (str.slice(0,-1)) : str;
}


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~FORM VALIDATION~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

//TODO

// WEB INTERFACE VALIDATION

// SUPER USER VALIDATION 


// SETTING 2 ADD CONTACT VALIDATION


/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~HTML PAGE RENDERING~~~~~~~~~~~~ */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */


/* helper function that returns the html string of the header */
function getStringHeader () {
	var html = ""
	html += '<div class ="ui-header ui-bar-a" data-swatch="a" data-theme="a" data-form = "ui-bar-a" data-role = "header" role= "banner" data-add-back-btn="true" data-rel="back">'
	html += '<a href="#home" class= "ui-btn-left ui-btn-corner-all ui-btn ui-icon-back ui-btn-icon-notext ui-shadow" title="Back" data-form = "ui-icon" data-role= "button" role= "button"></a>'
	html += '<hi href="#home" class = "ui-title" tabindex = "0" role="heading" aria-level = "1"><a href="#home">SIMPL</a></h1>'
	html += '<a href="#inbox" class = "ui-btn-right ui-btn-corner-all ui-btn ui-icon-mail ui-btn-icon-notext ui-shadow" title="Inbox" data-form="ui-icon" data-role = "button" role= "button"></a>'
	html += '</div>'
	return html
}


//NOTE : to get all messages chronologically, just go in order of incr id num
// getting all messages by person (thread) would require also adding to a separate
// database, indexed by "whom", perhaps with a hash value for each new person...algorithmically more complex!!

/* makes sure the functionality pages are properly linked from zoommed page */
function updateFunctionPages (id) {
	var calling_label = "Calling " + contacts.contact_info[id].name;
	var zoompage = "#zoomcontact" + id;
	var html = '<img src="' + contacts.contact_info[id].photo_file_path
	html += '" style="width: 80%" align="middle">'
	var endcallhtml = '<a href=' + zoompage + ' data-theme="b" <h1>End Call</h1></a>'
	var message_html = '<h2>To: ' + contacts.contact_info[id].name + '</h2>'
	var on_send = '<a href="#sent" onclick="textMessage(' + id +')" class="ui-btn">Send</a>'
	$("#messageto").html(message_html);
	$(".who_calling").html(calling_label);
	$(".call_image").html(html);
	$(".endCall").attr("href",zoompage);
	$("#backto").attr("href", zoompage);
	$("#send_btn").html(on_send);
	$("#backto").attr("href", zoompage);
	clearMessageFields();
	// update message linking pages
}


/* helper function that returns contact html to the main display list*/
function getContactListHTML (id) {
	var html = "";
	html += '<h2 class="contact-list-name">' + contacts.contact_info[id].name + '</h2>'
	html += '<li class="ui-li-has-thumb ui-first-child">'
	html += '<h3>' + contacts.contact_info[id].relation + '</h3>' // maybe take this out if needbe, or add a condition/make it optional
	html += '<a class="bigiconfont" href="#zoomcontact' + id +  '" onclick="updateFunctionPages(' + id + ')">'
	html += '<img src=' + contacts.contact_info[id].photo_file_path + ' />'
	html += '<div class="meep" onclick="deleteContact(id)">Delete</div>'
	html += '</a></li>'
	//$("#contact_list").append(html);
	return html;

}


function deleteContact(id){
	var p = id.parentNode;
	p.parentNode.removeChild(p);
	saveContacts();
}


/* helper function that creates zoom pages for a given contact id */
function getZoomPageHTML(id) {
	var zoomhtml = "";
	zoomhtml += '<div data-role="page" id="zoomcontact' + id + '">';
	zoomhtml += getStringHeader();
	zoomhtml += '<div class="zoom_profile" data-role="content">'
	zoomhtml += '<div class="zoom_heading" data-role="header"><center><h2><b>' + contacts.contact_info[id].name + '</b></h2></center></div>'
	zoomhtml += '<div><center><img src=' + contacts.contact_info[id].photo_file_path + ' alt="profile picture" style="width: 70%;"></center></div>'
	zoomhtml += '<ui data-role="listview">'
	zoomhtml += '<li><a href="#call" onclick="callClockVoice()" class="bigiconfont ui-btn ui-icon-phone ui-btn-icon-left"><h2><b>Call</b></h2></a></li>'
	zoomhtml += '<li><a href="#video" onclick="callClock1()" class="bigiconfont ui-btn ui-icon-video ui-btn-icon-left"><h2><b>Video Call</b></h2></a></li>'
	zoomhtml += '<li><a href="#message" onclick="clearMessageFields()" class="bigiconfont ui-btn ui-icon-mail ui-btn-icon-left"><h2><b>Message</b></h2></a></li>'
	zoomhtml += '</ui></div></div>'
	return zoomhtml;
	//$("body").append(zoomhtml);
}



/* initializes Simpl contacts list and creates necessary zoom pages*/
function initializeSimpl () {
	var html = "";
	var zoomhtml = "";

	html += '<li><a href="#web_user_interface" onclick="clearWebInterfaceFields()"> Younger User Web Interface </a></li>'

	for (var i = 0; i < contacts.contact_info.length; i++) {
		html += getContactListHTML(i);
		zoomhtml += getZoomPageHTML(i);
		// if (contacts.contact_info.display[i]) 
			// display phone/video? this may be for way later
	}
	$("#contact_list").html(html);
	$("body").append(zoomhtml);
}



$(function() {
	$.mobile.page.prototype.options.backBtnTheme = "a";
	contacts = loadContacts();
	messages = loadMessages();

	builtInClock1 = 0;
	// is this necessary? why getting initialization error?!?! refresh on listview...
	$(document).ready (function () {
		initializeSimpl();
		renderInbox() });
});
