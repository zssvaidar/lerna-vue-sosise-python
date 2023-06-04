import { Knex } from "knex";
import Database from "sosise-core/build/Database/Database";
import IOC from "sosise-core/build/ServiceProviders/IOC";
import LoggerService from "sosise-core/build/Services/Logger/LoggerService";
import serviceConfig from "../../config/serviceConfig";
import PageUrlDataType from "../Types/PageUrlDataType";
import DomainUrlType from "../Types/Parser/DomainUrlType";
import CategoryFilterType from "../Types/Site/CategoryFilterType";
import SiteSearchType from "../Types/Site/SiteSearchType";
import TagDataTypeType from "../Types/Site/TagDataTypeType";

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

    public  async getFilterInfo (siteId: any): Promise<{ filters: SiteSearchType[], categoriesFilter: CategoryFilterType[], tagTypeFilter: TagDataTypeType[], siteFilter: DomainUrlType[]
    }> {
        const filters = await this.getFilters();
        const categoriesFilter = await this.getCategoriesFilter();
        const tagTypeFilter = await this.getTagTypeFilter(siteId);
        console.log(tagTypeFilter);
        const siteFilter = await this.getSiteFilter();
        
        return { filters, categoriesFilter, tagTypeFilter, siteFilter };
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

    public async getTagPageInfo (text: string, siteId: any): Promise<{ suggestionData: {[id: string]: {url: string, data: PageUrlDataType[]}}}> {
        const suggestionData: {[id: string]: {url: string, data: PageUrlDataType[]}} = {}
        const pageTagData = await this.getTagData(text, siteId);
        for (const data of pageTagData) {
            suggestionData[data.pageId] = {
                url: data.url,
                data: await this.getAllPageTagData(data)
            };
        }

        return { suggestionData };
    }

    public async getAllTagPageInfo(): Promise<{ suggestionData: {[id: string]: {url: string, data: PageUrlDataType[]}}}> {
        const suggestionData: {[id: string]: {url: string, data: PageUrlDataType[]}} = {}

        const raw = await this.client.raw(`
            SELECT
                parser_site_url_tag_data.id,
                tag as tag,
                text as text,
                found as found,
                page_id as pageId,
                info,
                has_info as hasInfo,
                tag_id as tagId,
                group_tag_id as groupTagId,
                page_url.url
            FROM parser_site_url_tag_data
            join page_url on page_url.id = page_id
            limit 3000
        `)
        const pageTagData = raw[0];
        for (const data of pageTagData) {
            suggestionData[data.pageId] = {
                url: data.url,
                data: await this.getAllPageTagData(data)
            };
        }

        return { suggestionData };
    }

    public async getTagPageInfoByTagCode (tagDataTypeCode: string): Promise<{tagTypeFilterData: PageUrlDataType[]}> {
        const raw = await this.client.raw(`
            SELECT
                max(parser_site_url_tag_data.id) id,
                max(parser_site_url_tag_data.tag) tag,
                parser_site_url_tag_data.text,
                max(parser_site_url_tag_data.found) found,
                max(parser_site_url_tag_data.page_id) pageId,
                max(parser_site_url_tag_data.info) info,
                max(parser_site_url_tag_data.has_info) hasInfo,
                max(parser_site_url_tag_data.tag_id) as tagId,
                max(parser_site_url_tag_data.group_tag_id) as groupTagId,

                max(parser_site_url_tag_data.text_type_id) text_type_id,
                max(site_dict_tag_text_data_type.label) label,
                max(site_dict_tag_text_data_type.code) name,
                RIGHT (max(parser_site_url_tag_data.text_type_id), 2)
            FROM parser_site_url_tag_data
            JOIN site_dict_tag_text_data_type
                ON site_dict_tag_text_data_type.id = parser_site_url_tag_data.text_type_id
            WHERE 
                RIGHT (parser_site_url_tag_data.text_type_id, 2) = ${tagDataTypeCode}
                AND CHAR_LENGTH(parser_site_url_tag_data.text) < 100
            group by text
        `);
        const rows = raw[0];

        return { tagTypeFilterData: rows };
    }

    private async getAllPageTagData (data: PageUrlDataType): Promise<PageUrlDataType[]> {
        const table = 'parser_site_url_tag_data';

        const rows = await this.client.table(table)
            .select([
                'parser_site_url_tag_data.id',
                'parser_site_url_tag_data.tag as tag',
                'parser_site_url_tag_data.text as text',
                'parser_site_url_tag_data.found as found',
                'parser_site_url_tag_data.page_id as pageId',
                'parser_site_url_tag_data.info',
                'parser_site_url_tag_data.has_info as hasInfo',
                'parser_site_url_tag_data.tag_id as tagId',
                'parser_site_url_tag_data.group_tag_id as groupTagId',

                'parser_site_url_tag_data.text_type_id',
                'site_dict_tag_text_data_type.label',
                'site_dict_tag_text_data_type.code',
                'site_dict_tag_text_data_type.code as name',
            ])
            .join('site_dict_tag_text_data_type', 'site_dict_tag_text_data_type.id', 'parser_site_url_tag_data.text_type_id')
            .where('page_id', data.pageId)
            .where('found', true);

        return rows
    }

    private async getTagData(text: string, siteId: any): Promise<PageUrlDataType[]> {
        let query = `
            SELECT
                parser_site_url_tag_data.id,
                tag as tag,
                text as text,
                found as found,
                page_id as pageId,
                info,
                has_info as hasInfo,
                tag_id as tagId,
                group_tag_id as groupTagId,
                page_url.url
            FROM parser_site_url_tag_data
            join page_url on page_url.id = page_id
            WHERE 
                text LIKE '%${text}%'
                
        `;
        if(siteId)
            query += ` and page_url.domain_id = ${siteId}`;
        const raw = await this.client.raw(query)
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

    private async getTagTypeFilter (siteId: any): Promise<TagDataTypeType[]> {

        let query = `SELECT site_dict_tag_text_data_type.id 
            FROM site_dict_tag_text_data_type 
            JOIN parser_site_url_tag_data 
                ON parser_site_url_tag_data.text_type_id = site_dict_tag_text_data_type.id
        `;

        if(siteId)
            query += ` JOIN page_url on page_url.id = parser_site_url_tag_data.page_id
            JOIN domain_url on page_url.domain_id = domain_url.id
            WHERE domain_url.id = ${siteId}`

        console.log(query);
            
        const raw = await this.client.raw(`
            SELECT
                MAX(id) id,
                RIGHT(id, 2) code,
                MAX(name) name,
                MAX(label) label,
                MAX(lang_id) langId
            FROM site_dict_tag_text_data_type
            WHERE
                id IN (${query})
                and RIGHT(id, 2)
            GROUP BY RIGHT(id, 2)
        `)
        const rows = raw[0];

        return rows;
    }

    public async getSiteFilter(): Promise<DomainUrlType[]> {
        const table = "domain_url";
        const rows  = await this.client.table(table).select(['id','url', 'name', 'created_at as createdAt']);

        return rows;

    }
}
