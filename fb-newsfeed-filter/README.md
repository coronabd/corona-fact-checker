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

