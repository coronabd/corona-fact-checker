// match pattern for the URLs to redirect
//add the links to be blocked here dynamically/manually
var pattern = ["https://www.facebook.com/lalsalu.page/posts/2769601203135709",
              "https://www.facebook.com/groups/brahmanbarian2017/permalink/3068719746521623/",
              "https://www.facebook.com/mh.mon.94/videos/638619193593343/",
              "https://*.bing.com/*"];

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
