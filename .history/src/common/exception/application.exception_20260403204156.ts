

export class ApplicationException extends Error  {
        constructor(message:string  , public statusCode:number, exr:unknown ){
            super(message , statusCode , )
        }


}