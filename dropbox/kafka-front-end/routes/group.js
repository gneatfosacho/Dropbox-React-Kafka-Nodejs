var express = require('express');
var router = express.Router();
var User = require('../models/User');

var Group = require('../models/Groups');
var UserLog = require('../models/UserLog');
var kafka = require('./kafka/client');


router.get('/getgroups', function (req, res) {

    var email=req.session.email;


    kafka.make_request('getgroups',{"email":email }, function(err,results){

        if(err){
            res.send({status: 401});

        }
        else
        {
            if(results.code == 200){
                res.send({status: 201, groups:results.value.groups});
            }
            else {
                res.send({status: 401});

            }
        }
    });

});


router.post('/deletegroup', function (req, res) {

    var groupname = req.body.groupname;
    var owner = req.session.email;


    kafka.make_request('deletegroup',{"groupname":groupname, "owner":owner}, function(err,results){
/*
        console.log('in result');
        console.log(results);*/
        if(err){
            res.send({status: 401, message: "Error deleting group!"});

        }
        else
        {
            if(results.code == 200){
                res.send({status: 201, message: "Group deleted Successfully!"});
            }
            else {
                res.send({status: 401, message: "Error deleting group!"});

            }
        }
    });

});

router.post('/addgroup', function (req, res) {


    var groupname = req.body.groupname;

    var email = req.session.email;


    kafka.make_request('addgroup',{"groupname":groupname, "email":email}, function(err,results){

        if(err){
            res.send({status: 401, message: "Error deleting group!"});

        }
        else
        {
            if(results.code == 200){
                res.send({status: 201, "group": results.value.group, "message": results.value.message});
            }

            else if(results.code == 402){
                res.send({status: 401, message:results.value});
            }

            else {
                res.send({status: 401});

            }
        }
    });

});


router.post('/getmembers', function (req, res) {

    var email= req.session.email;
    var groupname= req.body.groupname;
    var owner= req.body.owner;

    kafka.make_request('getmembers',{"groupname":groupname, "email":email, "owner":owner}, function(err,results){

        if(err){
            res.send({status: 401});

        }
        else
        {
            if(results.code == 200){
                res.send({status: 201, members: results.value.members});
            }

            else {
                res.send({status: 401});

            }
        }
    });


});


router.post('/deletemember', function (req, res) {

    var groupname = req.body.group;
    var member = req.body.email;
    var owner = req.body.owner;


    kafka.make_request('deletemember',{"groupname":groupname, "member":member, "owner":owner}, function(err,results){

        if(err){
            res.send({status: 401, message:results.value});

        }
        else
        {
            if(results.code == 200){
                res.send({status: 201, message:results.value});
            }

            else {
                res.send({status: 401, message:results.value});

            }
        }
    });
});

router.post('/addmember', function (req, res) {


    kafka.make_request('addmember',{"data":req.body, "owner":req.session.email}, function(err,results){

        if(err){
            res.send({status: 401, message:results.value});

        }
        else
        {
            if(results.code == 200){
                res.send({status: 201, member:results.value.member, message: results.value.message});
            }

            else {
                res.send({status: 401, message:results.value});

            }
        }
    });
});


module.exports = router;
