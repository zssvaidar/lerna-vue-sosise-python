import { Knex } from "knex";
import Database from "sosise-core/build/Database/Database";
import IOC from "sosise-core/build/ServiceProviders/IOC";
import LoggerService from "sosise-core/build/Services/Logger/LoggerService";
import serviceConfig from "../../config/serviceConfig";
import PageUrlDataType from "../Types/PageUrlDataType";
import CategoryFilterType from "../Types/Site/CategoryFilterType";
import SiteSearchType from "../Types/Site/SiteSearchType";

export default class SiteDataService {
    private client: Knex;
    private logging: LoggerService;
    /**
     * Constructor
     */
    constructor() {
        this.client = Database.getConnection(serviceConfig.database).client;
        this.logging = IOC.make(LoggerService) as LoggerService
    }

    public  async getFilterInfo (): Promise<{ filters: SiteSearchType[], categoriesFilter: CategoryFilterType[] }> {
        const filters = await this.getFilters();
        const categoriesFilter = await this.getCategoriesFilter();
        return { filters, categoriesFilter };
    }

    public async updatePageTagData (pageTagDataId: number, data: any): Promise<void> {
        const table = 'parser_site_url_tag_data';

        await this.client
            .table(table)
            .update(data)
            .where('id', pageTagDataId);

    }

    public async getTagDataSearch (text: string): Promise<any> {
        const raw = await this.client.raw(`
            SELECT
                id,
                SUBSTRING_INDEX(
                    SUBSTRING_INDEX(text, '${text}', -1), 
                    ' ', 2
                ) text
            FROM parser_site_url_tag_data
            WHERE 
                text LIKE '%${text}%'
            LIMIT 10
        `)
        const rows = raw[0];

        return rows;
    }

    public async getTagPageInfo (text: string) {
        const result = {}
        const pageTagData = await this.getTagData(text);
        for (const data of pageTagData) {
            result[data.pageId] = await this.getAllPageTagData(data)
        }
    }

    private async getAllPageTagData (data: PageUrlDataType): Promise<PageUrlDataType[]> {
        const table = 'parser_site_url_tag_data';

        const rows = await this.client.table(table)
            .select([
                'id',
                'tag as tag',
                'text as text',
                'found as found',
                'page_id as pageId',
                'info',
                'has_info as hasInfo',
                'tag_id as tagId',
                'group_tag_id as groupTagId',
            ])
            .where('page_id', data.pageId)
            .where('found', true);

        return rows
    }

    private async getTagData(text: string): Promise<PageUrlDataType[]> {
        const raw = await this.client.raw(`
            SELECT
                id,
                tag as tag,
                text as text,
                found as found,
                page_id as pageId,
                info,
                has_info as hasInfo,
                tag_id as tagId,
                group_tag_id as groupTagId
            FROM parser_site_url_tag_data
            WHERE 
                text LIKE '%${text}%'
        `)
        const rows = raw[0];

        return rows;
    }

    private async getFilters (): Promise<SiteSearchType[]>  {
        const table = 'site_data_search_type';

        const rows = this.client
            .table(table)
            .select(['id', 'label', 'type'])
            .where('disabled', false);

        return rows;
    }

    private async getCategoriesFilter (): Promise<CategoryFilterType[]> {
        const table = 'site_dict_tag_data_type';

        const rows = this.client
            .table(table)
            .select(['id', 'label']);

        return rows;
    }

}
