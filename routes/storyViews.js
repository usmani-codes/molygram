import express from 'express'

import { getStoryViews, getStoryView, createStoryView, updateStoryView, deleteStoryView, getStoryViewsCount, getStoryViewsByUser, getStoryViewsCountByUser } from '../controllers/storyViews.js'
import { RolesOnly } from '../middlewares/index.js'
import { uploadOptions } from '../middlewares/imageUploader.js'

export const router = express.Router()

router.get('/', getStoryViews)

router.get('/:id', getStoryView)

router.post("/", uploadOptions.single('image'), createStoryView)

router.put('/:id', uploadOptions.single('image'), updateStoryView)

router.delete('/:id', RolesOnly('admin'), deleteStoryView)

router.get('/story/:id', getStoryViewsByUser)
router.get('/story/:id/get/count', getStoryViewsCountByUser)

router.get('/get/count', getStoryViewsCount)
