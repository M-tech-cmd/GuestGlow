import multer from "multer";

// Use memory storage so files are available in req.files as buffers
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
