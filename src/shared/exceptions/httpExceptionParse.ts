class ExceptionParser {

    /**
     * Parse instance of Error | array of error object
     *
     * @returns object
     */
    public static parse (errors: any): object {
        if (typeof errors.message !== "string" && ExceptionParser.isMessageIterable(errors)) {
            const errs = [];
            for (const error of errors.message) {
                errs.push({
                    status: 422,
                    title: typeof error.location !== undefined ? error.location : "",
                    description: typeof error.description !== undefined ? error.description : "",
                    isOperational: typeof error.isOperational !== undefined ? error.isOperational : "",
                })
            }

            return {
                errors: errs
            }
        }
        else {
            return {
                error: {
                    title: errors.title ? errors.title : "",
                    statusCode: errors.statusCode ? errors.statusCode : "",
                    description: errors.description,
                    isOperational: errors.isOperational,
                }
            }
        }
    }

    public static isMessageIterable(errors: any): boolean {
        return errors.message && typeof errors.message[Symbol.iterator] === "function"
    }
}

export default ExceptionParser
