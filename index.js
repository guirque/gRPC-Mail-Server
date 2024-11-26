const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Loading from .proto File /////////////////////////////////////////////////////////////////////

//taken from docs
var packageDefition = protoLoader.loadSync(
    process.cwd() + `/main.proto`,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

let protoDescriptor = grpc.loadPackageDefinition(packageDefition);

let mainService = protoDescriptor.main;

// Method Implementations ///////////////////////////////////////////////////////////////////////

let labelArray = [];
let labelUsers = {}; //holds the key as the label and an array of calls as value.

function createLabel(call, callback)
{
    let labelToCreate = call.request.label[0];
    labelArray.push(labelToCreate);
    labelUsers[labelToCreate] = [];
    
    console.log('Client created label: ', labelToCreate);
    callback(null, {label: [labelToCreate]})
}

function requestLabels(call, callback)
{
    console.log('Client requested labels: ', labelArray);
    callback(null, {label: labelArray});
}

function bidirectional(call)
{
    setTimeout(()=> call.end(), 300000);
    
    call.on('data', (res)=>
        {
            //console.log(`Server received message:`, res.title, res.data, res.sender, res.label);

            // Broadcast to everyone that's subscribed to that label
            if(!res.subscription) {

                console.log(`Client ${res.sender} wants to send a message to label '${res.label}, which has a total of ${labelUsers[res.label].length} users'`);

                if(Object.hasOwn(labelUsers, res.label))
                    labelUsers[res.label].forEach(
                        (user)=>{
                            user.write(
                            {         
                                data: res.data,
                                sender: res.sender,
                                title: res.title,
                                label: res.label
                            }
                            )});
            }
            // Subscription
            else
            {
                console.log(`${res.sender} subscribed to ${res.label}`);
                if(!Object.hasOwn(labelUsers, res.label))
                {
                    labelUsers[res.label] = [call];
                }
                else labelUsers[res.label].push(call);
            }

        })
    call.on('end', ()=>
    {
        call.end();
    })
}

// Setting Up Server ////////////////////////////////////////////////////////////////////////////
const server = new grpc.Server();

// Adding services and corresponding method implementations
server.addService(mainService.service, {
    createLabel,
    requestLabels,
    bidirectional
  });

// Exporting ////////////////////////////////////////////////////////////////////////////////////
module.exports = 
{
    server,
    mainService
}