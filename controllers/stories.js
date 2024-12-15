import mongoose from 'mongoose'
import Story from '../models/story.js'

// @desc Get all stories
// @route GET /api/v1/stories
const getStories = async (req, res, next) => {
    const stories = await Story.find({}, "-__v").populate("user", "-updatedAt -__v")

    if (!stories.length) {
        return res.status(404).json({ success: false, msg: 'no stories found' })
    }

    return res.json({ success: true, stories })
}

// @desc Get story by id
// @route GET /api/v1/stories/:id
const getStory = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: 'not a valid story id' })
    }

    const story = await Story.findOne({ _id: id }, "-__v").populate("user", "-createdAt -updatedAt -__v")

    if (!story) {
        return res.status(404).json({ success: false, msg: 'no story found with this id' })
    }

    return res.status(200).json({ success: true, story })
}

// @desc create a story
// @route story /api/v1/stories
const createStory = async (req, res, next) => {
    const { user } = req.body

    // console.log("inside controller ..")

    if (!mongoose.isValidObjectId(user)) {
        return res.status(401).json({ success: false, msg: 'not a valid db id..' })
    }

    console.log(req.file)

    if (!req.file || !user) {
        return res.status(400).json({ success: false, msg: 'please provide all required feilds ..' })
    }

    let image = `uploads/stories/${req.file.filename}`

    const story = new Story({ image, user })
    await story.save()

    if (!story) {
        return res.status(500).json({ success: false, msg: "something went wrong .." })
    }

    res.status(201).json({ success: true, msg: 'story created successfully ', data: story })
}

// @desc update a story by id
// @route PUT /api/v1/stories/:id
const updateStory = async (req, res, next) => {
    const { id } = req.params
    const { user } = req.body

    if (!mongoose.isValidObjectId(id) || (user && !mongoose.isValidObjectId(user))) {
        return res.status(401).json({ success: false, msg: 'not a valid db id..' })
    }

    let image = req.file && `uploads/stories/${req.file.filename}`

    const story = await Story.findOneAndUpdate({ _id: id }, { user, image }, { new: true }).populate("user", "name")

    if (!story) {
        return res.status(404).json({ success: false, msg: 'story with this id not found' })
    }

    res.status(201).json({ msg: 'story updated ', story })
}

// @desc delete a story by id
// @route DELETE /api/v1/stories/:id
const deleteStory = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: "invalid story Id.." })
    }

    const story = await Story.findOneAndDelete({ _id: id })

    if (!story) {
        return res.status(404).json({ success: false, msg: `story not found` })
    }

    res.status(203).json({ success: true, msg: `story deleted..`, story })
}

//@desc get story by user
// @route GET /api/v1/stories/user/:id
const getStoriesByUser = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: 'not a valid user id' })
    }

    const stories = await Story.find({ user: id }).populate('user', 'name')

    if (!stories.length) {
        return res.status(404).json({ success: false, msg: 'no stories found with this id' })
    }

    return res.json({ success: true, data: stories })
}

//@desc get a user's story count
// @route GET /api/v1/stories/user/:id/get/count
const getStoriesCountByUser = async (req, res, next) => {
    const { id } = req.params
    const stories = await Story.countDocuments({ user: id })
    res.status(200).json({ success: true, totalstories: stories })
}

// @desc get stories total count
// @route GET /api/v1/stories/get/count
const getStoriesCount = async (req, res, next) => {
    const stories = await Story.countDocuments()
    res.status(200).json({ success: true, totalstories: stories })
}

export { getStories, getStory, createStory, updateStory, deleteStory, getStoriesCount, getStoriesByUser, getStoriesCountByUser }