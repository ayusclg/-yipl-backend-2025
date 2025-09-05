import multer from "multer";
import cloudinary from 'cloudinary'


const storage = multer.memoryStorage()

export const Upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: ((req, file, cb) => {
        const allowedFileType = ['image/jpg', 'image/png', 'image/jpeg']
        if (allowedFileType.includes(file.mimetype)) {
            cb(null,true)
        }
        else {
            cb(new Error("Not Allowed File Type"))
        }
    })
})


export const uploadImageToCloud = async (file: Express.Multer.File) => {
  const base64 = Buffer.from(file.buffer).toString("base64");
  const dataUri = `data:${file.mimetype};base64,${base64}`;

  try {
    const cloudinaryUpload = await cloudinary.v2.uploader.upload(dataUri, {
      resource_type: "auto",
      folder: "LibaryManagement",
    });
    const response = cloudinaryUpload.secure_url;
    return response;
  } catch (error) {
    throw new Error("Uploading To Cloudinary Failed");
  }
}