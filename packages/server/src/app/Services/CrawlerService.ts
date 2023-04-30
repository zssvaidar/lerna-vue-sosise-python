import { Knex } from "knex";
import { isNull } from "lodash";
import Database from "sosise-core/build/Database/Database";
import serviceConfig from "../../config/serviceConfig";
import CrawlerDomainType from "../Types/Back/Crawler/CrawlerDomainType";
import PageUrlType from "../Types/Parser/PageUrlType";

export default class CrawlerService {
    private client: Knex;
    /**
     * Constructor
     */
    constructor() {
        this.client = Database.getConnection(serviceConfig.database).client;
    }

    public async createDomainUrl(domainUrl: string): Promise<void> {
        const table = "domain_url";
        const name = domainUrl.split('/')[2]??''
        await this.client.table(table)
            .insert({name, url: domainUrl});
    }

    public async removeDomainUrl(id: number): Promise<void> {
        const table = "domain_url";
        await this.client.table(table)
            .delete()
            .where('id', id);
    }

    public async getDomainUrl(id: number): Promise<CrawlerDomainType> {
        const table = "domain_url";
        const select = ["id", "name", "url"];
        return await this.client.table(table)
            .select(select)
            .where('id', id)
            .first();
    }

    public async getDomainPageUrl(id: number): Promise<PageUrlType[]> {
        const table = "page_url";
        const select = ['domain_id', 'url', 'type', 'group_id'];
        return await this.client.table(table)
            .select(select)
            .where('domain_id', id);
    }

    public async getDomainUrls(): Promise<CrawlerDomainType[]> {
        const table = "domain_url";
        const select = ["id", "name", "url"];
        return await this.client.table(table).select(select);
    }

    public async storeDomainPageUrl(domainId: number, url: string, type : string | null): Promise<void> {
        const table = "page_url";
        const data = { domain_id: domainId, url };
        if (!isNull(type))
            data['type'] = type;

        await this.client.table(table).insert(data);
    }
}
