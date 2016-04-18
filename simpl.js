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
	return stuff ? stuff : {contact_info:[]}
}


/* simple helper that returns a contact given id_number */
function getContact (id_num) {
	return contacts.contact_info[id_num];
}


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


/* ~~~~MESSAGE SAVING FUNCTIONALITY~~~~ */


/* loads all sent and received messages stored in local storage
	if it exists, or if it does not exist, creates new message threads */
function loadMessages () {
	var stuff = JSON.parse(localStorage.getItem("messages"));
	// make sure not null, and if so create new threads
	return stuff ? stuff : {sent: [], received: []}
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


/* helper functionality for saving a string
	to messages.sent (1) or messages.received (0)
	mark received messages as not read initially 
	~~whom field is an id number~~ */
function addMessage (sent, whom, text) {
	var id_num;
	var now = new Date ();
	if (sent) {
		id_num = messages.sent.length;
		messages.sent.push({message_s_id: id_num, date_time: now, to: whom, content: text});
	}
	else {
		id_num = messages.received.length;
		messages.received.push({message_r_id: id_num, date_time: now, read: false, from: whom, content: text});
	}
}


// TODO: test this
/*  dynamically displaying messages in the inbox; account for unread vs. read */
function renderInbox() {
	var html = ""
	var id_num;
	var name;
	var date_time;
	var img_path;
	var is_read;
	for (var i = 0; i < messages.received.length; i++) {
		id_num = messages.received[i].from;
		name = contacts.contact_info[id_num].name;
		img_path = contacts.contact_info[id_num].photo_file_path;
		date_time = messages.received[i].date_time;
		is_read = messages.received[i].read;
		html += '<li><img src="' + img_path + '"><div data-role="header">'
		if (is_read) {
			html += 'Read'
		}
		else {
			html += 'Unread'
		}
		html += '</div><div>From: ' + name + '</div><div>' + date_time + '</div>'
		html += '<div><a href="#view_message" onclick="viewMessage(' + i + ')" data-role="button">View Message</a></div></li>'
	}
	$("#message_list").html(html);
	$("#message_list").listview('refresh');

}


/* 	<div id="message_display" data-role="content">
		<div>
			<h2> From: Sally Smith </h2>
			<h2> Date: April 4, 2016 </h2>
		</div>
		<div class="big-font-text">
			<p> Dear grandma, </p>
			<p> Miss you lots! Please call me when you get the chance. I have done so many cool things and I really can't wait to tell you all about them! I have seriously been doing just the coolest things ever. So many words I love writing words so much, really they are just fascinating. So many words I love writing words so much, really they are just fascinating. So many words I love writing words so much, really they are just fascinating. How are you? How is everything going? I hope to see you very soon! </p>
			<p> Sincerely, </p>
			<p> Mary Smith </p>
		</div>
		<div> <a href="#message" onClick="updateFunctionPages(' + id + ')" data-role="button">Reply</a></div>
	</div>
	*/

// another function to view a message; mark as read if 
// test this
function viewMessage (message_id) {
	var id = messages.received[message_id].from
	var name = contacts.contact_info[id].name
	var date = messages.received[message_id].date_time
	var message_content = messages.received[message_id].content
	var	html = '<div><h2>From: ' + name + '</h2>'
	html += '<h2>Date: ' + date + '</h2></div>'
	html += '<div class="big-font-text">' + message_content + '</div>'
	html += '<div><a href="#message" onClick="updateFunctionPages(' + id + ')" data-role="button">Reply</a></div>'
	$("#message_display").html(html)
	messages.received[message_id].read = true;
	renderInbox();
}

/* should happen on click of send button*/

function textMessage(id) {
	var words_n_stuff = $("#text_to_send").val()
	addMessage(1, id, words_n_stuff);
	$("#sent_text").val(words_n_stuff);
	saveMessages();
	clearMessageFields();
}

function clearMessageFields () {
	$("#text_to_send").val("");
	$("#sent_text").val("");
}

//NOTE : to get all messages chronologically, just go in order of incr id num
// getting all messages by person (thread) would require also adding to a separate
// database, indexed by "whom", perhaps with a hash value for each new person...algorithmically more complex!!


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
	html += '<li class="ui-li-has-thumb ui-first-child">'
	html += '<a href="#zoomcontact' + id +  '" onclick="updateFunctionPages(' + id + ')">'
	html += '<img src=' + contacts.contact_info[id].photo_file_path + ' />'
	html += '<h1>' + contacts.contact_info[id].name + '</h1>'
	html += '<p>' + contacts.contact_info[id].relation + '</p>' // maybe take this out if needbe, or add a condition/make it optional
	html += '<div class="ui-li-aside"><a href="#zoomcontact' + id + '" data-role="button" onClick="updateFunctionPages(' + id + ')">View</a></div>' 
	html += '</a></li>'
	//$("#contact_list").append(html);
	return html;

}


function callClock1() {
	var secs1 = 0;
	var mins1 = 0;
	document.getElementById("secs1").innerText = secs1;
	document.getElementById("mins1").innerText = mins1;
	if (builtInClock1) {
		clearInterval(builtInClock1);
	}
	builtInClock1 = setInterval(function() {
		secs1 ++;
		modsecs = secs1 % 60;
		document.getElementById("secs1").innerText = modsecs;
		if (! (modsecs)) {
			mins1++;
			document.getElementById("mins1").innerText = mins1;
		}
	}, 1000);
}


function callClockVoice () {
	var secs1 = 0;
	var mins1 = 0;
	document.getElementById("c_secs").innerText = secs1;
	document.getElementById("c_mins").innerText = mins1;
	if (builtInClock1) {
		clearInterval(builtInClock1);
	}
	builtInClock1 = setInterval(function() {
		secs1 ++;
		modsecs = secs1 % 60;
		document.getElementById("c_secs").innerText = modsecs;
		if (! (modsecs)) {
			mins1++;
			document.getElementById("c_mins").innerText = mins1;
		}
	}, 1000);
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
	//zoomhtml += '<li><a href="tel:' + Number(stringToNum(contacts.contact_info[id].phone_num))
	//zoomhtml += '" data-role="button" rel="external" class="ui-btn ui-icon-phone ui-btn-icon-left"><h3>Call</h3></a></li>'
	zoomhtml += '<li><a href="#call" onclick="callClockVoice()" class="ui-btn ui-icon-phone ui-btn-icon-left"><h3>Call</h3></a></li>'
//	zoomhtml += '<li><a href="#call" class="ui-btn ui-icon-phone ui-btn-icon-left"><h3>Call</h3></a></li>'
	zoomhtml += '<li><a href="#video" onclick="callClock1()" class="ui-btn ui-icon-video ui-btn-icon-left"><h3>Video Call</h3></a></li>'
	zoomhtml += '<li><a href="#message" onclick="clearMessageFields()" class="ui-btn ui-icon-mail ui-btn-icon-left"><h3>Message</h3></a></li>'
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
	html += '<li><a href="#add_contact" onclick="clearAddContactFields()"> Add Contact (Setting 2) Test </a></li>'

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
	$.mobile.page.prototype.options.backBtnTheme = "a";
	contacts = loadContacts();
	messages = loadMessages();
	// test
	stuff = "Dear grandma, Miss you lots! Please call me when you get the chance. I have been doing lots and lots of super fun and amazing things wow is life not super great wowowowowwo"
	stuff2= "Hey grammy, I have done so many cool things and I really can't wait to tell you all about them!"
	builtInClock1 = 0;
	// for testing : 
	//addContact("Homer Simpson", "images/02.jpg", "Son", 5555555555, "hsimps@aol.com", 0);
	//addContact("Lisa Simpson", "images/03.jpg", "Granddaughter", 5555555555, "lsimps@aol.com", 0);
	//addContact("Marge Simpson", "images/04.jpg", "Daugher-in-law", 5555555555, "msimps@aol.com", 0);
	addMessage (false, 1, stuff);
	addMessage (false, 2, stuff2);

	initializeSimpl();
	renderInbox();
});
