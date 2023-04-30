import sys
import json
import logging

logging.basicConfig(filename='process.txt', level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a")  # configure logging file
logging.info('start 2_project_page_group_collector')

# listIds = sys.argv[1].split(',')
# logging.info(listIds)
domainId = sys.argv[1]

from utility import WebCrawler, ApiRequests
crawler = WebCrawler()

api = ApiRequests()
splits = range(3, 15)

for split in splits:
    data_parser_group_urls = api.create_parser_group_urls(domainId, split)
    data_parser_group_urls = api.get_parser_group_urls(domainId, split)

    if(len(data_parser_group_urls['list']) > 0):
        logging.info(data_parser_group_urls['list'][0]['url'])
    logging.info(('%s %s %s %s')%(data_parser_group_urls['length'], 'groups in split of', split, '/'))

logging.info('end 2_project_page_group_collector')
