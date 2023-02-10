import BaseSchema from 'sosise-core/build/Database/BaseSchema';
import * as faker from 'faker';

/**
 * If you need more information, see: http://knexjs.org/#Schema ; https://www.npmjs.com/package/faker
 */
export default class SearchTag extends BaseSchema {
    /**
     * Restrict running the seed only in a local environment (APP_ENV=local)
     */
    protected onlyInLocalEnvironment = false;

    /**
     * Table name where data should be inserted in
     */
    protected tableName = 'table_name_comes_here';

    /**
     * Run seed
     */
    public async run(): Promise<void> {
        // Prepare data to seed
        const data: any = [
            
        ];

        // Insert to table
        await this.dbConnection.table(this.tableName).insert(data);
    }
}
