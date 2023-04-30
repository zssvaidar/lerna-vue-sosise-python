import sys
from utility import WebCrawler, ApiRequests
import logging

logging.basicConfig(filename='1_project_link_collector.txt', level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a")  # configure logging file
logging.info('start 1_project_link_collector')

crawler = WebCrawler()
domainId = int(sys.argv[1])

url_data = crawler.fetch_domain_url(domainId)
crawler.prepare_resource_links(url_data)
api = ApiRequests()
crawler.run_crawler(api, 1)

logging.info('end 1_project_link_collector')
