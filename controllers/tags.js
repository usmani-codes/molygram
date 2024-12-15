import mongoose from 'mongoose'
import Tag from '../models/tag.js'

// @desc Get all tag
// @route GET /api/v1/tags
const getTags = async (req, res, next) => {
    const tags = await Tag.find({}, "-__v -createdAt -updatedAt")

    if (!tags.length) {
        return res.status(404).json({ success: false, msg: 'no tags found' })
    }

    return res.json({ success: true, data: tags })
}

// @desc Get tag by id
// @route GET /api/v1/tags/:id
const getTag = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ success: false, msg: "invalid tag id.." })
    }

    const tag = await Tag.findOne({ _id: id }, "-__v")

    if (!tag) {
        return res.status(404).json({ success: false, msg: 'no tag found with this id' })
    }

    return res.json({ success: true, data: tag })
}

// @desc Create a new tag
// @route POST /api/v1/tags
const createTag = async (req, res, next) => {
    const { name, description } = req.body

    if (!name) {
        return res.status(404).json({ success: false, msg: 'please fill all required fields ..' })
    }

    const tag = await Tag.findOne({ name }, "name")

    if (tag) {
        return res.status(400).json({ success: false, msg: 'tag already existed !' })
    }

    const newtag = new Tag({ name })
    await newtag.save()

    if (!newtag) {
        res.status(404).json({ success: false, msg: 'the tag cannot be created!' })
    }

    res.status(201).json({ success: true, data: newtag })
}


// @desc update a tag by id
// @route PUT /api/v1/tags/:id
const updateTag = async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body

    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ success: false, msg: "invalid tag id.." })
    }

    const tag = await Tag.findOneAndUpdate({ _id: id }, { name }, { new: true })

    if (!tag) {
        return res.status(404).json({ success: false, msg: 'tag with this id not found' })
    }

    res.status(201).json({ msg: 'tag updated ', data: tag })
}

// @desc delete a Hospital by id
// @route DELETE /api/v1/tags/:id
const deleteTag = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: "invalid Id" })
    }

    const tag = await Tag.findOneAndDelete({ _id: id })

    if (!tag) {
        return res.status(404).json({ success: true, msg: `tag type could not deleted ..` })
    }

    res.status(203).json({ success: true, msg: `tag deleted`, tag })
}

// @desc get tag total count
// @route GET /api/v1/tags/get/count
const getTagsCount = async (req, res, next) => {
    const tags = await Tag.countDocuments()
    res.status(200).json({ success: true, totaltag: tags })
}

export { getTags, getTag, createTag, updateTag, deleteTag, getTagsCount }