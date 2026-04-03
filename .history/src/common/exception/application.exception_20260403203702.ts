

export class ApplicationException extends Error  {
        constructor(message:string  , public statusCode, cause:unknown ){
            super(message)
        }


}