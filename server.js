const express = require('express');
const http = require('http');
const app = express();
const path = require('path');

const server = http.createServer(app); //cria o servidor socket
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public'))); //configurando o diretorio do index.html
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile); //habilitando o uso de html no node atraves da biblioteca ejs
app.set('view engine', 'html');


app.use('/', (req, res) => {
    res.render('index.html'); //renderizando o html
});

let messages = []; //array que armazena as mensagens

io.on('connection', socket => {
    console.log('Usuário conectado:[ID]', socket.id); //mostra no servidor quando um usuário se conecta e informa o id dele
    socket.emit('previousMessages', messages); //encaminha todas as mensagens ja enviadas 

    socket.on('sendMessage', data => {
        console.log(data); //exibe a mensagem enviada no servidor
        messages.push(data); //armazena a mensagem no array
        socket.broadcast.emit('receivedMessage', data) //Envia a mensagem para todos conectados na aplicação
    });
});

server.listen(5000, () => { //configuração da porta 
    console.log('Servidor rodando na porta: 5000');
});