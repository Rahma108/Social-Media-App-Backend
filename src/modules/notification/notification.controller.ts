import { Router, type Request, type Response } from "express";
import { notificationService } from "./notification.service";
import { successResponse } from "../../common/response";
import { BadRequestException } from "../../common/exception";

const router = Router();

/* CREATE Notification (Admin only)*/
router.post("/", async (req: Request, res: Response) => {
    try {
        const { receiverId, message, type, postId } = req.body;

        const notification = await notificationService.createNotification({
        receiverId,
        senderId: (req as any).user,
        message,
        type,
        postId
        });

        return successResponse({res , status: 201, data: notification })
    } catch (err: any) {
        console.log(err); 
    }
});


/* GET My Notifications*/
router.get("/", async (req: Request, res: Response) => {
    try {
        const notifications = await notificationService.getUserNotifications((req as any).user);
        return successResponse({res , status: 200, data: notifications })
    
    } catch (err: any) {
        console.log(err);
    }
});


/*GET Unread Count*/
router.get("/unread-count", async (req: Request, res: Response) => {
    try {
        const count = await notificationService.getUnreadCount((req as any).user);
        return successResponse({res ,  data: count })
    } catch (err: any) {
        throw new BadRequestException("Fail to Give unread count")
    }
});


/* Mark one as read*/
// router.patch("/:id/read", async (req: Request, res: Response) => {
//     try {
//     const { id } = req.params;

//         if (!id) {
//             throw new BadRequestException("id is required")
//         }
        
//         const notification = await notificationService.markAsRead(id);
//         return successResponse({res ,  data: notification})
//     } catch (err: any) {
//         throw new BadRequestException("Fail to mark one read")
//     }
// });


// /* Mark all as read*/
router.patch("/read-all", async (req: Request, res: Response) => {
    try {
        await notificationService.markAllAsRead((req as any).user._id);

        return successResponse({res })
    } catch (err: any) {
        throw new BadRequestException("Fail to mark all read")
    }
});


// /*Soft Delete*/
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await notificationService.softDeleteNotification(id);

        return successResponse({res })
    } catch (err: any) {
        throw new BadRequestException("Fail to delete")
    }
});


// /* Hard Delete*/
router.delete("/:id/hard", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await notificationService.hardDeleteNotification(id);

        return successResponse({res })
    } catch (err: any) {
        throw new BadRequestException("Fail to delete")
    }
});

export default router;