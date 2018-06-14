
var File = require('../models/Files');

var UserLog = require('../models/UserLog');

var fs = require('fs');
var User = require('../models/User');
var File = require('../models/Files');
var UserLog = require('../models/UserLog');
var Group = require('../models/Groups');

function getGroups(msg, callback) {
    console.log("in file upload kafka")

    var res = {}

    var groups = []
    Group.find({$or: [{'owner': msg.email}, {'members.email': msg.email}]}, function (err, groupsArr) {

        if (err) {
            throw err;
        }

        if (!groupsArr) {
            res.code = "401";
            callback(null, res);
        }
        else {
            console.log(groupsArr)
            groups = groupsArr;
            res.code = "200";
            res.value = {"groups": groups};
            callback(null, res);
        }

    });
}

function deleteGroup(msg, callback) {


    var res = {}

    var log={
        'groupname':msg.groupname,
        'action':'Delete Group',
        'actiontime': new Date()
    };


    Group.remove({'groupname': msg.groupname, 'owner': msg.owner},function(err){
        if(err){
            throw err;
            res.code = "401";
            callback(null, res);
        }
        else{

            UserLog.update({'user': msg.owner}, {$push: {grouplog:log}}, function (err) {
                if (err) {
                    throw err;
                    res.code = "401";
                    callback(null, res);
                }
                else {
                    res.code = "200";
                    callback(null, res);
                }

            });

        }

    });
}


function addGroup(msg, callback) {


    var res = {}

    var membercount = 0;

    var log = {
        'groupname': msg.groupname,
        'action': 'Add Group',
        'actiontime': new Date()
    };

    var newgroup = new Group();
    newgroup.groupname = msg.groupname;
    newgroup.membercount = membercount;
    newgroup.owner = msg.email;
    newgroup.member=[];

    var groupdata = {};
    groupdata.groupname = msg.groupname;
    groupdata.membercount = membercount;
    groupdata.owner = msg.email;
    groupdata.members = [];

    Group.findOne({'groupname': msg.groupname, 'owner': msg.email}, function (err, group) {

        console.log("Group exists..")
        if (err) {
            throw err;
        }

        if (group) {
            res.code = "402";
            res.value = "Group name already exists!"
            callback(null, res);
        }

        else {

            newgroup.save(function (err) {

                if (err) {
                    console.log(err)
                    res.send({"status": 401});
                    callback(null, res);
                }
                else {
                    UserLog.update({'user': msg.email}, {$push: {grouplog: log}}, function (err) {
                        if (err) {
                            throw err;
                            console.log("Error inserting last login....")
                        }
                        else {
                            console.log(groupdata);
                            res.code = "200";
                            res.value = {"group": groupdata, "message": "Group created successfully!"}
                            console.log(res);
                            callback(null, res);
                        }

                    });
                }
            });
        }
    });
}




function getMembers(msg, callback) {
    console.log("in file upload kafka")

    var res = {}

    Group.findOne( {'groupname': msg.groupname, 'owner': msg.owner}, function (err, group) {

        if (err) {
            throw err;
        }

        if(!group){
            res.code = "401";
            callback(null, res);
        }
        else {

            res.code = "200";
            res.value = {"members": group.members}
            callback(null, res);

        }
    });
}


function deleteMember(msg, callback) {


    var res = {}

    var log={
        'groupname':msg.groupname,
        'action':'Delete Member '+msg.member,
        'actiontime': new Date()
    };

    Group.update({'groupname': msg.groupname, 'owner': msg.owner}, {$pull: {'members':{'email': msg.member}}}, { multi: true }, function (err) {
        if (err) {
            throw err;

            res.code = "401";
            res.value = "Error deleting member!"
            callback(null, res);
        }
        else {

            UserLog.update({'user': msg.owner}, {$push: {grouplog: log}}, function (err) {
                if (err) {
                    throw err;

                }
                else {

                    res.code = "200";
                    res.value = "Member deleted Successfully!"
                    callback(null, res);

                }

            });

        }

    });

}


function addMember(msg, callback) {


    var res = {}

    var groupname = msg.data.group.groupname;
    var count = msg.data.group.membercount;
    var memberemail = msg.data.member;
    var owner = msg.owner;


    var log={
        'groupname':groupname,
        'action':'Add Member '+memberemail,
        'actiontime': new Date()
    };

    var memberdata = {}


    User.findOne( {'email': memberemail}, function (err, user) {

        console.log(user);
        if (err) {
            throw err;
        }

        if (!user) {
            res.code = "401";
            res.value = "User not available on dropbox!"
            callback(null, res);
        }

        else {

            memberdata.firstname= user.firstname;
            memberdata.lastname=user.lastname;
            memberdata.email=memberemail;
            memberdata.group=groupname;

            Group.update({'groupname': groupname, 'owner': owner},
                {$set: {membercount: count+1}, $push: {'members': memberdata}},function(err){
                    if(err){
                        throw err;
                        res.code = "401";
                        res.value = "Error adding member!"
                        callback(null, res);
                    }
                    else{

                        UserLog.update({'user': owner}, {$push: {grouplog:log}}, function (err) {
                            if (err) {
                                throw err;

                            }
                            else {

                                res.code = "200";
                                res.value = {"member":memberdata, message: "Member added Successfully!"}
                                callback(null, res);

                            }
                        });
                    }
                });
        }
    })

}

exports.getGroups=getGroups;
exports.addMember=addMember;
exports.deleteMember=deleteMember;
exports.deleteGroup=deleteGroup;
exports.addGroup=addGroup;
exports.getMembers=getMembers;