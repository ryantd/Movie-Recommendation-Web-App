var MongoClient = require('mongodb').MongoClient,
    settings = require('./config.js'),
    Guid = require('Guid'),
    bcrypt = require('bcrypt-nodejs'),
    request = require('request'),
    fs = require('fs'),
    rp = require('request-promise');

var fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;
var exports = module.exports = {};

MongoClient.connect(fullMongoUrl)
    .then(function(db) {
        db.createCollection("users");
        db.createCollection("movies");
        var userCollection = db.collection("users");
        var movieCollection = db.collection("movies");

        /* user system related funcs */
        exports.createUser = function(uname, pwd, cpwd, sid) {
            if (!uname) return Promise.reject("You must provide a username");
            if (!pwd) return Promise.reject("You must provide a password");
            if (!cpwd) return Promise.reject("You must provide a confirm password");
            if (!sid) return Promise.reject("You must provide a sessionId");

            if (pwd != cpwd) {
                return Promise.reject("The confirmed password does not match. Please try again.");
            }

            var hashpwd = bcrypt.hashSync(pwd);
            
            return userCollection.find({ username: uname }).limit(1).toArray().then(function(listOfUsers) {
                if (listOfUsers.length != 0) {
                    throw "Looks like this username is already in use.";
                }
                return userCollection.insertOne({ _id: Guid.create().toString(),
                                       username: uname,
                              encryptedPassword: hashpwd,
                               currentSessionId: sid,
                                        profile: {  name: "",
                                                    like: "",
                                                     uid: "",
                                               birthYear: 0
                                                 }
                }).then(function(newDoc) {
                    return exports.getUserById(newDoc.insertedId);
                });
            });
        };

        exports.loginUser = function(uname, pwd, sid) {
            if (!uname) return Promise.reject("You must provide a username");
            if (!pwd) return Promise.reject("You must provide a password");
            if (!sid) return Promise.reject("You must provide a sessionId");

            return userCollection.find({ username: uname }).limit(1).toArray().then(function(listOfUsers) {
                if (listOfUsers.length === 0) {
                    throw "Could not find user with name of " + uname;
                }
                if (!bcrypt.compareSync(pwd, listOfUsers[0].encryptedPassword)) {
                    throw "We are unable to match your username and password. Please reenter your existing information and if that does not work please try your previous account information.";
                }
                exports.updateSid(uname, sid);
                return listOfUsers[0];
            });
        };

        exports.updateProfile = function(sid, fname, byear) {
            return userCollection.update({ currentSessionId: sid }, { $set: { profile: {       name: fname,
                                                                                          birthYear: byear
                                                                                       }
                                                                            } }).then(function() {
                return exports.getUserBySessionId(sid);
            });
        };

        exports.updateSid = function(uname, sid) {
            if (!uname) return Promise.reject("You must provide a username");
            if (!sid) return Promise.reject("You must provide a sid");
            
            return userCollection.update({ username: uname }, { $set: { currentSessionId: sid } }).then(function() {
                return exports.getUserBySessionId(sid);
            });
        };

        exports.getUserByName = function(uname) {
            if (!uname) return Promise.reject("You must provide a name");

            return userCollection.find({ username: uname }).limit(1).toArray().then(function(listOfUsers) {
                if (listOfUsers.length === 0) {
                    throw "Could not find user with name of " + uname;
                }
                return listOfUsers[0];
            });
        };

        exports.getUserById = function(id) {
            if (!id) return Promise.reject("You must provide an ID");

            return userCollection.find({ _id: id }).limit(1).toArray().then(function(listOfUsers) {
                if (listOfUsers.length === 0) {
                    throw "Could not find user with id of " + id;
                }
                return listOfUsers[0];
            });    
        };

        exports.getUserBySessionId = function(sid) {
            if (!sid) return Promise.reject("You must provide an SID");

            return userCollection.find({ currentSessionId: sid }).limit(1).toArray().then(function(listOfUsers) {
                if (listOfUsers.length === 0) {
                    throw "Could not find user with sid of " + sid;;
                }
                return listOfUsers[0];
            });    
        };

        exports.getAllUsers = function() {
            return userCollection.find().toArray();
        }
        
        /* movie related funcs */
        exports.createMovieByImdb = function(imdb) {
            if (!imdb) return Promise.reject("You must provide a imdb id");
            var preLink = "http://www.omdbapi.com/?i=",
                postShortLink = "&plot=short&r=json",
                postFullLink = "&plot=short&r=json";
            var shortLink = preLink + imdb + postShortLink;
            var fullLink = preLink + imdb + postFullLink;
            var fullObj = null, shortPlot = "", imgCurrentName = "";
            
            return rp(shortLink).then(function (htmlString) {
                shortPlot = JSON.parse(htmlString).Plot;
                return rp(fullLink).then(function (htmlString) {
                    fullObj = JSON.parse(htmlString);
                    var imgurl = fullObj.Poster;
                    var re = /(?:\.([^.]+))?$/;
                    var ext = re.exec(imgurl);
                    imgCurrentName = imdb + "." + ext[1];
                    var poster = request(imgurl).pipe(fs.createWriteStream('static/resources/poster/' + imgCurrentName));
                    //poster.on('finish', function () { ; });
                    return movieCollection.find({ imdbId: imdb }).limit(1).toArray().then(function(listOfMovies) {
                        if (listOfMovies.length != 0) {
                            throw "Looks like this movie is already in db.";
                        }
                        return movieCollection.insertOne({ _id: Guid.create().toString(),
                                                        imdbId: imdb,
                                                         title: fullObj.Title,
                                                          year: fullObj.Year,
                                                         genre: fullObj.Genre,
                                                      director: fullObj.Director,
                                                        actors: fullObj.Actors,
                                                   description: shortPlot,
                                                       imgname: imgCurrentName,
                                                       likedby: "",
                                                          json: fullObj
                        }).then(function(newDoc) {
                            return exports.getMovieById(newDoc.insertedId);
                        });
                    });
                });
            });
        };
        
        exports.updateMovie = function(imdb, title, year,genre, director, actors, des, imgname, likedby, jsontext) {
            var jsonObj = JSON.parse(jsontext);
            return movieCollection.update({ imdbId: imdb },
                                      { $set: { 
                                                 title: title,
                                                  year: year,
                                                 genre: genre,
                                              director: director,
                                                actors: actors,
                                           description: des,
                                               imgname: imgname,
                                               likedby: likedby,
                                                  json: jsonObj
                                              }
            }).then(function() {
                return exports.getMovieByImdb(imdb);
            });
        };

        exports.getMovieByImdb = function(imdb) {
            if (!imdb) return Promise.reject("You must provide an imdb");

            return movieCollection.find({ imdbId: imdb }).limit(1).toArray().then(function(listOfMovies) {
                if (listOfMovies.length === 0) {
                    throw "Could not find movie with imdb of " + imdb;
                }
                return listOfMovies[0];
            });
        };

        exports.getMovieById = function(id) {
            if (!id) return Promise.reject("You must provide an ID");

            return movieCollection.find({ _id: id }).limit(1).toArray().then(function(listOfMovies) {
                if (listOfMovies.length === 0) {
                    throw "Could not find movie with id of " + id;
                }
                return listOfMovies[0];
            });    
        };

        exports.getMovieByTitleAndYear = function(title, year) {
            if (!title) return Promise.reject("You must provide a title");
            if (!year) return Promise.reject("You must provide a year");

            return movieCollection.find({ title: title, year: year }).limit(1).toArray().then(function(listOfMovies) {
                if (listOfMovies.length === 0) {
                    throw "Could not find movie with title of " + title + " in " + year;
                }
                return listOfMovies[0];
            });    
        };

        exports.getAllMovies = function() {
            return movieCollection.find().toArray();
        }
    });
