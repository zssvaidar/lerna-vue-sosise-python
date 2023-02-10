import BaseSchema from 'sosise-core/build/Database/BaseSchema';
import * as faker from 'faker';

/**
 * If you need more information, see: http://knexjs.org/#Schema ; https://www.npmjs.com/package/faker
 */
export default class SearchFilterAndGroup extends BaseSchema {
    /**
     * Restrict running the seed only in a local environment (APP_ENV=local)
     */
    protected onlyInLocalEnvironment = false;

    /**
     * Table name where data should be inserted in
     */
    protected tableName1 = 'search_filter';
    protected tableName2 = 'info_group';
    protected tableName3 = 'info_by_group';

    /**
     * Run seed
     */
    public async run(): Promise<void> {
        // Prepare data to seed
        const data: any = [
            {name: 'Пойск по имени'},
            {name: 'Пойск по датам'},
            {name: 'Пойск по специальности'},
            {name: 'Пойск по университету'},
            {name: 'Пойск по городу'}
        ];

        // Insert to table
        await this.dbConnection.table('search_filter').insert(data);

        const data1: any = [
            {
                domain: 'http://www.vestnik.nauka.kz/', 
                url: 'some_data', 
                type: 'some_data'
            },
            {
                domain: 'https://sj.astanait.edu.kz/', 
                url: 'some_data', 
                type: 'some_data'
            },
            {
                domain: 'https://bb.kaznu.kz/', 
                url: 'some_data', 
                type: 'some_data'
            },
            {
                domain: 'https://vestnik.aues.kz/', 
                url: 'some_data', 
                type: 'some_data'
            },
            {
                domain: 'https://bulbio.enu.kz/ ', 
                url: 'some_data', 
                type: 'some_data'
            },
            {
                domain: 'https://vestnik.kbtu.edu.kz/', 
                url: 'some_data',  
                type: 'some_data'
            },
        ];

        await this.dbConnection.table('info_group').insert(data1);

        // Prepare data to seed
        const data2: any = [];

        // Generate 100 rows
        for (let row = 10; row < 15; row++) {
            data2.push({
                filter_id: row,
                group_id: 1,
                info_content: JSON.stringify({ 'data': 'something'})
            });
        }

        // Insert to table
        await this.dbConnection.table('info_by_group').insert(data2);

    }
}
