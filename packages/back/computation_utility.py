#%%

import mysql.connector as sql
from datetime import date
import pandas as pd
import numpy
import fasttext
import re

def get_site_tag_data():
    #### Initlialize mysql connection
    db_connection = sql.connect( host='localhost', port= 3306,
                                database='dp3_database', user='root', password=1234) 
                                
    cursor = db_connection.cursor()

    cursor.execute(
        ''
    )
    
    table_rows = cursor.fetchall()
    

#%%
#%%
from analytics_utility import *
import mysql.connector as sql
from datetime import date
import pandas as pd
import numpy
import fasttext
import re

#### Initlialize mysql connection
db_connection = sql.connect( host='localhost', port= '3306',
                            database='dp3_database', user='root', password='1234') 
                      
cursor = db_connection.cursor()

cursor.execute(
    '''
        SELECT parser_group_url_tag_info.id, tag_id as tagId, parent_id as parentId, url_group_id as groupId, depth, tag, text, xpath, select_tag as selectTag,
            select_child_tags as selectChildTags, tag_data_type_id as tagDataTypeId, site_dict_tag_data_type.code
    FROM parser_group_url_tag_info
    LEFT JOIN site_dict_tag_data_type ON
        parser_group_url_tag_info.tag_data_type_id = site_dict_tag_data_type.id
    WHERE
        LENGTH(text) > 1
    LIMIT 25000
''')

table_rows = cursor.fetchall()

columns = [d[0] for d in cursor.description]
df = pd.DataFrame(table_rows, columns=columns)

df = transform_text(df)
df_en, df_kz, df_ru = identify_lanuage_split_train_test(df)

#%%
import snowballstemmer
import nltk
# nltk.download('stopwords')
language = 'russian'
stopwords = nltk.corpus.stopwords.words(language)
stemmer = snowballstemmer.stemmer(language);

# frequencies = df_ru['text'].value_counts().reset_index()

words = df_ru['text'].str.split(expand=True).stack()
stemmed_words = stemmer.stemWords(words)
stemmed_words = pd.Series(stemmed_words)
# stemmed_words.value_counts().reset_index()

# Filter stopwords
filtered_words = stemmed_words[~stemmed_words.isin(stopwords)]
# Filter numbers out
filtered_words = filtered_words[pd.to_numeric(filtered_words, errors='coerce').isna()]

frequencies = filtered_words.value_counts().reset_index()

sorted_frequencies = frequencies.sort_values(by='count', ascending=True)

result = sorted_frequencies.values.tolist()

result
#%%


#%%
len(df_en['text'])