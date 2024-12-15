import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

//routes
import { auth, users, posts, comments, followers, likes, tags, storyViews, stories } from './routes/index.js'

// middlewares
import { AUTH, logger, notFound, errorHandler } from './middlewares/index.js'
import config from './config/config.js'

const app = express()
const PORT = config.PORT || 5000
const api = config.API

// middlewares
app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger)

// routes 
app.use(`${api}/auth`, auth)
app.use(`${api}/users`, AUTH, users)
app.use(`${api}/posts`, AUTH, posts)
app.use(`${api}/comments`, AUTH, comments)
app.use(`${api}/likes`, AUTH, likes)
app.use(`${api}/followers`, AUTH, followers)
app.use(`${api}/hashtags`, AUTH, tags)
app.use(`${api}/stories`, AUTH, stories)
app.use(`${api}/story-views`, AUTH, storyViews)

// middilewares
app.use(notFound)
app.use(errorHandler)

//run server
const main = async () => {
   const connectionEstablished = await mongoose.connect(config.MONGO_URI)
   if (!connectionEstablished) {
      return console.log("Couldn't connected to db ..")
   }
   console.log('connected to database ...')
   app.listen(PORT, async () => {
      console.log(`server is listening at http://localhost:${PORT}`)
   })
}


main()