import sys
import json
import logging

logging.basicConfig(filename='process.txt', level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a")  # configure logging file
logging.info('start 2_project_page_group_html_collector')

listIds = sys.argv[1].split(',')
logging.info(listIds)

from utility import WebCrawler, ApiRequests
crawler = WebCrawler()

api = ApiRequests()
data_parser_group_urls = api.get_parser_group_urls(listIds)
crawler.prepare_page_group_links(data_parser_group_urls['list'])

crawler.run_crawler_parser_on_page_group()

logging.info('end 2_project_page_group_html_collector')
