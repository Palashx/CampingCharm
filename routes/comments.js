var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    //
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log("Something went wrong in /campgrounds/:id/comments/new");
        } else {
            
            res.render("comments/new", {campgroundejs: campground});
        }
    });
   
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log("Somethinf went wrong in /campgrounds/:id/comments");
            res.redirect("landing");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log("Something wrong in post comment");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment + "BLAH BLAH BLAH");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
            
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id,function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
             res.render("comments/edit", {campgroundejs_id: req.params.id, comment: foundComment});
        }
        
    });
   
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedcomment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE rpoute
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router; 