const ref = db.ref("funcionários");

let idcapturado = null;

$("#cancelar").hide();

$("#salvar").click(function () {
    // Pegamos os valores das caixas de texto normalmente (menos o ID no salvar)
    let nome = $("#nome").val().toUpperCase();
    let salario = $("#salario").val();
    let cargo = $("#cargo").val().toLowerCase();

    // Removemos o "id ===" daqui para o alerta não travar o salvamento
    if(nome === "" || salario === "" || cargo === ""){
       alert('Preencha todos os campos');
       return;
    }

    if (idcapturado){ // editar
        // Na edição, mantemos a atualização direta no ID que já existe
        ref.child(idcapturado).update({nome, salario, cargo});
        resetar();
    } else { // salvar
        // SOLUÇÃO: Usamos o push() para o Firebase criar uma chave longa e aleatória automaticamente
        ref.push({nome, salario, cargo});
        limpar();
    }
});

// Escuta no formato `.on("value")` exatamente igual ao seu estilo original
ref.on("value", dados_tabela2 => {
     $("#lista2").empty();

     $("#lista2").append(`
        <tr>
             <th>ID </th>
             <th>Nome</th>
             <th>Salário</th>
             <th>Cargo</th>
             <th colspan="2">Opções</th>         
        </tr>
     `);

    dados_tabela2.forEach(registro2 => {
        let reg = registro2.val();
        let id = registro2.key; // Captura a chave aleatória que o Firebase gerou   

        $("#lista2").append(`
            <tr>
                  <!-- Exibe a chave aleatória na coluna ID da tabela -->
                  <td>${id}</td>            
                  <td>${reg.nome}</td>
                  <td>R$ ${parseFloat(reg.salario).toFixed(2)}</td>
                  <td>${reg.cargo}</td>

                  <td>
                      <button class="btn btn-danger btn-sm" onclick="excluir('${id}')">
                          <i class="bi bi-trash"></i>
                      </button>
                  </td>

                  <td>
                      <button class="btn btn-outline-warning btn-sm" onclick="editar('${id}','${reg.nome}','${reg.salario}','${reg.cargo}')">
                          <i class="bi bi-pencil"></i>
                      </button>
                  </td>
            </tr>
        `);
    });
});

function limpar() {
    $("#number").val(""); // Limpa o campo caso ele exiba algo na edição
    $("#nome").val("");
    $("#salario").val("");
    $("#cargo").val("");
    $("#nome").focus(); // Foca direto no Nome, já que o ID é automático
}

function editar(id, nome, salario, cargo){
    // Ao clicar no lápis, jogamos o ID aleatório dentro da caixa desativada para visualização
    $("#number").val(id);
    $("#nome").val(nome);
    $("#salario").val(salario);
    $("#cargo").val(cargo);

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
        db.ref("funcionários/" + id).remove();
    }
}
