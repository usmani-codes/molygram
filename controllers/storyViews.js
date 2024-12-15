import mongoose from 'mongoose'
import storyView from '../models/storyView.js'
import StoryView from '../models/storyView.js'
import Story from '../models/story.js'
import { User } from '../models/user.js'

// @desc Get all storyViews
// @route GET /api/v1/story-views
const getStoryViews = async (req, res, next) => {
    const storyViews = await StoryView.find({}, "-__v").populate("story user", "-updatedAt -__v")

    if (!storyViews.length) {
        return res.status(404).json({ success: false, msg: 'no storyViews found' })
    }

    return res.json({ success: true, storyViews })
}

// @desc Get storyView by id
// @route GET /api/v1/story-views/:id
const getStoryView = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: 'not a valid storyView id' })
    }

    const storyView = await StoryView.findOne({ _id: id }, "-__v").populate("story user", "-createdAt -updatedAt -__v")

    if (!storyView) {
        return res.status(404).json({ success: false, msg: 'no views found with this id' })
    }

    return res.status(200).json({ success: true, storyView })
}

// @desc create a storyView
// @route storyView /api/v1/story-views
const createStoryView = async (req, res, next) => {
    const { user, story } = req.body

    if (!mongoose.isValidObjectId(user) || !mongoose.isValidObjectId(user)) {
        return res.status(401).json({ success: false, msg: 'not a valid db id..' })
    }

    const viewCounted = await StoryView.findOne({ user })

    if (viewCounted && String(viewCounted.story) === story) {
        return res.status(400).json({ success: false, msg: "user's view already counted" })
    }

    //check if story and user exists in db
    const storyId = await Story.findOne({ _id: story })
    const userId = await User.findOne({ _id: user })

    if (!storyId || !userId) {
        return res.status(401).json({ success: false, msg: 'not a valid user or story id..' })
    }

    const storyView = new StoryView({ story, user })
    await storyView.save()

    if (!storyView) {
        return res.status(500).json({ success: false, msg: "something went wrong .." })
    }

    res.status(201).json({ success: true, msg: 'storyView created successfully ', data: storyView })
}

// @desc update a storyView by id
// @route PUT /api/v1/story-views/:id
const updateStoryView = async (req, res, next) => {
    const { id } = req.params
    const { user, story } = req.body

    if ((story && !mongoose.isValidObjectId(id)) || (user && !mongoose.isValidObjectId(user))) {
        return res.status(401).json({ success: false, msg: 'not a valid db id..' })
    }


    const storyView = await StoryView.findOneAndUpdate({ _id: id }, { user, story }, { new: true }).populate("user", "name")

    if (!storyView) {
        return res.status(404).json({ success: false, msg: 'storyView with this id not found' })
    }

    res.status(201).json({ msg: 'storyView updated ', storyView })
}

// @desc delete a storyView by id
// @route DELETE /api/v1/story-views/:id
const deleteStoryView = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: "invalid storyView Id.." })
    }

    const storyView = await StoryView.findOneAndDelete({ _id: id })

    if (!storyView) {
        return res.status(404).json({ success: false, msg: `storyView not found` })
    }

    res.status(203).json({ success: true, msg: `storyView deleted..`, storyView })
}

//@desc get storyView by user
// @route GET /api/v1/story-views/user/:id
const getStoryViewsByUser = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: 'not a valid user id' })
    }

    const storyViews = await StoryView.find({ story: id }).populate('user', 'name')

    if (!storyViews.length) {
        return res.status(404).json({ success: false, msg: 'no storyViews found with this id' })
    }

    return res.json({ success: true, data: storyViews })
}

//@desc get a user's storyView count
// @route GET /api/v1/story-views/user/:id/get/count
const getStoryViewsCountByUser = async (req, res, next) => {
    const { id } = req.params
    const storyViews = await storyView.countDocuments({ story: id })
    res.status(200).json({ success: true, totalstoryViews: storyViews })
}

// @desc get storyViews total count
// @route GET /api/v1/story-views/get/count
const getStoryViewsCount = async (req, res, next) => {
    const storyViews = await storyView.countDocuments()
    res.status(200).json({ success: true, totalstoryViews: storyViews })
}

export { getStoryViews, getStoryView, createStoryView, updateStoryView, deleteStoryView, getStoryViewsCount, getStoryViewsByUser, getStoryViewsCountByUser }