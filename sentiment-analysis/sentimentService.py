import sentiment
from flask import Flask, request
from flask_restful import Resource, Api
import json
app = Flask(__name__)
api = Api(app)


@app.route('/welcome/')
def api_welcome():
    return 'Welcome'

@app.route('/sentiment/', methods = ['POST'])
def api_sentiment():
    content = request.get_json()
    return sentiment.calculateSentiment(content['sourceText'])
    
 
if __name__ == '__main__':
    app.run(debug=True)#,host='0.0.0.0')