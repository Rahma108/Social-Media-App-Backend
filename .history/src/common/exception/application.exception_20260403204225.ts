

export class ApplicationException extends Error  {
        constructor(message:string  , public statusCode:number, extra:unknown ){
            super(message , {cause:{st} } )
        }


}