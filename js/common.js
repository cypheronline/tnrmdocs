
var getToDelimiterSelector = function() { return document.querySelector('input[name="to_delimiter"]:checked'); }
var getToDelimiterSelectors = function() { return document.querySelectorAll('input[name="to_delimiter"]'); }

// Base URL for CDN
var cdn_base_url = "https://cdn.jsdelivr.net/gh/cypheronline/tnrmdocs@2.0";
// var cdn_base_url = "/tnrm";


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


/****
 * Copies the text of the target element to the clipboard 
****/
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


/****
 * Gets the count of strings joined together by delimiters for each key in an object 
****/
function getPatternCountsByKeys(obj, delim) {
	delim = (delim==undefined) ? ";" : delim;
	let counts_by_keys = {};
	for(key in obj) {
		val = (obj[key].slice(-1)==delim ? obj[key].slice(0,-1) : obj[key]);
		arr_from_str_split = val.split(delim);
		counts_by_keys[key] = arr_from_str_split.length;
	}
	return counts_by_keys;
}


var states = readFromJSON(cdn_base_url + "/js/states.json");
states['ALL'] = "All States & Union Territories of India";

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
