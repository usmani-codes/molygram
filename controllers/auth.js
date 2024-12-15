import mongoose from 'mongoose'
import bcypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { User } from '../models/user.js'


const jwtSecret = process.env.JWT_SECRET

const login = async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(401).json({ success: false, msg: 'please provide all required fields' })
    }

    const user = await User.findOne({ email: email }).select("+password")

    if (!user) {
        return res.status(404).json({ success: false, msg: 'user with this email not found' })
    }

    const passwordMatched = await bcypt.compare(password, user.password)

    if (!passwordMatched) {
        return res.status(401).json({ success: false, msg: 'incorrect email or password' })
    }

    user.hashedPassword = ''

    const token = jwt.sign({ email: user.email, role: user.role }, jwtSecret, { expiresIn: '1d' })

    console.log(`logged in as: ${user.isAdmin ? 'admin' : 'user'} `)
    res.status(201).json({ success: true, userId: user.id, msg: "user logedIn successfully ", token })

}

const register = async (req, res, next) => {
    console.log("registering user ..")
    const { name, email, password, bio, phone } = req.body

    let { role } = req.body
    role = role || 'user'

    let userNumber = ''

    for (let i = 0; i < 3; i++) {
        userNumber += Math.floor(Math.random() * 10)
    }

    let username = name + userNumber
    console.log("creating username..", username)

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, msg: 'please fill all required fields' })
    }

    const user = await User.findOne({ email: email })

    if (user) {
        return res.status(401).json({ success: false, msg: 'the user already exists!' })
    }

    const hashedPassword = await bcypt.hash(password, 10)
    let newUser = new User({ name, email, password: hashedPassword, username, role, bio, phone })
    newUser.role = newUser.role.toLowerCase()
    await newUser.save()

    if (!newUser) {
        res.status(400).json({ success: false, msg: 'the user cannot be created!' })
    }

    const token = jwt.sign({ email: newUser.email, role: newUser.role }, jwtSecret, { expiresIn: '1h' })

    newUser.hashedPassword = ''

    return res.status(201).json({ success: true, msg: "user creatd successfully", data: { id: newUser.id, email: newUser.email, role: newUser.role }, token })

}

export { login, register }