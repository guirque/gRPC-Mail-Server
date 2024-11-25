const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Loading from .proto File /////////////////////////////////////////////////////////////////////

//taken from docs
var packageDefition = protoLoader.loadSync(
    process.cwd() + `/test.proto`,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

let protoDescriptor = grpc.loadPackageDefinition(packageDefition);

let mainService = protoDescriptor.main;

// Method Implementations ///////////////////////////////////////////////////////////////////////

function aMethod(value, callback)
{
    console.log('aMethod executing', value.request);
    const a = 
    {
        aNum: 10,
        check: true,
        aha: 'something'
    }

    callback(null, a);
}

// Setting Up Server ////////////////////////////////////////////////////////////////////////////
const server = new grpc.Server();

// Adding services and corresponding method implementations
server.addService(mainService.service, {
    aMethod
  });

// Exporting ////////////////////////////////////////////////////////////////////////////////////
module.exports = 
{
    server,
    mainService
}