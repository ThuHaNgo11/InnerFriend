const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    journals: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Journal"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    profilePhotoUrl: {
        type: String
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User