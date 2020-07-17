# Covid-19 Misinformation Tracker Server

To setup the server in your local machine you need to install **virtual environment** and then create an environment from **requirements.txt**. To check how to setup virtual environment follow [this link](https://docs.python.org/3/tutorial/venv.html)


I have added **13 Bangla documents** in **misinfo_collection** database. You can get the db from [here](https://drive.google.com/open?id=1qUNwmUoYB2GSyot8p7_DKNy3lYEIVh2X).  

## MongoDB
This server uses MongoDB as DBMS. You can either setup MongoDB in your local machine, or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) in cloud. 

### Local Machine
You need to download and setup MongoDB in your local machine. I have used **9 documents** for the initialization of the database. I have dumped the database [here](https://drive.google.com/file/d/19YLjsfMu__jdHpjjfV0JYZmLuwMIslXl/view?usp=sharing). After setting up MongoDB, you can import it on your local database. You can follow the instructions [here](https://docs.mongodb.com/manual/reference/program/mongoimport/). Replace the **MISINFO_COLLECTION** and **DB_NAME** in the **config.py** file with your database and collection name.

### MongoDB Atlas
For testing purposes sign up using another email. After signing in, create a new cluster from the dashboard. Perform the following- 

1.create *database & collections* in Atlas, use the names from `config.py`
```
MISINFO_COLLECTION = 'misinfo_collection'
CACHE_COLLECTION = 'cache_collection'
BLACKLIST_COLLECTION = 'blacklist_collection'
DB_NAME = 'covid'
```
2. Click on `CONNECT`
3. `Connect to your application`
4. follow the given instruction, such as setting up dbUser, dbPass. 
5. in *select your driver and version* select Driver=Python, Version=3.4 or later
6. Copy the connection string. It will be something like this: mongodb://riy:<password>@cluster0-shard-00-00-otmbj.mongodb.net:27017,cluster0-shard-00-01-otmbj.mongodb.net:27017,cluster0-shard-00-02-otmbj.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority
7. Paste the connection string in `config.py`. The connection string is just a sample. You need to replace <password> with your database password that you set up in step 6. Also the database name in the string is *test*. Unless your database name is also *test*, you need to replace it with your database name. For example, the string in step 6  has database name *test* in bold: mongodb://riy:<password>@cluster0-shard-00-00-otmbj.mongodb.net:27017,cluster0-shard-00-01-otmbj.mongodb.net:27017,cluster0-shard-00-02-otmbj.mongodb.net:27017/**test**?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority
```
DB_HOST = <PROVIDED CONNECTION URL OF MONGO ATLAS>
```

That should work!

NOTE: Uploading data in a new account is easier with https://docs.mongodb.com/compass/master/install/ , https://docs.mongodb.com/compass/master/import-export/ . Also if you only want an already available database, contact with any collaborator in the project to get the deployed database's connection string. 


## Other files  
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
You can also check the API response for Bengali misinformation by sending a request like this:
> curl -X POST http://127.0.0.1:5000/covid19/api/get_related_misinfo -F 'claim=চা পান করলে করোনা ভালো হয়ে যাব'
The API response will be something like this:
```javascript
[
    {
        "claim": "চা পান করলে করোনা ভালো হয়ে যাবে।",
        "data": {
            "attached_file": "",
            "insertion_time": "Sat, 18 Apr 2020 18:05:29 GMT",
            "misinfo": "মাত্র আমার গ্রামের এক রিলেটিভ কল দিয়ে বললো এক গ্লাস পানিতে কয়েকটা চা পাতা নিয়ে একটা ভালো ইন্টেনশন নিয়ে খেলে করোনা ভালো হয়ে যাবে। ",
            "misinfo_link": "",
            "misinfo_source_type": "Facebook Post",
            "misinfo_tags": "religious medicine",
            "misinfo_type": "Culture",
            "truth": "স্বাস্থ্য বিশেষজ্ঞরা বলেছেন যে COVID-19 সংক্রমণ প্রতিরোধ বা নিরাময়ে চা পান করা কার্যকর তা প্রমাণ করার জন্য পর্যাপ্ত বৈজ্ঞানিক প্রমাণ নেই; ২০২০ সালের মার্চ পর্যন্ত ওয়ার্ল্ড হেলথ অর্গানাইজেশন (ডাব্লুএইচও) বলেছে যে চায়ে কোভিড -১৯ এর কোনও নিরাময় নেই।",
            "truth_link": "https://factcheck.afp.com/no-evidence-drinking-tea-can-cure-or-relieve-symptoms-covid-19-doctors-say",
            "verified_by": "WHO"
        },
        "objectId": "5e9b416932b48d3db561661c",
        "similarity": "0.337481"
    },
    {
        "claim": "চা পান করলে করোনা ভালো হয়ে যাবে।",
        "data": {
            "attached_file": "",
            "insertion_time": "Sat, 18 Apr 2020 19:18:35 GMT",
            "misinfo": "গ্রামের সাধারাণ মানুষজন চিনি এবং লবণ ছাড়া চা পান করছে এবং তাদেরকে কেউ একজন বলেছে যে এটা ভাইরাসটি সারাতে সাহায্য করবে। এমতাবস্থায়, মানুষ আযান দিচ্ছে এবং রং চা পান করছে।",
            "misinfo_link": "",
            "misinfo_source_type": "Facebook Post",
            "misinfo_tags": "",
            "misinfo_type": "Cure",
            "truth": "স্বাস্থ্য বিশেষজ্ঞরা বলেছেন যে COVID-19 সংক্রমণ প্রতিরোধ বা নিরাময়ে চা পান করা কার্যকর তা প্রমাণ করার জন্য পর্যাপ্ত বৈজ্ঞানিক প্রমাণ নেই; ২০২০ সালের মার্চ পর্যন্ত ওয়ার্ল্ড হেলথ অর্গানাইজেশন (ডাব্লুএইচও) বলেছে যে চায়ে কোভিড -১৯ এর কোনও নিরাময় নেই।",
            "truth_link": "https://factcheck.afp.com/no-evidence-drinking-tea-can-cure-or-relieve-symptoms-covid-19-doctors-say",
            "verified_by": "WHO"
        },
        "objectId": "5e9b528b32b48d3db5616623",
        "similarity": "0.100622"
    }
]
```

## Cache System
Results of queries at route `/covid19/api/get_related_misinfo` is stored for quick searching. Intuiton is that when one fake-news becomes viral, most queries will be related to that. So, it makes sense to store recent queries, but that is not ideal as same fake-news can take many form. But the result always stays same for one specific fake-news with almost similar queries. Hence, only the result, in this case `objectId` of the fake-news in the database is stored, along with time of last time it was searched for. Here is the structure of a single cached fake-news.  
```	
{
	"_id":{"$oid":"5eb2de55e48bdbaf1b3bc82e"},
	"fakeNewsId":"5e920864060c77188c2d0ae9",
	"lastAccessed":1588780629
}
```
*_id* is the objectId of the cache itself, *fakeNewsId* is the objectId of the fake-news stored in *misinfo_collection*, *lastAccessed* is the unix timestamp refering to the last time this fake-news was returned. 

Location of the cache is in *cache_collection* inside *covid* database on Mongo Atlas. Collection size has a  maximum length of *N*. If a fake-news needs to be cached and *cache_collection* is full, oldest cache is removed and newer one is cached.

## Blacklist API

The route of the API is set to **/covid19/api/get_blacklist** and supports only **POST** method. You can check the API request by sending a request like this:
`curl -X POST https://coronafactcheck.herokuapp.com/covid19/api/get_blacklist`. It will return something like this,
```
{
	"_id":{"$oid":"5eb2de71f0c94243b32e110a"},
	"url":"www.something.com/",
	"proof":"[www.anotherthing.com,www.otherthing.com]"
}
```
As usual, *_id* is objectId, *url* is the url to be blacklisted, *proof* is a list of sources proving that *url* is rouge; it can be anything from fake-news posted by that link to news articles blaming that url.

## Heroku Server
Server is hosted on heroku. If you plan on pushing new builds to server, do the following. The safest way is to pull first, change later. 
1. Install heroku CLI
2. create a new directory
3. cd into that directory and open bash.
4. login heroku. `heroku login -i`  
5. add existing app. `heroku git:remote -a coronafactcheck`
6. pull existing build from heroku. `git pull heroku master`
7. make your changes to the files.
8. `git add .`, then `git commit -m ""`
9. push your version. `git push heroku master`

If you have already work on local files, do step 1,3(cd into local directory),6,8,9. Step 6 is where merge conflict may arise. 

## All Active API
### Blacklist API
Call: `https://coronafactcheck.herokuapp.com/covid19/api/get_blacklist`

Returns: 

JSON: a list of urls that should be blocked by extension.

### User Study News
call: `https://coronafactcheck.herokuapp.com/covid19/api/user_study_news`

Returns:

JSON
