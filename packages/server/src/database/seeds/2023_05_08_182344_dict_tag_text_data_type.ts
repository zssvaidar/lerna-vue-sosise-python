import BaseSchema from 'sosise-core/build/Database/BaseSchema';

/**
 * If you need more information, see: http://knexjs.org/#Schema ; https://www.npmjs.com/package/faker
 */
export default class DictTagTextDataType extends BaseSchema {
    /**
     * Restrict running the seed only in a local environment (APP_ENV=local)
     */
    protected onlyInLocalEnvironment = false;

    /**
     * Table name where data should be inserted in
     */
    protected tableName = 'site_dict_tag_text_data_type';

    /**
     * Run seed
     */
    public async run(): Promise<void> {
        // Prepare data to seed
        const data: any = [
            { id: 100, lang_id: 1, label: 'Шум', name: 'noise' },
            { id: 101, lang_id: 1, label: 'Название', name: 'title' },
            { id: 102, lang_id: 1, label: 'Имя', name: 'name' },
            { id: 103, lang_id: 1, label: 'Дата', name: 'date' },
            { id: 104, lang_id: 1, label: 'Контент', name: 'content' },
            { id: 105, lang_id: 1, label: 'Тег', name: 'tag' },
            { id: 106, lang_id: 1, label: 'Термин', name: 'termin' },
            { id: 107, lang_id: 1, label: 'Имена', name: 'names' },
            { id: 108, lang_id: 1, label: 'МРНТИ', name: 'grnti' },
            { id: 109, lang_id: 1, label: 'Найменование', name: 'named_entity' },
            { id: 110, lang_id: 1, label: 'Цитата', name: 'citation' },

            { id: 200, lang_id: 1, label: 'Шум', name: 'noise' },
            { id: 201, lang_id: 1, label: 'Название', name: 'title' },
            { id: 202, lang_id: 1, label: 'Имя', name: 'name' },
            { id: 203, lang_id: 1, label: 'Дата', name: 'date' },
            { id: 204, lang_id: 1, label: 'Контент', name: 'content' },
            { id: 205, lang_id: 1, label: 'Тег', name: 'tag' },
            { id: 206, lang_id: 1, label: 'Термин', name: 'termin' },
            { id: 207, lang_id: 1, label: 'Имена', name: 'names' },
            { id: 208, lang_id: 1, label: 'МРНТИ', name: 'grnti' },
            { id: 209, lang_id: 1, label: 'Найменование', name: 'named_entity' },
            { id: 210, lang_id: 1, label: 'Цитата', name: 'citation' },

            { id: 300, lang_id: 1, label: 'Шум', name: 'noise' },
            { id: 301, lang_id: 1, label: 'Название', name: 'title' },
            { id: 302, lang_id: 1, label: 'Имя', name: 'name' },
            { id: 303, lang_id: 1, label: 'Дата', name: 'date' },
            { id: 304, lang_id: 1, label: 'Контент', name: 'content' },
            { id: 305, lang_id: 1, label: 'Тег', name: 'tag' },
            { id: 306, lang_id: 1, label: 'Термин', name: 'termin' },
            { id: 307, lang_id: 1, label: 'Имена', name: 'names' },
            { id: 308, lang_id: 1, label: 'МРНТИ', name: 'grnti' },
            { id: 309, lang_id: 1, label: 'Найменование', name: 'named_entity' },
            { id: 310, lang_id: 1, label: 'Цитата', name: 'citation' },
        ];


        // Insert to table
        await this.dbConnection.table(this.tableName).insert(data);
    }
}
