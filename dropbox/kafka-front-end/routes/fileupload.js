var express = require('express');
var router = express.Router();
var multer = require('multer');
var glob = require('glob');
var mysql = require('./mysql');
var fs = require('fs');
var User = require('../models/User');
var File = require('../models/Files');
var UserLog = require('../models/UserLog');
var kafka = require('./kafka/client');
var path = require('path');



var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        // cb(null, file.fieldname + '-' + Date.now() + '.jpeg')
        cb(null, file.originalname)


    }
});

var upload = multer({storage:storage});



router.get('/',  function (req, res) {


    console.log(req.query.filepath);
    var filepath=req.query.filepath;
    var tempfilepath='./public/uploads/'+filepath.split('/')[filepath.split('/').length-1]

    kafka.make_request('downloadfile',{"filepath": filepath}, function(err,results){

        console.log('in result');
        console.log(results.code);
        if(err){
            throw err;

        }
        else {
            if (results.code == 200) {

                fs.writeFile(tempfilepath, new Buffer(results.value.file , 'base64'), function (err) {
                    if (err)
                        console.log(err);
                    else {
                        console.log('File created');

                        var file = path.join(__dirname, '..') + tempfilepath.substring(1);


                        res.download(file, function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("hello", tempfilepath)
                                fs.unlink(tempfilepath);
                            }
                        })
                    }
                });

            }
        }
    });
});



router.get('/getfiles', function (req, res) {

    kafka.make_request('getfiles',{"email":req.session.email, "filepath": req.query.filepath}, function(err,results){

        console.log('in result');
        console.log(results);
        if(err){
            res.send({status: 401});

        }
        else
        {
            if(results.code == 200){
                res.send({"files": results.value.files, "status": 201});
            }
            else {
                res.send({status: 401});

            }
        }
    });


});


router.post('/delete', function (req, res) {
console.log(req.body);

    kafka.make_request('deletefile',{"email":req.session.email, "filedata": req.body}, function(err,results){

        console.log('in result');
        console.log(results);
        if(err){
            res.send({status: 401, message: results.value});

        }
        else
        {
            if(results.code == 200){
                res.send({"status": 201, message: results.value});
            }
            else {
                res.send({status: 401, message: results.value});

            }
        }
    });

});

router.post('/upload', upload.single('file'), function (req, res) {

    var filepath = './public/uploads/'+req.file.filename;

    fs.readFile(filepath, function(err, buf) {
        if(err) {
            console.log(err);
        }
        else {

            var buffer = buf.toString('base64');

            kafka.make_request('upload', {
                "email": req.session.email,
                "file": req.file,
                "filedata": req.body,
                "buffer": buffer
            }, function (err, results) {

                if (err) {
                    res.send({status: 401});
                }
                else {
                    if (results.code == 200) {
                        fs.unlink(filepath);
                        res.send({"filedata": results.value.filedata, "status": 204});
                    }
                    else {
                        res.send({status: 401});
                    }
                }
            });
        }
    });

});



router.post('/makefolder', function (req, res) {

    kafka.make_request('makefolder',{"email":req.session.email, "folderdata": req.body}, function(err,results){

        console.log('in result');
        console.log(results);
        if(err){
            res.send({status: 401, message: results.value});

        }
        else
        {
            if(results.code == 200){
                res.send({"status": 201, "folderdata": results.value.folderdata , "message": results.value.message});
            }
            else {
                res.send({status: 401, message: results.value});

            }
        }
    });

});


router.post('/star', function (req, res) {

    kafka.make_request('starfile',{"file":req.body}, function(err,results){

        console.log('in result');
        console.log(results);
        if(err){
            res.send({status: 401});

        }
        else
        {
            if(results.code == 200){
                res.send({status: 201, starred: results.value.starred});
            }
            else {
                res.send({status: 401});

            }
        }
    });

});



router.post('/sharefile', function (req, res) {


    kafka.make_request('sharefile',{"email":req.session.email, "data": req.body}, function(err,results){

        console.log('in result');
        console.log(results);
        if(err){
            res.send({status: 401, email:results.value.shareEmail});

        }
        else
        {
            if(results.code == 200){

                res.send({"status": 201});

            }
            else {
                res.send({status: 401, email:results.value.shareEmail});

            }
        }
    });

});



router.post('/sharefileingroup', function (req, res) {


    kafka.make_request('sharefileingroup',{"email":req.session.email, "data": req.body}, function(err,results){

        console.log('in result');
        console.log(results);
        if(err){
            res.send({status: 401, group:results.value.group});

        }
        else
        {
            if(results.code == 200){

                res.send({"status": 201, "sharedcount":results.value.sharedcount});

            }
            else {
                res.send({status: 401, group:results.value.group});

            }
        }
    });

});


module.exports = router;
