import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema
 */
export default class ParserPageUrlGroup extends BaseSchema {
    protected tableName = "parser_url_group";

    /**
     * Run the migrations.
     */
    public async up(): Promise<void> {
        await this.dbConnection.schema.createTable(this.tableName, (table) => {
            table.increments("id");

            table.integer("domain_id").unsigned().notNullable();
            table.foreign("domain_id").references("domain_url.id");
            table.integer("page_id").unsigned().notNullable();
            table.foreign("page_id").references("page_url.id");
            table.integer('split');
            table.string('url');
            table.specificType('page_ids', 'VARCHAR(2048)');
            table.string('group_url').unique();
            table.integer('count');
            table.boolean('group_ready').defaultTo(false);

            table.timestamps(true);
        });

        await this.dbConnection.schema.table('page_url', (table) => {
            table.foreign("group_id").references("parser_url_group.id");
        });
    }

    /**
     * Reverse the migrations.
     */
    public async down(): Promise<void> {
        await this.dbConnection.schema.dropTable(this.tableName);
    }
}
