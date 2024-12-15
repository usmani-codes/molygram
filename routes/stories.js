import express from 'express'

import { getStories, getStory, createStory, updateStory, deleteStory, getStoriesCount, getStoriesByUser, getStoriesCountByUser } from '../controllers/stories.js'
import { RolesOnly } from '../middlewares/index.js'
import { uploadOptions } from '../middlewares/imageUploader.js'

export const router = express.Router()

router.get('/', getStories)

router.get('/:id', getStory)

router.post("/", uploadOptions.single('image'), createStory)

router.put('/:id', uploadOptions.single('image'), updateStory)

router.delete('/:id', RolesOnly('admin', "auther"), deleteStory)

router.get('/user/:id', getStoriesByUser)
router.get('/user/:id/get/count', getStoriesCountByUser)




router.get('/get/count', getStoriesCount)

// export default router