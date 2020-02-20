var express = require("express");
var router = express.Router();
var Hike = require("../models/hike");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//index - show all hikes
router.get("/", function(req,res){
	//get all hikes from DB
	Hike.find({}, function(err, allHikes){
		if(err){
			console.log(err);
		}else{
			res.render("hikes/index", {hikes: allHikes, page:'hikes'});
		}
	})
});

//create - add new hike to db
router.post("/", middleware.isLoggedIn, function(req,res){
	//get data from form
	var name = req.body.name;
	var country = req.body.country;
	var rating = req.body.rating;
	var image = req.body.image;
	var info = req.body.info;
	var description = req.body.description;
	var author ={
		id: req.user._id,
		username: req.user.username
	}
	geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
		console.log(err.message);
		req.flash('error', 'Invalid address');
		return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newHike = {name: name, country: country, rating:rating, image: image, info: info, description: description, author:author, location: location, lat: lat, lng: lng};
    // Create a new hike and save to DB
    Hike.create(newHike, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to hikes page
            console.log(newlyCreated);
            res.redirect("/hikes");
        }
    });
  });
});

//new - show form to create new hike
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("hikes/new");
});

//show - shows more info about one hike
router.get("/:id",function(req,res){
	//find hike with provided id
	Hike.findById(req.params.id).populate("comments").exec(function(err,foundHike){
		if(err || !foundHike){
			req.flash("error","Hike not found");
			res.redirect("back");
		}else{
			//render show template with that hike
			res.render("hikes/show",{hike: foundHike});
		}
	});
});

//Edit hike route
router.get("/:id/edit", middleware.checkHikeOwnership, function(req,res){
		Hike.findById(req.params.id, function(err,foundHike){
			res.render("hikes/edit", {hike: foundHike});
		});
});

//Update hike route
router.put("/:id", middleware.checkHikeOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
		console.log(err.message);
      	req.flash('error', 'Invalid address');
      	return res.redirect('back');
    }
    req.body.hike.lat = data[0].latitude;
    req.body.hike.lng = data[0].longitude;
    req.body.hike.location = data[0].formattedAddress;

    Hike.findByIdAndUpdate(req.params.id, req.body.hike, function(err, hike){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/hikes/" + hike._id);
        }
    });
  });
});

//destroy hike route
router.delete("/:id", middleware.checkHikeOwnership, function(req,res){
	Hike.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/hikes");
		}else{
			res.redirect("/hikes");
		}
	})
})


module.exports = router;

