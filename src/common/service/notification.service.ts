import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import  admin from 'firebase-admin'


export class NotificationService {

    private client:admin.app.App ;
    constructor(){
        const serviceAccount = JSON.parse(
            readFileSync(resolve("./src/config/social-media-app-7b804-firebase-adminsdk-fbsvc-a0772f1b98.json")) as unknown as string
        );
        this.client = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }

    async sendNotification({
        token ,
        data
    }:{
        token : string ;
        data:{
            title : string ;
            body: string ;
        }
    }){
    const message = {
        token,
        data
    };

    return await this.client.messaging().send(message);



    }
    async sendMultipleNotification({
        tokens ,
        data
    }:{
        tokens : string[] ;
        data:{
            title : string ;
            body: string ;
            postId?: string;
            commentId?: string;
        }
    }){
    await Promise.allSettled(
        tokens.map(token =>{ return this.sendNotification({token , data })  } )



    )



    }




}


export const notificationService = new NotificationService()