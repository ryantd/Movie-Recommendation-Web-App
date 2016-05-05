var MongoClient = require('mongodb').MongoClient,
    settings = require('./config.js'),
    Guid = require('Guid'),
    bcrypt = require('bcrypt-nodejs'),
    request = require('request'),
    fs = require('fs'),
    rp = require('request-promise'),
    omdb = require('omdb');;

var fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;

MongoClient.connect(fullMongoUrl)
    .then(function(db) {
        var userCollection = db.collection("users");
        var movieCollection = db.collection("movies");
        
        /* user system related funcs */
        

        var getAllMovies = function() {
            return movieCollection.find().toArray();
        }
        var cursor = getAllMovies().then(function(cursor) {
            //console.log(cursor.genre);
            for (var i in cursor) {
                console.log(cursor[i].genre);
            }
        });
        
    });

