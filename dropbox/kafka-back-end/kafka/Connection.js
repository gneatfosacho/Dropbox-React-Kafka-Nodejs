var kafka = require('kafka-node');

function ConnectionProvider() {
    this.getConsumer = function() {
        if (!this.kafkaConsumerConnection) {

            this.client = new kafka.Client("localhost:2181");
            this.kafkaConsumerConnection = new kafka.Consumer(this.client,[
                { topic: 'login', partition: 0 },
                { topic: 'getuser', partition: 0 },
                { topic: 'upload', partition: 0 },
                { topic: 'signup', partition: 0 },
                { topic: 'getfiles', partition: 0 },
                { topic: 'deletefile', partition: 0 },
                { topic: 'makefolder', partition: 0 },
                { topic: 'sharefile', partition: 0 },
                { topic: 'updateuser', partition: 0 },
                { topic: 'starfile', partition: 0 },
                { topic: 'getgroups', partition: 0 },
                { topic: 'deletegroup', partition: 0 },
                { topic: 'addgroup', partition: 0 },
                { topic: 'getmembers', partition: 0 },
                { topic: 'deletemember', partition: 0 },
                { topic: 'sharefileingroup', partition: 0 },
                { topic: 'downloadfile', partition: 0 },
                { topic: 'addmember', partition: 0 }]);

            this.client.on('ready', function () { console.log('client ready!') })
        }
        return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function() {

        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client("localhost:2181");
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            //this.kafkaConnection = new kafka.Producer(this.client);
            console.log('producer ready');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;