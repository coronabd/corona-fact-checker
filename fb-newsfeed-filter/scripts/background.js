// ----------------- constants ---------------------
const user_study_api = 'http://coronafactcheck.herokuapp.com/covid19/api/user_study_news'
const time_gap = 2
const FB_URL = 'https://www.facebook.com/'

var pattern = ["https://www.facebook.com/lalsalu.page/posts/2769601203135709",
    "https://www.facebook.com/groups/brahmanbarian2017/permalink/3068719746521623/",
    "https://www.facebook.com/mh.mon.94/videos/638619193593343/",
    "https://*.bing.com/*",
    "https://www.facebook.com/mh.mon.94/*",
    "https://*.bing.com/*"
];
var currenturl = ""

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
        for (i = 0; i < serverData.length; i++) {
            //console.log(serverData[i]['url'])
            urlList.push(serverData[i]['url'])
        };
        // console.log(urlList)
        //console.log(pattern)
    };
};
xmlhttp.open("POST", url, true);
xmlhttp.send();

var requestedURL;
// cancel function returns an object
// which contains a property `cancel` set to `true`
function cancel(requestDetails) {
    // console.log("working: " + urlList)
    // console.log("pattern: " + pattern)
    //TODO: handle www or w/o www
    // console.log("Canceling: " + requestDetails.url);
    //display custom popup message
    //chrome.tabs.update({url: "https://example.com"});
    requestedURL = requestDetails.url;

    // return {redirectUrl: chrome.extension.getURL("templates/blockmsg.html") };
    return {
        redirectUrl: chrome.extension.getURL("templates/blockmsg.html" + "?&from=" + currenturl + "&blocked=" + requestedURL)
    };

    // return {cancel: true};
}


// add the listener,
// passing the filter argument and "blocking" 
chrome.webRequest.onBeforeRequest.addListener(cancel, {
    urls: pattern
}, ["blocking"]);

// listen to tab changes event and page loading complete event
// capture the current url, then pass onto the blockmsg.html for "go back" button
function temp(req) {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
        currentWindow: true
    }, function(tabs) {
        // console.log("CURRENT TAB " + tabs[0].url);
        currenturl = tabs[0].url;
    });
}
chrome.webRequest.onCompleted.addListener(temp, {
    urls: ["<all_urls>"]
});
chrome.tabs.onActivated.addListener(temp)

//------------ cookies -----------------
var biscuit;

// function checkforcookie(tab) {
//     console.log('---------- NEW LOOP -----------')
//     chrome.cookies.get({ url: "https://facebook.com", name: "modal"}, function (cookie) {
//         if (cookie == null) {
//             biscuit = 'undefined';
//             console.log("THE COOKIE,"+ biscuit);
//         }
//         else {
//             biscuit = cookie.value;
//             console.log("THE COOKIE,"+ biscuit);
//         }
//         //                    chrome.tabs.sendMessage(tabs, {msg: biscuit});
//     });

// }

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        var tab;
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "to the extension");
        if (sender.tab) {
            tab = sender.tab.id // from where message is sent 	
        } else {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                tab = tabs[0].id;
            })
        }
        if (request.msg == "checkcookie") {
            checkforcookie(tab);
        } else if (request.msg == "checkcache") { // okay
            chrome.storage.local.get('CORONAMISINFO', function(data) {
                chrome.tabs.sendMessage(tab, {
                    msg: data.CORONAMISINFO
                });
            })
            console.log('Cache Result sent to content')
        }
    });

// for long messages
chrome.runtime.onConnect.addListener(function(port) {
    console.log("----------------- NEW LOOP ------------------")
    console.assert(port.name == "cookie_comm");
    port.onMessage.addListener(function(response) {

        if (response.msg == "checkcookie") {
            console.log('RECIEVED MSG FROM CONTENT')

            chrome.cookies.get({
                url: FB_URL,
                name: 'modal'
            }, function(cookie) {
                console.log(cookie)
                if (cookie) {
                    port.postMessage({
                        msg: cookie.value
                    });
                } else {
                    port.postMessage({
                        msg: 'notshown'
                    })
                }

            });
        } else if (response.msg == 'setcookie') {
            expmin = parseFloat(Date.now() / 1000.0 + (time_gap * 60));
            chrome.cookies.set({
                url: FB_URL,
                name: "modal",
                value: "shown",
                expirationDate: expmin
            }, function(cookie) {
                console.log("Cookie Setup Successful " + cookie.value);
            });
        } else if (response.msg == 'checkcache') {
            chrome.storage.local.get('CORONAMISINFO', function(data) {
                port.postMessage({
                    msg: data.CORONAMISINFO
                });
            })
            console.log('Cache Result sent to content')
        }
    });
});


function memorySizeOf(obj) {
    var bytes = 0;

    function sizeOf(obj) {
        if (obj !== null && obj !== undefined) {
            switch (typeof obj) {
                case 'number':
                    bytes += 8;
                    break;
                case 'string':
                    bytes += obj.length * 2;
                    break;
                case 'boolean':
                    bytes += 4;
                    break;
                case 'object':
                    var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                    if (objClass === 'Object' || objClass === 'Array') {
                        for (var key in obj) {
                            if (!obj.hasOwnProperty(key)) continue;
                            sizeOf(obj[key]);
                        }
                    } else bytes += obj.toString().length * 2;
                    break;
            }
        }
        return bytes;
    };

    function formatByteSize(bytes) {
        if (bytes < 1024) return bytes + " bytes";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
        else return (bytes / 1073741824).toFixed(3) + " GiB";
    };

    return formatByteSize(sizeOf(obj));
};

function fetchdata() {
    $.post(user_study_api)
        .done(function onSuccess(result) {
            console.log(result)
            chrome.storage.local.set({
                'CORONAMISINFO': result
            }, function() {
                console.log('Value is set to ' + memorySizeOf(result));
            });
        })
        .fail(function onError(xhr, status, error) {
            console.log(error)
        })
}

console.log("browser started, fetching data");
fetchdata();