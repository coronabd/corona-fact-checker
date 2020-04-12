from pymongo import MongoClient
from flask import Flask

app = Flask(__name__)
app.config.from_object('config')
host = app.config['DB_HOST']
port = app.config['DB_PORT']

client = MongoClient(host, port)
db = client[app.config['DB_NAME']]

misinfo_collection = db[app.config['MISINFO_COLLECTION']]


def insert_into_misinfo_collection(data):
    post_id = misinfo_collection.insert_one(data).inserted_id
    return post_id


def get_all_misinfo_claims():
    claim_lists = []
    all_claims = misinfo_collection.find({}, {'_id': 0})
    for row in all_claims:
        claim_lists.append(row)
    return claim_lists

