import Validator from 'validatorjs';
import ValidationException from 'sosise-core/build/Exceptions/Validation/ValidationException';
import { isNil } from 'lodash';

/**
 * If you need more validation rules, see: https://github.com/mikeerickson/validatorjs
 */
export default class ApiInfoUnifier {

    private params: any;
    public filterData: boolean;
    public dataOfFilter: number | null = null;
    public selectedFilterValue: string | null = null

    /**
     * Constructor
     */
    constructor(params: any) {
        // Remember incoming params
        this.params = params;

        // Validate, await is important otherwise we could not catch the exception
        this.validate();

        // Map data
        this.map();
    }

    /**
     * Request data validation
     */
    private validate() {
        // Create validator
        const validator = new Validator(this.params, {
            filter_data: ['boolean'],
            data_of_filter: ['numeric'],
            selected_filter_value: ['string']
        });

        // If it fails throw exception
        if (validator.fails()) {
            throw new ValidationException('Validation exception', (validator.errors.all() as any));
        }
    }

    /**
     * Request data mapping
     */
    private map() {
        this.filterData = this.params.filter_data ?? false;
        if(!isNil(this.params.data_of_filter))
            this.dataOfFilter = Number(this.params.data_of_filter);
        
        if(!isNil(this.params.selected_filter_value))
            this.selectedFilterValue = this.params.selected_filter_value;
    }
}
