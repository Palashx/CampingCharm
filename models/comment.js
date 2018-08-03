var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
        text: String,
        author: {
                id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User" // ref refers to the model that this id refers to
                },
                username: String
        },
        
});

module.exports = mongoose.model("Comment", commentSchema);