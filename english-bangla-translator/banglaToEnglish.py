from googletrans import Translator

def translate(sourceText):
	translator = Translator()
	translatedText = translator.translate(sourceText, dest='EN')
	return translatedText