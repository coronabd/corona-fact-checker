// match pattern for the URLs to redirect
var pattern = ["https://*.msn.com/*", "https://*.bing.com/*"];

var customLinks = ["https://*.msn.com/*", "https://*.bing.com/*"];


chrome.storage.onChanged.addListener(function(changes, namespace) {

	if(  'customLinks' in changes ){
		customLinks = changes['customLinks'];
	}

    for (var key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});

// cancel function returns an object
// which contains a property `cancel` set to `true`
function cancel(requestDetails) {
    //TODO: handle www or w/o www
    console.log("Canceling: " + requestDetails.url);
    return { cancel: true };
}

// add the listener,
// passing the filter argument and "blocking"
chrome.webRequest.onBeforeRequest.addListener(cancel, { urls: pattern }, ["blocking"]);