import os
from flask import Flask, jsonify, request, render_template, redirect, flash
import datetime
from flask_cors import CORS
import json
import database_operation as db_operation
import claim_similarity_checker as claim_checker

app = Flask(__name__)
app.config.from_object('config')
CORS(app)


def get_the_closet_misinfo_set(claim):
    all_misinfo = db_operation.get_all_misinfo_claims()
    matched_claims = claim_checker.get_matched_claims(claim, all_misinfo, top=3, threshold=0.25)
    return matched_claims

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/fact_checker')
def fact_checker():
    return render_template('fact_checker.html')


@app.route('/verify_claim', methods=['POST'])
def verify_claim():
    claim = request.form['claim']
    misinfo_list = get_the_closet_misinfo_set(claim)
    if len(misinfo_list) > 0:
        return render_template('show_misinfo.html', misinfo_list=misinfo_list)
    else:
        return render_template('no_misinfo.html', claim=claim)


@app.route('/insert', methods=['POST'])
def insert():
    data = {}
    data['misinfo'] = request.form['misinfo_claim']
    data['misinfo_type'] = request.form['misinfo_type']
    data['misinfo_tags'] = request.form['misinf_tag']
    data['misinfo_link'] = request.form['source_link']
    data['misinfo_source_type'] = request.form['source_type']
    data['truth'] = request.form['truth']
    data['truth_link'] = request.form['source_link_truth']
    data['verified_by'] = request.form['verified_by']
    file = request.files['image']
    file_name = file.filename
    if file_name != '':
        file_dir = os.path.join(app.config['IMAGE_UPLOADS'], file_name)
        file.save(file_dir)
    data['attached_file'] = file_name
    data['insertion_time'] = datetime.datetime.utcnow()

    post_id = db_operation.insert_into_misinfo_collection(data)
    print("Susccess " + str(post_id))
    return render_template("submission_success.html")

@app.route('/covid19/api/get_related_misinfo', methods=['POST'])
def cb_detection():
    claim = request.values.get('claim')
    misinfo_list = get_the_closet_misinfo_set(claim)

    return jsonify(misinfo_list)


if __name__ == '__main__':
    app.run(host = '0.0.0.0',port=5005)
