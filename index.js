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

function aMethod(call, callback)
{
    console.log('aMethod executing', call.request);
    const a = 
    {
        aNum: 10,
        check: true,
        aha: 'something'
    }

    callback(null, a);
}

let i = 0;
function bidirectional(call)
{
    call.on('data', (res)=>
        {
            console.log(`Server received:`, res.data);
            call.write({data: `Server received your message (${res.data})`});
            i++;
            if(i == 3)
            {
                call.end();
            }
        })
}

// Setting Up Server ////////////////////////////////////////////////////////////////////////////
const server = new grpc.Server();

// Adding services and corresponding method implementations
server.addService(mainService.service, {
    aMethod,
    bidirectional
  });

// Exporting ////////////////////////////////////////////////////////////////////////////////////
module.exports = 
{
    server,
    mainService
}