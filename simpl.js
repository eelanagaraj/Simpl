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

function displayMainScreen () {
	var html = "";
	for (var i = 0; i < contacts.contact_info.length; i++) {
		html += '<li>'
		html += '<a href="#zoomcontact1">' // if necessary, change this to a specific name
		html += '<img src=' + contacts.contact_info[i].photo_file_path + ' />'
		html += '<h1>' + contacts.contact_info[i].name + '</h1>'
		html += '<p>' + contacts.contact_info[i].relation + '</p>' // maybe take this out if needbe, or add a condition
		html += '<div class="ui-li-aside"><a href="#zoomcontact1" data-role="button"> View Contact </a></div>'
		html += '</a></li>'
		// if (contacts.contact_info.display[i]) 
			// display phone/video? this may be for way later
	}
	$("#contact_list").append(html); 
	// save display ??
}


// render zoomed in contact page at #zoomedcontact1
function displayContactProfile (id_num) {
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
// TODO --> LINK ATTRIBUTE IN HTML to pass in ID and call this function when a view contact is clicked


/*  test html for adding contacts
<li>
						<a href="#zoomcontact1">
							<img src="images/02.jpg" />
							<h1>Homer Simpson</h1>
							<p>Son</p>
							<div class="ui-li-aside"> <a href="#zoomcontact1" data-role="button"> View Contact </a></div>							
						</a>
					</li>
					<li>
						<a href="#zoomcontact1">
							<img src="images/03.jpg" />
							<h1>Lisa Simpson</h1>
							<p>Granddaughter</p>
							<div class="ui-li-aside"> <a href="#zoomcontact1" data-role="button"> View Contact </a></div>
						</a>
					</li>				  
					<li>
						<a href="#zoomcontact1">
							<img src="images/04.jpg" />
							<h1>Marge Simpson</h1>
							<p>Daughter-in-Law</p>
							<div class="ui-li-aside"> <a href="#zoomcontact1" data-role="button"> View Contact </a></div>							
						</a>
					</li>
*/
$(function() {
	contacts = loadContacts();
	// to test
	addContact("Homer Simpson", "images/02.jpg", "Son", 5555555555, "hsimps@aol.com", 0);
	addContact("Lisa Simpson", "images/03.jpg", "Granddaughter", 5555555555, "lsimps@aol.com", 0);
	addContact("Marge Simpson", "images/04.jpg", "Daugher-in-law", 5555555555, "msimps@aol.com", 0);
	displayMainScreen();

});