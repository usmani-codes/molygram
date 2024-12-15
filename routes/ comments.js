import express from 'express'

import { getComments, getComment, createComment, updateComment, deleteComment, getCommentsCount, getCommentsByUser, getCommentsCountByUser } from '../controllers/comments.js'

export const router = express.Router()

router.get('/', getComments)

router.get('/:id', getComment)

router.post('/', createComment)

router.put('/:id', updateComment)

router.delete('/:id', deleteComment)

router.get('/get/count', getCommentsCount)

router.get('/user/:id', getCommentsByUser)
router.get('/user/:id/get/count', getCommentsCountByUser)