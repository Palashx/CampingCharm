var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    User            = require("./models/user"),
    LocalStrategy   = require("passport-local"),
    seedDB          = require("./seeds");
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes   = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
 // Seeding the DB
// seedDB();

// Passport configuration
app.use(require("express-session")({
 secret: "Secret message",
 resave: false,
 saveUninitialized: false
}));


app.use(flash());
//Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
 res.locals.currentUser = req.user;
 res.locals.error = req.flash("error");
 res.locals.success = req.flash("success");
 next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Yelp Camp has started");
});

app.listen(3001, "localhost", function(){
    console.log("Yelp Camp has started");
});
