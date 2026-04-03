

export class ApplicationException extends Error  {
        constructor(message:string  , public , cause:unknown ){
            super(message)
        }


}