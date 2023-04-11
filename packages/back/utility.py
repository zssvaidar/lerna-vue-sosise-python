import requests
from pydash import get
from playwright.sync_api import Page, Locator, expect
from playwright.sync_api import sync_playwright
from playwright_dompath.dompath_sync import xpath_path

from urllib.parse import urlparse
import logging  # python logging
from pathlib import Path
import hashlib
import json

logging.basicConfig(filename='logs/logs.txt', level=logging.INFO, format='%(asctime)s %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a")  # configure logging file
logging.info('start')


class CrawlerDomainType():
    def __init__(self, data):
        self.id = data['id']
        self.url = data['url']

    def __str__(self):
        return "CrawlerDomainType <%d> <%s>" % (self.id, self.url)


class ApiRequests():
    def __init__(self):
        self.crawler_domain_url: str = 'http://localhost:10000/api/v1/crawler/domainurls'
        self.crawler_url_store: str = 'http://localhost:10000/api/v1/crawler/url'

    def get_parser_domain_links(self, log=False) -> list[CrawlerDomainType]:
        try:
            response = requests.get(self.crawler_domain_url)
        except Exception as e:
            raise ConnError('Ошибка подключения')

        if (log):
            print(response.json())

        data: list[CrawlerDomainType] = list(
            map(CrawlerDomainType, get(response.json(), "data", {})))

        return data

    def post_url(self, url_data, log=False):
        try:
            response = requests.post(self.crawler_url_store, data=url_data)

            if (response.json()['code'] == 5001):
                print(8 * ' ', 'duplciate entry %s' % (str(url_data)))
                logging.error('duplciate entry % s' % (str(url_data)))

        except Exception as e:
            raise ConnError('Ошибка подключения %s' % (self.crawler_url_store))

        if (log):
            print(response.json())


class WebCrawler():
    def __init__(self):
        self.api = ApiRequests()

    def fetch_resource_urls(self,):
        data = self.api.get_parser_domain_links()
        return data

    def store_resource_url_pages(self, domain_id, page_collection, api: ApiRequests):
        for url, page_data in page_collection.items():
            data = {'domain_id': domain_id, 'url': url}
            if ('is_404' in page_data):
                data['type'] = '404'

            if ('is_file' in page_data):
                data['type'] = 'file'

            api.post_url(data)

    def prepare_resource_links(self, url_data=[]):
        self.domain_url_data: list[CrawlerDomainType] = url_data

    def run_crawler(self, remote_api: ApiRequests):

        def method_save_collection(page_collection):
            self.store_resource_url_pages(
                url_data.id, page_collection, remote_api)

        with sync_playwright() as p:
            browser_type = p.chromium
            browser = browser_type.launch(headless=False)
            page = browser.new_page()

            timeout = 60000
            page.set_default_navigation_timeout(timeout)
            page.set_default_timeout(timeout)
            for url_data in self.domain_url_data:
                filter = DomainUrlPath(url_data.id, url_data.url)
                filter.init_data_remote(method_save_collection)
                filter.init_cache_file()
                filter.run_crawling(page)
                # print()


class ConnError(Exception):
    pass


class DomainUrlPath:
    def __init__(self, domain_id: int, url: str, pwd=''):
        # self.domain_url = urlparse(url).netloc
        m = hashlib.sha256()
        m.update(url.encode())
        hex = m.hexdigest()
        self.domain_id = domain_id
        self.domain_url = url
        self.domain_hash = hex
        self.queue = [self.domain_url]
        self.filtered_url = []
        self.filtered_page_collection = {}
        self.index = 0

    def init_data_remote(self, method_save_collection):
        self.method_save_collection = method_save_collection

    def init_cache_file(self):

        path = Path('./cache/%s.json' % self.domain_hash)
        if (not path.is_file()):
            path.touch()
            self.save_cache_state()
        else:
            self.load_chache_state()

    def load_chache_state(self):

        with open('./cache/%s.json' % self.domain_hash) as json_file:
            data = json.load(json_file)
            # print(data.filtered_url)
            self.filtered_url = json.loads(data)['filtered_url']
            self.queue = json.loads(data)['queue']

    def save_cache_state(self):
        data = {
            'queue': self.queue,
            'filtered_url': self.filtered_url
        }
        json_string = json.dumps(data)
        with open('./cache/%s.json' % self.domain_hash, 'w') as outfile:
            json.dump(json_string, outfile)

    def save_data(self):
        self.method_save_collection(self.filtered_page_collection)
        self.filtered_page_collection = {}

    def filter_page_url(self, page: Page):
        self.index += 1

        if (self.queue_empty()):
            self.save_data()
            return

        if (self.index % 50 == 0):
            self.save_data()
            self.save_cache_state()

        url = self.queue.pop()
        self.filtered_url.append(url)
        self.filtered_page_collection[url] = {}
        logging.info('[%d] url: %s queue length: %d' %
                     (self.index, url, len(self.queue)))

        if (self.has_file(page, url)):
            return

        page.goto(url)
        page.wait_for_load_state()

        if (self.has_404(page, url)):
            return

        anchor_elements = page.locator('a')
        anchor_elements_count = anchor_elements.count()

        for idx in range(anchor_elements_count):
            anchor = anchor_elements.nth(idx)
            self.filter_anchor_href(url, anchor)

        self.filter_page_url(page)

    def queue_empty(self, ):
        if (len(self.queue) < 1):
            print('Queue is empty. Crawler stops')
            return True

        return False

    def filter_anchor_href(self, url: str, anchor: Locator):
        try:
            anchor_href = anchor.evaluate('(el)=> el.href')
            if (anchor_href not in self.queue and anchor_href not in self.filtered_url and self.domain_url in anchor_href):
                self.queue.append(anchor_href)
        except Exception as e:
            print(e)
            if ('errors' in self.filtered_page_collection[url]):
                self.filtered_page_collection[url]['errors'].append(e)
            else:
                self.filtered_page_collection[url]['errors'] = [e]
            pass

    def has_file(self, page: Page, url: str) -> bool:
        headers = requests.head(url).headers
        if ('text/html' not in headers['Content-Type']):
            self.filter_page_url(page)
            self.filtered_page_collection[url]["is_file"] = True
            return True

        return False

    def has_404(self, page: Page, url: str) -> bool:
        body = page.locator('body')
        try:
            if (expect(body).to_contain_text("404") == None):
                self.filter_page_url(page)
                self.filtered_page_collection[url]["is_404"] = True
                return True
        except Exception as e:
            pass

        return False

    def run_crawling(self, page: Page):
        self.filter_page_url(page)
