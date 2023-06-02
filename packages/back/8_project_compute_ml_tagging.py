from computation_utility import *
import requests
import logging
import sys
logging.basicConfig(filename='process.txt', level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a")  # configure logging file
logging.info('start 8_project_compute_ml_tagging')

#### Normalize names
def create_tagtext_freq_record(page_tag_data_id, data):
    url = 'http://localhost:10000/api/v1/ml/model/siteText' % page_tag_data_id
    requests.put(url, json=data)

df = get_site_tag_data()

# for _, row in df.iterrows():
#     new_data_type_id = str(row['data_type_id'])[0] + '02'
#     update_page_data_type(row['id'], { 'text_type_id': new_data_type_id })

# for _, row in df.iterrows():
#     update_page_data_type(row['id'], { 'text': row['text'] })

logging.info('end 8_project_compute_ml_tagging')
