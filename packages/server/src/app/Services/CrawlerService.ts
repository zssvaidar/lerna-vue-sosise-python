import { Knex } from "knex";
import { isNull } from "lodash";
import Database from "sosise-core/build/Database/Database";
import serviceConfig from "../../config/serviceConfig";
import CrawlerDomainType from "../Types/Back/Crawler/CrawlerDomainType";

export default class CrawlerService {
    private client: Knex;
    /**
     * Constructor
     */
    constructor() {
        this.client = Database.getConnection(serviceConfig.database).client;
    }

    public async getDomainUrls(): Promise<CrawlerDomainType[]> {
        const table = "domain_url";
        const select = ["id", "url"];
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
