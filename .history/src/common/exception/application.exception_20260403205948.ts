

export class ApplicationException extends Error  {
        constructor(message:string  , public statusCode:number, cause:unknown ){
            super(message , {cause}  )
        }

}

export class NotFoundException extends ApplicationException {
        constructor(message:string  , cause:unknown ){
            super(message ,  404 , cause )
        }

}
export class BadRequestException extends ApplicationException {
        constructor(message:string  , cause?:unknown ){
            super(message , 409 , cause )
        }

}