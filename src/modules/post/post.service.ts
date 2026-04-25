import { HydratedDocument, Types } from "mongoose";
import { createPostBodyDTO } from "./post.dto";
import { IPost, IUser } from "../../common/interfaces";
import {  notificationService, redisService, S3Service } from "../../common/service";
import { PostRepository, UserRepository } from "../../DB/repository";
import { BadRequestException, NotFoundException } from "../../common/exception";
import { randomUUID } from "crypto";
import { json } from "zod";

class PostService {
    private readonly s3Service: S3Service
    private readonly userRepository: UserRepository
    private readonly postRepository: PostRepository

        constructor(){
            this.s3Service = new S3Service()
            this.userRepository = new UserRepository()
            this.postRepository = new PostRepository()
        }

    async createPost({availability , content , files , tags}: createPostBodyDTO , user : HydratedDocument<IUser>): Promise<IPost>{
        let folderId = randomUUID()
        let FCM_TOKENS : string[] = []
        let mentions = [] 
        if(tags?.length){
            tags = [...new Set(tags)]

        const matchedTags = await this.userRepository.find({filter:{ _id : {$in : tags }}})
        if(matchedTags.length != tags.length ){
            throw new NotFoundException("Fail to find Match account ✖️")

        }
        for (const tag of tags ) {
            mentions.push(Types.ObjectId.createFromHexString(tag))
            const tokens = (await redisService.getFCMs(tag) ||[] ).map(ele => {FCM_TOKENS.push(ele)})

            FCM_TOKENS.push(tag)
        }

        }

        let attachments: string[] = []

        if (files && files.length > 0) {
            attachments = await this.s3Service.uploadAssets({
                files,
                path: `Post/${folderId}`
            }) || []
        }

        const post = await this.postRepository.createOne({

            data:{
                createdBy:user._id ,
                content:content as string ,
                availability ,
                attachments ,
                folderId ,
                tags :  mentions


            }
        })

        if(!post){
            if(!attachments.length){
                await this.s3Service.deleteAssets({
                Keys : attachments.map(ele => { return {Key: ele }} )
            })
            throw new BadRequestException("Fail to create this post ✖️")

            }
        }
        
        if(FCM_TOKENS.length){
            await notificationService.sendMultipleNotification({
                tokens : FCM_TOKENS ,
                data:{
                    title : "Post Creation" ,
                    body : JSON.stringify({
                        message : `Hello you have been mentioned ${user.username} post  ` ,
                        postId : post._id 

                    })
                }
            })

        }

        return post.toJSON()
    }
}


export const postService = new PostService()
