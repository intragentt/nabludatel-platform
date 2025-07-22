import { upload } from "../config/multer";

export const uploadSingleImage = upload.single("file");
