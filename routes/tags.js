import express from 'express'

import { getTags, getTag, createTag, updateTag, deleteTag, getTagsCount } from '../controllers/tags.js'
import { RolesOnly } from '../middlewares/rolesOnly.js'

export const router = express.Router()

router.get('/', getTags)

router.get('/:id', getTag)

router.post('/', RolesOnly('admin'), createTag)

router.put('/:id', RolesOnly('admin', "auther"), updateTag)

router.delete('/:id', RolesOnly('admin', "auther"), deleteTag)

router.get('/get/count', RolesOnly('admin', "auther"), getTagsCount)
