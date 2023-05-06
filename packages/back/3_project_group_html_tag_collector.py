import sys
import logging

logging.basicConfig(filename='process.txt', level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a")  # configure logging file
logging.info('start 3_project_group_html_tag_collector')

domainId = sys.argv[1]

from utility import WebCrawler, ApiRequests
crawler = WebCrawler()

api = ApiRequests()
splits = range(3, 15)

for split in splits:
    data_parser_group_urls = api.get_parser_group_urls(domainId, split)

    if(len(data_parser_group_urls['list']) > 0):
        logging.info(data_parser_group_urls['list'][0]['url'])

    logging.info(('%s %s %s  %s')%(data_parser_group_urls['length'], 'groups in split of', split, '/'))

    crawler.prepare_page_group_links(data_parser_group_urls['list'])
    crawler.run_crawler_parser_on_page_group(api)

logging.info('end 3_project_group_html_tag_collector')
