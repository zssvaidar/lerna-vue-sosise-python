import BaseSchema from 'sosise-core/build/Database/BaseSchema';
import * as faker from 'faker';
import crypto from 'crypto';

/**
 * If you need more information, see: http://knexjs.org/#Schema ; https://www.npmjs.com/package/faker
 */
export default class User extends BaseSchema {
    /**
     * Restrict running the seed only in a local environment (APP_ENV=local)
     */
    protected onlyInLocalEnvironment = false;

    /**
     * Table name where data should be inserted in
     */
    protected tableName = 'user';

    /**
     * Run seed
     */
    public async run(): Promise<void> {
        const hashPass = crypto.createHash('sha256').update('123').digest('base64');
        // Prepare data to seed
        const data: any = [
            {   username: 'zssvaidar@gmail.com',
                email: 'zssvaidar@gmail.com',
                password: hashPass,
                is_admin: true,
                is_active: true
            }
        ];

        // Insert to table
        await this.dbConnection.table(this.tableName).insert(data);
    }
}
