import express from "express";

import { login, register } from '../controllers/auth.js'

export const router = express.Router()

//user login
router.post('/login', login)
router.post('/register', register)