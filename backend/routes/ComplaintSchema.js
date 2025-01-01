const { Collection, default: mongoose } = require("mongoose");

// Complaint Schema
const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Infrastructure', 'Lighting', 'Noise', 'Cleaning'],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    // images: [{
    //     type: String
    // }],
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{Collection:"Complaints"
});
mongoose.model("Complaints",complaintSchema);