const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    date_time: {
        type: Date,
        required: true
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Event', eventSchema);