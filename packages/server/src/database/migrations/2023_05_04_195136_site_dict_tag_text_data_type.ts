import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema
 */
export default class DictTagTextDataType extends BaseSchema {

    protected tableName = 'site_dict_tag_text_data_type';

    /**
     * Run the migrations.
     */
    public async up(): Promise<void> {
        await this.dbConnection.schema.createTable(this.tableName, (table) => {
            table.increments('id');

            table.string('name');
            table.string('label');
            table.string('code');
            table.integer('lang_id').unsigned().notNullable()

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
