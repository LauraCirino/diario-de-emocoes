function analisarHumor(texto){
    const positivo = ["feliz","alegre","animado","grato","otimo","bem","contente","calmo"];
    const negativo = ["triste","cansado","chateado","pessimo","mal","deprimido","ancioso","estressado","raiva"]
    const textMin = texto.toLowerCase();
    let score = 0
    
    positivo.forEach(palavra => {
        if(textoMin.includes(palavra)) score++;
    })

     negativo.forEach(palavra => {
        if(textoMin.includes(palavra)) score--;
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

}