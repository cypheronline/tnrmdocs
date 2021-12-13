
function getEmailIdsByKeyRange(mail_ids_by_region, start_key, end_key) {
	let mail_ids_subset = {};
	let count = 0;
	for(region_code in mail_ids_by_region) {
		if (region_code == start_key)
			count++;
		if (count>0)
			mail_ids_subset[region_code] = mail_ids_by_region[region_code];
		if (region_code == end_key)
			break;
	}
	return mail_ids_subset;
}


function printEmail(full_email, full_email_elems) {

	if(full_email_elems['container_element'] != undefined) {
		let container = document.getElementById(full_email_elems['container_element']);
		container.hidden = false;
	}

	let to_delim = getToDelimiterSelector();
	full_email['to'] = full_email['to'].replaceAll(';', to_delim.value).replaceAll(',', to_delim.value);

	for (key in full_email) {
		full_email_elems[key].value = full_email[key];
	}
}


/****
 * Generate link(s) based on the input
****/
function generateLink(txt_name, txt_address_line1, opt_region, output_elem, full_email_elems){
	
	let container = document.getElementById(full_email_elems['container_element']);
	container.hidden = true;

	var form1 = document.getElementById("form1");
	if (!form1.checkValidity()) {
		form1.reportValidity();
		throw exception("Check inputs!!")
	}
	
	output_elem.innerHTML = "";

	var selected_regn_code = opt_region.value;

	var cc = "TNRMLETTER2COLLECTORS@GMAIL.COM";

	
	for (lang in languages) {
		try {
			
			let full_email = {};
			full_email['to'] = to[selected_regn_code];
			selected_region_code = (selected_regn_code.search("ALL")>=0) ? "ALL" : selected_regn_code;

			var body = decodeURIComponent(
			((selected_region_code in bodyEncoded) ? bodyEncoded[selected_region_code][lang] : bodyEncoded["OTHERS"][lang]).replaceAll('+', '%20'));
			
			body = body.replaceAll('<<Name>>', txt_name.value).replaceAll('<<AddressLine1>>', txt_address_line1.value).replaceAll('<<STATE>>', states[selected_region_code].toUpperCase());

			let link_href = "mailto:" + encodeURIComponent(full_email['to']) + "?" + "cc=" + encodeURIComponent(cc) + "&" + "subject=" + encodeURIComponent(subjectsByLang[lang]) + "&" + "Content-type=text/html" + "&" + "body=" + encodeURIComponent(body);
			full_email['cc'] = cc;
			
			full_email['subject'] = subjectsByLang[lang];
			full_email['body'] = body;

			let link = document.createElement("a");
			link.id = "lnk" + lang;
			link.href = "#" + link.id;
			link.onclick = function() {
				if(confirm("Do you want to open the email App?"))
					window.location = link_href;
				printEmail(full_email, full_email_elems);
			};
			
			link.innerHTML = linkCaptionsByLang[lang];
			output_elem.appendChild(link);
			output_elem.appendChild(document.createElement("br"));
			output_elem.appendChild(document.createElement("br"));
		}
		catch(err){
			console.log("Content not found in " + languages[lang] + " for " + states[selected_region_code]);
		}
	}


}


// Email subject by language
var subjectsByLang = {
	
	"EN":"Request under Section 76 of the Evidence Act to provide supporting documents for the deprivation of my life and liberty.",

	"TA": "எனது வாழ்வு மற்றும் சுதந்திரம் பறிக்கப்பட்டதற்கான ஆதார ஆவணங்களை வழங்க சாட்சிய சட்டம் பிரிவு 76 ன் படி கோருதல்.",
	
	"ML": "എന്റെ ജീവിതത്തിനും സ്വാതന്ത്ര്യത്തിനും ഹാനികരമായ അനുബന്ധ രേഖകൾ നൽകാൻ ഇന്ത്യൻ എവിഡൻസ് ആക്ട് സെക്ഷൻ 76 പ്രകാരം അടിയന്തിര അപേക്ഷ.",

	"KN": "ಸಾಕ್ಷ್ಯ ಕಾಯಿದೆಯ ಸೆಕ್ಷನ್ 76 ರ ಅಡಿಯಲ್ಲಿ ನನ್ನ ಜೀವನ ಮತ್ತು ಸ್ವಾತಂತ್ರ್ಯವನ್ನು ಹರಿಸುವುದಕ್ಕೆ ಪೂರಕ ದಾಖಲೆಗಳನ್ನು ನೀಡಲು ವಿನಂತಿ.",

	"TE": "సాక్ష్యాధారాల చట్టంలోని సెక్షన్ 76 ప్రకారం నా జీవితం మరియు స్వేచ్ఛను హరించడానికి సహాయక పత్రాలను అందించమని అభ్యర్థన.",

	"HI": "साक्ष्य अधिनियम की धारा 76 के तहत मेरे जीवन और स्वतंत्रता से वंचित करने के लिए सहायक दस्तावेज प्रदान करने का अनुरोध।"
}

var stateLangs = {"TN": ["EN","TA"]}

var to = readFromJSON(cdn_base_url + "/js/common/dc_email_ids.json");
var bodyEncoded = readFromJSON(cdn_base_url + "/js/ep/email_body.json");

// to['ALL'] = Object.values(to).join(' ');
bodyEncoded['ALL'] = {"EN": bodyEncoded['OTHERS']['EN']};


// Adding email body in all languages to bodyEncoded['ALL']
for(let key_state in bodyEncoded) {
	if (key_state != "TN") {
		let body_enc_by_lang = bodyEncoded[key_state];
		for(let lang in body_enc_by_lang) {
			if (!bodyEncoded['ALL'].hasOwnProperty(lang)) {
				bodyEncoded['ALL'][lang] = body_enc_by_lang[lang];
			}
		}
	}
}

to['ALL-1'] = Object.values(getEmailIdsByKeyRange(to, "TN", "HR")).join(' ');
to['ALL-2'] = Object.values(getEmailIdsByKeyRange(to, "HP", "WB")).join(' ');