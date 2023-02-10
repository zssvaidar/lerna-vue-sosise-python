import { Request, Response, NextFunction } from 'express';
import { isEmpty, isNull } from 'lodash';
import IOC from 'sosise-core/build/ServiceProviders/IOC';
import HttpResponse from 'sosise-core/build/Types/HttpResponse';
import MainService from '../../Services/MainService';
import ApiInfoUnifier from '../../Unifiers/ApiInfoUnifier';
import lodash from 'lodash';

export default class InfoController {
    private service: MainService;

    constructor () {
        this.service = IOC.make(MainService)
    }

    /**
     *
     */
    public async fetchFilters (request: Request, response: Response, next: NextFunction) {
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
                console.log(data.dataOfFilter);
                httpResponse.data['filter_data'] = await this.service.getInfoByFilter(data.dataOfFilter);
            }
            
            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }

    /**
     * 
     */
    public async searchRequest (request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Some example',
                data: {}
            };

            const searchText = lodash.get(request.query, 'text', null) as string;
            if(isNull(searchText))
                throw new Error("Invalid text");
            
            const tagResult = await this.service.searchTagWithText(searchText);
            const ids = JSON.parse(tagResult[0].infoByGroupObject).ids
            const values = await this.service.getInfoByValue('ids', ids);

            httpResponse.data['searchResults'] = values;

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }
}
