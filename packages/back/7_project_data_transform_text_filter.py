#%%


from analytics_utility import *

import sys
import logging


logging.basicConfig(filename='process.txt', level=logging.INFO, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p', filemode="a")  # configure logging file
logging.info('start 6_project_data_transform_update')

group_id = sys.argv[1]

df = get_page_tag_data_by_type(group_id)
df.loc[(df['data_type_id']!=204) & (df['data_type_id']!=304) & (df['data_type_id']!=104) & (df['data_type_id']!=104)].to_csv('./test.csv', index=False)

#%%

from nltk.tokenize import word_tokenize

def extract_features(text):
    # Check if text contains a comma
    if text.count(',') >= 2:
        return 'contains_comma'
    else:
        return 'no_comma'


def preprocess_text(text):
    # Replace multiple commas with a single space
    text = re.sub(r',+', ' ', text)
    # Remove any non-alphanumeric characters
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    # Convert to lowercase
    text = text.lower()
    # Split into words
    words = text.split()
    # Remove stop words (if necessary)
    # ...
    # Join the words back into a string
    text = ' '.join(words)
    return text

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.pipeline import Pipeline
from sklearn.svm import LinearSVC

# Define the feature extractor
vectorizer = CountVectorizer(preprocessor=preprocess_text, tokenizer=word_tokenize, ngram_range=(1,2), binary=True)

# Define the classifier
clf = LinearSVC()

# Define the pipeline
pipeline = Pipeline([
    ('feature_extractor', vectorizer),
    ('classifier', clf)
])

# Train the pipeline
X_train = [
    'This is a sentence.', 
    'В статье проанализированы основные проблемы, возникающие от использования микроволновых печей, отмечены необоснованные рекомендации по длительности обработки продуктов. Не правильное применение микроволнового разогрева и нарушения правил техники безопасности приводит к негативным изменениям в организме благодаря  аминокислот Приведены сведения об экспериментальных данных обработки воды в СВЧ-поле, определены температурные зависимости для воды объемом 100 мл и 200 мл от длительности обработки в СВЧ-поле, а также рассчитаны и построены зависимости количества поглощенной водой теплоты от времени обработки. Предложены зависимости для расчета конечной температуры воды и градиента температур в условиях эксперимента. Установлено, что время релаксации микроволн в воде практически равно 0 с. Для обеспечения более щадящего действия на продукт в СВЧ-поле не рекомендуется для разогрева продуктов увеличивать время обработки свыше 1 мин.для более безопасного употребления разогретых продуктов в пищу.  Их целесообразно выдержать после обработки в течении 1 мин. СВЧ-поле, микроволны, релаксация, вода, температура, количество теплоты.',
    'Досумов К., Чурина Д. Х.,  Кенесов Б.Н., Байматова Н.Х., Майлина'
    ]
y_train = [0, 0, 1]
pipeline.fit(X_train, y_train)

# Use the pipeline to make predictions
X_test = ['This is a test sentence.', 'This sentence also contains a comma.']
y_pred = pipeline.predict(X_train)
print(y_pred)
# X_train[2].count(',')>