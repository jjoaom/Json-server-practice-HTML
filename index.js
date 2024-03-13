// Trabalho Interdisciplinar 1 - Aplicações Web
//
// Esse módulo implementa uma API RESTful baseada no JSONServer
//
// Para montar um servidor para o seu projeto, acesse o projeto 
// do JSONServer no Replit, faça o FORK do projeto e altere o 
// arquivo db.json para incluir os dados do seu projeto.




const jsonServer = require('json-server')
const cors = require('cors');
const server = jsonServer.create()
const router = jsonServer.router('db.json')

// Para permitir que os dados sejam alterados, altere a linha abaixo
// colocando o atributo readOnly como false.
const middlewares = jsonServer.defaults({ readOnly: true })

server.use(cors());
server.use(middlewares)
server.use(router)
server.listen(3001, () => {
  console.log('JSON Server is running')
})

