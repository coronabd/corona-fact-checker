from nltk.stem.wordnet import WordNetLemmatizer
from gensim import similarities
from nltk.corpus import stopwords
from gensim import corpora
import string
from flask import Flask
import itertools

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


def get_matched_claims(claim, all_misinfo, top=2, threshold=0.7):
    pair_list = []
    for misinfo in all_misinfo:
        score = calculate_sim_sim_matrix(claim, misinfo['misinfo'])
        if score >= threshold:
            pair = {'claim': claim, 'data': misinfo, 'similarity': str(score)}
            pair_list.append(pair)

    sorted_pair_list = sorted(pair_list, key=lambda k: k['similarity'], reverse=True)
    top_misinfo = sorted_pair_list[0:top]
    return top_misinfo

