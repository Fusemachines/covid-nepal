import ExceptionParser from "./httpExceptionParse"
import { HttpExceptionInterface, ParamsInterface, ParseInterface } from "../interfaces/httpException.interface"

class HttpException extends Error implements HttpExceptionInterface {

    public readonly params: any;
    public readonly options: any;

    /**
     * @param  {object} params
     * @param options
     */
    constructor(params: ParamsInterface, options: any = {}) {
        super(params.description);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        params.isOperational = params.isOperational ? params.isOperational : false
        this.params = params;
        this.options = options;

        Error.captureStackTrace(this);
    }


    // return type should be array
    public parse(options: ParseInterface = { logger: true }) {
        const parsedError: any = ExceptionParser.parse(this.params)

        // logger
        if (options && options.logger) {
            global.logger.log({
                level: "error",
                message: parsedError.error && parsedError.error.description
            });
        }

        return parsedError.error || parsedError.errors
    }
}

export default HttpException

