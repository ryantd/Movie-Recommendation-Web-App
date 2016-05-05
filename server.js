// We first require our express package
var express = require('express');
var bodyParser = require('body-parser');
var data = require('./data.js');
var cookieParser = require('cookie-parser');
var Guid = require('Guid');
var fs = require('fs');

// This package exports the function to create an express instance:
var app = express();

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/assets', express.static('static'));

app.get("/startup", function(request, response) {
    
    var obj = JSON.parse(fs.readFileSync('static/resources/data/input.json', 'utf8'));
    var array = obj.array;
    var htmltext = "successfully add ";
    var i;
    for (i in array) {
        data.createMovieByImdb(array[i]).then().then(function(movie) {
            console.log(movie.imdbId + " is saved in db.");
        }, function(errorMessage) {
            console.log(movie.imdbId + " error: " + errorMessage);
        });
    }
    response.send(htmltext + i);
});

app.get("/", function(request, response) {

    if (request.cookies.sessionId) {
        var currentSid = request.cookies.sessionId;
        data.getUserBySessionId(currentSid).then(function(user) {
            response.render('pages/profile', { data: user.profile, sid: user.currentSessionId, successInfo: null, updateError: "You have already logged in." });
        }, function(errorMessage) {
            response.clearCookie("sessionId");
            response.status(500).render('pages/home', { signupError: null, loginError: "No cookies found, please log in again." });
        });
    } else {
        response.render("pages/home", { signupError: null, loginError: null });
    }
});

app.post("/profile", function(request, response) {
    var fname = request.body.firstname;
    var lname = request.body.lastname;
    var hobby = request.body.hobby;
    var pname = request.body.petname;
    var currentSid = request.cookies.sessionId;

    data.updateProfile(currentSid, fname, lname, hobby, pname).then(function(user) {
        response.render('pages/profile', { data: user.profile, sid: user.currentSessionId, successInfo: "Updated Successfully", updateError: null });
    }, function(errorMessage) {
        response.status(500).render('pages/profile', { data: user.profile, sid: user.currentSessionId, successInfo: null, updateError: errorMessage });
    });
});

app.get("/profile", function(request, response) {

    if (request.cookies.sessionId) {
        var currentSid = request.cookies.sessionId;
        data.getUserBySessionId(currentSid).then(function(user) {
            response.render('pages/profile', { data: user.profile, sid: user.currentSessionId, successInfo: null, updateError: null });
        }, function(errorMessage) {
            response.clearCookie("sessionId");
            response.status(500).render('pages/home', { signupError: null, loginError: "No cookies found, please log in again." });
        });
    } else {
        response.status(500).render('pages/home', { signupError: null, loginError: "Please log in first." });
    }
});

app.post("/login", function(request, response) {
    var uname = request.body.loginname;
    var pwd = request.body.loginpwd;
    var sid = Guid.create().toString();

    var expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    data.loginUser(uname, pwd, sid).then(function(user) {
        response.cookie("sessionId", sid, { expires: expiresAt });
        response.render('pages/profile', { data: user.profile, sid: user.currentSessionId, successInfo: null, updateError: null });
    }, function(errorMessage) {
        response.status(500).render('pages/home', { signupError: null, loginError: errorMessage });
    });
});

app.get("/login", function(request, response) {
    response.redirect('/');
});

app.post("/signup", function(request, response) {
    var uname = request.body.signupname;
    var pwd = request.body.signuppwd;
    var cpwd = request.body.confirmpwd;
    var sid = Guid.create().toString();

    var expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    response.clearCookie("sessionId");
    response.cookie("sessionId", sid, { expires: expiresAt });
    
    data.createUser(uname, pwd, cpwd, sid).then(function(user) {
        response.render('pages/profile', { data: user.profile, sid: sid, successInfo: null, updateError: null });
    }, function(errorMessage) {
        response.status(500).render('pages/home', { signupError: errorMessage, loginError: null });
    });
});

app.get("/signup", function(request, response) {
    response.redirect('/');
});

app.get("/logout", function(request, response) {
    if (request.cookies.sessionId) {
        response.clearCookie("sessionId");
        response.render("pages/home", { signupError: null, loginError: "Log out successfully, please log in again" });
    } else {
        response.render("pages/home", { signupError: null, loginError: "You need log in first" });
    }
});

app.get("/movie", function (request, response) {
    
    data.getMovieByKeyWord("hateful").then(function(movieList) {     
        //console.log(movieList);
        response.render('pages/search', {movieList: movieList})
    });
})

app.get("/select", function (request, response) {
    
    data.getMovieByGenre("drama").then(function(movieList) {     
        //console.log(movieList);
        response.render('pages/select', {movieList: movieList})
    });
})
// We can now navigate to localhost:3000
app.listen(3000, function() {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});
