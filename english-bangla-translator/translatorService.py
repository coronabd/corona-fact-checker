import englishToBangla
import banglaToEnglish
from flask import Flask, request
from flask_restful import Resource, Api
from flask import jsonify
app = Flask(__name__)
api = Api(app)


@app.route('/welcome/')
def api_welcome():
    return 'Welcome'

@app.route('/entobn', methods = ['POST'])
def api_englishToBangla():
    content = request.get_json()
    translatedText = str(englishToBangla.translate(content['sourceText']))
    return jsonify(outputText=translatedText)


@app.route('/bntoen', methods = ['POST'])
def api_banglaToEnglish():
    content = request.get_json()
    translatedText = str(banglaToEnglish.translate(content['sourceText']))
    return jsonify(outputText=translatedText)
 
if __name__ == '__main__':
    app.run(debug=True)#,host='0.0.0.0')