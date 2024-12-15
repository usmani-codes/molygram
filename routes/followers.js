import express from 'express'

import { getFollowers, getFollower, updateFollower, deleteFollower, getFollowersCount, createFollower, getFollowersOfUser, getFollowersCountOfUser } from '../controllers/followers.js'

export const router = express.Router()

router.get('/', getFollowers)

router.get('/:id', getFollower)

router.post("/", createFollower)

router.put('/:id', updateFollower)

router.delete('/:id', deleteFollower)

router.get('/get/count', getFollowersCount)

router.get('/user/:id', getFollowersOfUser)
router.get('/user/:id/get/count', getFollowersCountOfUser)

// export default router