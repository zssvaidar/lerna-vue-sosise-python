#%%

from playwright.sync_api import Page, Locator, expect
from playwright.sync_api import sync_playwright
from playwright_dompath.dompath_sync import xpath_path

# df = pd.read_csv('./data/urls.csv')
# df2 = df.copy()
# df['is_edge'] = False

# for index, row in df.iterrows():
#     # print(row[])
#     data.fChi2.loc[idx] = fChi2

import re
e = [
'/html/body/div[4]/div[1]/ul/li[1]/a',
'/html/body/div[4]/div[1]/ul/li[2]/a',
'/html/body/div[4]/div[1]/ul/li[3]/a',
'/html/body/div[4]/div[1]/ul/li[4]/a',
'/html/body/div[4]/div[1]/ul/li[5]/a',
'/html/body/div[4]/div[1]/ul/li[6]/a',
'/html/body/div[4]/div[2]/ul/li[1]/a',
]
# Авторларға арналған ережелер
# Мақала жазу үлгісі
# Әдебиеттер тізімінің үлгісі
# Автормен шарт жасасу
# Транслитерация ГОСТ 7.79-2000
# Инструкция по транслитерации

with sync_playwright() as p:
    browser_type = p.chromium
    browser = browser_type.launch(headless=False)
    page = browser.new_page()
    
    page.goto('http://www.vestnik.nauka.kz/kz/vypusk-4/issledovanie-sovremennyx-metodov-razrabotki-baz-dannyx-dlya-informacionnyx-sistem.php')
    
    for item in e:
        
    # xpath = xpath_path(element).replace('"','\'')
        try:
            href = page.locator('xpath=%s'%(item)).inner_html()
            print(href)
        except Exception as e:
            print(e)
        