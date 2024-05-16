const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    createdAt: {
        type: String,
    },
    imageUrl: {
        type: String,
    }
})

const Journal = mongoose.model("Journal", journalSchema);
module.exports = Journal