# misinfo-checker-chrome Chrome Extension

- This assumes there is an API that can check whether a post, link, text, etc. is misinfo or not. 

## Necessary modifications

edit the following in `scripts/covid19.js`
- `API_URL` : There will be an API to connect to the backend server. This variable will hold the address of that API
- `loop`: This function works on scrolling over FB newsfeed. loop() continuously looks for post in the feed and extracts status, link, title, text and call _callmisinfoApi()
- `_callmisinfoApi`: This function calls the API to check whether a status/link/text/title contains any misinformation. The server response is passed to `_handlemisinfoApiSuccess()`. We assume server response will be something like this-
{
          "data": {
            "decision": "misinfo",
            "confidence": "0.90",
            "explanation": "Why it is misinfo?",
            "verified_by": "snoops.com",
            "verification_link": "www.verified.com"
          }
        }

- `_handlemisinfoApiSuccess`: This function create a warning sign (HTML) and adds to DOM if the post is misinfo

# Contributor Guide
## Current Structure

Function structure in `covid10.js`:
```
# IN init()
  if facebook domain: 
    message "checkcookie" sent to background.js.
    modalAutoSetup()
  
# IN modalAutoSetup() 
  message "sendcookie" sent to background.js
    IN callback
      flag <- response
      if flag is 'shown':
        do nothing
      else:
        message "checkcache" sent to background.js
        message "setcookie" sent to background.js

# IN chrome.runtime.onMessage listener
  if message is not empty:
    modalShow(1,message)
  else:
    modalShow(0)

# IN modalShow(cache=false,result=null)
  if cache is false:
    gets data from server using POST
  else if cache is true:
    builds bootstrap modal using a loop
    appends that modal to the body of current tab
    shows the modal 
```
Function structure in `background.js`:
```
IN chrome.runtime.onMessage listener
  if message sent from tab:
    tab <- tabid
  else:
    tab <- current selected tabid in current selected window
  
  if message is 'checkcookie':
    checkforcookie(tab)
  else if message is 'setcookie':
    setcookie()
  else if message is 'sendcookie':
    existing cookie is sent to tab
  else if message is 'checkcache':
    cache <- get cache from local storage
    send cache to tab
```
Event listeners in `background.js`:
* chrome.webRequest.onBeforeRequest: blocks URL after matching URL pattern
* chrome.webRequest.onCompleted: works on capturing URL of current tab to show in `blockmsg.html`
* chrome.tabs.onActivated: same as above. 
* chrome.runtime.onMessage: listens to incoming messages from other scripts. 

Function strucure in `popup.js`:
```
on button click #seefake:
  message "checkcache" sent to background.js
```

## Todo
1. Change data acess point for modal
2. Update stylesheet for `popup.html`
3. Fix asynchronous issues with `background.js | setcookie(), checkforcookie()`. Sometimes, fast reload of page still shows the modal even thought cookie exists at that moment
4. Create webhook or similar system in `background.js` to push notification of new fake-news
