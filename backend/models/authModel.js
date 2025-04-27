const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: function () { return this.role !== 'admin'; }, //only required for non-admins
        minLength: 5
    },
    email: {
        type: String,
        required: true,
        minLength: 10
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    role: {
        type: String,
        required: true,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }]
}, {
    timestamps: true
})

const User = mongoose.model("User", userSchema);

module.exports = User;