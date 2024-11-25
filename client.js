const grpc = require('@grpc/grpc-js');
const {mainService} = require('./index.js');

// Stub (client)
const client = new mainService('127.0.0.1:3000', grpc.credentials.createInsecure());

// Running remote method
const dataToSend = {aNum: 10, check: true, aha: 'client sent this'};
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