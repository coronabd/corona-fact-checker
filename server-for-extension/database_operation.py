from pymongo import MongoClient
from flask import Flask
from bson.objectid import ObjectId

app = Flask(__name__)
app.config.from_object('config')
host = app.config['DB_HOST']
port = app.config['DB_PORT']

# loading database
client = MongoClient(host)
db = client[app.config['DB_NAME']]

# loading tables
misinfo_collection = db[app.config['MISINFO_COLLECTION']]
cache_collection = db[app.config['CACHE_COLLECTION']]
blacklist_collection = db[app.config['BLACKLIST_COLLECTION']]
user_study = db[app.config['USER_STUDY_COLLECTION']]


def insert_into_misinfo_collection(data):
    post_id = misinfo_collection.insert_one(data).inserted_id
    return post_id

def insert_into_cache_collection(data):
    post_id = cache_collection.insert_one(data).inserted_id
    return post_id

def get_all_misinfo_claims():
    claim_lists = []
    all_claims = misinfo_collection.find({})
    for row in all_claims:
        claim_lists.append(row)
    return claim_lists

def get_all_cache():
    cache_list = []
    caches = cache_collection.find({})
    for row in caches:
        cache_list.append(row)
    return cache_list

def delete_from_cache_collection(objectId):
    cache_collection.delete_one({'_id':objectId}) 

def get_blacklist():
    urllist = []
    temp = list(blacklist_collection.find({}))

    if len(temp) > 0:
        keys = ['url', 'proof']
        for row in temp:
            url = {k:row[k] for k in keys if k in row} 
            urllist.append(url)
            
    return urllist

def fetch_all(table_name):
    """
    Fetches all rows from a table.

    Parameters
    ----------
    table_name: str. 
        Table name in the database

    Returns
    -------
    rows: list.
        A list containing all data in the table.

    """
    claim_lists = []
    all_claims = eval(table_name).find({})
    for row in all_claims:
        str_row = dict([(key, str(val)) for key, val in row.items()])
        claim_lists.append(str_row)
    return claim_lists

def write_feedback(item_id, user, verdict):
    query = {'_id': ObjectId(item_id)}
    result = misinfo_collection.update_one(query,{"$push": {verdict: user} })
    print(result)