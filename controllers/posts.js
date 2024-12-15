import mongoose from 'mongoose'
import Post from '../models/post.js'
import fs from 'fs/promises'
// import { User } from '../models/user.js'
// import Role from '../models/role.js'

// @desc Get all Posts
// @route GET /api/v1/posts
const getPosts = async (req, res, next) => {
    const posts = await Post.find({}, "-__v").populate("user", "-updatedAt -__v")

    if (!posts.length) {
        return res.status(404).json({ success: false, msg: 'no posts found' })
    }

    return res.json({ success: true, posts })
}

// @desc Get Post by id
// @route GET /api/v1/posts/:id
const getPost = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: 'not a valid Post id' })
    }

    const post = await Post.findOne({ _id: id }, "-__v") //.populate("user", "-createdAt -updatedAt -__v").populate("category", "-createdAt -updatedAt -__v")

    if (!post) {
        return res.status(404).json({ success: false, msg: 'no post found with this id' })
    }

    return res.status(200).json({ success: true, post })
}

// @desc create a Post
// @route POST /api/v1/posts
const createPost = async (req, res, next) => {
    const { caption, content, user } = req.body

    console.log(req.body)

    if (!mongoose.isValidObjectId(user)) {
        return res.status(401).json({ success: false, msg: 'not a valid db id..' })
    }

    if (!req.file) {
        return res.status(400).json({ success: false, msg: 'please attach an image to create a story ..' })
    }

    let image = `uploads/posts/${req.file.filename}`

    if (!caption || !content || !user) {
        return res.status(400).json({ success: false, msg: 'please provide all required feilds ..' })
    }

    const post = new Post({ image, caption, content, user })
    await post.save()

    if (!post) {
        return res.status(500).json({ success: false, msg: "something went wrong .." })
    }

    res.status(201).json({ success: true, msg: 'Post created successfully ', data: post })
}

// @desc update a Post by id
// @route PUT /api/v1/posts/:id
const updatePost = async (req, res, next) => {
    const { id } = req.params
    const { caption, content } = req.body

    if (!mongoose.isValidObjectId(id)) {
        return res.status(401).json({ success: false, msg: 'not a valid db id..' })
    }

    if (req.body.user) {
        return res.status(403).json({ success: false, msg: 'can not change your id..' })
    }

    let image = req.file && `uploads/posts/${req.file.filename}`

    const post = await Post.findOneAndUpdate({ _id: id }, { caption, content, image }, { new: true }).populate("user", "name")

    if (!post) {
        return res.status(404).json({ success: false, msg: 'post with this id not found' })
    }

    res.status(201).json({ msg: 'post updated ', post })
}

// @desc delete a post by id
// @route DELETE /api/v1/posts/:id
const deletePost = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: "invalid Post Id.." })
    }

    const post = await Post.findOneAndDelete({ _id: id })

    if (!post) {
        return res.status(404).json({ success: false, msg: `Post not found` })
    }

    res.status(203).json({ success: true, msg: `Post deleted..`, post })
}

//@desc get post by user
// @route GET /api/v1/posts/user/:id
const getPostsByUser = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: 'not a valid user id' })
    }

    const posts = await Post.find({ user: id }).populate('user', 'name')

    if (!posts.length) {
        return res.status(404).json({ success: false, msg: 'no Posts found with this id' })
    }

    return res.json({ success: true, data: posts })
}

//@desc get a user's Post count
// @route GET /api/v1/posts/user/:id/get/count
const getPostsCountByUser = async (req, res, next) => {
    const { id } = req.params
    const posts = await Post.countDocuments({ user: id })
    res.status(200).json({ success: true, totalPosts: posts })
}

// @desc get Posts total count
// @route GET /api/v1/posts/get/count
const getPostsCount = async (req, res, next) => {
    const posts = await Post.countDocuments()
    res.status(200).json({ success: true, totalPosts: posts })
}

export { getPosts, getPost, createPost, updatePost, deletePost, getPostsCount, getPostsByUser, getPostsCountByUser }