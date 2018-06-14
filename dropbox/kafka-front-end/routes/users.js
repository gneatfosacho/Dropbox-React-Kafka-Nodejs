var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var User = require('../models/User');
var crypto = require('crypto');
var fs = require('fs');
var File = require('../models/Files');
var passport = require('passport');
var UserLog = require('../models/UserLog');
var bcrypt = require('bcrypt');
var kafka = require('./kafka/client');


/* GET users listing. */
router.get('/', function (req, res) {

    kafka.make_request('getuser',{"email":req.session.email}, function(err,results){

        console.log('in result');
        console.log(results);
        if(err){
            res.send({status: 401});
        }
        else
        {
            if(results.code == 200){
                console.log(results.value.userdetails)
                res.send({"userdetails": results.value.userdetails, "status": 201});
            }
            else {
                res.send({status: 401});
            }
        }
    });

});

router.post('/', function (req, res) {

    var reqEmail = req.body.email;
    var reqPassword = req.body.password;


   passport.authenticate('login', function(err, user) {

        if (err) {
            throw err;

        }

        if(!user ){
            console.log('Could not find user')
            res.send({status: 401});
        }
        else {

            req.session.email = user.email;
            console.log(req.session.email);
            res.send({"status": 201, "email": user.email});

        }

    })(req,res);

});

router.post('/signup', function (req, res) {

console.log(req.body);
    kafka.make_request('signup',{"user":req.body}, function(err,results){

        console.log('in result');
        console.log(results);
        if(err){
            res.status(401).json({message: "SignUp failed"});

        }
        else
        {
            if(results.code == 200){
                res.status(201).json({message: "User Details Saved successfully"});
            }
            else {
                res.status(401).json({message: "SignUp failed"});

            }
        }
    });




});



router.post('/updateuser', function (req, res) {


    kafka.make_request('updateuser',{"email": req.session.email, "userdata":req.body}, function(err,results){

        console.log('in result');
        console.log(results);
        if(err){
            res.status(401).send();

        }
        else
        {
            if(results.code == 200){
                res.status(201).send();
            }
            else {
                res.status(401).send();

            }
        }
    });

});


//Logout the user - invalidate the session
router.post('/logout', function (req, res) {

    req.session.destroy();
    console.log('Session destroyed');
    res.status(201).send();

});

module.exports = router;
