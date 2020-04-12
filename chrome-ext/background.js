var customPatterns = [ "https://somedummydefaultvalue.com/*" ];
var pluginEnabled;


chrome.storage.sync.get(['customLinks', 'pluginEnabled' ,'preferences'], function(result) {
        customPatterns = result.customLinks;

        pluginEnabled = result.pluginEnabled;
        setupBlocker();

        // if( result.preferences == undefined){
        // 	result.preferences =  {};
        // }
        // $('#use_central_database').prop('checked', result.preferences.useCentralDatabase);

});

chrome.storage.onChanged.addListener(function(changes, namespace) {

    if ('customLinks' in changes) {
        customPatterns = changes['customLinks'].newValue;
        setupBlocker();
    }

    if ('pluginEnabled' in changes) {
    	pluginEnabled = changes.pluginEnabled.newValue;
    	setupBlocker();
    }

    // for (var key in changes) {
    //     var storageChange = changes[key];
    //     console.log('Storage key "%s" in namespace "%s" changed. ',
    //         key,
    //         namespace,
    //         'Old value',
    //         storageChange.oldValue,
    //         'Newe value',
    //         storageChange.newValue
    //     );
    // }
});

function setupBlocker(){
	console.log("removing the blocker: ");
	chrome.webRequest.onBeforeRequest.removeListener(blockUrl);
    if (pluginEnabled) {
        console.log("adding the blocker: ", customPatterns);
        chrome.webRequest.onBeforeRequest.addListener(
            blockUrl, {
                urls: customPatterns
            },
            ["blocking"]
        );
    }
}


function blockUrl(requestDetails) {

    //TODO: handle www or w/o www

    return { cancel: true };
}