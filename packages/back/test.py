from utility import WebCrawler
crawler = WebCrawler()

links = crawler.fetch_resource_links()
crawler.prepare_resource_links(links)

crawler.run_crawler()

print(crawler.domain_urls)