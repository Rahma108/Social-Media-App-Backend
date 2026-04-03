

export class ApplicationException extends Error  {
        constructor(message:string , cause:unknown ){
            super(message)
        }


}