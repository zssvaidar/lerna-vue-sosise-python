import { Knex } from "knex";
import Database from "sosise-core/build/Database/Database";
import serviceConfig from "../../config/serviceConfig"
import FilterType from "../Types/Filter/FilterType";
import FilterValueType from "../Types/Filter/FilterValueType";
import InfoGroupType from "../Types/InfoGroupType";
import InfoType from "../Types/InfoType";
import SearchTagType from "../Types/SearchTagType";
import lodash, { isEmpty } from 'lodash';

export default class MainService {
    private client: Knex;

    /* 
     * v1
     * search_filter
     * - name
     * info_by_group
     * - group_id
     * - filter_id
     * - info_content
     * info_group
     * - domain
     * - url
     * - type
     * search_tag
     * - text
     * - info_by_group_object
     * v2
     * search_filter
     * - name
     * info_by_group
     * - group_id
     * - filter_id
     * - value
     * info
     * - info_content
     * - ibg_id
     * info_group
     * - domain
     * - url
     * - type
     * search_tag
     * - text
     * - info_by_group_object
     */
    /**
     * Constructor
     */
    constructor() {
        this.client = Database.getConnection(serviceConfig.database).client;
    }

    public async getFilters (): Promise<FilterType[]> {
        const tableName = 'search_filter';
        const select = ['id as filterId', 'name'];

        return await this.client.table(tableName)
            .select(select);
    }

    public async getFilterValue (): Promise<FilterValueType[]> {
        const tableName = 'search_filter';
        const join = 'info_by_group'; const joinBy = 'info_by_group.filter_id'; const joinWith = 'search_filter.id';
        const select = ['name','group_id as groupId', 'info_by_group.filter_id as filterId', 'value'];

        return await this.client.table(tableName)
            .select(select)
            .join(join, joinBy, joinWith)
            .groupBy(['value', 'info_by_group.filter_id']);
    }

    public async getFilterWithValue (): Promise<InfoType[]> {
        const tableName = 'search_filter';
        const join = 'info_by_group'; const joinBy = 'info_by_group.filter_id'; const joinWith = 'search_filter.id';
        const join2 = 'info'; const join2By = 'info.ibg_id'; const join2With = 'info_by_group.id';
        const select = ['name','group_id as groupId', 'info_by_group.filter_id as filterId', 'value', 'info_content as infoContent'];

        return await this.client.table(tableName)
            .select(select)
            .join(join, joinBy, joinWith)
            .join(join2, join2By, join2With);
    
    }

    public async getInfoGroup(): Promise<InfoGroupType[]> {
        const tableName = 'info_group';
        const select = ['id', 'domain', 'url', 'type'];

        return await this.client.table(tableName)
            .select(select);
    }

    public async getInfoByFilterValue (filterValue): Promise<InfoType[]> {
        const tableName = 'info_by_group';
        const select = ['info.id as infoId', 'ibg_id as ibgId', 'info_by_group.filter_id as filterId', 'group_id as groupId','value', 'info.info_content as infoContent'];
        const join = 'info'; const joinBy = 'info.ibg_id'; const joinWith = 'info_by_group.id';

        const result = await this.client.table(tableName)
            .select(select)
            .join(join, joinBy, joinWith)
            .where('value', filterValue);

        return Array.from(result, this.formatInfo);
    }


    private formatInfo(data): InfoType {
        return {
            infoId: data.infoId,
            filterId: data.filterId,
            ibgId: data.ibgId,
            value: data.value,
            groupId: data.groupId,
            infoContent: JSON.parse(data.infoContent)
        }
    }

    public async getInfoByFilter (filterId: number) {
        const tableName = 'search_filter';
        const join = 'info_by_group'; const joinBy = 'info_by_group.filter_id'; const joinWith = 'search_filter.id';
        const select = ['name','group_id as groupId', 'info_by_group.filter_id as filterId', 'info_content as infoContent'];

        return await this.client.table(tableName)
            .select(select)
            .join(join, joinBy, joinWith)
            .where('search_filter.id', filterId);
    }

    public async searchTagWithText (text: string): Promise<SearchTagType[]> {
        const tableName = 'search_tag';
        const select = ['text', 'info_object as infoObject'];

        const result = await this.client.table(tableName)
            .select(select)
            .where('text', 'like', `%${text}%`);

        if (isEmpty(result)) 
            return []
        
        return result;
    }

    public async getInfoByValue (key: 'ids', value: any) {
        const tableName = 'info_by_group';
        const select = ['info.id as infoId', 'ibg_id as ibgId', 'info_by_group.filter_id as filterId', 'group_id as groupId','value', 'info.info_content as infoContent'];
        const join = 'info'; const joinBy = 'info.ibg_id'; const joinWith = 'info_by_group.id';

        const result = await this.client.table(tableName)
            .select(select)
            .join(join, joinBy, joinWith)
            .whereIn('info.id', value);

        return Array.from(result, this.formatInfo);
    }

}
