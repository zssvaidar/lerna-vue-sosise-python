import { Request, Response, NextFunction } from 'express';
import IOC from 'sosise-core/build/ServiceProviders/IOC';
import HttpResponse from 'sosise-core/build/Types/HttpResponse';
import ComputationTextFreqService from '../../Services/ComputationTextFreqService';

export default class ComputationController {

    private service: ComputationTextFreqService;

    constructor () {
        this.service = IOC.make(ComputationTextFreqService) as ComputationTextFreqService;
    }
    /**
     * fetchApiData
     */
    public async fetchApiData(request: Request, response: Response, next: NextFunction) {
        try {
            // Prepare http response
            const httpResponse: HttpResponse = {
                code: 1000,
                message: 'Some example',
                data: null
            };

            httpResponse.data = await this.service.fetchApiData();

            // Send response
            return response.send(httpResponse);
        } catch (error) {
            next(error);
        }
    }
}
