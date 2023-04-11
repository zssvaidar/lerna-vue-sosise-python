from utility import WebCrawler, ApiRequests
crawler = WebCrawler()

url_data = crawler.fetch_resource_urls()
crawler.prepare_resource_links(url_data)

api = ApiRequests()
crawler.run_crawler(api)
