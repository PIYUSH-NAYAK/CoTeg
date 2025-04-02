const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    users: [
        {
            userId: { type: String, required: true }
        }
    ],
    code: {
        type: String,
        default: ""  // Store the latest state of the code
    }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
