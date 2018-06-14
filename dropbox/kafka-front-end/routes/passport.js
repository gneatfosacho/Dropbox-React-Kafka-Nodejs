var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require('../models/User');
var bcrypt = require('bcrypt');
var kafka = require('./kafka/client');

module.exports = function(passport) {

    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
                console.log('second in pass');
console.log(email);
console.log(password);
            kafka.make_request('login',{"email":email,"password":password}, function(err,results){
                console.log('in result');
                console.log(results);
                if(err){
                    done(err,{});
                }
                else
                {
                    if(results.code == 200){
                        done(null,{"email":email});
                    }
                    else {
                        done(null,false);
                    }
                }
            });


        }));
};


