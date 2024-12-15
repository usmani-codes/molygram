import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    image: { type: String },
    caption: { type: String },
    content: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },


}, {
    timestamps: true
})

postSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

postSchema.set('toJSON', {
    virtuals: true
})


const Post = mongoose.model('Post', postSchema)

export default Post