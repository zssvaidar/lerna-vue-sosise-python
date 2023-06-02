import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema ; https://www.npmjs.com/package/faker
 */
export default class DictTagDataType extends BaseSchema {
    /**
     * Restrict running the seed only in a local environment (APP_ENV=local)
     */
    protected onlyInLocalEnvironment = false;

    /**
     * Table name where data should be inserted in
     */
    protected tableName = 'site_dict_tag_data_type';

    /**
     * Run seed
     */
    public async run(): Promise<void> {
        // Prepare data to seed
        const data: any = [

            { id: 1, code: 'pub_cat', label: 'Категория публикаций' },
            { id: 2, code: 'pub_type', label: 'Тип научной публикаций' }, // статья, доклад, труд
            { id: 3, code: 'pub_title', label: 'Название публикаций' },
            { id: 4, code: 'pub_source', label: 'Источник публикаций' },
            { id: 5, code: 'pub_theme', label: 'Тема публикаций (теги)' },
            { id: 6, code: 'pub_content', label: 'Содержание статьи' },
            { id: 7, code: 'pub_abstract', label: 'Абстракт'},
            { id: 8, code: 'pub_tags', label: 'Теги'},
            { id: 9, code: 'pub_keyword', label: 'Ключевые слова'},
            { id: 10, code: 'pub_date', label: 'Дата публикаций' },
            { id: 11, code: 'pub_mrnti', label: 'МРНТИ'},
            { id: 12, code: 'pub_main_link', label: 'Главная ссылка публикаций' },
            { id: 13, code: 'pub_link', label: 'Ссылки в публикаций' },
            { id: 14, code: 'pub_entity', label: 'Найменования сущностей' },
            { id: 15, code: 'theme_review', label: 'Рецензия'},
            { id: 16, code: 'author_name',label: 'Имя автора' },
            { id: 17, code: 'author_names',label: 'Имена авторов' },
            { id: 18, code: 'author_affiliate',label: 'Аффилиация автора' },
            { id: 19, code: 'authors_affiliate',label: 'Аффилиация авторов' },
            { id: 20, code: 'author_degree',label: 'Степень автора' },
            { id: 21, code: 'noice',label: 'Шум' },
            { id: 22, code: 'termin', label: 'Термин' },

            // { /* id: 1, */ code: 'pub_cat', label: 'Категория публикаций' },
            // { /* id: 2, */ code: 'pub_type', label: 'Тип научной публикаций' }, // статья, доклад, труд
            // { /* id: 3, */ code: 'pub_name', label: 'Название публикаций' },
            // { /* id: 4, */ code: 'pub_source', label: 'Источник публикаций' },
            // { /* id: 5, */ code: 'pub_theme', label: 'Тема публикаций (теги)' },
            // { /* id: 6, */ code: 'pub_content', label: 'Содержание статьи' },
            // { /* id: 7, */ code: 'pub_abstract', label: 'Абстракт'},
            // { /* id: 8, */ code: 'pub_date', label: 'Дата публикаций' },
            // { /* id: 9, */ code: 'pub_main_link', label: 'Главная ссылка публикаций' },
            // { /* id: 10, */ code: 'pub_link', label: 'Ссылки в публикаций' },

            // { /* id: 11, */ code: 'theme_review', label: 'Рецензия'},

            // { /* id: 12, */ code: 'author_name',label: 'Имя автора' },
            // { /* id: 13, */ code: 'author_names',label: 'Имена авторов' },
            // { /* id: 14, */ code: 'author_affiliate',label: 'Аффилиация автора' },
            // { /* id: 15, */ code: 'authors_affiliate',label: 'Аффилиация авторов' },
            // { /* id: 16, */ code: 'author_degree',label: 'Степень автора' },

            // { /* id: 17, */ code: 'noice',label: 'Шум' },
            // { /* id: 18, */ code: 'termin', label: 'Термин' },

        ];

        // Insert to table
        await this.dbConnection.table(this.tableName).insert(data);
    }
}
