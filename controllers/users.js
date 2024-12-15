import mongoose from 'mongoose'
import bcypt from 'bcryptjs'
import fs from 'fs/promises'

import { User } from '../models/user.js'
import Post from '../models/post.js'


// @desc Get all users
// @route GET /api/v1/users
const getUsers = async (req, res, next) => {
    const users = await User.find({}, "-__v -createdAt -updatedAt")
    if (!users.length) {
        return res.status(404).json({ success: false, msg: 'no users found' })
    }
    res.status(200).json({ success: true, data: users })
}

// @desc Get user by id
// @route GET /api/v1/users/:id
const getUser = async (req, res, next) => {
    const { id } = req.params
    const isValidUser = mongoose.isValidObjectId(id)

    if (!isValidUser) {
        return res.status(400).json({ success: false, msg: 'not a valid id' })
    }

    const user = await User.findOne({ _id: id })

    if (!user) {
        return res.status(404).json({ success: false, msg: 'no user found with this id' })
    }

    res.json({ success: true, data: user })
}


// @desc update a user by id
// @route PUT /api/v1/users/:id
const updateUser = async (req, res, next) => {
    const { id } = req.params
    const { name, email, password, bio, phone, username } = req.body

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: 'not a valid id' })
    }

    if (email || req.body.id) {
        return res.json({ success: false, msg: "can't change email for now" })
    }

    let dbuser = await User.findOne({ username }, 'username')

    console.log("username in db :", dbuser?.username)

    if (dbuser?.username) {
        return res.status(401).json({ success: false, msg: 'username is taken please choose another username' })
    }

    const profilePicture = `/uploads/profiles/${req.file.filename}`
    const user = await User.findOneAndUpdate({ _id: id }, { name, email, password, profilePicture, bio, phone, username }, { new: true })

    if (!user) {
        return res.status(404).json({ success: false, msg: 'user with this id not found' })
    }

    res.status(201).json({ msg: 'user updated ', data: user })
}

// @desc delete a user
// @route DELETE /api/v1/users/:id
const deleteUser = async (req, res, next) => {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
        return res.status(404).json({ success: false, msg: `not a valid id` })
    }

    const dbUser = await User.findOne({ _id: id })


    const postbythisUser = await Post.findOne({ auther: id })

    console.log(postbythisUser)

    if (postbythisUser) {
        return res.status(401).json({ success: false, msg: `please delete this users all posts first..` })
    }

    if (dbUser && (dbUser.email === req.user.email)) { //deleting logedIn user
        await User.findOneAndDelete({ _id: id })
        return res.status(203).json({ success: false, msg: `signing out to Delete account ..` })
    }

    //delete user's profile picture if exists 
    // if (!dbUser.profilePicture.startsWith('/uploads/profiles/default')) {
    //     console.log('user has diff profile picture')
    //     await fs.unlink(dbUser.profilePicture)
    // }
    const user = await User.findOneAndDelete({ _id: id })
    if (!user) {
        return res.status(404).json({ success: false, msg: `user not found` })
    }
    const users = await User.find({})

    res.status(200).json({ success: true, msg: `user deleted`, user: users })
}

// @desc get users total count
// @route GET /api/v1/users/get/count
const getUsersCount = async (req, res, next) => {
    const users = await User.countDocuments()
    res.status(200).json({ success: true, totalUsers: users })
}




export { getUsers, getUser, updateUser, deleteUser, getUsersCount }