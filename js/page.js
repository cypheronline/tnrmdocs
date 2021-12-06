

window.onload = function() {

	var full_email_elems = {
		"container_element": full_email_container.id,
		"cc": output_cc_email_addrs, 
		"to": output_to_email_addrs,
		"cc": output_cc_email_addrs,
		"subject": output_subject,
		"body": output_email_body
	};

	for (key in full_email_elems) {
		full_email_elems[key].value = "";
	}

	let copyButtons = document.querySelectorAll(".copy_button");

	for (key in copyButtons) {
		if (!isNaN(key)) {
			let target_text_field = document.getElementById(copyButtons[key].getAttribute('for'));
			copyButtons[key].onclick = function(){ copy_text_to_clipboard(target_text_field) }
		}
	}


	///
	// Adding options to the "Region" dropdown
	///

	optregion.innerHTML = "";

	for (var i = 1; i <= 2; i++) {
		let optionAll = document.createElement("option");
		optionAll.value = "ALL-" + i;
		optionAll.innerHTML = "(" + i + ") All States & Union Territories";
		optregion.appendChild(optionAll);
	}


	for (var i in states) {
		let option = document.createElement("option");
		option.value = i;
		option.innerHTML = states[i];
		optregion.appendChild(option);
	}


	///
	// Reset all elements
	///

	function resetAll() {
		txtname.value = "";
		txtaddressline1.value = "";
		optregion.selectedIndex = 0;
		full_email_container.hidden = true;
		output.innerHTML = "";
		output_to_email_addrs.value = "";
		output_cc_email_addrs.value = "";
		output_subject.value = "";
		output_email_body.value = "";
	}

	function resetOutput() {
		output.innerHTML = "";
		full_email_container.hidden = true;
		output_to_email_addrs.value = "";
		output_cc_email_addrs.value = "";
		output_subject.value = "";
		output_email_body.value = "";
	}

	btn_submit.onclick = function() {
		generateLink(txtname, txtaddressline1, optregion, output, full_email_elems);
	}

	function keyDown() {
		this.setAttribute('data', this.value);
	}

	function keyUp() {
		let oldValue = this.getAttribute('data');
		if (oldValue != this.value)
			resetOutput();
	}
	
	function replaceWithDelimiter() {
		let elem = getToDelimiterSelector();
		let to_emails_field = document.getElementById(elem.getAttribute('for'));
		to_emails_field.value = to_emails_field.value.replaceAll(';', elem.value).replaceAll(',', elem.value);
	}

	for (selector of getToDelimiterSelectors()) {
		selector.onchange = function() { replaceWithDelimiter() };
		selector.onclick = function() { replaceWithDelimiter() };
	}

	/*inpcomma.onchange = function() {replaceWithDelimiter();}
	inpcomma.onclick = function() {replaceWithDelimiter();}
	inpsemicolon.onchange = function() {replaceWithDelimiter();}
	inpsemicolon.onclick = function() {replaceWithDelimiter();}*/
	txtname.onkeydown = keyDown;
	txtname.onkeyup = keyUp;
	txtaddressline1.onkeydown = keyDown;
	txtaddressline1.onkeyup = keyUp;
	optregion.onchange = resetOutput;
}
