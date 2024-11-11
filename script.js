let table = document.getElementById('tbody');
const div = document.getElementById('divEditar');
const url = 'http://localhost:9000';
let nomeEditar = document.getElementById("nome-editar")
let descricaoEditar = document.getElementById("descricao-editar")
let precoEditar = document.getElementById("preco-editar")
let estoqueEditar = document.getElementById("estoque-editar")
let fornecedorEditar = document.getElementById("fornecedor-editar")
let imagemEditar = document.getElementById("imagem-editar")
const formularioEditar = document.getElementById('formulario-editar')
let idAtual = 0;

async function fazerFetch(site, metodo, produto) {
  try {
    if (metodo == 'GET') {
      const response = await fetch(`${url}/${site}`, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } else {
      const response = await fetch(`${url}/${site}`, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto) ,
      });
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.error(err);
  }
}

async function getAll() {
  table.innerHTML = '';
  const data = await fazerFetch('getTudo', 'GET', '');
  data.map((index) => {
    const {
      id,
      nome,
      descricao,
      preco,
      quantidade_em_estoque,
      categoria,
      fornecedor,
      data_validade,
      url_imagem
    } = index;
    
    table.innerHTML += `
      <tr>
        <td><img src='${url_imagem}' style="width: 100px"></td>
        <td>${nome}</td>
        <td>${descricao}</td>
        <td>R$${preco}</td>
        <td>${quantidade_em_estoque}</td>
        <td>${fornecedor}</td>
        <td>
          <button class='botao botao-acoes' onclick="editar(${id})">Editar</button><br>
          <button class='botao botao-acoes' onclick="deletar(${id})">Deletar</button>
        </td>
      </tr>`;
  });
};

async function deletar(id) {
  try {
    const data = await fazerFetch('apagar', 'DELETE', {id: id});
    getAll();
  } catch (error) {
    console.log(error);
  }
}

async function editar(id) {
  div.style.display = "flex"

  const btnFechar = document.getElementById("fechar-editar")
  if (btnFechar) {
    btnFechar.addEventListener("click", (e) => {
      div.style.display = "none"
    })
  }

  try {
    const produto = await fazerFetch('getTudo', 'GET', '')
    produto.map((index) => {
      if (index.id == id) {
        if (index) {
          nomeEditar.value = index.nome
          descricaoEditar.textContent = index.descricao
          precoEditar.value = index.preco
          estoqueEditar.value = index.quantidade_em_estoque
          fornecedorEditar.value = index.fornecedor
          imagemEditar.value = index.url_imagem
        } else {
          alert("Não foi possível encontrar o produto")
        }
        idAtual = id;
      }
    });
  } catch (error) {
    console.error(error)
  }
}

if (formularioEditar) {
  formularioEditar.addEventListener("submit", async (e) => {
    e.preventDefault()
  
    const brinquedo = {
      nome: nomeEditar.value,
      descricao: descricaoEditar.textContent,
      preco: precoEditar.value,
      quantidade_em_estoque: estoqueEditar.value,
      fornecedor: fornecedorEditar.value,
      url_imagem: imagemEditar.value
    }

    const res = await fazerFetch(`brinquedos/${idAtual}`, 'PUT', brinquedo);

    if (res) {
      div.style.display = "none"
      getAll();
    } else {
      alert("Erro ao atualizar dados")
    }
  })          
}

const cadastrar = document.getElementById('cadastrar');
cadastrar.addEventListener('click', () => {
  window.location.href = './cadastrar/index.html';
});

window.onload = getAll();