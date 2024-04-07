import { Request } from "express";
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: any) {

        const allowedFileTypes = ['image/jpg', ' image/png', ' image/jpeg']
        if (!allowedFileTypes.includes(file.mimetype)) {
            cb(new Error(" This file is not allowed"))
            return
        }
        cb(null, './src/uploads')
    },
    filename: function (req: Request, file: Express.Multer.File, cb: any) {
        cb(null, Date.now() + "_" + file.originalname)
    }
})
export {
    multer,
    storage
};
