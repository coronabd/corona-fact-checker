Project Organisation

* base directory
* base directory/chrome-ext
* base directory/website

fb-newsfeed-filter

* Expecting a response from ML server in following format:

  var misinfo_result = {
          "data": {
            "decision": "misinfo",
            "confidence": "0.90",
            "explanation": "Why it is misinfo?",
            "verified_by": "snoops.com",
            "verification_link": "www.verified.com"
          }
        };
