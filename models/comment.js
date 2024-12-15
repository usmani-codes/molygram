import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: { type: String, required: true },

}, {
    timestamps: true
})

commentSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

commentSchema.set('toJSON', {
    virtuals: true
})


const Comment = mongoose.model('Comment', commentSchema)

export default Comment