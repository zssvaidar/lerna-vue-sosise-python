import { Request, Response, NextFunction } from "express";
import IOC from "sosise-core/build/ServiceProviders/IOC";
import HttpResponse from "sosise-core/build/Types/HttpResponse";
import CrawlerService from "../../Services/CrawlerService";
import ServerScriptService from "../../Services/ServerScriptService";
import PostCrawlerPageUrl from "../../Unifiers/PostCrawlerPageUrl";

export default class CrawlerController {
    private service: CrawlerService;
    private serverScriptService: ServerScriptService;
    constructor() {
        this.service = IOC.make(CrawlerService);
        this.serverScriptService = IOC.make(ServerScriptService);
    }

    public async createDomainUrl(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "createDomainUrl success",
                data: {},
            };

            const domainUrl = request.body.domain_url;
            await this.service.createDomainUrl(domainUrl);

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    public async deleteDomainUrl(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "createDomainUrl success",
                data: {},
            };

            const id = request.body.id;
            await this.service.removeDomainUrl(id);

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    public async fetchDomainUrl(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "createDomainUrl success",
                data: {},
            };

            const id = Number(request.params.id);
            httpResponse.data = await this.service.getDomainUrl(id);

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    public async fetchDomainPageUrl(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "createDomainUrl success",
                data: {},
            };

            const id = Number(request.params.id);
            httpResponse.data = await this.service.getDomainPageUrl(id);

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    public async fetchDomainUrls(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "fetchDomainUrls success",
                data: {},
            };

            const domainUrls = await this.service.getDomainUrls();

            httpResponse['list'] = domainUrls;
            httpResponse['length'] = domainUrls.length;

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    public async runscriptCrawler(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {

            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "runscriptCrawler success",
                data: {},
            };

            const id = request.query.id;

            if(request.query.script === 'group_tags') {
                httpResponse.data = await this.serverScriptService.runParserForGroupUrlTags(id);
            }

            if(request.query.script === 'groups') {
                httpResponse.data = await this.serverScriptService.runParserForGroups(id);
            }

            if(request.query.script === 'links') {
                httpResponse.data = await this.serverScriptService.runCrawlerForUrls(id);
            }

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY")
                return response.send({ code: 5001 });
            next(error);
        }
    }

    public async storeLinks(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            console.log(request);
            const params = new PostCrawlerPageUrl(request.body);

            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "storeLinks success",
                data: {},
            };

            httpResponse.data = await this.service.storeDomainPageUrl(
                params.domainId,
                params.url,
                params.type
            );

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY")
                return response.send({ code: 5001 });
            next(error);
        }
    }
}
