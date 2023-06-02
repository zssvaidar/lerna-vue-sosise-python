import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema
 */
export default class SiteDataSearchType extends BaseSchema {

    protected tableName = 'site_data_search_type';

    /**
     * Run the migrations.
     */
    public async up(): Promise<void> {
        await this.dbConnection.schema.createTable(this.tableName, (table) => {
            table.increments('id');

            table.string('label');
            table.string('type');
            table.string('code');
            table.boolean('disabled').defaultTo(false);

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
