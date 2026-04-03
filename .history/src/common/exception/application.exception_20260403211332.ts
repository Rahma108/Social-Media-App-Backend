

export class ApplicationException extends Error  {
        constructor(message:string  , public statusCode:number, cause:unknown ){
            super(message , {cause}  )
            this.name = this.constructor.name
            Error.
        }

}

export class NotFoundException extends ApplicationException {
        constructor(message:string = "Not Found "  , cause?:unknown ){
            super(message ,  404 , cause )
        }

}
export class BadRequestException extends ApplicationException {
        constructor(message:string = "Bad Request"  , cause?:unknown ){
            super(message , 400 , cause )
        }

}