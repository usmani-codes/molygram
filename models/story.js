import mongoose from "mongoose";

const storySchema = mongoose.Schema({
    image: {
        type: String,
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

storySchema.virtual('id').get(function () {
    return this._id.toHexString()
})

storySchema.set('toJSON', {
    virtuals: true
})


const Story = mongoose.model('Story', storySchema)

export default Story