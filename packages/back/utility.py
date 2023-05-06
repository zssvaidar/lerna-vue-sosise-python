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
import time

logging.basicConfig(filename='logs/logs.txt', level=logging.INFO, format='%(asctime)s %(message)s',
                    datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a")  # configure logging file
logging.info('start')


class CrawlerDomainType():
    def __init__(self, data):
        self.id = data['id']
        self.url = data['url']

    def __str__(self):
        return "CrawlerDomainType id: <%d> url: <%s>" % (self.id, self.url)

class ParserPageGroupUrlType():
    def __init__(self, data):
        self.id = data['id']
        self.url = data['url']
        self.domainId = data['domainId']
        self.pageId = data['pageId']
        self.groupUrl = data['groupUrl']
        self.url = data['url']
        self.pageIds = data['pageIds']
        self.count = data['count']

class GroupUrlTagType():
    def __init__(self, data):
        self.id = data['id']
        self.tagId = data['tagId']
        self.parentId = data['parentId']
        self.groupId = data['groupId']
        self.depth = data['depth']
        self.tag = data['tag']
        self.text = data['text']
        self.xpath = data['xpath']
        self.selectTag = data['selectTag']

class PageUrlType():
    def __init__(self, data):
        self.id = data['id']
        self.domainId = data['domainId']
        self.url = data['url']
        self.type = data['type']
        self.groupId = data['groupId']

class ApiRequests():
    def __init__(self):
        self.crawler_domain_url: str = 'http://localhost:10000/api/v1/domainurls/%d'
        self.crawler_url_store: str = 'http://localhost:10000/api/v1/domainurls/url'
        
        self.parser_create_url_group: str = 'http://localhost:10000/api/v1/parser/domain/%s/urlGroups'
        self.parser_url_group: str = 'http://localhost:10000/api/v1/parser/domain/%s/urlGroups?split=%s'
        self.parser_url_group_tag_store: str = 'http://localhost:10000/api/v1/parser/domain/%s/urlGroups/%s/urlGroupTags'
        
        self.group_page_and_tag_info: str = 'http://localhost:10000/api/v1/parser/domain/%s/urlGroups/%s/pageTags'
        self.page_tag_info: str = 'http://localhost:10000/api/v1/parser/domain/%s/urlGroups/%s/page/%s/pageTags'

    def get_parser_domain_link(self, id: int, log=False) -> list[CrawlerDomainType]:
        try:
            response = requests.get(self.crawler_domain_url % (id))
        except Exception as e:
            raise ConnError('Ошибка подключения')

        if (log):
            print(response.json())

        # data: list[CrawlerDomainType] = list(map(CrawlerDomainType, get(response.json(), "data", {})))

        return CrawlerDomainType(response.json()['data'])

    def post_page_url(self, url_data, log=False):
        try:
            response = requests.post(self.crawler_url_store, json=url_data)

            if (response.json()['code'] == 5001):
                print(8 * ' ', 'duplciate entry %s' % (str(url_data)))
                logging.error('duplciate entry % s' % (str(url_data)))

        except Exception as e:
            raise ConnError('Ошибка подключения %s' % (self.crawler_url_store))

        if (log):
            print(response.json())

    def post_parser_url(self, domainId, groupUrlId, url_data, log=False):
        try:
            response = requests.post(self.parser_url_group_tag_store%(domainId, groupUrlId), json=url_data)
        except Exception as e:
            raise ConnError('Ошибка подключения %s' % (self.parser_url_group_tag_store))

        if (log):
            print(response.json())

    def create_parser_group_urls(self, id: int, split: int):
        url = self.parser_create_url_group % (id)
        response = requests.post(url, json ={'id': id, 'split': split })
        
    def get_parser_group_urls(self, id: int, split: int):
        url = self.parser_url_group % (id, split)
        response = requests.get(url)
        
        return response.json()['data']
    
    def get_stored_group_tag_info(self, domain_id, group_id):
        url = self.group_page_and_tag_info % (domain_id, group_id)
        response = requests.get(url)
        
        return response.json()['data']

    def post_page_tag_data(self, domain_id, group_id, page_id, parser_data):
        url = self.page_tag_info % (domain_id, group_id, page_id)
        response = requests.post(url, json = parser_data)

class WebCrawler():
    def __init__(self):
        self.api = ApiRequests()

    def fetch_domain_url(self, id):
        data = self.api.get_parser_domain_link(id)
        return data

    def store_resource_url_pages(self, domainId, page_collection, api: ApiRequests):
        for url, page_data in page_collection.items():
            data = {'url': url, 'domain_id': domainId}
            print(data)
            if ('is_404' in page_data):
                data['type'] = '404'

            if ('is_file' in page_data):
                data['type'] = 'file'

            api.post_page_url(data)

    def prepare_resource_links(self, url_data):
        self.domain_url_data: CrawlerDomainType = url_data

    def prepare_page_group_links(self, url_data=[]):
        self.url_data: list[ParserPageGroupUrlType] = url_data

    def prepare_page_group_tags(self, domain_id, group_id, page_url = [], group_tag_info=[]):
        self.domain_id = domain_id
        self.group_id = group_id
        self.tag_data: list[GroupUrlTagType] = group_tag_info
        self.page_data: list[PageUrlType] = page_url

    def run_crawler(self, remote_api: ApiRequests, script):

        def method_save_collection(domainId, page_collection):
            self.store_resource_url_pages(domainId, page_collection, remote_api)

        with sync_playwright() as p:
            browser_type = p.chromium
            browser = browser_type.launch(headless=False)
            page = browser.new_page()

            timeout = 60000
            page.set_default_navigation_timeout(timeout)
            page.set_default_timeout(timeout)

            filter = DomainUrlPath(self.domain_url_data.id, self.domain_url_data.url)
            filter.init_crawler_remote(method_save_collection, self.domain_url_data.id)
            filter.init_cache_file()
            filter.run_crawling(page, script)


    def store_group_tags_data(self, domainId, groupUrlId, parser_data, api: ApiRequests):
        api.post_parser_url(domainId, groupUrlId, parser_data)

    def run_crawler_parser_on_page_group(self, remote_api: ApiRequests):

        def method_save_collection(domainId, groupUrlId, parser_data):
            self.store_group_tags_data(domainId, groupUrlId, parser_data, remote_api)
            
        with sync_playwright() as p:
            browser_type = p.chromium
            browser = browser_type.launch(headless=False)
            page = browser.new_page()

            timeout = 60000
            page.set_default_navigation_timeout(timeout)
            page.set_default_timeout(timeout)
            
            for url_data in self.url_data:
                id = url_data['id']
                url = url_data['url']
                domainId = url_data['domainId']

                filter = DomainUrlPath(domainId, url)
                filter.init_parser_remote(method_save_collection, id, domainId)
                filter.run_crawling(page, 2)
                filter.save_data(True)


    def store_page_tags_data(self, domain_id, group_id, page_id, parser_data, api: ApiRequests):
        api.post_page_tag_data(domain_id, group_id, page_id, parser_data)

    def run_collect_tag_tag_data(self, remote_api: ApiRequests):
        
        def method_save_data(domain_id, group_id, page_id, parser_data):
            self.store_page_tags_data(domain_id, group_id, page_id, parser_data, remote_api)

        with sync_playwright() as p:
            browser_type = p.chromium
            browser = browser_type.launch(headless=False)
            page = browser.new_page()

            timeout = 800
            page.set_default_navigation_timeout(5000)
            page.set_default_timeout(timeout)
            
            for item in self.page_data:
                filter = UrlPage(item['id'], item['url'], self.tag_data, method_save_data)
                filter.run_crawling(page)
                filter.save_data(self.domain_id, self.group_id)
        
            
            
class ConnError(Exception):
    pass


class DomainUrlPath:
    max_tries = 3
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
        
        self.parser_data = [];

    def init_crawler_remote(self, method_save_collection, domainId):
        self.method_save_collection = method_save_collection
        self.domainId = domainId

    def init_parser_remote(self, method_save_collection, groupUrlId, domainId):
        self.method_save_collection = method_save_collection
        self.groupUrlId = groupUrlId
        self.domainId = domainId

    def init_cache_file(self, type: str = ''):

        path = Path('./cache/%s.json' % self.domain_hash)
        if(type == 'parser'):
            path = Path('./cache/%s.json' % self.domain_hash)

        if (not path.is_file()):
            path.touch()
            self.save_cache_state()
        else:
            self.load_chache_state()

    def load_chache_state(self):

        with open('./cache/%s.json' % self.domain_hash) as json_file:
            data = json.load(json_file)
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

    def save_data(self, collect_tags = False):
        if(collect_tags):
            self.method_save_collection(self.domainId, self.groupUrlId, self.parser_data)
            self.parser_data = []
        else:
            self.method_save_collection(self.domainId, self.filtered_page_collection)
            self.filtered_page_collection = {}

    def filter_page_url(self, page: Page):
        self.index += 1

        if (self.queue_empty()):
            self.save_data()
            return

        if (self.index % 5 == 0):
            self.save_data()
            self.save_cache_state()

        url = self.queue.pop()
        print(url)
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
    
    ID=0
    def go_tree_tag_depth(self, page: Page, item: Locator, depth=0, tagId = 0, parent_id = 0):
        locator = item.locator('>*')
        try:
            tags = locator.evaluate_all("(elements)=> elements.map(element => { return element.tagName })")
            textContents = locator.evaluate_all("(elements)=> elements.map(element => { var textContent = ''; if(element.childNodes.length > 0) for (let node of element.childNodes)  if(node.nodeType == Node.TEXT_NODE) textContent+=node.textContent; return textContent; })")
        except Exception as e:
            print(e)

        if(self.ID % 200 == 0 and self.ID != 0):
            self.save_data(True)

        elements = item.locator('>*').all()

        for idx, element in enumerate(elements):
            self.ID += 1
            if(not textContents[idx].isspace() and textContents[idx] != '' and tags[idx] != 'SCRIPT' and tags[idx] != 'NOSCRIPT' and tags[idx] != 'STYLE'):
                xpath = xpath_path(element, False).replace('"','\'')
                logging.info(('%s')%(xpath))
                data = { 'parentId': parent_id, 'tagId': self.ID, 'depth': depth, 'tag': tags[idx], 'text': textContents[idx], 'xpath': xpath }
                logging.info(('ID: %s TAG: %s TEXT: %s PATH: %s')%(self.ID, tags[idx], textContents[idx], xpath))
                # print(data)
                self.parser_data.append(data)
                # print(parent_id, self.ID, 'depth:', depth, 'tag:', tags[idx], 'text:', textContents[idx])
            else:
                xpath = xpath_path(element, False).replace('"','\'')
                data = { 'parentId': parent_id, 'tagId': self.ID, 'depth': depth, 'tag': tags[idx], 'text': '', 'xpath': xpath }
                self.parser_data.append(data)

            self.go_tree_tag_depth(page, element, depth+1, self.ID, tagId)

    def colelct_tag_data(self, page: Page):
        url = self.domain_url
        
        print(url)
        logging.info(('%s')%(url))
        page.goto(url)
        page.wait_for_load_state()

        body = page.locator('body').all()[0]
        self.go_tree_tag_depth(page, body)
        

    def run_crawling(self, page: Page, script):
        tries = 1
        
        while(self.max_tries != tries):
            try:
                if(script == 1):
                    self.filter_page_url(page)
                elif(script == 2):
                    self.parser_data = []
                    self.colelct_tag_data(page)
                tries = self.max_tries
            except Exception as e:
                print(e)
                logging.error(e)
                tries += 1
                time.sleep(1.5)
                
class UrlPage:
    def __init__(self, page_id, url, tag_data: list[GroupUrlTagType], method_save_data):
        self.page_id = page_id
        self.url = url
        self.tag_data = tag_data
        self.method_save_data = method_save_data

        self.parser_data = {}

    def save_data(self, domain_id, group_id):
        self.method_save_data(domain_id, group_id, self.page_id, self.parser_data)
    
    def run_crawling(self, page: Page):

        page.goto(self.url)

        for item in self.tag_data:
            self.parser_data[item['id']] = { 'tag': item['tag'], 'group_tag_id': item['id'],'tag_id': item['tagId'] }
            try:
                locator = page.locator('xpath=/'+item['xpath']).first
                textContents = locator.evaluate("(element) => { var textContent = '';if(element.childNodes.length > 0) for (let node of element.childNodes)if(node.nodeType == Node.TEXT_NODE) textContent+=node.textContent; return textContent; }")
                self.parser_data[item['id']]['text'] = textContents
                if(item['tag'] == 'A'):
                    href = locator.evaluate("(element)=> element.getAttribute('href') ")
                    if(href is not None):
                        self.parser_data[item['id']]['href'] = href
            except Exception as e:
                self.parser_data[item['id']] = { 'tag': item['tag'], 'group_tag_id': item['id'], 'tag_id': item['tagId'], 'found': False }
                logging.error(e)
