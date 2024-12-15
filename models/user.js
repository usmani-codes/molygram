
import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: { //generating from name, (not getting from user as in json obj)
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email must be unique'],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minLength: [3, "Password can't be less than 3 letters"],
        select: false
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'auther', 'user']
    },
    profilePicture: {
        type: String,
        default: '/uploads/profiles/default-profile.png'
    },
    bio: {
        type: String,
    },
    phone: {
        type: String,
        default: '031208976543'
    }

}, {
    timestamps: true
})

userSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

userSchema.set('toJSON', {
    virtuals: true
})

export const User = mongoose.model('User', userSchema)

