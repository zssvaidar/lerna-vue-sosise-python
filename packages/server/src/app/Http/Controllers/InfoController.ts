import { Request, Response, NextFunction } from 'express';
import { isNull } from 'lodash';
import IOC from 'sosise-core/build/ServiceProviders/IOC';
import HttpResponse from 'sosise-core/build/Types/HttpResponse';
import MainService from '../../Services/MainService';
import ApiInfoUnifier from '../../Unifiers/ApiInfoUnifier';

export default class InfoController {
    private service: MainService;

    constructor () {
        this.service = IOC.make(MainService)
    }
    /**
     *
     */
    public async fetchFilters(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Some example',
                data: {}
            };
            
            const data = new ApiInfoUnifier(request.query)

            if(data.filterData) {
                httpResponse.data['filters'] = await this.service.getFilterData();
                httpResponse.data['filter_group'] = await this.service.getInfoGroup();
            }
            if(!isNull(data.dataOfFilter)) {
                httpResponse.data['filter_data'] = await this.service.getInfoByFilter(data.dataOfFilter);

            }
            
            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }
}
