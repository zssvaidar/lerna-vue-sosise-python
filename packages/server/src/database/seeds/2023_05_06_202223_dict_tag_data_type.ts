import BaseSchema from 'sosise-core/build/Database/BaseSchema';
import * as faker from 'faker';

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
            { label: 'Категория публикаций' },
            { label: 'Тип научной публикаций' }, // статья, доклад, труд
            { label: 'Название публикаций' },
            { label: 'Источник публикаций' },
            { label: 'Тема публикаций (теги)' },
            { label: 'Содержание статьи' },
            { label: 'Абстракт'},
            { label: 'Дата публикаций' },
            { label: 'Главная ссылка публикаций' },
            { label: 'Ссылки в публикаций' },

            { label: 'Имя автора' },
            { label: 'Имена авторов' },
            { label: 'Аффилиация автора' },
            { label: 'Аффилиация авторов' },
            { label: 'Степень автора' }

        ];

        // Insert to table
        await this.dbConnection.table(this.tableName).insert(data);
    }
}
