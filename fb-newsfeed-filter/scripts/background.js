// match pattern for the URLs to redirect
//add the links to be blocked here dynamically/manually
var pattern = ["https://www.facebook.com/lalsalu.page/posts/2769601203135709",
              "https://www.facebook.com/groups/brahmanbarian2017/permalink/3068719746521623/",
              "https://www.facebook.com/mh.mon.94/videos/638619193593343/",
              "https://*.bing.com/*"];



//post request to server
var serverData;
var xmlhttp = new XMLHttpRequest();
var url = "https://coronafactcheck.herokuapp.com/covid19/api/get_blacklist";
//collect all the blacklisted urls in this urlList
var urlList = [];
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
         serverData = JSON.parse(this.responseText);
         //console.log(serverData)
         for(i=0; i<serverData.length; i++){
            //console.log(serverData[i]['url'])
            urlList.push(serverData[i]['url'])
         };
         console.log(urlList)
         //console.log(pattern)
    };
};
xmlhttp.open("POST", url, true);
xmlhttp.send();



var requestedURL;
// cancel function returns an object
// which contains a property `cancel` set to `true`
function cancel(requestDetails) {
   console.log("working: " +urlList)
   console.log("pattern: " +pattern)
  //TODO: handle www or w/o www
  console.log("Canceling: " + requestDetails.url);
  //display custom popup message
  //chrome.tabs.update({url: "https://example.com"});
  requestedURL = requestDetails.url;
  return {redirectUrl: chrome.extension.getURL("templates/blockmsg.html") };

  //return {cancel: true};
}


//TODO: try to replace pattern with urlList, but not working as required, all sites are blocked
// add the listener,
// passing the filter argument and "blocking"
chrome.webRequest.onBeforeRequest.addListener(cancel, {urls: urlList}, ["blocking"]);

//TODO: not working yet
$('#okbutton').click(function()
{
  alert("this button was clicked");
  //alert(chrome.extension.getBackgroundPage().URLStorage);
  //window.location.href = chrome.extension.getBackgroundPage().URLStorage;
});
