import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { uploadsPath } from "../utils/paths";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsPath),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

export const upload = multer({ storage });
