
## Throwing Exception(s)
We have built Custom HttpException to handle exception.`HttpException` implement `HttpExceptionInterface` which has parser method to parse the error object and parser method accept below options

* logger
    * default: true
    * error.parse({ logger: false })

## Uses
```js
throw new HttpException({
    title: "NOT FOUND",
    statusCode: 500,
    description: `Error while getting all livedata`,
    isOperational: true
})
```

## Extending HttpException
You can add new Exception class like NotFoundException by extending HttpException.

`example`
```js
import HttpException from "./HttpException"

class NotAuthorizedException extends HttpException {
    constructor () {
        super({
            statusCode: 403,
            title: "Unauthorized",
            description: "You are not authorized"
        })
    }
}

export default NotAuthorizedException
```
### Uses
```js
throw new NotAuthorizedException({
    isOperational: true
})
```
