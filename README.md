Cadastro de ProdutosUm projeto simples pra praticar a integração entre um backend em Node.js com Express e um frontend básico em HTML, CSS e JavaScript puro.💡 SobreA ideia foi criar um CRUD básico (por enquanto com foco em criação e listagem) onde dá pra cadastrar itens informando nome, preço e quantidade.Pra não precisar configurar um banco de dados completo (como PostgreSQL ou MongoDB) logo de cara, os dados ficam salvos em um arquivo .json local. Serve perfeitamente pra entender na prática como funcionam as requisições HTTP (GET e POST), manipulação do DOM e leitura/escrita de arquivos com o Node.🛠️ TecnologiasBackend: Node.js, ExpressFrontend: HTML5, CSS3, JavaScript (Vanilla)Persistência: JSON (Fs module)📁 Estrutura de PastasPlaintext.
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── bancoDeDadosFalso.json
├── package.json
└── server.js
🚀 Como rodar na sua máquinaClone o repositório e instale as dependências:Bashnpm install
Suba o servidor local:Bashnpm start
Abra o navegador em:Plaintexthttp://localhost:3000
📌 Rotas da APIMétodoRotaDescriçãoGET/produtosRetorna a lista completa de produtosPOST/produtosCadastra um novo produtoExemplo do payload para o POST /produtos:JSON{
  "nome": "Teclado Mecânico",
  "preco": 199.90,
  "quantidade": 5
}
⚠️ Validações e LimitaçõesO servidor bloqueia campos vazios ou formatos inválidos (preço precisa ser positivo, quantidade deve ser número inteiro).
