import express, { query } from 'express';
import cors from 'cors';
import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: "./.env.production" });

const app = express();
app.use(express.json());
app.use(cors());

const { Pool }= pg;

const pool = new Pool({
  user: 'postgres',
  port: '5432',
  host: 'localhost',
  database: 'brinquedo',
  password: 'bigongo40'
});

const testarConexao = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Conexão bem-sucedida", res.rows[0]);
  } catch (err) {
    console.error("error ao conectar com banco de dados", err);
  }
};

testarConexao();

app.put('/putBrinquedo', async (req, res) => {
  try {
    const {       
      nome,
      descricao,
      preco,
      quantidadeEmEstoque,
      categoria,
      fornecedor,
      dataValidade,
      urlImagem 
    } = req.body;

    const brinquedo = await pool.query(
      "INSERT INTO produtos (nome, descricao, preco, quantidade_em_estoque, categoria, fornecedor, data_validade, url_imagem) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [nome, descricao, preco, quantidadeEmEstoque, categoria, fornecedor, dataValidade, urlImagem]
    );
    res.status(200).json(brinquedo.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/getTudo', async (req, res) => {
  try {
    const brinquedos = await pool.query( 
      "SELECT * FROM produtos ORDER BY id"
    );
    console.log(brinquedos.rows)
    res.status(200).json(brinquedos.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/apagar', async (req, res) => {
  try {
    const { id }= req.body;
    const deletar = await pool.query( 
      "DELETE FROM produtos WHERE id=$1 RETURNING *",
      [id]
    );
    res.status(200).json(deletar);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/brinquedos/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nome, descricao, preco, quantidade_em_estoque, 
      fornecedor, url_imagem } = req.body

    const updProduto = await pool.query(
      `UPDATE produtos SET
      nome = $1, descricao = $2, preco = $3,
      quantidade_em_estoque = $4, fornecedor = $5, url_imagem = $6
      WHERE id=$7 RETURNING *`,
      [nome, descricao, preco, quantidade_em_estoque, fornecedor, url_imagem, id]
    )
    if (updProduto.rows === 0) {
      res.status(404).json({ message: "Produto não encontrado" })
    }
    res.status(200).json(updProduto.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
});

const port = 9000;
app.listen(port, () => {
  console.log("O server está funcionando!");
});