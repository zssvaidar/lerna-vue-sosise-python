from analytics_utility import *
from sklearn.model_selection import train_test_split

df = get_page_tag_data(True)
store_df(df)
df = transform_text(df)
df_en, df_kz, df_ru = identify_lanuage_split_train_test(df)
df_en, df_kz, df_ru = set_target_column(df_en), set_target_column(df_kz), set_target_column(df_ru),

train_en, test_en = train_test_split(df_en, test_size=0.8, random_state=11)
train_kz, test_kz = train_test_split(df_kz, test_size=0.8, random_state=11)
train_ru, test_ru = train_test_split(df_ru, test_size=0.8, random_state=11)

postfix='1'

# train_en.to_csv('data/en/train%s.csv'%postfix, index=False)
# train_kz.to_csv('data/kz/train%s.csv'%postfix, index=False)
# train_ru.to_csv('data/ru/train%s.csv'%postfix, index=False)

target_ids ={
    'kz': [
        ('noise', 100),
        ('title', 101),
        ('name', 102),
        ('date', 103),
        ('content', 104),
        ('tag', 105),
        ('termin', 106),
        ('names', 107),
        ('grnti', 108),
        ('named_entity', 109),
        ('citation', 110)
    ],
    'ru': [
        ('noise', 200),
        ('title', 201),
        ('name', 202),
        ('date', 203),
        ('content', 204),
        ('tag', 205),
        ('termin', 206),
        ('names', 207),
        ('grnti', 208),
        ('named_entity', 209),
        ('citation', 210)
    ],
    'en': [
        ('noise', 300),
        ('title', 301),
        ('name', 302),
        ('date', 303),
        ('content', 304),
        ('tag', 305),
        ('termin', 306),
        ('names', 307),
        ('grnti', 308),
        ('named_entity', 309),
        ('citation', 310)
    ]
}