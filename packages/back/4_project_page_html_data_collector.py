import sys
import logging

logging.basicConfig(filename='process.txt', level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a")  # configure logging file
logging.info('start 4_project_page_html_data_collector')

domain_id = sys.argv[1]
group_id = sys.argv[2]

from utility import WebCrawler, ApiRequests
crawler = WebCrawler()

api = ApiRequests()

group_tag_info = api.get_stored_group_tag_info(domain_id, group_id)

logging.info( 'PAGE COUNT: %s TAG COUNT: %s'% (len(group_tag_info['pageUrls']), len(group_tag_info['groupTagsToCollect']) ) )

crawler.prepare_page_group_tags(domain_id, group_id, group_tag_info['pageUrls'], group_tag_info['groupTagsToCollect'])
crawler.run_collect_tag_tag_data(api)

logging.info('end 4_project_page_html_data_collector')
