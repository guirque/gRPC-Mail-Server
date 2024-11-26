const grpc = require('@grpc/grpc-js');
const {mainService} = require('./index.js');

// Stub (client)
const client = new mainService('127.0.0.1:3000', grpc.credentials.createInsecure(), {"grpc.keepalive_time_ms": 5000});

// Running remote method
const dataToSend = {aNum: 10, check: true, aha: 'client sent this'};

// Running aMethod
console.log('Data sent: ', dataToSend);
client.aMethod(dataToSend, (error, answer)=>
{
    if(!error){
        console.log('Data received: ', answer);
    }
    else
    {
        console.log('Error message: ', error);
    }
});

// Running bidirectional (establishing connection and sending 3 messages. Also, printing server responses)
console.log('sending message to server on persistent connection');
let connection = client.bidirectional();

connection.write({data: 'uhuulll, im a msg'});
setTimeout(() => connection.write({data: 'mensagem de novo'}), 5000);
setTimeout(() => connection.write({data: 'mensagem de novo'}), 10000);

connection.on('end', ()=>
{
    console.log('Server has disconnected');
})

connection.on('data', (res)=>
{
    console.log('Server has responded with: ', res.data);
});

connection.on('error', (error)=>
{
    console.log('Error: ', error);
});

connection.on('status', (status)=>
{
    console.log('Status: ', status);
});