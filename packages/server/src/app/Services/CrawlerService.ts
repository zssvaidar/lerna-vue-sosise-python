import { Knex } from "knex";
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
        const table = "domain_urls";
        const select = ["id", "url"];
        return await this.client.table(table).select(select);
    }
}
