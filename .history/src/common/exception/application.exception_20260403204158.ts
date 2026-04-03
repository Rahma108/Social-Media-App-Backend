

export class ApplicationException extends Error  {
        constructor(message:string  , public statusCode:number, exrta:unknown ){
            super(message , statusCode , )
        }


}