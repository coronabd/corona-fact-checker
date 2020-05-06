from nltk.stem.wordnet import WordNetLemmatizer
from gensim import similarities
from nltk.corpus import stopwords
from gensim import corpora
import string
from flask import Flask
import itertools
import time 

from langdetect import detect
import bengali_claim_similarity_checker as bengali_claim_checker
import database_operation as db_operation
app = Flask(__name__)
app.config.from_object('config')


lemma = WordNetLemmatizer()
stop = set(stopwords.words('english'))
exclude = set(string.punctuation)
dictionary = corpora.Dictionary.load(app.config['DICTIONARY'])


def doc_tfidf(doc_list):
    post_term_matrix = [dictionary.doc2bow(doc) for doc in doc_list]
    corpora.MmCorpus.serialize('post.mm', post_term_matrix)
    corpus = corpora.MmCorpus('post.mm')
#     return post_term_matrix
    return corpus


def clean(doc):
    stop_free = " ".join([i for i in doc.lower().split() if i not in stop])
    punc_free = ''.join(ch for ch in stop_free if ch not in exclude)
    normalized = " ".join(lemma.lemmatize(word) for word in punc_free.split())
    return normalized


def compare_similarity(claim, misinfo):
    cleaned_content = [clean(claim).split()]
    tfidf_cont = doc_tfidf(cleaned_content)
    vec_bow = dictionary.doc2bow(misinfo.lower().split())
    index = similarities.MatrixSimilarity(tfidf_cont, num_features=len(dictionary))
    sim = index[vec_bow]
    return sim[0]


def calculate_sim_sim_matrix(claim, misinfo):
    return compare_similarity(claim, misinfo)


def update_caches(top_misinfo):
    """
    updates cache collection with top results. only stores 15 most frequent fakenews.
    if collection is maxed out, least frequent fakenews is removed. Newer fakenews takes it's place.
    """
    N = 8
    exists = False
    cache_list = db_operation.get_all_cache()
    
    for i in cache_list:    # check if already cached
        if i['fakeNewsId'] == top_misinfo[0]['objectId']:
            exists = True
            print(">>>>>>>>>>>>>>>>>>>>>>>> already cached")
            break

    if exists==False and len(cache_list) >= N:     # not cached and cache size maxed
        cache_list = sorted(cache_list, key=lambda k: k['lastAccessed'])
        db_operation.delete_from_cache_collection(cache_list[0]['_id'])

    if exists==False:      # cache update
        data = {}
        data['fakeNewsId'] = top_misinfo[0]['objectId']
        data['lastAccessed'] = int(time.time())
        post_id = db_operation.insert_into_cache_collection(data)
        print(">>>>>>>>>>>>>>>>>>>>>>>> posted new cache")


def get_matched_claims(claim, all_misinfo, top=2, threshold=0.7):
    lang_code = detect(claim)
    if lang_code == "bn":
        top_misinfo = bengali_claim_checker.bengali_get_matched_claims(claim, all_misinfo, top=2, threshold=0.7)
    else:
        pair_list = []
        for misinfo in all_misinfo:
            objectId = str(misinfo['_id'])
            score = calculate_sim_sim_matrix(claim, misinfo['misinfo'])
            if score >= threshold:
                keys = list(misinfo.keys())[1:]
                plain_data = {k:misinfo[k] for k in keys if k in misinfo}
                pair = {'claim': claim, 'data': plain_data, 'similarity': str(score),'objectId':objectId}
                pair_list.append(pair)

        sorted_pair_list = sorted(pair_list, key=lambda k: k['similarity'], reverse=True)
        top_misinfo = sorted_pair_list[0:top]
    if len(top_misinfo) >0:
        update_caches(top_misinfo)
    return top_misinfo
