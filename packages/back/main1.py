import sys
from playwright.sync_api import sync_playwright

from playwright.sync_api import Page, expect, Locator
from urllib.parse import urlparse

import requests
import logging # python logging
logging.basicConfig(filename='logs/logs.txt', level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a") # configure logging file
logging.info('start')

class DomainUrlPath:
    def __init__(self, url, pwd = '', is_test = False):
        self.is_test = is_test
        self.url = url
        self.domain_url = urlparse(url).netloc
        if(self.is_test):
            self.url = 'file://' + pwd + '/' + url
        self.queue = [self.url]
        self.filtered_url = []
        self.index = 1

    def filter_domain_url(self, page: Page):
        url = self.queue.pop()
        self.filtered_url.append(url)
        logging.info('[%d] url: %s queue length: %d'% (self.index, url, len(self.queue)))
        print(url)

        headers=requests.head(url).headers
        # downloadable = 'attachment' in headers.get('Content-Disposition', '')
        if('text/html' not in headers['Content-Type']):
            self.filter_domain_url(page)
            return

        page.goto(url)
        page.wait_for_load_state()
        # page.wait_for_timeout(3000)


        anchor_elements = page.locator('a')
        anchor_elements_count = anchor_elements.count()

        for idx in range(anchor_elements_count):
            anchor = anchor_elements.nth(idx)
            try:
                anchor_href = anchor.evaluate('(el)=> el.href', timeout=400)
                if(anchor_href not in self.queue and anchor_href not in self.filtered_url and self.domain_url in anchor_href):
                    self.queue.append(anchor_href)
            except Exception as e:
                print(e)
                pass

        self.filter_domain_url(page)
        
    def run_crawler_sites(self, page: Page):
        self.filter_domain_url(page)
        
        print(self.filtered_url)
    
def run_crawler_test():
    pass

    
if(__name__ == '__main__'):

    with sync_playwright() as p:
        browser_type = p.chromium
        browser = browser_type.launch(headless=False)
        page = browser.new_page()

        if(len(sys.argv) > 2 and sys.argv[1] == 'test'):
            pwd = sys.argv[2]
            run_crawler_test(pwd, page)
        else:
            filter = DomainUrlPath('http://www.vestnik.nauka.kz/informatika/obzor-metodov-ocenki-dliny-polosy-v-rulone.php')
            filter.run_crawler_sites(page)
