const viewModal = document.getElementById('modal');
const abrirModal = document.querySelector('#section-one button');
const fecharModal = document.querySelector(".finalizarFechar");
const modal__conteudo__container = document.querySelector('.modal__conteudo__container');
const totalPagar = document.querySelector(".total");
const divFuncionamento = document.getElementById("funcionamento");
const finalizarPedido = document.querySelector('.finalizar button');
const endereco__campo = document.querySelector(".endereco__campo");

abrirModal.addEventListener('click', ()=> {
    updateCarrinho();
    viewModal.style.display = 'flex';
})


fecharModal.addEventListener('click', ()=> {
    viewModal.style.display = 'none';
})

//Adicionando ao carrinho
var carrinho = [];

function addCarrinho(name, price){
    let existeItem = carrinho.find(item => item.name === name);
    if(existeItem) {
        //Se o item já existir nas compras, vai apenas aumentar a quantidade 
        existeItem.quantity += 1;
    } else {
        //Método push serve para adicionar elementos ao vetor 
        carrinho.push({
            name,
            price,
            quantity: 1
        })
    }
    updateCarrinho();
}

function pedido(event){
    //O método event.target vai indicar qual elemento disparou o evento atráves do método closest
    let disparouEvento = event.target.closest(".pedidoBurger");

    if(disparouEvento) { //getAttibute serve para pegar atributo
        let nomeProduto = disparouEvento.getAttribute("data-name");
        let precoProduto = disparouEvento.getAttribute("data-price");

        addCarrinho(nomeProduto, precoProduto);

    }
}

function updateCarrinho() {
    modal__conteudo__container.innerHTML = "";
    let total = 0;

    //forEach() é o métedo que serve para percorrer o meu vetor e p
    carrinho.forEach(item => {
        let createElementCar = document.createElement('div');
        createElementCar.innerHTML = `
            <div class="modal__conteudo">
                <div class= "modal__conteudo__container">
                    <p>${item.name}</p>
                    <p> Quantidade: ${item.quantity}</p>
                    <p> Preço: ${item.price}</p>
                </div>

                <div class="modalButtonRemove">
                    <button class="buttonModalRemove" data-name="${item.name}">Remover</button> 
                </div>
            </div>
        `
        total += item.price * item.quantity;
        modal__conteudo__container.appendChild(createElementCar);
    });

       //textContent é usado para adcionar um texto no HTML
       totalPagar.textContent = `R$ ${total.toFixed(2)}`;
       //toFixed serve para limitar as casas decimais       
}

//criando função de remover item no carrinho 
function removerItemCarrinho(name){
    /*
        Essa variável index, foi criada para encontrar a posição do item na lista (vetor). 
        Por conta disso, eu uso método findIndex().    
    */ 
    let index = carrinho.findIndex(item => item.name === name);
    if(index !== -1){//menos 1, ta relacionado ao findIndex.Quando não se acha nenhum item no vetor.
        let item = carrinho[index];

        //Condição para ir removendo item por item 
        if(item.quantity > 1){
            item.quantity -= 1;//Pega a quantidade que tem e em seguida remover 1 de cada vez.
            updateCarrinho();
            return;
        }

        carrinho.splice(index, 1);
        updateCarrinho();
    }
}

modal__conteudo__container.addEventListener('click', (event)=>{
    if(event.target.classList.contains("buttonModalRemove")){
        let name = event.target.getAttribute('data-name');

        removerItemCarrinho(name);
    
    }
})


finalizarPedido.addEventListener('click', ()=>{
    //validação de incluir pedido
    if(carrinho.length === 0){
        alert("ERRO! Você tentou finalizar o pedido sem adicionar nada ao carrinho.");
        return;
    }

    //Validação do endereço 
    if(endereco__campo.value === ""){
        alert("ERRO! Você está tentando finalizar o pedido sem adicionar um endereço.");
    return;
    }

    //Validação que informa o fechamento do restaurante
    let funcionamento = verificaHora();
    if (!funcionamento){
        alert("O RESTAURANTE ESTÁ FECHADO!");
        return;
    }
    //Mapeando para mostrar o que vai ser enviado para o restaurante
    let carrinhoItens = carrinho.map((item)=>{
        // indicando que será retornado através do método map
        return(
            `
            Pedido: ${item.name}
            Quantidade: ${item.quantity}
            Preço: R$ ${item.price}
            `
        )
        
    }).join("");//Método que serve para juntar as informações do vetor e transformar tudo em texto/string

    //Enviando a mensagem do produto para o Whatsapp
    let message = encodeURIComponent (carrinhoItens); //Método que vai pegar a string e levar para o servidor
    let phone = "(98) 983626252";

    //Método que vai referenciar o link do whatsapp
    window.open(`https://wa.me/${phone}?text=${message}  Endereço: ${endereco__campo.value}`, "_blank");
})

function verificaHora(){
    let data = new Date (); //O método Date(), faz gerar a data atual.
    let hora = data.getHours(); //O método getHours(), faz gerar a hora atual.

    return hora >= 13 && hora < 23; 
}

const trocaFuncionamento = verificaHora();

if(trocaFuncionamento){
    divFuncionamento.classList.remove("funcionamentoF");
    divFuncionamento.classList.add("funcionamentoA");
} else{
    divFuncionamento.classList.remove("funcionamentoA");
    divFuncionamento.classList.add("funcionamentoF");
}