var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");

// landing route
router.get("/", function(req,res){
	res.render("landing");
});

//about route
router.get("/about",function(req,res){
	res.render("about", {page:'about'});
});

//Auth routes

// show reg form
router.get("/register",function(req,res){
	res.render("register", {page:'register'});
});

//handle sign up logic
router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success", "Welcome to Hiking the World " + user.username);
			res.redirect("/hikes");
		})
	})
})

//show login form
router.get("/login", function(req,res){
	res.render("login", {page:'login'});
});

//handling login logic
router.post("/login", passport.authenticate("local", 		
		{	
			successRedirect: "/hikes",
			failureRedirect: "/login",
			failureFlash: true,
			successFlash: "Welcome back to Hiking the World!"
		}), function(req,res){
});

// logout route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/hikes");
});

module.exports = router;

