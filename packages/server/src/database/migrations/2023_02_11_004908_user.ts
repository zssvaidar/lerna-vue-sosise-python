import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema
 */
export default class User extends BaseSchema {

    protected tableName = 'user';

    /**
     * Run the migrations.
     */
    public async up(): Promise<void> {
        await this.dbConnection.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            
            table.string('username').notNullable();
            table.string('email').notNullable().unique();
            table.string('password');
            table.boolean('is_admin').defaultTo(false);
            table.boolean('is_active').defaultTo(true);

            table.timestamps(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public async down(): Promise<void> {
        await this.dbConnection.schema.dropTable(this.tableName);
    }
}
