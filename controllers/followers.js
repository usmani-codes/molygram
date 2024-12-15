import mongoose from 'mongoose'
import Follower from '../models/follower.js'

// @desc Get all Follower
// @route GET /api/v1/followers
const getFollowers = async (req, res, next) => {
    const followers = await Follower.find({}, "-__v -createdAt -updatedAt").populate('user follower', 'name')

    if (!followers.length) {
        return res.status(404).json({ success: false, msg: 'no followers found' })
    }

    return res.json({ success: true, data: followers })
}

// @desc Get Follower by id
// @route GET /api/v1/followers/:id
const getFollower = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ success: false, msg: "invalid Follower id.." })
    }

    const follower = await Follower.findOne({ _id: id }, "-__v")

    if (!follower) {
        return res.status(404).json({ success: false, msg: 'no follower found with this id' })
    }

    return res.json({ success: true, data: follower })
}

// @desc Create a new Follower
// @route POST /api/v1/followers
const createFollower = async (req, res, next) => {
    const { user, follower } = req.body

    if (!mongoose.isValidObjectId(user) || !mongoose.isValidObjectId(follower)) {
        res.status(400).json({ success: false, msg: "invalid like id.." })
    }

    if (!user || !follower) {
        return res.status(404).json({ success: false, msg: 'please fill all required fields ..' })
    }

    const dbUser = await Follower.findOne({ user }, "follower")

    // await dbUser.followers.push(follower)
    // await dbUser.save()
    // return res.status(400).json({ success: false, msg: 'You got a new follower || follower added to followers' })

    const newFollower = new Follower({ user, follower })
    await newFollower.save()

    if (!newFollower) {
        res.status(404).json({ success: false, msg: 'the Follower cannot be created!' })
    }

    res.status(201).json({ success: true, data: newFollower })
}


// @desc update a Follower by id
// @route PUT /api/v1/followers/:id
const updateFollower = async (req, res, next) => {
    const { id } = req.params
    const { user, follower } = req.body

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(user) || !mongoose.isValidObjectId(follower)) {
        res.status(400).json({ success: false, msg: "invalid Follower id.." })
    }

    const dbFollower = await Follower.findOneAndUpdate({ _id: id }, { user, follower }, { new: true })

    if (!dbFollower) {
        return res.status(404).json({ success: false, msg: 'Follower with this id not found' })
    }

    res.status(201).json({ msg: 'Follower updated ', data: dbFollower })
}

// @desc delete a Hospital by id
// @route DELETE /api/v1/followers/:id
const deleteFollower = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: "invalid Id" })
    }

    const follower = await Follower.findOneAndDelete({ _id: id })

    if (!follower) {
        return res.status(404).json({ success: true, msg: `Follower type could not deleted ..` })
    }

    res.status(203).json({ success: true, msg: `Follower deleted`, follower })
}

//@desc get Follower by user
// @route GET /api/v1/followers/user/:id
const getFollowersOfUser = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: 'not a valid user id' })
    }

    const followers = await Follower.find({ user: id }).populate("user follower", "name")

    if (!followers.length) {
        return res.status(404).json({ success: false, msg: 'no followers found with this id' })
    }

    return res.json({ success: true, data: followers })
}

//@desc get a user's Followers count
// @route GET /api/v1/followers/user/:id/get/count
const getFollowersCountOfUser = async (req, res, next) => {
    const { id } = req.params
    const followers = await Follower.countDocuments({ user: id })
    res.status(200).json({ success: true, totalFollowers: followers })
}

// @desc get Follower total count
// @route GET /api/v1/followers/get/count
const getFollowersCount = async (req, res, next) => {
    const followers = await Follower.countDocuments()
    res.status(200).json({ success: true, totalFollower: followers })
}

export { getFollowers, getFollower, createFollower, updateFollower, deleteFollower, getFollowersCount, getFollowersOfUser, getFollowersCountOfUser }