import express from 'express'

import { getLikes, getLike, updateLike, deleteLike, getLikesCount, createLike } from '../controllers/likes.js'

export const router = express.Router()

router.get('/', getLikes)

router.get('/:id', getLike)

router.post("/", createLike)

router.put('/:id', updateLike)

router.delete('/:id', deleteLike)

router.get('/get/count', getLikesCount)

// export default router