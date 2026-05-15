const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    questions: [{
        text: String,
        // UPDATED: Now an object to track votes per option
        options: [{
            text: { type: String, required: true },
            votes: { type: Number, default: 0 } // Tracks the count for the Results bars
        }],
        isMandatory: { type: Boolean, default: true }
    }], 
    settings: {
        isAnonymous: { type: Boolean, default: true },
        expiresAt: { type: Date, required: false }, 
        isPublished: { type: Boolean, default: false }
    }
}, { timestamps: true });

module.exports = mongoose.model('Poll', PollSchema);