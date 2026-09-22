import multer from "multer";

const storage = multer.memoryStorage();

// Single profile picture
export const singleUpload = multer({ storage }).single("profilePic");


// Multiple product images - maximum 5
export const multipleUpload = multer({ storage }).array("images", 5);

