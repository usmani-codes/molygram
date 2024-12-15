import multer from 'multer'


const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.originalUrl.includes('stories'))
        const validFile = FILE_TYPE_MAP[file.mimetype]
        let err = new Error('invalid Image type')
        err.status = 400

        err = validFile ? null : err

        if (req.originalUrl.includes('stories')) {
            cb(err, 'public/stories')
        } else if ((req.originalUrl.includes('posts'))) {
            cb(err, 'public/posts')
        } else {
            cb(err, 'public/profiles')
        }

    },
    filename: function (req, file, cb) {
        let fileName

        if (file.originalname.includes(" ")) {
            fileName = file.originalname.split(" ").join("-").split(".")[0]
        } else {
            fileName = file.originalname.split(".")[0]
        }

        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

export const uploadOptions = multer({ storage: storage })