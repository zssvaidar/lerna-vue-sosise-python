import mysql.connector as sql
from datetime import date
import pandas as pd
import numpy
import fasttext
import re

def get_page_tag_data(get_all_pages=False, group_id = None):
    #### Initlialize mysql connection
    db_connection = sql.connect( host='localhost', port= '3306',
                                database='dp3_database', user='root', password='1234') 
                                
    cursor = db_connection.cursor()

    if(get_all_pages):
        cursor.execute('''
            SELECT ptData.id, ptData.text FROM parser_site_url_tag_data as ptData
                join page_url as pUrl
                on ptData.page_id = pUrl.id
            where
                found = 1
        ''')
    else:
        cursor.execute('''
            SELECT ptData.id, ptData.text FROM parser_site_url_tag_data as ptData
                join page_url as pUrl
                on ptData.page_id = pUrl.id
            where
                pUrl.group_id = %s and 
            found = 1
        ''' % (group_id))

    table_rows = cursor.fetchall()
    columns = [d[0] for d in cursor.description]
    df = pd.DataFrame(table_rows, columns=columns)

    return df

def get_page_tag_data_by_type(get_all_pages=False, group_id = None):
    #### Initlialize mysql connection
    db_connection = sql.connect( host='localhost', port= '3306',
                                database='dp3_database', user='root', password='1234') 
                                
    cursor = db_connection.cursor()

    if(get_all_pages):
        cursor.execute('''
            SELECT tdType.id data_type_id, tdType.label, ptData.id, ptData.text FROM parser_site_url_tag_data as ptData
                JOIN page_url AS pUrl
                    ON ptData.page_id = pUrl.id
                JOIN site_dict_tag_text_data_type AS tdType
                    ON ptData.text_type_id = tdType.id
            WHERE
                found = 1
            ORDER BY RIGHT(tdType.id , 2)
        ''')
    else:
        cursor.execute('''
            SELECT ptData.id, ptData.text FROM parser_site_url_tag_data as ptData
                JOIN page_url as pUrl
                ON ptData.page_id = pUrl.id
            WHERE
                pUrl.group_id = %s and 
            found = 1
        ''' % (group_id))

    table_rows = cursor.fetchall()
    columns = [d[0] for d in cursor.description]
    df = pd.DataFrame(table_rows, columns=columns)

    return df

def store_df(df):
    today = date.today()

    df.to_csv('./data/main_data_%s.csv' % str(today))


def get_stored_df(path):

    df = pd.read_csv(path)

    return df
#### Initlialize mysql connection
def transform_text (df):
    def clean_text(text):
        # https://kazakhtili.wordpress.com/2010/08/07/kazakh-alphabet/
        text = re.sub(r'[^a-zA-z0-9а-яА-Я-/ғңқүұәөһіҒҢҚҮҰӘӨҺІ\s]', ' ', text, re.IGNORECASE)
        text = re.sub(r'\s+', ' ', text)
        return text

    df['text'] = df['text'].apply(clean_text)
    df['text'] = df['text'].replace(' ', numpy.nan)
    df = df.dropna(subset=['text'])
    
    return df


def identify_lanuage_split_train_test(df):
    
    # download pre-trained language detection model for Russian, English, and Kazakh
    # https://fasttext.cc/docs/en/language-identification.html
    model_path = 'data/lid.176.bin'
    model = fasttext.load_model(model_path)

    # detect language of each text
    def detect_language(text):
        # text = text.strip()
        
        text = text.replace('\n', '')
        language = model.predict(text)[0][0][-2:]
        if language == 'en':
            return 'en'
        elif language == 'ru':
            return 'ru'
        elif language == 'kk':
            return 'kz'
        else:
            return 'Unknown'
        
    
    df['language'] = df['text'].apply(detect_language)
    df_en = df.loc[df['language'] == 'en'].reset_index(drop=True)
    df_kz = df.loc[df['language'] == 'kz'].reset_index(drop=True)
    df_ru = df.loc[df['language'] == 'ru'].reset_index(drop=True)

    return df_en, df_kz, df_ru

def set_target_column(df):
    
    df['target'] = 0

    target_col = df.pop('target')
    df.insert(0, 'target', target_col)
    
    return df