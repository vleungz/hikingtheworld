var express = require("express");
var router = express.Router({mergeParams: true});
var Hike = require("../models/hike");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments new
router.get("/new", middleware.isLoggedIn, function(req,res){
	Hike.findById(req.params.id,function(err,hike){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {hike: hike});
		}
	}) 
});

//Comments create
router.post("/",middleware.isLoggedIn, function(req,res){
	//look up hike using ID
	Hike.findById(req.params.id,function(err, hike){
		if(err){
			console.log(err);
			res.redirect("/hikes");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				}else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//save comment
					hike.comments.push(comment);
					hike.save();
					req.flash("success", "Successfully added comment");
					res.redirect('/hikes/' + hike._id);
				}
			})
		}
	})
})

//comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Hike.findById(req.params.id, function(err,foundHike){
		if(err || !foundHike){
			req.flash("error", "No hike found");
			return res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err,foundComment){
			if(err){
				res.redirect("back");
			}else{
				res.render("comments/edit", {hike_id:req.params.id, comment:foundComment});
			}
		})
	})
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, function(err,updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/hikes/"+ req.params.id);
		}
	})
});

//comment destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted");
			res.redirect("/hikes/" + req.params.id);
		}
	})
});


module.exports = router;
