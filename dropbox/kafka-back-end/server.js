var connection =  new require('./kafka/Connection');
var user = require('./services/user');
var file = require('./services/file');
var group = require('./services/group');

//var topic_name = 'login';
var consumer = connection.getConsumer();
var producer = connection.getProducer();

console.log('server is running');
consumer.on('message', function (message) {


    console.log('message received');
    console.log(message);
    console.log(JSON.stringify(message.value));

    var data = JSON.parse(message.value);


    if(message.topic=='login') {
        user.login(data.data, function (err, res) {

            response(data, res);
            return;
        });
    }

    else if(message.topic=='getuser'){
        user.getUserDetails(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='upload'){
        file.fileUpload(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='signup'){
        user.signup(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='getfiles'){
        file.getFiles(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='deletefile'){

        file.fileDelete(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='makefolder'){

        file.makeFolder(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='sharefile'){

        file.shareFile(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='updateuser'){

        user.updateUser(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='starfile'){

        file.markUnmarkStar(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='getgroups'){

        group.getGroups(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='deletegroup'){

        group.deleteGroup(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='addgroup'){

        group.addGroup(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='getmembers'){

        group.getMembers(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='deletemember'){

        group.deleteMember(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='addmember'){

        group.addMember(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='sharefileingroup'){

        file.shareFileInGroup(data.data, function(err,res){

            response(data, res);
            return;
        });
    }

    else if(message.topic=='downloadfile'){

        file.downloadFile(data.data, function(err,res){

            response(data, res);
            return;
        });
    }
});

function response(data, res) {
    var payloads = [
        { topic: data.replyTo,
            messages:JSON.stringify({
                correlationId:data.correlationId,
                data : res
            }),
            partition : 0
        }
    ];
    producer.send(payloads, function(err, data){
        console.log(data);
    });
}