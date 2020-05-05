from nltk.stem.wordnet import WordNetLemmatizer
from gensim import similarities
from nltk.corpus import stopwords
from gensim import corpora
import string
from flask import Flask
import itertools

#bengali NLP
import re
import math
import numpy as np
from collections import Counter
from langdetect import detect

app = Flask(__name__)
app.config.from_object('config')


def bengali_clean(text):
    stopwords_file = 'bengali_stop_words.txt'
    with open(stopwords_file) as f:
        bengali_stopwords = f.read()
    len_text = len(text)
    documents = []   
    for i in range(len_text):
        words = []
        regex = re.compile('[%s]' % re.escape(string.punctuation))
        text1 = regex.sub('', text[i])
        for word in text1.split():
            if "।" in word:
                word = word.replace("।", "")
            if not word.isdigit():
                if word not in bengali_stopwords:
                        words.append(word)  
        documents.append(words)
    return documents
def create_frequency_matrix(documents):
    frequency_matrix = {}
    for i in range(len(documents)):
        freq_table = {}
        words = documents[i]
        for word in words:
            if word in freq_table:
                freq_table[word] += 1
            else:
                freq_table[word] = 1
        frequency_matrix[i] = freq_table
    return frequency_matrix
def create_tf_matrix(freq_matrix):
    tf_matrix = {}
    for sent, f_table in freq_matrix.items():
        tf_table = {}
        count_words_in_sentence = len(f_table)
        for word, count in f_table.items():
            tf_table[word] = count / count_words_in_sentence
        tf_matrix[sent] = tf_table
    return tf_matrix
def create_documents_per_words(freq_matrix):
    word_per_doc_table = {}
    for sent, f_table in freq_matrix.items():
        for word, count in f_table.items():
            if word in word_per_doc_table:
                word_per_doc_table[word] += 1
            else:
                word_per_doc_table[word] = 1
    return word_per_doc_table
def create_idf_matrix(freq_matrix, count_doc_per_words, total_documents):
    idf_matrix = {}    
    for i, f_table in freq_matrix.items():
        idf_table= {}
        for word in f_table.keys():
            idf_table[word] = math.log10(total_documents / float(count_doc_per_words[word]))            
        idf_matrix[i] = idf_table       
    return idf_matrix
def create_tf_idf_matrix(tf_matrix, idf_matrix):
    tf_idf_matrix = {}
    for (sent1, f_table1), (sent2, f_table2) in zip(tf_matrix.items(), idf_matrix.items()):
        tf_idf_table = {}
        for (word1, value1), (word2, value2) in zip(f_table1.items(),
                                                    f_table2.items()):  # here, keys are the same in both the table
            tf_idf_table[word1] = float(value1 * value2)
        tf_idf_matrix[sent1] = tf_idf_table
    return tf_idf_matrix
def bengali_vec_tfidf(documents):
    frequency_matrix = create_frequency_matrix(documents)
    tf_matrix = create_tf_matrix(frequency_matrix)
    count_doc_per_words = create_documents_per_words(frequency_matrix)
    total_vocab_size = len(count_doc_per_words)
    total_vocab = [x for x in count_doc_per_words]
    total_documents = len(documents)
    idf_matrix = create_idf_matrix(frequency_matrix, count_doc_per_words, total_documents)
    tf_idf_matrix = create_tf_idf_matrix(tf_matrix, idf_matrix)
    D = np.zeros((total_documents, total_vocab_size))
    for key, value in tf_idf_matrix.items():
        doc_id = key
        for word, tfidf_val in value.items():
            word_id = total_vocab.index(word)
            D[doc_id][word_id] = tfidf_val
    return D, total_vocab, total_documents
def doc_freq(word):
    c = 0
    try:
        c = count_doc_per_words[word]
    except:
        pass
    return c
def gen_vector_query(tokens, total_vocab, total_documents):    
    Q = np.zeros((len(total_vocab)))
    counter = Counter(tokens)
    words_count = len(tokens)
    query_weights = {}    
    for token in np.unique(tokens):
        tf = counter[token]/words_count
        df = doc_freq(token)
        idf = math.log10(total_documents / (df+1))
        try:
            ind = total_vocab.index(token)
            Q[ind] = tf*idf
        except:
            pass
    return Q
def cosine_sim(a, b):
    cos_sim = np.dot(a, b)/(np.linalg.norm(a)*np.linalg.norm(b))
    return cos_sim
def cosine_similarity(k, D, tokens, total_vocab, total_documents):   
    d_cosines = []    
    query_vector = gen_vector_query(tokens, total_vocab, total_documents)    
    for d in D:
        d_cosines.append(cosine_sim(query_vector, d))       
    out = np.array(d_cosines).argsort()[-k:][::-1]
    return out, d_cosines
def bengali_matched_claims(claim, all_misinfo):
    cleaned_doc = bengali_clean(all_misinfo)
    vector_tfidf, total_vocab, total_documents = bengali_vec_tfidf(cleaned_doc)
    cleaned_claim = bengali_clean(claim)
    top_misinfo_id = cosine_similarity(2, vector_tfidf, cleaned_claim[0], total_vocab, total_documents)
    return top_misinfo_id

def bengali_get_matched_claims(claim, all_misinfo, top=2, threshold=0.7):
    pair_list = []
    text = []
    for misinfo in all_misinfo:
        info_text = misinfo['misinfo']
        lang_code = detect(info_text)
        if lang_code == "bn":
            text.append(misinfo['misinfo'])
    claim_text = [claim]
    top_misinfo_id, dcosines = bengali_matched_claims(claim_text, text)
    for misinfo in all_misinfo:
        for val in top_misinfo_id:
            if misinfo['misinfo'] in text[val]:
                pair = {'claim': claim, 'data': misinfo, 'similarity': format(dcosines[val], '.6g')}
                pair_list.append(pair)
    
    sorted_pair_list = sorted(pair_list, key=lambda k: k['similarity'], reverse=True)
    top_misinfo = sorted_pair_list                           
    return top_misinfo