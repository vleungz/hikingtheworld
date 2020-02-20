var Hike = require("../models/hike");
var Comment = require("../models/comment");

// middleware goes here
var middlewareObj ={};

middlewareObj.checkHikeOwnership = function(req,res,next){
	//is user logged in
	if(req.isAuthenticated()){
		Hike.findById(req.params.id, function(err,foundHike){
			if(err || !foundHike){
				req.flash("error", "Hike not found");
				res.redirect("back");
			}else{
				//does user own hike
				if(foundHike.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req,res,next){
	//is user logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err,foundComment){
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");
			}else{
				//does user own comment
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}


module.exports = middlewareObj;