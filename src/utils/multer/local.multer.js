import multer from "multer"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const uploadFileDisk = () => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            // Use absolute path for Back4App
            const uploadPath = path.join(__dirname, '../../../public/files')
            cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            // Keep original filename but add timestamp to make it unique
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            const ext = path.extname(file.originalname)
            const originalName = path.basename(file.originalname, ext)
            cb(null, originalName + '-' + uniqueSuffix + ext)
        }
    })

    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Only image files are allowed!'), false)
        }
    }

    return multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB limit
        }
    })
}