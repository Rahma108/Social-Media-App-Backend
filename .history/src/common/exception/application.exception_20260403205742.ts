

export class ApplicationException extends Error  {
        constructor(message:string  , public statusCode:number, cause:unknown ){
            super(message , {cause}  )
        }

}

export class ApplicationException extends Ap {
        constructor(message:string  , public statusCode:number, cause:unknown ){
            super(message , {cause}  )
        }

}