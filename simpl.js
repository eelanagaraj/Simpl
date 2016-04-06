// include all the JS helper functionality, data storage, etc.

// change fields if necessary ?? 
// display = binary array containing settings of younger user (email vs. text, etc.)
function addContact (id_num, name, photo, phone_num, email_addr, display) {
	contacts.contact_info.push({id: id_num, name: name, photo: photo, phone_num: phone_num, email_addr: email_addr, display: display});
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
		// TODO
		// use Charlene's designed UI, but construct dynamically using stored contacts

		// if (contacts.contact_info.display[i]) 
			// display phone/video? this may be for way later
	}
}

function displayContactProfile (id_num) {
	html = ""
	contact = getContact(id_num);
	// html to display the contact zoomed in
	// add to the page html maybe? 
		//--> one possibility, have a single page for the zoomed in contact in the index
		// change the html stored at that page any time a contact is clicked 
		// link every contact to that same page though, but change info displayed at that location
		// much less costly and space-efficient than rendering and linking a billion pages??
}

$(function() {
	contacts = loadContacts();
//	displayMainScreen();

});