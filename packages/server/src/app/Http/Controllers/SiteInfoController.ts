import { Request, Response, NextFunction } from 'express';
import IOC from 'sosise-core/build/ServiceProviders/IOC';
import HttpResponse from 'sosise-core/build/Types/HttpResponse';
import SiteInfoService from '../../Services/SiteInfoService';

export default class SiteInfoController {

    private service: SiteInfoService;
    constructor () {
        this.service = IOC.make(SiteInfoService);
    }

    /**
     *
     */
    public async serveDomainData(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Success serveDomainData',
                data: null
            };
            const domainId = Number(request.params.id);

            httpResponse.data = await this.service.getDomainInfo(domainId);

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     */
    public async serveDomainUrlGroupData(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Success serveDomainUrlGroupData',
                data: null
            };

            const domainId = Number(request.params.id);
            const groupId = Number(request.params.group_id);

            httpResponse.data = await this.service.getDomainUrlGroupInfo(domainId, groupId);
            
            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     */
    public async setDomainUrlGroupTags(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Success setDomainUrlGroupTags',
                data: null
            };

            const selectedTags = request.body.selected_tags;
            httpResponse.data = await this.service.updateDomainUrlGroupTags(selectedTags);
            
            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     */
    public async setDomainUrlGroupReady(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Success setDomainUrlGroupReady',
                data: null
            };

            const domainId = Number(request.params.domain_id);
            const groupId = Number(request.params.group_id);
            const groupReady = request.body.group_ready;

            httpResponse.data = await this.service.updateDomainUrlGroupReady(domainId, groupId, groupReady);
            
            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     */
    public async serveGroupCollectedData(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Success serveGroupCollectedData',
                data: null
            };

            const groupId = Number(request.params.group_id);

            httpResponse.data = await this.service.getGroupCollectedData(groupId);
            
            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     */
       public async serveGroupPagesAndGroupTagData(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Success serveGroupPagesAndGroupTagData',
                data: null
            };

            const groupId = Number(request.params.group_id);
            
            httpResponse.data = await this.service.getGroupPagesAndGroupTagData(groupId);
            
            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     */
    public async savePageTagData(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Success serveGroupPagesAndGroupTagData',
                data: null
            };

            const domainId= Number(request.params.domain_id);
            const groupId = Number(request.params.group_id);
            const pageId = Number(request.params.page_id);
            
            httpResponse.data = await this.service.savePageTagData(groupId, pageId, request.body);
            
            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }
    
}
