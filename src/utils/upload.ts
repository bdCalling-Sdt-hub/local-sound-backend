import multer, { StorageEngine, FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import error from "./error";
import dotenv from 'dotenv'; 
dotenv.config();

const UPLOAD_DIR = process.env.UPLOAD_FOLDER || "public/images/users";
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 20971520; // 20 MB

const storage: StorageEngine = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const extName = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.originalname.replace(
      extName,
      ""
    )}${extName}`;
    req.body.image = fileName; // Set the image path to req.body.image
    cb(null, fileName);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  let allowedFileTypes = ["jpg", "jpeg", "png", "mp3"];

  if (!req.originalUrl.includes("musics"))
    allowedFileTypes = allowedFileTypes.slice(0, 3);
  
  const extName = path.extname(file.originalname).toLowerCase();
  const isAllowedFileType = allowedFileTypes.includes(extName.substring(1));
  if (!isAllowedFileType) {
    return cb(
      error(`Only ${allowedFileTypes.join(", ")} files are allowed`, 400)
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

export default upload;
