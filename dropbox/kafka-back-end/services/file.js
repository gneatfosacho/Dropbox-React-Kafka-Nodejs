
var File = require('../models/Files');

var UserLog = require('../models/UserLog');

var fs = require('fs');
var User = require('../models/User');
var File = require('../models/Files');
var Group = require('../models/Groups');
var UserLog = require('../models/UserLog');
var rimraf = require('rimraf');

function fileUpload(msg, callback) {
console.log("in file upload kafka")

var res={}

    var splitedemail = msg.email.split('.')[0];

    var filename = msg.file.filename;
    var filepath = './public/uploads/'+splitedemail+'/'+msg.file.filename;
    var fileparent = msg.filedata.fileparent;
    var isfile = msg.filedata.isfile;


    if(fileparent)
        filepath=fileparent+'/'+filename


    var filedata={
        'filename': filename,
        'filepath':filepath,
        'fileparent': fileparent,
        'isfile': isfile,
        'owner':msg.email,
        'sharedcount':0,
        'starred' : false
    };

    var newfile=new File();
    newfile.filename = filename,
        newfile.filepath = filepath,
        newfile.fileparent = fileparent,
        newfile.isfile = isfile,
        newfile.owner = msg.email,
        newfile.sharedcount = 0,
        newfile.starred = false


    var log={
        'filename':filename,
        'filepath':filepath,
        'isfile':isfile=='T'?"File":"Folder",
        'action':'Upload File',
        'actiontime': new Date()
    };

    fs.writeFile(filepath, new Buffer(msg.buffer, 'base64'), function(err) {
        if(err)
            console.log(err);
        else {
            console.log('File created');

            newfile.save(function (err) {

                if (err) {
                    console.log(err)
                    res.code = "401";

                }
                else {

                    UserLog.update({'user': msg.email}, {$push: {filelog: log}}, function (err) {
                        if (err) {
                            throw err;
                            console.log("Error inserting last login....")
                        }
                        else {

                            res.code = "200";
                            res.value = {"filedata": filedata};
                            callback(null, res);
                        }

                    });
                }
            });
        }
    });
}

function getFiles(msg, callback) {


    var res = {}
    var email=msg.email;
    var filepath=msg.filepath;
    var files=[];

    File.find( {'fileparent' : filepath} , function (err, filesArr) {

        if (err) {
            throw err;
        }

        if(!filesArr){
            res.code = "401";
            callback(null, res);
        }
        else {

            files=filesArr;

            res.code = "200";
            res.value = {"files": files};
            callback(null, res);
        }

    });
}



function downloadFile(msg, callback) {


    var res = {}
    var filepath=msg.filepath;


    fs.readFile(filepath, function(err, buf) {
        if (err) {
            console.log(err);
        }
        else {

            var buffer = buf.toString('base64');
            res.code = "200";
            res.value = {'file':buffer}
            callback(null, res);

        }
    });
}



function markUnmarkStar(msg, callback) {


    var res = {}

    var filepath = msg.file.filepath;
    var starred = msg.file.starred;


    File.update( {'filepath' : filepath}, {$set:{'starred':starred}} , function (err) {

        if (err) {
            throw err;
            res.code = "401";
            callback(null, res);
        }

        else {

            res.code = "200";
            res.value = {'starred':starred}
            callback(null, res);
        }

    });
}


function fileDelete(msg, callback) {
    var res = {};
    var filename = msg.filedata.filename;
    var isfile = msg.filedata.isfile;
    var filepath= msg.filedata.filepath;
    var count = msg.filedata.sharedcount;
    var owner = msg.filedata.owner;
    var email=msg.email;

console.log(msg);
    var log={
        'filename':filename,
        'filepath':filepath,
        'isfile':isfile=='T'?"File":"Folder",
        'action':'Delete File',
        'actiontime': new Date()
    };


    File.findOne({'filepath':filepath, 'owner':email}, function(err, file){
        if(err){
            throw err;
            res.code = "401";
            res.value = "Error deleting file!";
            callback(null, res);
        }

        if(file){

            if (isfile == 'F') {
                try {

                    rimraf.sync(filepath)
                }
                catch (err) {

                    res.code = "401";
                    res.value = "Folder is not empty!";
                    callback(null, res);
                }

            }
            else {
                console.log(filepath)
                fs.unlinkSync(filepath);

            }

            file.remove(function(err){
                if(err){
                    throw err;
                    res.code = "401";
                    res.value = "Error deleting file!";
                    callback(null, res);
                }
                else{

                    UserLog.update({'user': email}, {$push: {filelog:log}}, function (err) {
                        if (err) {
                            throw err;

                        }
                        else {
                            console.log("Success")

                            res.code = "200";
                            res.value = "File Deleted Successfully!";
                            callback(null, res);
                        }

                    });

                }

            });

        }

        else{
console.log(owner);
            File.update({'filepath':filepath}, { $set:{sharedcount:count-1}, $pull: {sharedlist: email}}, function(err){

                if(err){
                    throw err;
                    res.code = "401";
                    res.value = "Error deleting file!";
                    callback(null, res);
                }
                else{
                    UserLog.update({'user': email}, {$push: {filelog:log}}, function (err) {
                        if (err) {
                            throw err;

                        }
                        else {
                            console.log("Success")

                            res.code = "200";
                            res.value = "File Deleted Successfully!";
                            callback(null, res);
                        }

                    });

                }

            });
        }
    });

}



function makeFolder(msg, callback) {


    var res = {};
    var splitedemail = msg.email.split('.')[0];

    var filename = msg.folderdata.foldername;

    var filepath = './public/uploads/'+splitedemail+'/'+filename;
    var fileparent = msg.folderdata.fileparent;
    var isfile = msg.folderdata.isfile;


    var folderdata={
        'filename': filename,
        'filepath':filepath,
        'fileparent': fileparent,
        'isfile': isfile,
        'owner':msg.email,
        'sharedcount':0,
        'starred' : false
    };

    var newfolder=new File();
    newfolder.filename = filename,
        newfolder.filepath = filepath,
        newfolder.fileparent = fileparent,
        newfolder.isfile = isfile,
        newfolder.owner = msg.email,
        newfolder.sharedcount = 0

    var log={
        'filename':filename,
        'filepath':filepath,
        'isfile':isfile=='T'?"File":"Folder",
        'action':'Create Folder',
        'actiontime': new Date()
    };

    var dir = './public/uploads/'+splitedemail+'/'+filename;

    if (!fs.existsSync(dir)){

        fs.mkdirSync(dir);
    }

    newfolder.save( function (err) {

        if(err){
            res.code = "401";
            res.value = "Error making folder!";
            callback(null, res);
        }
        else {

            UserLog.update({'user': msg.email}, {$push: {filelog:log}}, function (err) {
                if (err) {
                    throw err;
                    res.code = "401";
                    res.value = "Error making folder!";
                    callback(null, res);
                }
                else {

                    res.code = "200";
                    res.value = {"folderdata":folderdata, "message": "Folder created successfully!"};
                    callback(null, res);
                }

            });
        }

    });


}

function shareFile(msg, callback) {


    var res={}
    var userEmail=msg.email;
    var shareEmail= msg.data.shareEmail;

    var file=msg.data.filedata;
    var count = file.sharedcount;
    var filename = file.filename;
    var filepath = file.filepath;
    var fileparent = file.fileparent;
    var isfile = file.isfile;

    var log={
        'filename':filename,
        'filepath':filepath,
        'isfile':isfile=='T'?"File":"Folder",
        'action':'Share File',
        'actiontime': new Date()
    };


    File.update({'filepath':filepath}, { $set:{sharedcount:count+1}, $push: {sharedlist: shareEmail}}, function(err){

        if(err){
            throw err;
            res.code = "401";
            res.value = {"shareEmail":shareEmail}
            callback(null, res);
        }
        else{

            UserLog.update({'user': userEmail}, {$push: {filelog:log}}, function (err) {
                if (err) {
                    throw err;
                    console.log("Error inserting last login....")
                }
                else {
                    res.code = "200";
                    callback(null, res);

                }

            });
        }
    });

}


function shareFileInGroup(msg, callback) {


console.log("Message............")
    console.log(msg)
    var res={}
    var userEmail=msg.email;
    var group= msg.data.group;

    var file=msg.data.file;
    var count = file.sharedcount;
    var filename = file.filename;
    var filepath = file.filepath;
    var fileparent = file.fileparent;
    var isfile = file.isfile;

    var log={
        'filename':filename,
        'filepath':filepath,
        'isfile':isfile=='T'?"File":"Folder",
        'action':'Share File with group '+group,
        'actiontime': new Date()
    };


    Group.findOne( {'groupname': group, 'owner': userEmail}, function (err, groupData) {

        if (err) {
            throw err;
        }

        if(!group){
            res.code = "401";
            callback(null, res);
        }
        else {

            var membersArr = groupData.members;

            for(var i=0; i<membersArr.length; i++){

                count+=1;
                File.update({'filepath':filepath}, { $set:{sharedcount:count+1}, $push: {sharedlist: membersArr[0].email}}, function(err){

                    if(err){
                        throw err;

                        res.code = "401";
                        res.value = {"group":group}
                        callback(null, res);
                    }

                });
            }

            UserLog.update({'user': userEmail}, {$push: {filelog:log}}, function (err) {
                if (err) {
                    throw err;
                    console.log("Error inserting last login....")
                }
                else {

                    res.code = "200";
                    res.value = {"sharedcount":count}
                    callback(null, res);

                }
            });
        }
    });

}

exports.markUnmarkStar=markUnmarkStar;
exports.downloadFile=downloadFile;
exports.shareFileInGroup=shareFileInGroup;
exports.shareFile=shareFile;
exports.makeFolder=makeFolder;
exports.fileDelete=fileDelete;
exports.getFiles = getFiles;
exports.fileUpload = fileUpload;