import express from "express";

import { getUsers, getUser, updateUser, deleteUser, getUsersCount } from '../controllers/users.js'
import { uploadOptions } from "../middlewares/imageUploader.js";
import { RolesOnly } from "../middlewares/rolesOnly.js";

export const router = express.Router()

//get all Users
router.get('/', RolesOnly('admin'), getUsers)

//get single User
router.get('/:id', getUser)

//update a User
router.put('/:id', uploadOptions.single('image'), updateUser)

//delete a User
router.delete('/:id', RolesOnly('admin'), deleteUser)
// get users count
router.get('/get/count', RolesOnly('admin'), getUsersCount)
