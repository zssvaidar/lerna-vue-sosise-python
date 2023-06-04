import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema ; https://www.npmjs.com/package/faker
 */
export default class SiteDataSearchType extends BaseSchema {
    /**
     * Restrict running the seed only in a local environment (APP_ENV=local)
     */
    protected onlyInLocalEnvironment = false;

    /**
     * Table name where data should be inserted in
     */
    protected tableName = 'site_data_search_type';

    /**
     * Run seed
     */
    public async run(): Promise<void> {
        // Prepare data to seed
        const data: any = [
            { label: 'Глобальный поиск по категориям', type: 'default' },
            { label: 'По сайту', type: 'site' },
            { label: 'По ключевым словам', type: 'keyword' },
            { label: 'Поиск по типам ner ', type: 'ner' },
        ];

        // Insert to table
        await this.dbConnection.table(this.tableName).insert(data);
    }
}
