import pandas as pd
from nltk.sentiment.vader import SentimentIntensityAnalyzer

def calculateSentiment(sourceText):
	analyser = SentimentIntensityAnalyzer()
	return analyser.polarity_scores(sourceText)