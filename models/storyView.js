import mongoose from "mongoose";

const storyViewSchema = mongoose.Schema({
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
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

storyViewSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

storyViewSchema.set('toJSON', {
    virtuals: true
})


const StoryView = mongoose.model('StoryView', storyViewSchema)

export default StoryView