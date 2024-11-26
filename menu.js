// Função para exibir o menu
function exibirMenu() {
    console.log("\n=== Menu ===");
    console.log("1 - Se inscrever em um tópico");
    console.log("2 - Criar um tópico");
    console.log("3 - Listar os tópicos");
    console.log("4 - Enviar mensagem em todos os tópicos");
    console.log("0 - Sair");
}

// Função principal
function menu() {
    let opcao;

    do {
        exibirMenu();
        opcao = parseInt(prompt("Escolha uma opção:"));

        switch (opcao) {
            case 1:
                console.log("Tópicos disponíveis:");
                break;

            case 2:
                let novoTopico = prompt("Digite o nome do novo tópico:");
                break;

            case 3:
                console.log("Tópicos disponíveis:");
                break;

            case 4:
                let mensagem = prompt("Digite a mensagem para enviar a todos os tópicos:");
                break;

            case 0:
                console.log("Saindo...");
                break;
        }
    } while (opcao !== 0);
}

menu();
