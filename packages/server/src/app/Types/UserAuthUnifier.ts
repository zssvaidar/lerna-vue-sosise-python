import Validator from 'validatorjs';
import ValidationException from 'sosise-core/build/Exceptions/Validation/ValidationException';

/**
 * If you need more validation rules, see: https://github.com/mikeerickson/validatorjs
 */
export default class UserAuthUnifier {

    private params: any;
    public email: string;
    public password: string;

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
            email: ['required', 'string'],
            password: ['required', 'string'],
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
        this.email = this.params.email.toLowerCase();
        this.password = this.params.password;
    }
}
