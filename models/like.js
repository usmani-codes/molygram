import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps: true
})

likeSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

likeSchema.set('toJSON', {
    virtuals: true
})


const Like = mongoose.model('Like', likeSchema)

export default Like