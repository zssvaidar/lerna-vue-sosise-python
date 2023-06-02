import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema
 */
export default class ParserGroupTagInfo extends BaseSchema {

    protected tableName = 'parser_group_url_tag_info';

    /**
     * Run the migrations.
     */
    public async up(): Promise<void> {
        await this.dbConnection.schema.createTable(this.tableName, (table) => {
            table.increments('id');

            table.integer('tag_id');
            table.integer('parent_id');
            table.integer("url_group_id").unsigned().notNullable();
            table.foreign("url_group_id").references("parser_url_group.id");
            table.integer('depth');
            table.string('tag');
            table.string('text', 1024);
            table.string('xpath');
            table.boolean('select_tag').defaultTo(false);
            table.boolean('select_child_tags').defaultTo(false);
            table.integer('tag_data_type_id').references('site_dict_tag_data_type').inTable('id')

            table.timestamps(true, true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public async down(): Promise<void> {
        await this.dbConnection.schema.dropTable(this.tableName);
    }
}
