const ref = db.ref("cliente");
 
let idcapturado = null;
 
$("#salvar").click(function () {
    // Pegamos os valores normais (menos o campo ID no momento de salvar)
    let nome = $("#nome").val().toUpperCase();
    let email = $("#email").val().toLowerCase(); 
    let telefone = $("#telefone").val(); 
 
    // Removemos a verificação do "id ===" para permitir o salvamento automático
    if(nome === "" || email === "" || telefone === ""){
       alert('Preencha todos os campos');
       return;
    }
 
    if (idcapturado){//editar
        // Na edição, atualizamos diretamente o nó com a chave aleatória existente
        ref.child(idcapturado).update({nome, email, telefone});
        resetar();
    } else{//salvar
        // O push() gera uma chave única longa e grava os dados dentro dela
        ref.push({nome, email, telefone });
    }
 
    limpar();
});
 
ref.on("value", dados_tabela => {
     $("#lista").empty();
 
     $("#lista").append(`
        <tr>
             <th>ID (Firebase)</th>
             <th>Nome</th>
             <th>E-mail</th>
             <th>Telefone</th>
             <th colspan="2">Opções</th>        
        </tr>
     `);
 
    dados_tabela.forEach(registro => {
        let reg = registro.val();
        let id = registro.key;  // Captura a chave aleatória criptografada gerada pelo banco
 
        $("#lista").append(`
            <tr>
                  <!-- Exibe a chave única do Firebase diretamente na primeira coluna -->
                  <td>${id}</td>            
                  <td>${reg.nome}</td>
                  <td>${reg.email}</td>
                  <td>${reg.telefone}</td>
 
                  <td>
                      <button class="btn btn-danger btn-sm" onclick="excluir('${id}')">
                          <i class="bi bi-trash"></i>
                      </button>
                  </td>
 
                  <td>
                      <button class="btn btn-outline-warning btn-sm" onclick="editar('${id}','${reg.nome}','${reg.email}','${reg.telefone}')">
                          <i class="bi bi-pencil"></i>
                      </button>
                  </td>
            </tr>
        `);
    });
 
});
 
function limpar() {
    $("#id").val(""); // Limpa o campo de ID que é alimentado apenas na edição
    $("#nome").val("");
    $("#email").val("");
    $("#telefone").val("");
    $("#nome").focus(); // Altera o foco para o Nome, já que o ID agora é gerado automaticamente
    
    $("#cancelar").hide(); 
}
 
function editar(id, nome, email, telefone){
    // Exibe o ID aleatório dentro da caixinha desativada do HTML para visualização
    $("#id").val(id);
    $("#nome").val(nome);
    $("#email").val(email);
    $("#telefone").val(telefone);
 
    idcapturado = id;
   
    $("#cancelar").show(); 
 
    $("#salvar")
    .text("atualizar")
    .removeClass("btn-primary")
    .addClass("btn-success");
 
    $("#status").text("Editando registro....");
}
 
function resetar(){
    idcapturado = null;
    limpar();
    $("#status").text("");
    $("#salvar")
            .text("salvar")
            .removeClass("btn-success")
            .addClass("btn-primary");
            
    $("#cancelar").hide(); 
}
 
$("#cancelar").click(function (){
    resetar();
});
 
function excluir(id){
    if(confirm("Tem certeza que deseja excluir?"))
    {
        db.ref("cliente/"+ id).remove();
    }
}
