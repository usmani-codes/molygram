import express from 'express'

import { getPosts, getPost, updatePost, deletePost, getPostsCount, createPost, getPostsByUser, getPostsCountByUser } from '../controllers/posts.js'
import { RolesOnly } from '../middlewares/index.js'
import { uploadOptions } from '../middlewares/imageUploader.js'

export const router = express.Router()

router.get('/', getPosts)

router.get('/:id', getPost)

router.post("/", uploadOptions.single('image'), createPost)

router.put('/:id', uploadOptions.single('image'), updatePost)

router.delete('/:id', RolesOnly('admin', "auther"), deletePost)

router.get('/user/:id', getPostsByUser)
router.get('/user/:id/get/count', getPostsCountByUser)




router.get('/get/count', getPostsCount)

// export default router