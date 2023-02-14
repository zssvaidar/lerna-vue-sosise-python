import { Request, Response, NextFunction } from "express";
import IOC from "sosise-core/build/ServiceProviders/IOC";
import HttpResponse from "sosise-core/build/Types/HttpResponse";
import CrawlerService from "../../Services/CrawlerService";

export default class CrawlerController {
    private service: CrawlerService;
    constructor() {
        this.service = IOC.make(CrawlerService);
    }

    public async fetchDomainLinks(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            const data = await this.service.getDomainUrls();

            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "Some example",
                data: data,
            };

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }
}
