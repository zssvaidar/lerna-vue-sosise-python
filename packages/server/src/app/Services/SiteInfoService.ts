import { Knex } from "knex";
import { isEmpty, isNull } from "lodash";
import Database from "sosise-core/build/Database/Database";
import IOC from "sosise-core/build/ServiceProviders/IOC";
import LoggerService from "sosise-core/build/Services/Logger/LoggerService";
import serviceConfig from "../../config/serviceConfig";
import CrawlerDomainType from "../Types/Back/Crawler/CrawlerDomainType";
import PageUrlDataType from "../Types/PageUrlDataType";
import DomainUrlType from "../Types/Parser/DomainUrlType";
import PageGroupUrl from "../Types/Parser/PageGroupUrl";
import PageUrlType from "../Types/Parser/PageUrlType";
import TagDataType from "../Types/Site/TagDataType";
import UrlGroupTagType from "../Types/UrlGroupTagType";
import ServerScriptService from "./ServerScriptService";

export default class SiteInfoService {

    private client: Knex;
    private serverScriptService: ServerScriptService;
    private logging: LoggerService;
    constructor() {
        this.client = Database.getConnection(serviceConfig.database).client;
        this.serverScriptService = IOC.make(ServerScriptService);
        this.logging = IOC.make(LoggerService) as LoggerService
    }

    public async getDomainInfo (domainId: number): Promise<{ domainData: CrawlerDomainType, domainUrlGroupData: PageGroupUrl[] }> {
        const domainData = await this.getDomainUrl(domainId);
        const domainUrlGroupData = await this.getDomainUrlGroupByDomain(domainId);

        return { domainData, domainUrlGroupData };
    }

    public async getDomainUrlGroupInfo (domainId: number, groupId: number): Promise<{
        domainUrlGroup: PageGroupUrl, urlGroupTag: UrlGroupTagType[], groupTagsToCollect: UrlGroupTagType[],
        tagDataTypes: TagDataType[]
        }> {
        const domainUrlGroup = await this.getDomainUrlGroup(groupId);
        const urlGroupTag = await this.getUrlGroupTag(groupId);
        const groupTagsToCollect = await this.getUrlGroupTag(groupId, [1]);
        console.log(groupTagsToCollect);
        
        const tagDataTypes = await this.getTagDataTypes();

        return { domainUrlGroup, urlGroupTag, groupTagsToCollect, tagDataTypes };
    }

    public async updateDomainUrlGroupTags (selectedTags: {[id: string]: string}): Promise<void> {
        const table = 'parser_group_url_tag_info';

        for (const [selectedTag, value] of Object.entries(selectedTags)) {
            await this.client.table(table)
               .where('id', selectedTag)
               .update({ select_tag: value })
        }
    }

    public async updateDomainUrlGroupReady (domainId: number, groupId: number, groupReady: boolean): Promise<void> {

        if(groupReady)
            await this.serverScriptService.runParserForPageUrlTags(domainId, groupId);

        const table = 'parser_url_group';

        await this.client.table(table)
            .where('id', groupId)
            .update({ group_ready: groupReady });
    }

    public async getGroupCollectedData (groupId: number): Promise<{ pageUrls: PageUrlType[], pagesData: {[id: number]: PageUrlDataType[]} }> {
        const pageUrls = await this.getPageUrlInGroup(groupId);
        const pagesData: {[id: number]: PageUrlDataType[]} = {};
        for (const pageUrl of pageUrls) {
            pagesData[pageUrl.id] = await this.getPageUrlTagData(pageUrl.id);
        }

        return { pageUrls, pagesData };
    }

    public async getGroupPagesAndGroupTagData (groupId: number): Promise<{ pageUrls: PageUrlType[], groupTagsToCollect: UrlGroupTagType[]}> {
        const pageUrls = await this.getPageUrlInGroup(groupId);
        const groupTagsToCollect = await this.getUrlGroupTag(groupId, [1]);

        return { pageUrls, groupTagsToCollect };
    }

    public async savePageTagData (groupId: number, pageId: number, data: {[id: string]: any}) {
        console.log(data);
        for (const [groupTagId, item] of Object.entries(data)) {

            if(item && item.found === false) {
                await this.createPageTagDataNotFoun(pageId, item.group_tag_id, item.tag_id);
                continue
            }

            if(item.href)
                console.log(item.href);

            const text = item.text.trim()
            if(isEmpty(text)) {
                await this.createPageTagDataNotFoun(pageId, item.group_tag_id, item.tag_id);
                continue;
            }
            const tagId = Number(item.tag_id);
            await this.createPageTagData(pageId, item.group_tag_id, tagId, item.tag, text, item.href);
        }
    }

    private async createPageTagDataNotFoun (pageId: number, groupTagId: number, tagId: number) {
        const table = 'parser_site_url_tag_data';
        const data = {};
        data['page_id'] = pageId;
        data['group_tag_id'] = groupTagId;
        data['tag_id'] = tagId;
        data['found'] = false;

        try {
            await this.client.table(table)
                .insert(data);
        } catch (error) {
            if (error.code !== 'ER_DUP_ENTRY' && error.code !== 'ER_DATA_TOO_LONG') {
                this.logging.error(error.message)
            }
        }
    }

    private async createPageTagData (pageId: number, groupTagId: number, tagId: number, tag: string, text: string, href: string | null = null) {
        const table = 'parser_site_url_tag_data';
        const data = {};
        if(!isNull(href)) {
            data['info'] = JSON.stringify({ href: href });
            data['has_info'] = true;
        }

        data['page_id'] = pageId;
        data['tag'] = tag;
        data['text'] = text;
        data['tag_id'] = tagId;
        data['group_tag_id'] = groupTagId;
        
        try {
            await this.client.table(table)
                .insert(data);
        } catch (error) {
            if (error.code !== 'ER_DUP_ENTRY' && error.code !== 'ER_DATA_TOO_LONG') {
                this.logging.error(error.message)
            }
        }
    }

    private async getPageUrlInGroup (groupId: number): Promise<PageUrlType[]> {
        const table = 'page_url';

        const rows = await this.client.table(table)
            .select(['id', 'domain_id as domainId', 'url', 'type', 'group_id as groupId'])
            .where('group_id', groupId);
        
        return rows;
    }

    private async getPageUrlTagData (pageId: number): Promise<PageUrlDataType[]> {
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
            .where('page_id', pageId)
            .where('found', true);

        for (const row of rows) {
            if(row.hasInfo)
                // console.log(row.info);
            row.info = JSON.parse(row.info)
        }
        
        return rows;
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

    private async getTagDataTypes (): Promise<TagDataType[]> {
        const table = 'site_dict_tag_data_type';

        return await this.client.table(table)
            .select(['id', 'label']);
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
