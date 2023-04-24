import { Knex } from "knex";
import Database from "sosise-core/build/Database/Database";
import serviceConfig from "../../config/serviceConfig";
import DomainUrlType from "../Types/Parser/DomainUrlType";
import PageGroupUrl from "../Types/Parser/PageGroupUrl";
import PageUrlType from "../Types/Parser/PageUrlType";
import AbstractParser from "./AbstractParser";

export default class InfoParserService extends AbstractParser{
    private client: Knex;
    /**
     * Constructor
     */
    constructor() {
        super();
        this.client = Database.getConnection(serviceConfig.database).client;
    }

    public async getDomains(): Promise<DomainUrlType[]> {
        const table = "domain_url";
        const rows  = await this.client.table(table).select(['id','url', 'created_at as createdAt']);
        
        return rows;
    }

    public async getPageUrls(domainId: number): Promise<PageUrlType[]> {
        const table = "page_url";
        const rows = await this.client.table(table).select(['id', 'domain_id as domainId', 'url', 'type', 'created_at as createdAt']).where('domain_id', domainId);
        return rows;    
    }

    public async getPageGroupUrls(domainId: number): Promise<PageGroupUrl[]> {
        const raw = await this.client.raw(`
            select min(domain_id) domainId, min(id) pageId, subq.split groupUrl, min(url) url, subq.ids pageIds, min(subq.c) count 
            from (
                select group_concat(';', id, ';') search_ids, JSON_ARRAYAGG(id) ids, SUBSTRING_INDEX(url, '/', 5) split, count(*) c
                from page_url
                group by split
            ) subq
            join page_url
            where subq.c > 1
            and search_ids LIKE CONCAT('%;', id, ';%')
            group by subq.split;
        `);
        const rows = raw[0];

        rows.map((row: any) => {
            row.pageIds = JSON.parse(row.pageIds);
        });

        return rows;    
    }
    
    public async runPageGroupHtmlCollector(domainIds: number[]): Promise<any>{ 
        return await this.runSubProcess1(domainIds)
    }
}
