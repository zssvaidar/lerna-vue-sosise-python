import Validator from "validatorjs";
import ValidationException from "sosise-core/build/Exceptions/Validation/ValidationException";
import { isEmpty } from "lodash";

/**
 * If you need more validation rules, see: https://github.com/mikeerickson/validatorjs
 */
export default class PostCrawlerPageUrl {
    private params: any;
    public domainId: number;
    public url: string;
    public type: string | null = null;

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
            domain_id: ["numeric", "required", "min:1"],
            url: ["string", "required"],
            type: ["string"],
        });

        // If it fails throw exception
        if (validator.fails()) {
            throw new ValidationException(
                "Validation exception",
                validator.errors.all() as any
            );
        }
    }

    /**
     * Request data mapping
     */
    private map() {
        this.domainId = this.params.domain_id;
        this.url = this.params.url;

        if (!isEmpty(this.params.type)) this.type = this.params.type;
    }
}
