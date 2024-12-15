import mongoose from 'mongoose'
import Comment from '../models/comment.js'
import Post from '../models/post.js'

// @desc Get all comments
// @route GET /api/v1/comments
const getComments = async (req, res, next) => {
    const comments = await Comment.find({}, "-__v").populate("user post", "name content") //.populate("post user", "-updatedAt -__v")

    if (!comments.length) {
        return res.status(404).json({ success: false, msg: 'no comments found' })
    }

    return res.json({ success: true, comments })
}

// @desc Get Comment by id
// @route GET /api/v1/comments/:id
const getComment = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: 'not a valid Comment id' })
    }

    const comment = await Comment.findOne({ _id: id }, "-__v").populate("post user", "-createdAt -updatedAt -__v")

    if (!comment) {
        return res.status(404).json({ success: false, msg: 'no comment found with this id' })
    }

    return res.json({ success: true, comment })
}

// @desc create a Comment
// @route Comment /api/v1/comments
const createComment = async (req, res, next) => {
    const { content, post, user } = req.body

    if (!mongoose.isValidObjectId(user) || !mongoose.isValidObjectId(post)) {
        return res.status(401).json({ success: false, msg: 'not a valid db id..' })
    }

    if (!post || !user || !content) {
        return res.status(400).json({ success: false, msg: 'please provide all required feilds ..' })
    }

    const newComment = new Comment({ content, post, user })
    await newComment.save()

    if (!newComment) {
        return res.status(500).json({ success: false, msg: "something went wrong .." })
    }

    res.status(201).json({ success: true, msg: 'Comment added successfully ', data: newComment })
}

// @desc update a Comment by id
// @route PUT /api/v1/comments/:id
const updateComment = async (req, res, next) => {
    const { id } = req.params
    const { content, post } = req.body

    if (!mongoose.isValidObjectId(id) || (post && !mongoose.isValidObjectId(post))) {
        return res.status(401).json({ success: false, msg: 'not a valid db id..' })
    }

    if (req.body.user) {
        return res.status(401).json({ success: false, msg: "can't change user id" })
    }

    const comment = await Comment.findOneAndUpdate({ _id: id }, { content, post }, { new: true }).populate("user post", "name content")

    if (!comment) {
        return res.status(404).json({ success: false, msg: 'comment with this id not found' })
    }

    res.status(201).json({ msg: 'comment updated ', comment })
}

// @desc delete a Comment by id
// @route DELETE /api/v1/comments/:id
const deleteComment = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: "invalid comment Id.." })
    }

    const comment = await Comment.findOneAndDelete({ _id: id })


    if (!comment) {
        return res.status(404).json({ success: false, msg: `comment not found` })
    }

    res.status(203).json({ success: true, msg: `Comment deleted..`, comment })
}

//@desc get Comment by user
// @route GET /api/v1/comments/user/:id
const getCommentsByUser = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: 'not a valid user id' })
    }

    const comments = await Comment.find({ user: id }).populate("user post", "name content")

    if (!comments.length) {
        return res.status(404).json({ success: false, msg: 'no comments found with this id' })
    }

    return res.json({ success: true, data: comments })
}

//@desc get a user's comments count
// @route GET /api/v1/comments/user/:id/get/count
const getCommentsCountByUser = async (req, res, next) => {
    const { id } = req.params
    const comments = await Comment.countDocuments({ user: id })
    res.status(200).json({ success: true, totalComments: comments })
}

// @desc get comments total count
// @route GET /api/v1/comments/get/count
const getCommentsCount = async (req, res, next) => {
    const comments = await Comment.countDocuments()
    res.status(200).json({ success: true, totalComments: comments })
}

export { getComments, getComment, createComment, updateComment, deleteComment, getCommentsCount, getCommentsByUser, getCommentsCountByUser }