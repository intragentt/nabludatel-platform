import express from "express";
import fs from "fs";
import { uploadsPath } from "../utils/paths";
import { uploadSingleImage } from "../middlewares/uploadMiddleware";
import multer from "multer";

const router = express.Router();

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Файл не загружен" });
  }
  const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  console.log(
    `[${new Date().toISOString()}] File uploaded: ${fileUrl}, by IP=${
      req.ip || req.connection.remoteAddress
    }`
  );
  res.json({ url: fileUrl });
});

export default router;
