import { Request, Response, NextFunction } from "express";
import IOC from "sosise-core/build/ServiceProviders/IOC";
import HttpResponse from "sosise-core/build/Types/HttpResponse";
import InfoParserService from "../../Services/InfoParserService";
import ParserUrlGroupTagInfoType from "../../Types/UrlGroupTagType";

export default class InfoParserController {
    private service: InfoParserService;
    constructor() {
        this.service = IOC.make(InfoParserService);
    }

    /**
     *
     */
    public async serveUrls(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "getDomains success",
                data: {},
            };

            const data = await this.service.getDomains();
            httpResponse.data['length'] = data.length;
            httpResponse.data['list'] = data;

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     */
    public async serveDomainUrls(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "getPageUrls success",
                data: {},
            };
            const domainId = Number(request.params.id);

            const data = await this.service.getPageUrls(domainId);
            httpResponse.data['length'] = data.length;
            httpResponse.data['list'] = data;

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     */
    public async createDomainUrlGroups(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "getPageGroupUrls success",
                data: null
            };
            const domainId = Number(request.body.id);
            const split = Number(request.body.split);

            const groupUrls = await this.service.findPageGroupUrls(domainId, split);
            await this.service.savePageGroupUrls(domainId, groupUrls);
            const pageGroupUrls = await this.service.getPageGroupUrls(domainId, split);
            await this.service.setPageGroups(pageGroupUrls);

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     */
    public async serveDomainUrlGroups(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "getPageGroupUrls success",
                data: {},
            };
            const domainId = Number(request.params.id);
            const split = Number(request.query.split);

            const data = await this.service.getPageGroupUrls(domainId);
            httpResponse.data['length'] = data.length;
            httpResponse.data['list'] = data;

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     */
    public async saveDomainUrlGroupTags(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "getPageGroupUrls success",
                data: null,
            };

            const domainId = Number(request.params.id);
            const groupId = Number(request.params.groupId);
            const urlGroupTagInfo: ParserUrlGroupTagInfoType[] = request.body;

            await this.service.storeGroupUrlTagInfo(domainId, groupId, urlGroupTagInfo);

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     */
    public async starCollectUrlGroupHtmlContent(
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: "startDataCollection success",
                data: null,
            };

            let ids: any = request.query.ids;
            ids = ids.split(',').map(id => Number(id));

            const data = await this.service.runPageGroupHtmlCollector(ids);
            httpResponse.data = data;

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }
}
