// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import multer from 'multer';
// import dotenv from 'dotenv';

// dotenv.config();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
//     api_key: process.env.CLOUDINARY_API_KEY.trim(),
//     api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
// });

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: 'study-notes',
//         allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
//         transformation: [{ width: 800, height: 800, crop: 'limit' }],
//     },
// });

// const upload = multer({ storage });

// export default upload;



import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: async (req, file) => {
        // Agar PDF hai to resource_type 'raw' hona chahiye
        const isPdf = file.mimetype === 'application/pdf';

        return {
            folder: isPdf ? 'notes_pdfs' : 'notes_images',
            resource_type: isPdf ? 'raw' : 'image',
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        };
    },
});

export default multer({ storage });
