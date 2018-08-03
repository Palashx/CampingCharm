var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
     price: String,
    description: String,
    author: {
                id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User" // ref refers to the model that this id refers to
                },
                username: String
            },
    comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
                
            }
        ],
   
});

//compiling the chema into a model
module.exports = mongoose.model("Campground", campgroundSchema);