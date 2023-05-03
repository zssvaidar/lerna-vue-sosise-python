import { Knex } from "knex";
import Database from "sosise-core/build/Database/Database";
import serviceConfig from "../../config/serviceConfig";
import FilterType from "../Types/Filter/FilterType";
import FilterValueType from "../Types/Filter/FilterValueType";
import InfoType from "../Types/InfoType";
import SearchTagType from "../Types/Search/SearchTagType";
import { isEmpty } from 'lodash';

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
     * v3
     * info_group
     * - domain
     * - url
     * - type
     * search_filter
     * - name
     * info_by_group
     * - group_id
     * - filter_id
     * - value
     * info
     * - info_content
     * pivot_info_ibg
     * - ibg_id
     * - info_id
     * search_tag
     * - text
     * - info_object
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

    public async getInfoByFilterValue (filterValue): Promise<InfoType[]> {
        const tableName = 'info_by_group';
        const select = ['info.id as infoId', 'ibg_id as ibgId', 'info_by_group.filter_id as filterId', 'group_id as groupId','value', 'info.info_content as infoContent'];
        const pivot = 'pivot_info_ibg'; const pivotBy = 'pivot_info_ibg.ibg_id'; const pivotWith = 'info_by_group.id';
        const join = 'info'; const joinBy = 'info.id'; const joinWith = 'pivot_info_ibg.info_id';

        const result = await this.client.table(tableName)
            .select(select)
            .join(pivot, pivotBy, pivotWith)
            .join(join, joinBy, joinWith)
            .where('info_by_group.value', filterValue);

        return Array.from(result, this.formatInfo);
    }

    /* *********************************************************************** */
    /* TextInput Search */

    public async searchTagWithText (text: string): Promise<SearchTagType[]> {
        const tableName = 'search_tag';
        const select = ['text', 'info_object as infoObject'];

        const result = await this.client.table(tableName)
            .select(select)
            .where('text', 'like', `%${text}%`);

        if (isEmpty(result))
            return [];

        return result;
    }

    public async getInfoByValue (key: 'ids', value: any): Promise<InfoType[]> {
        const tableName = 'info_by_group';
        const select = ['info.id as infoId', 'info_by_group.id as ibgId', 'info_by_group.filter_id as filterId', 'group_id as groupId','value', 'info.info_content as infoContent'];
        const pivot = 'pivot_info_ibg'; const pivotBy = 'pivot_info_ibg.ibg_id'; const pivotWith = 'info_by_group.id';
        const join = 'info'; const joinBy = 'info.id'; const joinWith = 'pivot_info_ibg.info_id';

        const result = await this.client.table(tableName)
            .select(select)
            .join(pivot, pivotBy, pivotWith)
            .join(join, joinBy, joinWith)
            .whereIn('info.id', value);

        return Array.from(result, this.formatInfo);
    }

    /* *********************************************************************** */

    private formatInfo(data): InfoType {
        return {
            infoId: data.infoId,
            filterId: data.filterId,
            ibgId: data.ibgId,
            value: data.value,
            groupId: data.groupId,
            infoContent: JSON.parse(data.infoContent)
        };
    }

}
