import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema
 */
export default class InfoByGroup extends BaseSchema {

    protected tableName = 'info_by_group';

    /**
     * Run the migrations.
     */
    public async up(): Promise<void> {
        await this.dbConnection.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('group_id').unsigned().notNullable();
            table.foreign('group_id').references('info_group.id');

            table.integer('filter_id').unsigned().notNullable();
            table.foreign('filter_id').references('search_filter.id');

            table.json('info_content');
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
