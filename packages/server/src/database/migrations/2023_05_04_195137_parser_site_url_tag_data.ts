import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema
 */
export default class ParserSiteUrlTagData extends BaseSchema {

    protected tableName = 'parser_site_url_tag_data';

    /**
     * Run the migrations.
     */
    public async up(): Promise<void> {
        await this.dbConnection.schema.createTable(this.tableName, (table) => {
            table.increments('id');

            table.integer("tag_id");
            table.integer("group_tag_id").unsigned().notNullable();
            table.foreign("group_tag_id").references("parser_group_url_tag_info.id");
            table.string('tag', 1024);
            table.string('text', 1024);
            // table.string('xpath', 1024);
            table.json('info');
            table.boolean('has_info').defaultTo(false);
            table.boolean('found').defaultTo(true);
            table.integer("page_id").unsigned().notNullable();
            table.foreign("page_id").references("page_url.id");

            table.unique(['tag_id', 'page_id']);

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
