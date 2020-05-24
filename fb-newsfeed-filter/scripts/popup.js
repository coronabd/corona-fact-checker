$("#seefake").click(function () {

	//    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	// chrome.tabs.sendMessage(tabs[0].id, {msg: "modalforuser"});
	//});

	console.log("clicked");
	chrome.runtime.sendMessage({ msg: "checkcacheforuser" }, function (response) {
		console.log('message send');
	});
});
