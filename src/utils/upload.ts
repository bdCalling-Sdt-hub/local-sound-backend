import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

const UPLOAD_DIR = process.env.UPLOAD_FOLDER || "public/images/users";
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 20971520; // 20 MB

const ALLOWED_FILE_TYPES = ["jpg", "jpeg", "png", "mp3"];

const storage: StorageEngine = multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const extName = path.extname(file.originalname);
        const fileName = `${Date.now()}-${file.originalname.replace(extName, "")}${extName}`;
        req.body.image = fileName; // Set the image path to req.body.image
        cb(null, fileName);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const extName = path.extname(file.originalname).toLowerCase();
    const isAllowedFileType = ALLOWED_FILE_TYPES.includes(extName.substring(1));
    if (!isAllowedFileType) {
        return cb(new Error(`Only ${ALLOWED_FILE_TYPES.join(", ")} files are allowed`));
    }
    cb(null, true);
};

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
});

export default upload;
