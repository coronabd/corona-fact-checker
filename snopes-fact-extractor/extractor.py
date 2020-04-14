import requests
from bs4 import BeautifulSoup
import pandas as pd


URL = 'https://www.snopes.com/collections/new-coronavirus-collection/'; #main URL to collect data from
response = requests.get(URL);

html_soup = BeautifulSoup(response.text, 'html.parser');

#find all the sub-URLS
sub_urls = html_soup.find('div', class_='card-body').find('ul')
#print(sub_urls)

url_list = []
url_tag_list = []
#loop through all the urls in sub_URLS
for urls in sub_urls.find_all('li'):
    temp = urls.find('a')
    url_list.append(temp['href']);
    url_tag_list.append(temp.text)

# print(url_list)
# print(url_tag_list)
fact_news_tag = []
fact_news_url = []
fact_news_title = []
fact_news_description = []
fact_news_claim = []

for URL,tag in zip(url_list, url_tag_list):
    # URL = 'https://www.snopes.com/collections/coronavirus-origins-treatments/';
    response = requests.get(URL);
    html_soup = BeautifulSoup(response.text, 'html.parser');

    #find the section with all the news lists
    container = html_soup.find('section', class_ = 'collected-list col-12');

    news_list = container.find_all('a', class_ = 'collected-item');

    for news in news_list:

        # print(news['href']); #fact-news-url
        # print(news.h5.text); #fact-news-title
        # print(news.p.text); #fact-news-description
        # print(news.find('div', class_="media-body").text.strip())
        fact_news_tag.append(tag)
        fact_news_url.append(news['href']);
        fact_news_title.append(news.h5.text);
        fact_news_description.append(news.p.text);
        fact_news_claim.append(news.find('div', class_="media-body").text.strip())


df = pd.DataFrame({'fact_tag':fact_news_tag,
                   'news_url':fact_news_url,
                   'news_title':fact_news_claim,
                   'news_description':fact_news_description,
                   'news_claim': fact_news_claim})

print(df)

# #convert to csv
df.to_csv("snopes_fact_news.csv", sep=',', encoding='utf-8')


