// match pattern for the URLs to redirect
var pattern = ["https://*.msn.com/*", "https://*.bing.com/*"];

// cancel function returns an object
// which contains a property `cancel` set to `true`
function cancel(requestDetails) {
  //TODO: handle www or w/o www
  console.log("Canceling: " + requestDetails.url);
  return {cancel: true};
}

// add the listener,
// passing the filter argument and "blocking"
chrome.webRequest.onBeforeRequest.addListener(cancel, {urls: pattern},["blocking"]);
