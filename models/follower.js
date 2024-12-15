import mongoose from "mongoose";

const followerSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    // followers: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // }]

}, {
    timestamps: true
})

followerSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

followerSchema.set('toJSON', {
    virtuals: true
})


const Follower = mongoose.model('Follower', followerSchema)

export default Follower