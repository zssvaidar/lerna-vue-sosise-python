import { Knex } from "knex";
import Database from "sosise-core/build/Database/Database";
import serviceConfig from "../../config/serviceConfig";
import CrawlerDomainType from "../Types/Back/Crawler/CrawlerDomainType";
import PageGroupUrl from "../Types/Parser/PageGroupUrl";
import UrlGroupTagType from "../Types/UrlGroupTagType";

export default class SiteInfoService {

    private client: Knex;
    constructor() {
        this.client = Database.getConnection(serviceConfig.database).client;
    }

    public async getDomainInfo (domainId: number): Promise<{ domainData: CrawlerDomainType, domainUrlGroupData: PageGroupUrl[] }> {
        const domainData = await this.getDomainUrl(domainId);
        const domainUrlGroupData = await this.getDomainUrlGroupByDomain(domainId);

        return { domainData, domainUrlGroupData };
    }

    public async getDomainUrlGroupInfo (domainId: number, groupId: number): Promise< { domainUrlGroup: PageGroupUrl, urlGroupTag: UrlGroupTagType[], groupTagsToCollect: UrlGroupTagType[]}> {
        const domainUrlGroup = await this.getDomainUrlGroup(groupId);
        const urlGroupTag = await this.getUrlGroupTag(groupId);
        const groupTagsToCollect = await this.getUrlGroupTag(groupId, [1]);
        return { domainUrlGroup, urlGroupTag, groupTagsToCollect };
    }

    public async updateDomainUrlGroupTags (selectedTags: {[id: string]: string}): Promise<void> {
        const table = 'parser_group_url_tag_info';

        for (const [selectedTag, value] of Object.entries(selectedTags)) {
            await this.client.table(table)
               .where('id', selectedTag)
               .update({ select_tag: value })
        }
    }

    private async getUrlGroupTag (groupId: number, active: number[] = [0, 1]): Promise<UrlGroupTagType[]> {
        const table = 'parser_group_url_tag_info';
        const rows = await this.client
            .table(table)
            .select([ 'id', 'tag_id as tagId', 'parent_id as parentId', 'url_group_id as groupId', 'depth', 'tag', 'text', 'xpath', 'select_tag as selectTag', 'select_child_tags as selectChildTags'])
            .where('url_group_id', groupId)
            .whereIn('select_tag', active);

        return rows;
    }

    private  async getDomainUrlGroup (groupId: number): Promise<PageGroupUrl> {
        const table = 'parser_url_group';

        const row = await this.client.table(table)
            .select(['id', 'domain_id as domainId', 'page_id as pageId', 'split', 'url', 'page_ids as pageIds', 'group_url as groupUrl', 'count', 'group_ready as groupReady'])
            .where('id', groupId)
            .first();

        return row;
    }

    private async getDomainUrl (domainId: number): Promise<any> {
        const table = 'domain_url';
        const row = await this.client.table(table).select(['id','url', 'created_at as createdAt'])
            .where('id', domainId)
            .first();

        return row;
    }

    private  async getDomainUrlGroupByDomain (domainId: number): Promise<PageGroupUrl[]> {
        const table = 'parser_url_group';

        const row = await this.client.table(table)
            .select(['domain_id as domainId', 'page_id as pageId', 'split', 'url', 'page_ids as pageIds', 'group_url as groupUrl', 'count', 'group_ready as groupReady'])
            .where('domain_id', domainId);

        return row;
    }

}
