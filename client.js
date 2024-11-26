const grpc = require('@grpc/grpc-js');
const {mainService} = require('./index.js');

let messages = []; // Where the messages are stored
let labels = [];

// Stub (client)
const client = new mainService('127.0.0.1:3000', grpc.credentials.createInsecure(), {"grpc.keepalive_time_ms": 5000});


// Running bidirectional (establishing connection and sending 3 messages. Also, printing server responses)
console.log('sending message to server on persistent connection');
let connection = client.bidirectional();

connection.on('end', ()=>
{
    console.log('Desconectado.');
})

// Receiving Messages
connection.on('data', (res)=>
{
    console.log('<!> Nova mensagem!');
    messages.push(`
        Mensagem________________________________________________
        De: ${res.sender} | Em '${res.label}'
        ---
        ${res.data}
        ________________________________________________________
        `);
});

connection.on('error', (error)=>
{
    console.log('Error: ', error);
});

connection.on('status', (status)=>
{
    if(status.code != 0) console.log(status);
});

const prompt = require('prompt-sync')();

function exibirRelatorio()
{
    messages.forEach((message)=> console.log(message));
}

// Função para exibir o menu
function exibirMenu() {
    console.log("\n=== Menu ===");
    console.log("1 - Se inscrever em um tópico");
    console.log("2 - Criar um tópico");
    console.log("3 - Listar os tópicos");
    console.log("4 - Enviar mensagem a um tópico");
    console.log("0 - Sair");
}

let mayAdvance = true;
function isReady()
{
    return new Promise((res)=>
    {
        let interval = setInterval(
            ()=>
                {
                    if(mayAdvance) {clearInterval(interval); res(true);}
                }, 500);
    }, (rej)=>{})
}

// Função principal
async function menu() {

    let ultimaOpcao = -1;
    let nome = '';
    nome = prompt('Digite seu nome: ');

    do {
        await isReady();
        console.clear();
        mayAdvance = false;
        console.log(`-------------------------------------------------`);
        console.log(`Available labels: `, labels);
        console.log(`-------------------------------------------------`);
        exibirRelatorio();
        console.log(`-------------------------------------------------`);
        exibirMenu();
        let opcao = parseInt(prompt('Escolha uma opção: '));
            ultimaOpcao = opcao;

            switch (opcao) {
                case 1:
                    let topicoDeEscolha = prompt('Digite o nome do tópico: ');
                    await connection.write({sender: nome, label: topicoDeEscolha, subscription: true});
                    mayAdvance = true;
                    break;
    
                case 2:
                    let novoTopico = prompt('Digite o nome do novo tópico: ');
                    client.createLabel({label: [novoTopico]}, async (error, answer)=>
                    {
                        mayAdvance = true;
                        if(error)
                            console.log('Error message: ', error);
                        
                    });
                    break;
    
                case 3:
                    await client.requestLabels({label: []}, async (error, answer)=>
                        {
                            mayAdvance = true;
                            if(!error){
                                labels = answer.label;
                            }
                            else
                            {
                                console.log('Error message: ', error);
                            }
                        });

                    break;
    
                case 4:
                    let mensagem = prompt('Digite a mensagem para enviar a um tópico: ');
                    let topico = prompt('Digite o nome do tópico: ');
                    connection.write({data: mensagem, label: topico, sender: nome, subscription: false})
                    mayAdvance = true;
                    break;
                
                default:
                    console.log("Saindo...");
                    mayAdvance = true;
                    connection.end();
                    break;
            }
    } while (ultimaOpcao !== 0);
}

menu();

