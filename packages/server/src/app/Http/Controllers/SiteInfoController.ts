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
     * Example method
     */
    public async serveDomainData(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Some example',
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
     * Example method
     */
    public async serveDomainUrlGroupData(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Some example',
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
}
