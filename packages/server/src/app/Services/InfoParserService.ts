import { Knex } from "knex";
import { isNull } from "lodash";
import Database from "sosise-core/build/Database/Database";
import serviceConfig from "../../config/serviceConfig";
import DomainUrlType from "../Types/Parser/DomainUrlType";
import PageGroupUrl from "../Types/Parser/PageGroupUrl";
import PageUrlType from "../Types/Parser/PageUrlType";
import ParserUrlGroupTagInfoType from "../Types/UrlGroupTagType";
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

    public async findPageGroupUrls(domainId: number, split: number): Promise<PageGroupUrl[]> {
        const raw = await this.client.raw(`
            select min(domain_id) domainId, min(id) pageId, subq.groupUrl, ${split} split, min(url) url, subq.ids pageIds, min(subq.c) count
            from (
                select group_concat(';', id, ';') search_ids, JSON_ARRAYAGG(id) ids, SUBSTRING_INDEX(url, '/', ${split}) groupUrl, count(*) c
                from page_url
                where SUBSTRING_INDEX(url, '/', ${split+1}) = url
                group by groupUrl
            ) subq
            join page_url
            where subq.c > 1
            and domain_id = ${domainId}
            and search_ids LIKE CONCAT('%;', id, ';%')
            group by subq.groupUrl;
        `);
        const rows = raw[0];

        rows.map((row: any) => {
            row.pageIds = JSON.parse(row.pageIds);
        });

        return rows;
    }

    public async savePageGroupUrls(domainId: number, groupUrls: PageGroupUrl[]): Promise<void> {
        const table = 'parser_url_group';

        for (const groupUrl of groupUrls) {
            await this.client.table(table).insert({
                domain_id: groupUrl.domainId,
                page_id: groupUrl.pageId,
                split: groupUrl.split,
                url: groupUrl.url,
                page_ids: JSON.stringify(groupUrl.pageIds),
                group_url: groupUrl.groupUrl,
                count: groupUrl.count,
            });
        }

        // await this.client.table(table).insert(data);
    }

    public async getPageGroupUrls(domainId: number, split: number | null = null): Promise<PageGroupUrl[]> {
        const table = 'parser_url_group';

        const rows = await this.client.table(table)
            .select([ 'id', 'domain_id as domainId', 'page_id as pageId', 'split as split', 'url as url', 'page_ids as pageIds', 'group_url as groupUrl', 'count as count', 'group_ready as groupReady'])
            .where('domain_id', domainId)
            .modify(function(queryBuilder) {
                if (!isNull(split)) {
                    queryBuilder.where('split', split);
                }
            });

        for (const row of rows) {
            row.pageIds = JSON.parse(row.pageIds);
        }

        return rows;
    }

    public async setPageGroups(pageGroupUrls: PageGroupUrl[]) {
        const table = 'page_url';

        for (const pageGroupUrl of pageGroupUrls) {
            await this.client.table(table)
                .update('group_id', pageGroupUrl.id)
                .whereIn('id', pageGroupUrl.pageIds);
        }

    }

    public async storeGroupUrlTagInfo(domainId: number, groupId: number, urlGroupTagInfo: ParserUrlGroupTagInfoType[]) {
        const data = urlGroupTagInfo.map(tagInfo => {
            return {
                tag_id: tagInfo.tagId,
                parent_id: tagInfo.parentId,
                url_group_id: groupId,
                depth: tagInfo.depth,
                tag: tagInfo.tag,
                text: tagInfo.text,
                xpath: tagInfo.xpath
            };
        });

        const table = 'parser_group_url_tag_info';
        await this.client.table(table).insert(data)
        .onConflict(['text', 'xpath'])
        .ignore();
    }

    public async runPageGroupHtmlCollector(domainIds: number[]): Promise<any> {
        return await this.runSubProcess1(domainIds);
    }
}
