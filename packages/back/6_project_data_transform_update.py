from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC
from analytics_utility import *
import pandas as pd
import requests

def update_page_data_type(page_tag_data_id, data):
    url = 'http://localhost:10000/api/v1/site/pageTag/%s' % page_tag_data_id
    requests.put(url, json=data)

def train_model(lang_path):
    
    df = get_stored_df(lang_path)

    X = df['text']
    Y = df['target'].values

    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_df=0.75, min_df=2, ngram_range=(1,2))),
        ('clf', OneVsRestClassifier(LinearSVC(C=1)))
    ])

    pipeline.fit(X, Y)

    return pipeline, X, Y

def predict(pipeline, df, freq=False):

    test_X = df['text']
    y_pred = pipeline.predict(test_X)

    if(freq):
        return pd.DataFrame(y_pred).value_counts()

    return y_pred

import sys
import logging

logging.basicConfig(filename='process.txt', level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a")  # configure logging file
logging.info('start 6_project_data_transform_update')

group_id = sys.argv[1]

df = get_page_tag_data(group_id)

df = transform_text(df)
df_en, df_kz, df_ru = identify_lanuage_split_train_test(df)
df_en, df_kz, df_ru = set_target_column(df_en), set_target_column(df_kz), set_target_column(df_ru),

pipeline_en, train_X_en, train_Y_en = train_model('./data/en/train.csv')
pipeline_ru, train_X_ru, train_Y_ru = train_model('./data/ru/train.csv')
pipeline_kz, train_X_kz, train_Y_kz = train_model('./data/kz/train.csv')

# predict(pipeline_en, df_en)
df_en['target'] = predict(pipeline_en, df_en)
df_ru['target'] = predict(pipeline_ru, df_ru)
df_kz['target'] = predict(pipeline_kz, df_kz)

logging.info(df_en['target'].value_counts().to_string().replace('\n', ';'))
logging.info(df_ru['target'].value_counts().to_string().replace('\n', ';'))
logging.info(df_kz['target'].value_counts().to_string().replace('\n', ';'))

df_ru['target'].value_counts().values
logging.info('end 6_project_data_transform_update')

for _, row in df_en.iterrows():
    update_page_data_type(row['id'], { 'text_type_id': row['target'] })

for _, row in df_ru.iterrows():
    update_page_data_type(row['id'], { 'text_type_id': row['target'] })

for _, row in df_kz.iterrows():
    update_page_data_type(row['id'], { 'text_type_id': row['target'] })

logging.info('end 6_project_data_transform_update')
