// We first require our express package
var express = require('express');
var bodyParser = require('body-parser');
var data = require('./data.js');
var cookieParser = require('cookie-parser');
var Guid = require('Guid');
var fs = require('fs');
var xss= require("xss");

// This package exports the function to create an express instance:
var app = express();

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/assets', express.static('static'));
<<<<<<< HEAD
app.use(function(request,response,next){
	var sessionId=request.cookies.sessionId;
	if(sessionId){
        
		data.getUserBySessionId(sessionId).then(function(user) {
		response.locals.user=user;
        });
	}else{
        response.locals.user = {username: null, profile:null, currentSessionId:null};

	}
	next();
});
=======
>>>>>>> yuanwu

app.get("/startup", function(request, response) {
    
    var obj = JSON.parse(fs.readFileSync('static/resources/data/input.json', 'utf8'));
    var array = obj.array;
    var htmltext = "successfully add ";
    var i;
    for (i in array) {
        data.createMovieByImdb(array[i]).then().then(function(movie) {
<<<<<<< HEAD
            ;
        }, function(errorMessage) {
            response.send(errorMessage);
=======
            console.log(movie.imdbId + " is saved in db.");
        }, function(errorMessage) {
            console.log(movie.imdbId + " error: " + errorMessage);
>>>>>>> yuanwu
        });
    }
    response.send(htmltext + i);
});

app.get("/", function(request, response) {
<<<<<<< HEAD
        
        data.getAllMovies().then(function(movieList) {

            response.render('pages/home', { movieList:movieList, data: response.locals.user.profile, username: response.locals.user.username,sid:  response.locals.user.currentSessionId, successInfo: null, updateError: "You have already logged in." });
        });
=======

    if (request.cookies.sessionId) {
        var currentSid = request.cookies.sessionId;
        data.getUserBySessionId(currentSid).then(function(user) {
            response.render('pages/profile', { data: user.profile, username: user.username,sid: user.currentSessionId, successInfo: null, updateError: "You have already logged in." });
        }, function(errorMessage) {
            response.clearCookie("sessionId");
            response.status(500).render('pages/home', { signupError: null, username: null,loginError: "No cookies found, please log in again." });
        });
    } else {
        response.render("pages/home", { signupError: null, username: null,loginError: null });
    }
>>>>>>> yuanwu
});

app.post("/profile", function(request, response) {
    options={
        whiteList: [],
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
    };
    myxss= new xss.FilterXSS(options);

    var fname = myxss.process(request.body.firstname);
    var lname = myxss.process(request.body.lastname);
    var email = myxss.process(request.body.email);
<<<<<<< HEAD
    var birth = myxss.process(request.body.birthyear);
    var currentSid = request.cookies.sessionId;
    
    data.updateProfile(currentSid, fname, lname, email, birth).then(function(user) {
        data.getLikeMovieByUser(user).then(function(movieList) {
            
            response.render('pages/profile', { movieList:movieList, data: user.profile,username: user.username, sid: user.currentSessionId, successInfo: null, updateError: null });
        });                      
    }, function(errorMessage) {
        data.getLikeMovieByUser(user).then(function(movieList) {
            response.status(500).render('pages/profile', { movieList:movieList, data: user.profile, username: user.username,sid: user.currentSessionId, successInfo: null, updateError: errorMessage });
        });
=======
    var currentSid = request.cookies.sessionId;

    data.updateProfile(currentSid, fname, lname, email).then(function(user) {
        response.render('pages/profile', { data: user.profile, username: user.username,sid: user.currentSessionId, successInfo: "Updated Successfully", updateError: null });
    }, function(errorMessage) {
        response.status(500).render('pages/profile', { data: user.profile, username: user.username,sid: user.currentSessionId, successInfo: null, updateError: errorMessage });
>>>>>>> yuanwu
    });
});

app.get("/profile", function(request, response) {
<<<<<<< HEAD
    if (request.cookies.sessionId) {
        var currentSid = request.cookies.sessionId;
        data.getUserBySessionId(currentSid).then(function(user) {
            
            data.getLikeMovieByUser(user).then(function(movieList) {
               
                response.render('pages/profile', { movieList:movieList, data: user.profile,username: user.username, sid: user.currentSessionId, successInfo: null, updateError: null });
            });
                
        }, function(errorMessage) {
            response.clearCookie("sessionId");
            data.getAllMovies().then(function(movieList) {
                response.status(500).render('pages/home', { movieList:movieList, signupError: null, username: null,loginError: "No cookies found, please log in again." });
            });
        });
    } else {
        data.getAllMovies().then(function(movieList) {
            response.status(500).render('pages/home', {movieList:movieList, signupError: null, username: null,loginError: "Please log in first." });
        });
=======

    if (request.cookies.sessionId) {
        var currentSid = request.cookies.sessionId;
        data.getUserBySessionId(currentSid).then(function(user) {
            response.render('pages/profile', { data: user.profile,username: user.username, sid: user.currentSessionId, successInfo: null, updateError: null });
        }, function(errorMessage) {
            response.clearCookie("sessionId");
            response.status(500).render('pages/home', { signupError: null, username: null,loginError: "No cookies found, please log in again." });
        });
    } else {
        response.status(500).render('pages/home', { signupError: null, username: null,loginError: "Please log in first." });
>>>>>>> yuanwu
    }
});

app.post("/login", function(request, response) {
     options={
        whiteList: [],
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
    };
    myxss= new xss.FilterXSS(options);

    var uname = myxss.process(request.body.loginname);
    var pwd = myxss.process(request.body.loginpwd);
    var sid = Guid.create().toString();

    var expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    data.loginUser(uname, pwd, sid).then(function(user) {
        response.cookie("sessionId", sid, { expires: expiresAt });
<<<<<<< HEAD
        data.getAllMovies().then(function(movieList) {
            response.render('pages/home', { movieList:movieList, data: user.profile, username: user.username, sid: user.currentSessionId, successInfo: null, updateError: null });
        });
=======
        response.render('pages/home', { data: user.profile, username: user.username, sid: user.currentSessionId, successInfo: null, updateError: null });
>>>>>>> yuanwu
    }, function(errorMessage) {
        response.status(500).render('pages/sign', { signupError: null, username: null,loginError: errorMessage });
    });
});

app.get("/login", function(request, response) {
    if (request.cookies.sessionId) {
        var currentSid = request.cookies.sessionId;
        data.getUserBySessionId(currentSid).then(function(user) {
<<<<<<< HEAD
            response.render('pages/sign', { data: user.profile,username: user.username, sid: user.currentSessionId, successInfo: null, updateError: null, loginError: "You have already logged in!", signupError: null});
        }, function(errorMessage) {
            response.clearCookie("sessionId");
            data.getAllMovies().then(function(movieList) {
                response.status(500).render('pages/home', { movieList:movieList, signupError: null, username: null,loginError: "No cookies found, please log in again." });
            });
=======
            response.render('pages/sign', { data: user.profile,username: user.username, sid: user.currentSessionId, successInfo: null, updateError: null, loginError: "You have already logged in!"});
        }, function(errorMessage) {
            response.clearCookie("sessionId");
            response.status(500).render('pages/home', { signupError: null, username: null,loginError: "No cookies found, please log in again." });
>>>>>>> yuanwu
        });
    }
    else
    response.render('pages/sign',{ signupError: null, username: null,loginError: null });
});

<<<<<<< HEAD
app.post("/like", function(request, response) {
    
    var abc = JSON.parse(Object.keys(request.body)[0]);
    var currentSid = request.cookies.sessionId;
    
    if(currentSid === undefined) {
       
         response.json({error:"Please log in first"});
    }else
    {
    if (currentSid !== null) {
        data.likeBySid(currentSid, abc.imdbId).then(function(user) {
            ;
        });
    } else {
        response.render('pages/sign', { signupError: null, username: null,loginError: null });
    }
    }
});

=======
>>>>>>> yuanwu
app.post("/signup", function(request, response) {
    options={
        whiteList: [],
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script']
    };
    myxss= new xss.FilterXSS(options);

    var uname = myxss.process(request.body.signupname);
    var pwd = myxss.process(request.body.signuppwd);
    var cpwd = myxss.process(request.body.confirmpwd);
    var sid = Guid.create().toString();

    var expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    response.clearCookie("sessionId");
    response.cookie("sessionId", sid, { expires: expiresAt });
    
    data.createUser(uname, pwd, cpwd, sid).then(function(user) {
<<<<<<< HEAD
        data.getLikeMovieByUser(user).then(function(movieList) {
            response.render('pages/profile', { movieList:movieList, data: user.profile, username: user.username,sid: sid, successInfo: null, updateError: null });
        });
=======
        response.render('pages/home', { data: user.profile, username: user.username,sid: sid, successInfo: null, updateError: null });
>>>>>>> yuanwu
    }, function(errorMessage) {
        response.status(500).render('pages/sign', { signupError: errorMessage, username: null,loginError: null });
    });
});

app.get("/signup", function(request, response) {
response.render('pages/sign',{ signupError: null, username: null,loginError: null });
});

app.get("/logout", function(request, response) {
    if (request.cookies.sessionId) {
        response.clearCookie("sessionId");
<<<<<<< HEAD
        data.getAllMovies().then(function(movieList) {
            response.render("pages/home", { movieList:movieList, signupError: null, username: null,loginError: "Log out successfully, please log in again" });
        });
    } else {
        data.getAllMovies().then(function(movieList) {
            response.render("pages/home", { movieList:movieList, signupError: null, username: null,loginError: "You need log in first" });
        });
=======
        response.render("pages/home", { signupError: null, username: null,loginError: "Log out successfully, please log in again" });
    } else {
        response.render("pages/home", { signupError: null, username: null,loginError: "You need log in first" });
>>>>>>> yuanwu
    }
});


<<<<<<< HEAD
app.post("/search", function (request, response) {
    
    data.getMovieByKeyWord(request.body.keyword).then(function(movieList) {     
        
        response.render('pages/search', {movieList: movieList,errorMessage:null, username: response.locals.user.username,signupError: null, loginError: null})
    }, function(errorMessage) {
       
        response.status(500).render('pages/search', { movieList: null,errorMessage: errorMessage,username: response.locals.user.username,signupError: null, loginError: null});
=======
app.get("/search", function (request, response) {
    
    data.getMovieByKeyWord("hateful").then(function(movieList) {     
        //console.log(movieList);
        response.render('pages/search', {movieList: movieList, signupError: null, loginError: null})
>>>>>>> yuanwu
    });
})

app.get("/select/:genre", function (request, response) {
<<<<<<< HEAD
    if (request.params.genre === "all") {
        data.getAllMovies().then(function(movieList) {     
            response.json(movieList);
        });
    } else {
        data.getMovieByGenre(request.params.genre).then(function(movieList) {     
            response.json(movieList);
        });
    }
})

app.get("/movie/:id", function (request, response) {
    if (request.cookies.sessionId) {
        data.getMovieByImdb(request.params.id).then(function(movieList) {     
            var majorGenre = (movieList.genre).split(", ")[0];
            data.getMovieByGenre(majorGenre).then(function(recMovies) {
                data.getUserBySessionId(request.cookies.sessionId).then(function(user) {
                   
                   response.render('pages/movie', {movieList: movieList,recMovies: recMovies,like: user.like , username: response.locals.user.username,signupError: null, loginError: null})
                });
            });
        });
    } else {
        data.getMovieByImdb(request.params.id).then(function(movieList) {     
            var majorGenre = (movieList.genre).split(", ")[0];
            data.getMovieByGenre(majorGenre).then(function(recMovies) {
                response.render('pages/movie', {movieList: movieList,recMovies: recMovies, like: [],  username: response.locals.user.username,signupError: null, loginError: null})
            });
        });
    }
    
=======
    //console.log(request.params.genre);
    data.getMovieByGenre(request.params.genre).then(function(movieList) {     
        //console.log(movieList);
        response.render('pages/select', {movieList: movieList, signupError: null, loginError: null})
    });
})

app.get("/select", function (request, response) {
    //console.log(request.params.genre);
    data.getAllMovies().then(function(movieList) {     
        //console.log(movieList);
        response.render('pages/select', {movieList: movieList, signupError: null, loginError: null})
    });
})

app.get("/movie/:id", function (request, response) {
    //console.log(request.params.genre);
    data.getMovieByImdb(request.params.id).then(function(movieList) {     
        //console.log(movieList);
        var majorGenre = (movieList.genre).split(", ")[0];
        //console.log(majorGenre);
        data.getMovieByGenre(majorGenre).then(function(recMovies) {
            //console.log(recMovies);
            response.render('pages/movie', {movieList: movieList,recMovies: recMovies, signupError: null, loginError: null})
        })
    });
>>>>>>> yuanwu
})
// We can now navigate to localhost:3000
app.listen(3000, function() {
    console.log('Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it');
});