import { Request, Response, NextFunction } from 'express';
import IOC from 'sosise-core/build/ServiceProviders/IOC';
import HttpResponse from 'sosise-core/build/Types/HttpResponse';
import ServerScriptService from '../../Services/ServerScriptService';
import SiteDataService from '../../Services/SiteDataService';

export default class SiteFilterController {

    private serverScriptService: ServerScriptService;
    private service: SiteDataService;
    constructor () {
        this.serverScriptService = IOC.make(ServerScriptService);
        this.service = IOC.make(SiteDataService) as SiteDataService;
    }

    /**
     * fetchFilters
     */
    public async fetchFilters(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Success fetchFilters',
                data: null
            };

            httpResponse.data = await this.service.getFilterInfo();

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    public async updatePageTagData(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Success updatePageTagData',
                data: null
            };

            const pageDataTagId = Number(request.params.pageDataTagId);
            const data = request.body;

            httpResponse.data = await this.service.updatePageTagData(pageDataTagId, data);

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    public async runscriptCalculateGroupPageTagData(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Success runscriptCalculateGroupPageTagData',
                data: null
            };

            const groupId = Number(request.params.group_id);
            
            httpResponse.data = await this.serverScriptService.runCalculatePageTagData(groupId);

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    public async getTagDataSearch(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Success runscriptCalculateGroupPageTagData',
                data: null
            };

            const text = String(request.query.text);
            
            httpResponse.data = await this.service.getTagDataSearch(text);

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    public async getTagData(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Success runscriptCalculateGroupPageTagData',
                data: null
            };

            const text = String(request.query.text);
            
            httpResponse.data = await this.service.getTagPageInfo(text);

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }
}
