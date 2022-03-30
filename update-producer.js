var { Kafka, logLevel } = require('kafkajs');
var http = require('axios');
var fs = require("fs");

var baseurl = "http://localhost:3000/";

var _kafka = new Kafka({
  clientId: 'testapp',
  brokers: ['kafka:9092'],
  logLevel: logLevel.INFO
});


const producer = _kafka.producer({
    allowAutoTopicCreation: true,
    transactionTimeout: 60000
});

const statuses = ['Success', 'Failed', 'Reversal'];
const pos = Math.floor(Math.random() * statuses.length);
const sentData = {"id":Math.floor(Math.random()*100), "transactionStatus":statuses[pos]};
const payload = JSON.stringify(sentData);

const run = async () => {
    await producer.connect();
    await producer.send({
    topic: 'pos-reversal.notification.event',
    messages: [
        { value: payload },
    ],
    });

    await producer.disconnect();
}

setInterval(() => {
    run().catch(e => {
        const errdata = `${new Date()} - [testapp] ${e.message}\n`;
        fs.writeFile('prodUperrdata.txt', errdata, { flag: 'a+' }, err => {});
      
    });
}, 10000);

/*
var Kafka = require("node-rdkafka");
var avro = require('avsc');

const stream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': 'localhost:9092'
}, {}, {
    topic: 'pos-reversal.notification.event'
});

stream.on('error', (err) => {
    console.error('Error in our kafka stream');
    console.error(err);
});

function queueRandomMessage() {
    const statuses = ['Success', 'Failed', 'Reversal'];
    const pos = Math.floor(Math.random() * statuses.length);
    const sentData = {"transactionStatus":statuses[pos]};
    const payload = JSON.stringify(sentData);
    const success = stream.write(Buffer.from(payload));
    if (success) {
        console.log("Message wrote to stream successfully!");
    } else {
        console.log("Something went wrong");
    }
}


setInterval(() => {
    queueRandomMessage();
}, 3000);
*/