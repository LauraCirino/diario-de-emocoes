function analisarHumor(texto){
    const positivo = ["feliz","alegre","animado","grato","otimo","bem","contente","calmo"];
    const negativo = ["triste","cansado","chateado","pessimo","mal","deprimido","ancioso","estressado","raiva"]
    const textMin = texto.toLowerCase();
    let score = 0
    
    positivo.forEach(palavra => {
        if(textMin.includes(palavra)) score++;
    })

     negativo.forEach(palavra => {
        if(textMin.includes(palavra)) score--;
    })

    if(score > 0) return {humor: "feliz",emoji:"😁"};
    else if(score < 0) return {humor:"triste",emoji:"😭"}
    else return {humor:"neutro",emoji:"😐"}
}

function salvarEntrada(){
    const usuario = document.getElementById("usuario").value.trim();
    const data = document.getElementById("data").value;
    const titulo = document.getElementById("titulo").value.trim();
    const texto = document.getElementById("texto").value.trim();

    if(!usuario || !data || !titulo || !texto){
        alert('Por Favor, preencha todos os campos');
        return;
    }

    const analise = analisarHumor(texto);
    const novaEntrada = {
        id:Date.now(),
        usuario,
        data,
        titulo,
        texto,
        humor:analise.humor,
        emoji:analise.emoji,
        likes:0,
        comentarios:[]
    }

    const entradas = JSON.parse(localStorage.getItem("diarioEmocoes")) || [];
    entradas.unshift(novaEntrada);
    localStorage.setItem("diarioEmocoes", JSON.stringify(entradas));
    document.querySelector("form").reset();
    document.getElementById("data").value = new Date().toISOString().slice(0,16);
    mostrarEntradas();

}


function mostrarEntradas(){
    const lista = document.getElementById("listaEntradas");
    lista.innerHTML = "";
    const entradas = JSON.parse(localStorage.getItem("diaroEmocoes"))|| [];

    if(entradas.length === 0) {
        lista.innerHTML = "<p>Seu diário ainda está cazio.";
        return;
    }

    entradas.forEach(entrada => {
        const div = document.createElement("div");
        div.classList.add("entrada");

        div.innerHTML = ` 
        <h3>${entrada.titulo}</h3>
        <p><strong>Usuário:</strong> ${entrada.usuario}</p>
        <p><strong>Data:</strong> ${new Date(entrada.data).toLocaleString("pt-BR")}</p>
        <p> ${entrada.texto}</p>
        <p class="humor"><strong>Humor:</strong> ${entrada.humor} <span class="emoji"></p>

        <div class="likes" data-id="${entrada.id}">
            ❤ <span>${entrada.likes}</span> Curtidas
        </div>

        <div class="comentarios" id="comentarios-${entrada.id}">
            <h4>Comentário:</h4>
            <div class="lista-comentarios"></div>
            <div class="novo-comentario">
                <input type="text"> placeholder="Escrever um comentário..." />
                <button>enviar</button>
            </div>
        </div>
        `
        lista.appendChild(div);
        const comentariosDiv = div.querySelector(".lista-comentarios");
        entrada.comentarios.forEach(comentario =>{
            const p = document.createElement("p");
            p.classList.add("comentario");
            p.textContent = comentario;
            comentariosDiv.appendChild(p);
        })
        const likeDiv = div.querySelector(".likes");
        likeDiv.onclick = () => {
            adicionarLike(entrada.id);
        }

        const btnEnviar = div.querySelector(".novo-comentario button");
        const inputComentario = div.querySelector(".novo-comentario input");
        btnEnviar.onclick = () => {
            const textoComentario = inputComentario.value.trim();

            if(textoComentario){
                adicionarComentario(entrada.id, textoComentario);
                inputComentario.value = "";
            }
        }
    })
}

function adicionarLike(id){
    const entradas = JSON.parse(localStorage.getItem("diarioEmocoes"))|| [];
    const index = entradas.findIndex(e => e.id === id);
    if(index !== -1){
        entradas[index].likes++;
        localStorage.setItem("diarioEmocoes", JSON.stringify(entradas));
        mostrarEntradas();
    }
}

function adicionarComentario(id, texto){
     const entradas = JSON.parse(localStorage.getItem("diarioEmocoes"))|| [];
    const index = entradas.findIndex(e => e.id === id);
    if(index !== -1){
        entradas[index].comentarios.push(texto);
        localStorage.setItem("diarioEmocoes", JSON.stringify(entradas));
        mostrarEntradas();
    }
}

const frasesMotivacionais = {
    Feliz:[
        "Que bom que você está feliz! Continue espalhando essa energia positiva!",
        "Sorria, a vida é bela e cheia de oportunidades!",
        "Continue assim, com essa vibe positiva que contagia!",
    ],

    Neutro:[
        "Um dia de cada vez, pequenos passos também levam longe.",
        "Respire fundo e busque o que te faz bem!",
        "Que hoje você encontre motivos para sorrir e se sentir leve.",
    ],

    Triste:[
        "Tudo passa, mantenha a esperança e acredite em dias melhores.",
        "Você é mais forte do que imagina. Vá com calma e se cuide!",
        "Após a tempestade vem o arco-íris, confie no seu poder de superação.",
    ]
}

function mostrarFrase(){
    const entradas = JSON.parse(localStorage.getItem("diarioEmocoes"))|| [];

    if(entradas.lehgth === 0){
        alert("Ainda não há entradas no Diário");
        return;
    }

    const ultimoHumor = entradas[0].humor;
    const frases = frasesMotivacionais[ultimoHumor] || frasesMotivacionais.Neutro;
    const fraseEscolhida = frases[Math.floor(Math.random()*frases.lehgth)];
    const pFrase = document.getElementById("fraseMotivacional");
    pFrase.textContent = fraseEscolhida;

    if('speechSynthesis' in window){
        const utterance = new SpeechSynthesisUtterance(fraseEscolhida);
        utterance.lang = 'pt-BR';
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }
}

function inicializarData(){
    const dataInput = document.getElementById("data");
    dataInput.value = new Date().toISOString().slice(0,16);
}

window.onload = () => {
    inicializarData();
    mostrarEntradas();
}