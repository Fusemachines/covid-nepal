export interface ParseInterface {
    logger: boolean
}

export interface HttpExceptionInterface {
    parse(options: ParseInterface): any
}

export interface ParamsInterface {
    title?: string,
    statusCode: number,
    description: string,
    isOperational?: boolean
}
