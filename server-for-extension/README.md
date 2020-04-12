# Covid-19 Misinformation Tracker Server

To setup the server in your local machine you need to install **virtual environment** and then create an environment from **requirements.txt**. To check how to setup virtual environment follow [this link](https://docs.python.org/3/tutorial/venv.html)

This server uses MongoDB as DBMS. You need to download and setup MongoDB in your local machine. I have used **9 documents** for the initialization of the database. I have dumped the database [here](https://drive.google.com/file/d/19YLjsfMu__jdHpjjfV0JYZmLuwMIslXl/view?usp=sharing). After setting up MongoDB, you can import it on your local database. You can follow the instructions [here](https://docs.mongodb.com/manual/reference/program/mongoimport/). Replace the **MISINFO_COLLECTION** and **DB_NAME** in the **config.py** file with your database and collection name.
 
To calculate the similarity score, we need a pre-made dictionary which can be downloaded [here](https://drive.google.com/file/d/16Uej6m8D3ZM0oasGvPX6-Xf0czpNqqq9/view?usp=sharing). Set the path of this dictionary in **config.py** under the name of **DICTIONARY**.

Once you can run the server successfully, hit [http://127.0.0.1:5000/ ](http://127.0.0.1:5000/). You can see the index page something like this. You can add new information into DB using these page. ![index page](https://github.com/coronabd/corona-fact-checker/blob/master/server-for-extension/files/index.jpg) 

To verify a claim, you can visit this url [http://127.0.0.1:5000/fact_checker](http://127.0.0.1:5000/fact_checker). ![index page](https://github.com/coronabd/corona-fact-checker/blob/master/server-for-extension/files/checker.jpg)

The verification result will be something like this if any matches found. ![index page](https://github.com/coronabd/corona-fact-checker/blob/master/server-for-extension/files/results.jpg)
You can set the threshold for similarity check and number of returned results in **config.py**.
## Misinfo Checker API

The route of the API is set to **/covid19/api/get_related_misinfo** and supports only **POST** method. You can check the API request by sending a request like this:
> curl -X POST http://127.0.0.1:5000/covid19/api/get_related_misinfo -F 'claim=Tea can cure Corona'
The API response will be something like this:
```javascript
[
  {
    "claim": "Tea can cure Corona",
    "data": {
      "attached_file": "",
      "insertion_time": "Sat, 11 Apr 2020 17:25:50 GMT",
      "misinfo": "Tea can cure Corona",
      "misinfo_link": "",
      "misinfo_source_type": "Image",
      "misinfo_tags": "natural remedies; medicine reference",
      "misinfo_type": "Cure",
      "truth": "Currently, there are no vaccines or natural health products that are authorized to treat or protect against COVID-19 ",
      "truth_link": "",
      "verified_by": "Covid19 Misinfo Tracker Team"
    },
    "similarity": "0.8660254"
  },
  {
    "claim": "Tea can cure Corona",
    "data": {
      "attached_file": "",
      "insertion_time": "Sat, 11 Apr 2020 18:43:03 GMT",
      "misinfo": "Kalonji seed can cure Coronavirus",
      "misinfo_link": "",
      "misinfo_source_type": "Facebook Post",
      "misinfo_tags": "meidicine",
      "misinfo_type": "Cure",
      "truth": "India Today Anti Fake News War Room (AFWA) has found the claim to be misleading. First of all, there is no conclusive research that proves the assured efficacy of hydroxychloroquine as a wonder drug to fight Covid-19. Second, kalonji does not contain hydroxychloroquine. Third, the World Health Organization (WHO) has never recommended this combination of kalonji and honey as a preventive measure against coronavirus.",
      "truth_link": "https://www.indiatoday.in/fact-check/story/fact-check-can-kalonji-seeds-cure-covid-19-truth-behind-viral-myth-busted-1665269-2020-04-10",
      "verified_by": "AFWA"
    },
    "similarity": "0.28867513"
  }
]
```
