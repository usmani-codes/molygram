import mongoose from 'mongoose'
import Like from '../models/like.js'

// @desc Get all likes
// @route GET /api/v1/likes
const getLikes = async (req, res, next) => {
    const likes = await Like.find({}, "-__v -createdAt -updatedAt").populate('post user', 'name content')

    if (!likes.length) {
        return res.status(404).json({ success: false, msg: 'no likes found' })
    }

    return res.json({ success: true, data: likes })
}

// @desc Get like by id
// @route GET /api/v1/likes/:id
const getLike = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ success: false, msg: "invalid like id.." })
    }

    const like = await Like.findOne({ _id: id }, "-__v").populate('post user')

    if (!like) {
        return res.status(404).json({ success: false, msg: 'no like found with this id' })
    }

    return res.json({ success: true, data: like })
}

// @desc Create a new like
// @route POST /api/v1/likes
const createLike = async (req, res, next) => {
    const { post, user } = req.body

    if (!mongoose.isValidObjectId(post) || !mongoose.isValidObjectId(user)) {
        res.status(400).json({ success: false, msg: "invalid like id.." })
    }

    if (!user || !post) {
        return res.status(404).json({ success: false, msg: 'please fill all required fields ..' })
    }
    const newLike = new Like({ user, post })
    await newLike.save()

    if (!newLike) {
        res.status(404).json({ success: false, msg: 'the like cannot be created!' })
    }

    res.status(201).json({ success: true, data: newLike })
}


// @desc update a like by id
// @route PUT /api/v1/likes/:id
const updateLike = async (req, res, next) => {
    const { id } = req.params
    const { user, post } = req.body

    if ((post && !mongoose.isValidObjectId(post)) || (user && !mongoose.isValidObjectId(user))) {
        res.status(400).json({ success: false, msg: "invalid like id.." })
    }

    const like = await Like.findOneAndUpdate({ _id: id }, { user, post }, { new: true })

    if (!like) {
        return res.status(404).json({ success: false, msg: 'like with this id not found' })
    }

    res.status(201).json({ msg: 'like updated ', data: like })
}

// @desc delete a Hospital by id
// @route DELETE /api/v1/likes/:id
const deleteLike = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: "invalid Id" })
    }

    const like = await Like.findOneAndDelete({ _id: id })

    if (!like) {
        return res.status(404).json({ success: true, msg: `like type could not deleted ..` })
    }

    res.status(203).json({ success: true, msg: `like deleted`, like })
}

// @desc get like total count
// @route GET /api/v1/likes/get/count
const getLikesCount = async (req, res, next) => {
    const likes = await Like.countDocuments()
    res.status(200).json({ success: true, totallike: likes })
}

export { getLikes, getLike, createLike, updateLike, deleteLike, getLikesCount }