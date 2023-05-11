from analytics_utility import *
import requests
import logging
import sys
logging.basicConfig(filename='process.txt', level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a")  # configure logging file
logging.info('start 6_project_data_transform_update')

#### Normalize names
def update_page_data_type(page_tag_data_id, data):
    url = 'http://localhost:10000/api/v1/site/pageTag/%s' % page_tag_data_id
    requests.put(url, json=data)

df = get_page_tag_data_by_type(True, None, 'name')

for _, row in df.iterrows():
    new_data_type_id = str(row['data_type_id'])[0] + '02'
    update_page_data_type(row['id'], { 'text_type_id': new_data_type_id })


df = get_page_tag_data_by_type(True, None, 'name', 'Лариса Николаевна Гребцова')
df['text'] = df['text'].apply(lambda e: e.replace('Лариса Николаевна Гребцова', ''))

df = get_page_tag_data_by_type(True, None, 'name', 'Лариса Николаевна Гребцова')
df['text'] = df['text'].apply(lambda e: e.replace('Лариса Николаевна Гребцова', ''))

for _, row in df.iterrows():
    update_page_data_type(row['id'], { 'text': row['text'] })
