import { Knex } from "knex";
import Database from "sosise-core/build/Database/Database";
import serviceConfig from "../../config/serviceConfig"
import InfoGroupType from "../Types/InfoGroupType";
import InfoType from "../Types/InfoType";

export default class MainService {
    private client: Knex;

    /* 
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
     */
    /**
     * Constructor
     */
    constructor() {
        this.client = Database.getConnection(serviceConfig.database).client;
    }

    public async getFilterData (): Promise<InfoType[]> {
        const tableName = 'search_filter';
        const join = 'info_by_group'; const joinBy = 'info_by_group.filter_id'; const joinWith = 'search_filter.id';
        const select = ['name','group_id as groupId', 'info_by_group.filter_id as filterId', 'info_content as infoContent'];

        return await this.client.table(tableName)
            .select(select)
            .join(join, joinBy, joinWith);
    }

    public async getInfoGroup(): Promise<InfoGroupType[]> {
        const tableName = 'info_group';
        const select = ['id', 'domain', 'url', 'type'];

        return await this.client.table(tableName)
            .select(select);
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
}
