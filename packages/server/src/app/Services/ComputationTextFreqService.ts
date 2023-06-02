import { Knex } from "knex";
import Database from "sosise-core/build/Database/Database";
import serviceConfig from "../../config/serviceConfig";
import TagDataType from "../Types/Site/TagDataType";
import UrlGroupTagType from "../Types/UrlGroupTagType";

export default class ComputationTextFreqService {
    private client: Knex;

    /**
     * Constructor
     */
    constructor() {
        this.client = Database.getConnection(serviceConfig.database).client;

    }

public async fetchApiData (): Promise<{ dataTagTexts: any[], tagDataTypes: TagDataType[], rows: any}> {
        const table = 'parser_group_url_tag_info';

        let rows: (any | UrlGroupTagType)[] = await this.client.table(table)
            .select([ 'parser_group_url_tag_info.id', 'tag_id as tagId', 'parent_id as parentId', 'url_group_id as groupId', 'depth', 'tag', 'text', 'xpath', 'select_tag as selectTag',
            'select_child_tags as selectChildTags', 'tag_data_type_id as tagDataTypeId', 'site_dict_tag_data_type.code'])
            .leftJoin('site_dict_tag_data_type', 'parser_group_url_tag_info.tag_data_type_id', 'site_dict_tag_data_type.id')
            .whereRaw('LENGTH(text) > ?', 1)
            // .where('select_tag', true)
            .limit(5000);
        
        rows = rows.map(row => row.text)
        // console.log(rows.length);

        const dataTagTexts = [];
        const tagDataTypes = [];

        return { dataTagTexts, tagDataTypes, rows }

    }
}
