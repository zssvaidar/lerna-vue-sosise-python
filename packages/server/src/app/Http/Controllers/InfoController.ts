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
                httpResponse.data['filters'] = await this.service.getFilters();
                httpResponse.data['filter_value'] = await this.service.getFilterValue();
            
            }

            if(!isNull(data.selectedFilterValue)) {
                httpResponse.data['selected_filter_value_results'] = await this.service.getInfoByFilterValue(data.selectedFilterValue);
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
            
            const searchTags = await this.service.searchTagWithText(searchText);
            
            const ids: number[] = [];
            for (const searchTag of searchTags) {
                
                const tagIds = JSON.parse(searchTag.infoObject).ids
                for (const id of tagIds) {
                    if (!ids.includes(id)) {
                        ids.push(id);
                    }
                }
            }

            const values = await this.service.getInfoByValue('ids', ids);

            httpResponse.data['search_text_results'] = values;

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }
}
