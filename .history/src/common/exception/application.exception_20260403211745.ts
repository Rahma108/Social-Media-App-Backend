

export class ApplicationException extends Error  {
        constructor(public override message:string  , public statusCode:number, override cause?:unknown ){
            super()
            this.name = this.constructor.name
            Error.captureStackTrace(this , this.constructor)
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