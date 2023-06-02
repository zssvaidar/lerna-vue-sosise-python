import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema ; https://www.npmjs.com/package/faker
 */
export default class DictTagTextDataType extends BaseSchema {
    /**
     * Restrict running the seed only in a local environment (APP_ENV=local)
     */
    protected onlyInLocalEnvironment = false;

    /**
     * Table name where data should be inserted in
     */
    protected tableName = 'site_dict_tag_text_data_type';

    /**
     * Run seed
     */
    public async run(): Promise<void> {
        // Prepare data to seed
        const data: any = [
            { id: 101, lang_id: 1, code: 'pub_cat', label: 'Категория публикаций' },
            { id: 102, lang_id: 1, code: 'pub_type', label: 'Тип научной публикаций' }, // статья, доклад, труд
            { id: 103, lang_id: 1, code: 'pub_title', label: 'Название публикаций' },
            { id: 104, lang_id: 1, code: 'pub_source', label: 'Источник публикаций' },
            { id: 105, lang_id: 1, code: 'pub_theme', label: 'Тема публикаций (теги)' },
            { id: 106, lang_id: 1, code: 'pub_content', label: 'Содержание статьи' },
            { id: 107, lang_id: 1, code: 'pub_abstract', label: 'Абстракт'},
            { id: 108, lang_id: 1, code: 'pub_tags', label: 'Теги'},
            { id: 109, lang_id: 1, code: 'pub_keyword', label: 'Ключевые слова'},
            { id: 110, lang_id: 1, code: 'pub_date', label: 'Дата публикаций' },
            { id: 111, lang_id: 1, code: 'pub_mrnti', label: 'МРНТИ'},
            { id: 112, lang_id: 1, code: 'pub_main_link', label: 'Главная ссылка публикаций' },
            { id: 113, lang_id: 1, code: 'pub_link', label: 'Ссылки в публикаций' },
            { id: 114, lang_id: 1, code: 'pub_entity', label: 'Найменования сущностей' },
            { id: 115, lang_id: 1, code: 'theme_review', label: 'Рецензия'},
            { id: 116, lang_id: 1, code: 'author_name',label: 'Имя автора' },
            { id: 117, lang_id: 1, code: 'author_names',label: 'Имена авторов' },
            { id: 118, lang_id: 1, code: 'author_affiliate',label: 'Аффилиация автора' },
            { id: 119, lang_id: 1, code: 'authors_affiliate',label: 'Аффилиация авторов' },
            { id: 120, lang_id: 1, code: 'author_degree',label: 'Степень автора' },
            { id: 121, lang_id: 1, code: 'noice',label: 'Шум' },
            { id: 122, lang_id: 1, code: 'termin', label: 'Термин' },

            { id: 201, lang_id: 2, code: 'pub_cat', label: 'Категория публикаций' },
            { id: 202, lang_id: 2, code: 'pub_type', label: 'Тип научной публикаций' }, // статья, доклад, труд
            { id: 203, lang_id: 2, code: 'pub_title', label: 'Название публикаций' },
            { id: 204, lang_id: 2, code: 'pub_source', label: 'Источник публикаций' },
            { id: 205, lang_id: 2, code: 'pub_theme', label: 'Тема публикаций (теги)' },
            { id: 206, lang_id: 2, code: 'pub_content', label: 'Содержание статьи' },
            { id: 207, lang_id: 2, code: 'pub_abstract', label: 'Абстракт'},
            { id: 208, lang_id: 2, code: 'pub_tags', label: 'Теги'},
            { id: 209, lang_id: 2, code: 'pub_keyword', label: 'Ключевые слова'},
            { id: 210, lang_id: 2, code: 'pub_date', label: 'Дата публикаций' },
            { id: 211, lang_id: 2, code: 'pub_mrnti', label: 'МРНТИ'},
            { id: 212, lang_id: 2, code: 'pub_main_link', label: 'Главная ссылка публикаций' },
            { id: 213, lang_id: 2, code: 'pub_link', label: 'Ссылки в публикаций' },
            { id: 214, lang_id: 2, code: 'pub_entity', label: 'Найменования сущностей' },
            { id: 215, lang_id: 2, code: 'theme_review', label: 'Рецензия'},
            { id: 216, lang_id: 2, code: 'author_name',label: 'Имя автора' },
            { id: 217, lang_id: 2, code: 'author_names',label: 'Имена авторов' },
            { id: 218, lang_id: 2, code: 'author_affiliate',label: 'Аффилиация автора' },
            { id: 219, lang_id: 2, code: 'authors_affiliate',label: 'Аффилиация авторов' },
            { id: 220, lang_id: 2, code: 'author_degree',label: 'Степень автора' },
            { id: 221, lang_id: 2, code: 'noice', label: 'Шум' },
            { id: 222, lang_id: 2, code: 'termin', label: 'Термин' },

            { id: 301, lang_id: 3, code: 'pub_cat', label: 'Категория публикаций' },
            { id: 302, lang_id: 3, code: 'pub_type', label: 'Тип научной публикаций' }, // статья, доклад, труд
            { id: 303, lang_id: 3, code: 'pub_title', label: 'Название публикаций' },
            { id: 304, lang_id: 3, code: 'pub_source', label: 'Источник публикаций' },
            { id: 305, lang_id: 3, code: 'pub_theme', label: 'Тема публикаций (теги)' },
            { id: 306, lang_id: 3, code: 'pub_content', label: 'Содержание статьи' },
            { id: 307, lang_id: 3, code: 'pub_abstract', label: 'Абстракт'},
            { id: 308, lang_id: 3, code: 'pub_tags', label: 'Теги'},
            { id: 309, lang_id: 3, code: 'pub_keyword', label: 'Ключевые слова'},
            { id: 310, lang_id: 3, code: 'pub_date', label: 'Дата публикаций' },
            { id: 311, lang_id: 3, code: 'pub_mrnti', label: 'МРНТИ'},
            { id: 312, lang_id: 3, code: 'pub_main_link', label: 'Главная ссылка публикаций' },
            { id: 313, lang_id: 3, code: 'pub_link', label: 'Ссылки в публикаций' },
            { id: 314, lang_id: 3, code: 'pub_entity', label: 'Найменования сущностей' },
            { id: 315, lang_id: 3, code: 'theme_review', label: 'Рецензия'},
            { id: 316, lang_id: 3, code: 'author_name',label: 'Имя автора' },
            { id: 317, lang_id: 3, code: 'author_names',label: 'Имена авторов' },
            { id: 318, lang_id: 3, code: 'author_affiliate',label: 'Аффилиация автора' },
            { id: 319, lang_id: 3, code: 'authors_affiliate',label: 'Аффилиация авторов' },
            { id: 320, lang_id: 3, code: 'author_degree',label: 'Степень автора' },
            { id: 321, lang_id: 3, code: 'noice',label: 'Шум' },
            { id: 322, lang_id: 3, code: 'termin', label: 'Термин' },

            // { id: 200, lang_id: 1, label: 'Шум', name: 'noise' },
            // { id: 201, lang_id: 1, label: 'Название', name: 'title' },
            // { id: 202, lang_id: 1, label: 'Имя', name: 'name' },
            // { id: 203, lang_id: 1, label: 'Дата', name: 'date' },
            // { id: 204, lang_id: 1, label: 'Контент', name: 'content' },
            // { id: 205, lang_id: 1, label: 'Тег', name: 'tag' },
            // { id: 206, lang_id: 1, label: 'Термин', name: 'termin' },
            // { id: 207, lang_id: 1, label: 'Имена', name: 'names' },
            // { id: 208, lang_id: 1, label: 'МРНТИ', name: 'grnti' },
            // { id: 209, lang_id: 1, label: 'Найменование', name: 'named_entity' },
            // { id: 210, lang_id: 1, label: 'Цитата', name: 'citation' },

            // { id: 300, lang_id: 1, label: 'Шум', name: 'noise' },
            // { id: 301, lang_id: 1, label: 'Название', name: 'title' },
            // { id: 302, lang_id: 1, label: 'Имя', name: 'name' },
            // { id: 303, lang_id: 1, label: 'Дата', name: 'date' },
            // { id: 304, lang_id: 1, label: 'Контент', name: 'content' },
            // { id: 305, lang_id: 1, label: 'Тег', name: 'tag' },
            // { id: 306, lang_id: 1, label: 'Термин', name: 'termin' },
            // { id: 307, lang_id: 1, label: 'Имена', name: 'names' },
            // { id: 308, lang_id: 1, label: 'МРНТИ', name: 'grnti' },
            // { id: 309, lang_id: 1, label: 'Найменование', name: 'named_entity' },
            // { id: 310, lang_id: 1, label: 'Цитата', name: 'citation' },
        ];


        // Insert to table
        await this.dbConnection.table(this.tableName).insert(data);
    }
}
