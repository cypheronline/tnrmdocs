
// Base URL for CDN
var cdn_base_url = "https://cdn.jsdelivr.net/gh/cypheronline/tnrmdocs@1.0";
// var cdn_purge_base_url = "https://purge.jsdelivr.net/gh/cypheronline/tnrmdocs";


/****
 * Read from remote JSON file
****/
function readFromJSON(filePath, mimeType) {
	try {
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.open("GET",filePath,false);
		if (mimeType != null) {
			if (xmlhttp.overrideMimeType) {
				xmlhttp.overrideMimeType(mimeType);
			}
		}

		xmlhttp.send();

		if (xmlhttp.status==200 && xmlhttp.readyState == 4 )
			return JSON.parse(xmlhttp.responseText);
		else
			return null;
	}
	catch(err) {
		console.log(err);
	}
}


// Purging cached CDN content
/*readFromJSON(cdn_purge_base_url + "/js/states.json");
readFromJSON(cdn_purge_base_url + "/js/dc_email_ids.json");
readFromJSON(cdn_purge_base_url + "/js/email_body.json");*/

var states = readFromJSON(cdn_base_url + "/js/states.json");

var languages = {"EN":"English", "TA":"Tamil", "ML": "Malayalam", "KN": "Kannada", "TE": "Telugu", "HI": "Hindi"}


// Link captions by language 
var linkCaptionsByLang = {

	"EN":"Click to draft mail in English!!",
	
	"TA": "தமிழில் மின்னஞ்சல் அனுப்ப இங்கே கிளிக் செய்யவும்!!",
	
	"ML":"Click to draft mail in Malayalam!!",
	
	"KN":"Click to draft mail in Kannada!!",
	
	"TE":"Click to draft mail in Telugu!!",
	
	"HI":"Click to draft mail in Hindi!!"
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

var to = readFromJSON(cdn_base_url + "/js/dc_email_ids.json");
// var to = readFromJSON("https://cdn.jsdelivr.net/gh/cypheronline/tnrmdocs@6050de4/js/dc_email_ids.json");

var bodyEncoded = readFromJSON(cdn_base_url + "/js/email_body.json");

function copy_text_to_clipboard(target_elem) {
	target_elem.select();
	document.execCommand("copy");
}


function createPrintBox(content, rows=10, cols=50) {
	box = document.createElement('textarea');
	box.value = content;
	box.cols = cols;
	box.rows = rows;
	return box;
}


function printEmail(full_email, full_email_elems){

	if(full_email_elems['container_element'] != undefined){
		let container = document.getElementById(full_email_elems['container_element']);
		container.hidden = false;
	}
		
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

	var selected_region_code = opt_region.value;

	var cc = "TNRMLETTER2COLLECTORS@GMAIL.COM";

	
	for (lang in languages) {
		try {
			let full_email = {};

			full_email['to'] = to[selected_region_code];
			full_email['cc'] = cc;

			var body = decodeURIComponent(
			((selected_region_code in bodyEncoded) ? bodyEncoded[selected_region_code][lang] : bodyEncoded["OTHERS"][lang]).replaceAll('+', '%20'));
			
			body = body.replaceAll('<<Name>>', txt_name.value).replaceAll('<<AddressLine1>>', txt_address_line1.value).replaceAll('<<STATE>>', states[selected_region_code].toUpperCase())

			let link_href = "mailto:" + encodeURIComponent(to[selected_region_code]) + "?" + "cc=" + encodeURIComponent(cc) + "&" + "subject=" + encodeURIComponent(subjectsByLang[lang]) + "&" + "Content-type=text/html" + "&" + "body=" + encodeURIComponent(body);
			
			full_email['subject'] = subjectsByLang[lang];
			full_email['body'] = body;

			let link = document.createElement("a");
			link.id = "lnk" + lang;
			link.href = "#" + link.id;
			link.onclick = function() {
				printEmail(full_email, full_email_elems);
				if(confirm("Do you want to open the email App?"))
					window.location = link_href;
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