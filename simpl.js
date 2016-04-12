// include all the JS helper functionality, data storage, etc.

// change fields if necessary ?? 
// display = binary array containing settings of younger user (email vs. text, etc.)
function addContact (name, photo_file_path, relation, phone_num, email_addr, display) {
	id_num = contacts.contact_info.length
	contacts.contact_info.push({id: id_num, name: name, photo_file_path: photo_file_path, 
		relation: relation, phone_num: phone_num, email_addr: email_addr, display: display});
}

//prevent spelling errors, ensure consistency???
function getRelation (rel_code) {
	rels = ["Mother", "Father", "Daughter", "Son", "Granddaughter", "Grandson", "Cousin", "Friend"];
	return rels[rel_code]
}


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

function loadContacts () {
	stuff = JSON.parse(localStorage.getItem("contacts"));
	// make sure not null, if no contacts
	return stuff ? stuff : {contact_info:[]}
}


function getContact (id_num) {
	return contacts.contact_info[id_num];
}


function get_string_header () {
	html = ""
	html += '<div class ="ui-header ui-bar-a" data-swatch="a" data-theme="a" data-form = "ui-bar-a" data-role = "header" role= "banner">'
	html += '<a href="#home" class= "ui-btn-left ui-btn-corner-all ui-btn ui-icon-back ui-btn-icon-notext ui-shadow" title="Back" data-form = "ui-icon" data-role= "button" role= "button"></a>'
	html += '<hi href="#home" class = "ui-title" tabindex = "0" role="heading" aria-level = "1"> SIMPL </h1>'
	html += '<a href="#inbox" class = "ui-btn-right ui-btn-corner-all ui-btn ui-icon-mail ui-btn-icon-notext ui-shadow" title="Inbox" data-form="ui-icon" data-role = "button" role= "button"></a>'
	html += '</div>'
	return html
}

function initializeSimpl () {
	var html = "";
	for (var i = 0; i < contacts.contact_info.length; i++) {
		html += '<li>'
		html += '<a href="#zoomcontact' + i+ '">' // if necessary, change this to a specific name --> ADD onclick="displayContactInfo()"
		html += '<img src=' + contacts.contact_info[i].photo_file_path + ' />'
		html += '<h1>' + contacts.contact_info[i].name + '</h1>'
		html += '<p>' + contacts.contact_info[i].relation + '</p>' // maybe take this out if needbe, or add a condition
		html += '<div class="ui-li-aside"><a href="#zoomcontact' + i + '" data-role="button"> View Contact </a></div>' // --> ADD onclick="displayContactInfo()"
		html += '</a></li>'
		addZoomPage(i);
		// if (contacts.contact_info.display[i]) 
			// display phone/video? this may be for way later
	}
	$("#contact_list").append(html); 
	// add new pages for #zoomcontacti
	// save display ??
}

function addZoomPage(i) {
	zoomhtml = "";
	zoomhtml += '<div data-role="page" id="zoomcontact' + i + '">';
	zoomhtml += get_string_header();
	zoomhtml += '<div class="zoom_profile" data-role="content">'
	zoomhtml += '<div class="zoom_heading ui-title" data-role="header"><b>' + contacts.contact_info[i].name + '</b></div>'
	zoomhtml += '<div><img src=' + contacts.contact_info[i].photo_file_path + ' alt="profile picture" style="width: 70%;"></div>'
	zoomhtml += '<ui data-role="listview">'
	zoomhtml += '<li><a href="#call" class="ui-btn ui-icon-phone ui-btn-icon-left">Call</a></li>'
	zoomhtml += '<li><a href="#video" class="ui-btn ui-icon-video ui-btn-icon-left">Video Call</a></li>'
	zoomhtml += '<li><a href="#message" class="ui-btn ui-icon-mail ui-btn-icon-left">Message</a></li>'
	zoomhtml += '</ui></div></div>'
	$("body").append(zoomhtml);
}



// render zoomed in contact page at #zoomedcontact1
function displayContactProfile (id_num) {
	console.log($(this).attr("data-index"));
	id_num = $(this.attr("data-index"));
	html = ""
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
	// to test
	//addContact("Homer Simpson", "images/02.jpg", "Son", 5555555555, "hsimps@aol.com", 0);
	//addContact("Lisa Simpson", "images/03.jpg", "Granddaughter", 5555555555, "lsimps@aol.com", 0);
	//addContact("Marge Simpson", "images/04.jpg", "Daugher-in-law", 5555555555, "msimps@aol.com", 0);
	initializeSimpl();
});