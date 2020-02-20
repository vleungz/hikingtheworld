require('dotenv').config({path: __dirname + '/.env'});

var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Hike = require("./models/hike"),
	Comment = require("./models/comment"),
	User = require("./models/user")

//require routes
var commentRoutes = require("./routes/comments"),
	hikeRoutes = require("./routes/hikes"),
	indexRoutes = require("./routes/index")

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify',false);

//mongoose.connect("mongodb://localhost/hike", {useNewUrlParser:true});
var url = process.env.DATABASEURL || "mongodb://localhost/hike"
mongoose.connect(url, { 
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB");
}).catch(err => {
	console.log('Error:', err.message);
});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Passport config

app.use(require("express-session")({
	secret:"masha is cute",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//call on every route
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//use the routes
app.use(indexRoutes);
app.use("/hikes", hikeRoutes);
app.use("/hikes/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;

app.listen(port);

//app.listen(process.env.PORT, process.env.IP);
// app.listen(3000, function(){
// 	console.log('YelpCamp server started');
// });