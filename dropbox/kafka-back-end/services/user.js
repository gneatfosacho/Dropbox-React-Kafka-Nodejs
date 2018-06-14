
var User = require('../models/User');
var bcrypt = require('bcrypt');

var File = require('../models/Files');

var UserLog = require('../models/UserLog');

function login(msg, callback){

    var res = {};
    var email=msg.email;
    var password=msg.password;


        User.findOne({'email': email}, function (err, user) {
            if(!user || !bcrypt.compareSync(password, user.password)){
                console.log('errorr');
                res.code = "401";
                res.value = "Failed Login";
                callback(null, res);
            }
            else {


                User.update({'email': email},{lastlogintime: new Date()}, function (err) {
                    if (err) {
                        throw err;
                        console.log("Error inserting last login....")
                    }
                    else {

                        console.log("last login inserted....")
                        res.code = "200";
                        res.value = "Success Login";

                        callback(null, res);
                    }

                });


            }
        });

}

function getUserDetails(msg, callback){

    var res={}
    var email=msg.email;
    var userdetails={
        firstname: '',
        lastname: '',
        email: '',
        contactno: '',
        interests:'',
        lastlogin:'',
        files :[],
        filelog:[],
        grouplog:[]

    }

    User.findOne({'email': email}, function (err, user) {
        if (err) {
            throw err;

            res.code = "401";
            res.value = "Failed to get user details";
            callback(null, res);
        }
        else {

            File.find( {$or: [ {'owner': email, 'fileparent':''}, {'sharedlist': email}]} , function (err, filesArr) {

                if (err) {
                    throw err;

                    res.code = "401";
                    res.value = "Failed to get user details";
                    callback(null, res);
                }

                else {
                    UserLog.findOne({'user': email}, function (err, log) {


                        if (err) {
                            throw err;

                            res.code = "401";
                            res.value = "Failed to get user details";
                            callback(null, res);
                        }

                        if (!user) {

                            res.code = "401";
                            res.value = "Failed to get user details";
                            callback(null, res);
                        }
                        else {

                            userdetails.firstname = user.firstname;
                            userdetails.lastname = user.lastname;
                            userdetails.email = user.email;
                            userdetails.contactno = user.contactno;
                            userdetails.interests = user.interests;
                            userdetails.lastlogin = user.lastlogintime;
                            userdetails.filelog = log.filelog;
                            userdetails.grouplog = log.grouplog;
                            userdetails.files = filesArr;


                            res.code = "200";
                            res.value = {"userdetails": userdetails};
                            callback(null, res);
                            //res.send({"userdetails": userdetails, "status": 201});
                        }
                    });

                }


            });
        }

    });

}

function signup(msg, callback){

    var res={}
    var newUser = new User();
    var hash = bcrypt.hashSync(msg.user.password, 10);

    newUser.password = hash;
    newUser.firstname = msg.user.firstName;
    newUser.lastname = msg.user.lastName;
    newUser.email = msg.user.email;

    var userLog = new UserLog();

    userLog.user = msg.user.email;

    newUser.save(function(err){

        if(err){
            throw err;

            res.code = "401";
            res.value = "Failed to get user details";
            callback(null, res);
        }
        else {

            userLog.save(function(err) {

                if (err) {
                    throw err;

                    res.code = "401";
                    res.value = "Failed to get user details";
                    callback(null, res);
                }
                else {

                    var fs = require('fs');
                    var splitemail = msg.user.email.split('.')[0];
                    var dir = './public/uploads/' + splitemail;

                    if (!fs.existsSync(dir)) {

                        fs.mkdirSync(dir);
                    }
                    res.code = "200";

                    callback(null, res);
                }

            });
        }

    });


}

function updateUser(msg, callback) {

    var res={}
    var firstname = msg.userdata.firstname;
    var lastname = msg.userdata.lastname;
    var contact = msg.userdata.contactno;
    var interests = msg.userdata.interests;
    var email = msg.email;


    User.update({'email':email},{'firstname': firstname, 'lastname':lastname,
        'contactno':contact, 'interests':interests}, function (err) {
        if(err){
            console.log(err);
            res.code = "401";
            callback(null, res);
        }
        else
        {

            res.code = "200";

            callback(null, res);

        }

    });

}


exports.updateUser = updateUser;
exports.signup = signup;
exports.getUserDetails = getUserDetails;
exports.login = login;