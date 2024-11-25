const grpc = require('@grpc/grpc-js');
const {server} = require('./index');

// Running Server
server.bindAsync('127.0.0.1:3000', grpc.ServerCredentials.createInsecure(), ()=>
    {
        console.log('Server running on port 3000');
    });