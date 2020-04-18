import requests
from bs4 import BeautifulSoup
import pandas as pd

article_source = []
article_post_date_type = []
article_title = []
article_url = []
article_claim = []

for pg in range(1,9):
    URL = 'https://www.politifact.com/factchecks/list/?page='+str(pg)+'&category=coronavirus'
    response = requests.get(URL);

    html_soup = BeautifulSoup(response.text, 'html.parser');

    ul_list = html_soup.find('ul', class_='o-listicle__list').find_all('li');


    for li in ul_list:
        article_source.append(li.find('a',class_='m-statement__name').text.strip())
        article_post_date_type.append(li.find('div', class_='m-statement__desc').text.strip())
        article_title.append(li.find('div', class_='m-statement__quote').find('a').text.strip())
        article_url.append(li.find('div', class_='m-statement__quote').find('a')['href'])
        article_claim.append(li.find('img', class_='c-image__original', alt=True)['alt'])



df = pd.DataFrame({'article_source':article_source,
                   'article_post_date_type':article_post_date_type,
                   'article_title':article_title,
                   'article_url':article_url,
                   'article_claim': article_claim})

print(df)

# #convert to csv
df.to_csv("politifact_fact_news.csv", sep=',', encoding='utf-8')


