

window.onload = function() {

	var full_email_elems = {
		"container_element": full_email_container.id, 
		"to": output_to_email_addrs,
		"cc": output_cc_email_addrs,
		"subject": output_subject,
		"body": output_email_body
	};

	for (key in full_email_elems) {
		full_email_elems[key].value = "";
	}

	// var optRegion = document.getElementById("optregion");
	optregion.innerHTML = "";

	for (var i in states) {
		let option = document.createElement("option");
		option.value = i;
		option.innerHTML = states[i];
		optregion.appendChild(option);
	}

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

	txtname.onkeydown = keyDown;
	txtname.onkeyup = keyUp;
	txtaddressline1.onkeydown = keyDown;
	txtaddressline1.onkeyup = keyUp;
	optregion.onchange = resetOutput;
}