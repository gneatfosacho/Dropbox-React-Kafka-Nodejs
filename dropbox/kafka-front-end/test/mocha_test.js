/**
 * New node file
 */
var request = require('request');
var express = require('express');
var assert = require("assert");
var http = require("http");

describe('Login', function() {

    it('should login', function(done) {
        request.post('http://localhost:3001/users/', {
            form : {
                email : 'kimtani90@gmail.com',
                password : 'dishkim02'
            }
        }, function(error, response, body) {

            assert.equal(200, response.statusCode);
            done();
        });
    });
});



describe('Sign Up', function() {

    it('should signup', function(done) {
        request.post('http://localhost:3001/users/', {
            form : {
                firstName: 'John',
                lastName: 'Lenon',
                username: '',
                password: 'dishkim02',
                email: 'john@gmail.com',
                contactNo: ''
            }
        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});




describe('Get User Details', function() {

    it('should get user details', function(done) {
        request.get('http://localhost:3001/users?email=kimtani90@gmail.com',
            function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});




describe('Delete File', function() {

    before(function(done){
        request.post('http://localhost:3001/users/', {
            form : {
                email : 'kimtani90@gmail.com',
                password : 'dishkim02'
            }
        }, function(error, response, body) {

            if(error)
                return done(error);
            done();
        });
    })

    it('should delete file', function(done) {
        request.post('http://localhost:3001/files/delete', {
            form : {
                filename: 'ProfilePic.jpg',
                filepath: './public/uploads/kimtani90@gmail/ProfilePic.jpg',
                fileparent: '',
                isfile: 'T',
                owner: 'kimtani90@gmail.com',
                sharedcount: 0,
                starred: false
            }
        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});


describe('Make Folder', function() {

    it('should make folder', function(done) {
        request.post('http://localhost:3001/files/makefolder', {
            form : {
                email: 'kimtani90@gmail.com',
                foldername: 'newFolder',
                fileparent: '',
                isfile: 'F'
            }
        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});



describe('Share File', function() {

    it('should share a file', function(done) {
        request.post('http://localhost:3001/files/sharefile', {
            form :
                {filedata:
                    { 'filename': 'E.pdf',
                    'filepath': './public/uploads/kimtani90@gmail/E.pdf',
                    'fileparent': '',
                    'isfile': 'T',
                    'owner': 'kimtani90@gmail.com',
                    'sharedcount': 0,
                    'starred': false
                    },
                shareEmail: 'ross@gmail.com'}


        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});



describe('Create Group', function() {

    it('should create a group', function(done) {
        request.post('http://localhost:3001/groups/addgroup', {
            form :
                { groupname: 'aaa'}

        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});




describe('Get Groups', function() {

    it('should get a list of groups', function(done) {
        request.get('http://localhost:3001/groups/getgroups', {
            form :
                { email: 'kimtani90@gmail.com'}

        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});



describe('Get Members', function() {

    it('should get a list of members', function(done) {
        request.post('http://localhost:3001/groups/getmembers', {
            form :
                {  groupname: 'aaa',
                    owner: 'kimtani90@gmail.com',
                    email: 'kimtani90@gmail.com'}

        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});

describe('Delete Group', function() {

    it('should delete a group', function(done) {
        request.post('http://localhost:3001/groups/deletegroup', {
            form :
                { groupname: 'aaa',
                owner: 'kimtani90@gmail.com'}

        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});



describe('Delete Member', function() {

    it('should delete a member', function(done) {
        request.post('http://localhost:3001/groups/deletemember', {
            form :
                { firstname: 'Ram',
                    lastname: 'Kumar',
                    email: 'ram@gmail.com',
                    group: 'xyz',
                    owner: 'kimtani90@gmail.com' }


        }, function(error, response, body) {
            assert.equal(200, response.statusCode);
            done();
        });
    });
});





