import { Request, Response, NextFunction } from "express";
import IOC from "sosise-core/build/ServiceProviders/IOC";
import HttpResponse from "sosise-core/build/Types/HttpResponse";
import InfoParserService from "../../Services/InfoParserService";

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
