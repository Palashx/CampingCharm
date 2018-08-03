var express = require("express");
var router  = express.Router();
var Campground  = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
    // 
    //Get all  the data ffrom the db
    Campground.find({}, function(err, allcampgrounds){
        
        if(err){
            console.log("Something went wrong");
        }
        else{
            res.render("campgrounds/index", {campgroundsEjs: allcampgrounds, currentUser: req.user});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req,res){
    // Getting data from the form, req == what is sent, body is from where we are extracting the data, name. image is the data we want
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image,price: price, description: description, author: author};
    // campgrounds.push(newCampground);
    // We need to send form data here and add to the campground array. 
    Campground.create(newCampground, function(err, newlycreatedcampground){
        if(err){
            console.log("Something went wrong");
        } 
        else{
            res.redirect("/campgrounds");
            console.log(newlycreatedcampground);
        }
    });
    
});
// EDIT ROUTE

router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    // Finding route by ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
       
        if(err){
            console.log("Something went wrong");
            console.log(err);
        }
        else{
            console.log(foundcampground);
            res.render("campgrounds/show", {campground: foundcampground});
        }
    });
    
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
        });
});


router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//Destroy route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router; 
