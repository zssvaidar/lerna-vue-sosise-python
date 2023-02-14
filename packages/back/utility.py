import requests
from pydash import get
from playwright.sync_api import Page, Locator
from playwright.sync_api import sync_playwright
from playwright_dompath.dompath_sync import xpath_path

from urllib.parse import urlparse
import logging # python logging
logging.basicConfig(filename='logs/logs.txt', level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a") # configure logging file
logging.info('start')

class WebCrawler():
    def __init__(self):
        self.test_links = ['http://www.vestnik.nauka.kz/informatika/obzor-metodov-ocenki-dliny-polosy-v-rulone.php']
        
    def fetch_resource_links(self,):
        api = ApiRequests()
        data = api.get_parser_domain_links()
        urls = [item.url for item in data]
        return urls

    def prepare_resource_links(self, urls = None):
        if(urls is None):
            self.domain_urls = self.test_links
            return
        self.domain_urls = urls
            
    def run_crawler(self):
        
        with sync_playwright() as p:
            browser_type = p.chromium
            browser = browser_type.launch(headless=False)
            page = browser.new_page()
            
            timeout = 60000
            page.set_default_navigation_timeout(timeout)
            page.set_default_timeout(timeout)
            for url in self.domain_urls:
                filter = DomainUrlPath(url)
                filter.run_crawler_sites(page)

        
class ConnError(Exception):
    pass

class CrawlerDomainType():
    def __init__(self, data):
        self.id = data['id']
        self.url = data['url']

    def __str__(self):
        return "CrawlerDomainType <%d> <%s>"%(self.id, self.url)

class ApiRequests():
    def __init__(self):
        self.crawler_domain_url: str = 'http://localhost:10000/api/v1/crawler/domainurls'
        pass
    
    def get_parser_domain_links(self, log=False) -> list[CrawlerDomainType]:
        try:
            response = requests.get(self.crawler_domain_url)
        except Exception as e:
            raise ConnError('Ошибка подключения')

        if(log):
            print(response.json())
        
        data: list[CrawlerDomainType] = list (map(CrawlerDomainType, get(response.json(), "data", {}) ) )

        return data


class DomainUrlPath:
    def __init__(self, url, pwd = ''):
        self.url = url
        # self.domain_url = urlparse(url).netloc
        self.domain_url = url
        self.queue = [self.url]
        self.filtered_url = []
        self.index = 0

    def filter_domain_url(self, page: Page):
        self.index+=1
        if(len(self.queue) < 1):
            print('Queue is empty. Crawler stops')
            return
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
        