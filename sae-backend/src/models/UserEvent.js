const mongoose = require('mongoose');

const userEventSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
        index: true
    },
    event_id: {
        type: Number,
        required: true,
        index: true
    },
    attended: {
        type: String,
        enum: ['yes', 'no'],
        required: true
    },
    timestamp_attended: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

userEventSchema.index({ user_id: 1, event_id: 1 }, { unique: true });

module.exports = mongoose.model('UserEvent', userEventSchema);

