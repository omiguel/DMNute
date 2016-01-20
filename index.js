/**
 * Created by Osvaldo Miguel Junior on 22/07/15.
 */
var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var rtcLogin = require('./rtc/rtcLoginManager.js');
var banco = require('./db/');
var fs = require('fs');
var busboy = require('connect-busboy');

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname + '/views'));
app.use(express['static'](path.resolve(__dirname+ '/public')));

app.use(busboy());

io.on('connection',function(socket){
    new rtcLogin({socket: socket});
});

http.listen(80, function(err){
    console.log("Rodando na porta 80", err);
});

app.use('/image', express.static(path.resolve(__dirname + '/image/')));

/**
 * POST usado para dar update ou salvar as imagens no servidor;
 */
app.post('/upimage', function(req, res){

    var localFile; //recebe a imagem do cliente.
    var id; //recebe o objectID gerado pelo mongo, pois a imagem é a ultima coisa a ser salva e cada objeto tem apenas uma imagem;
    var localFilename; // recebe o nome da imagem enviada pelo cliente, é usada para poder pegar a extencao
    var doque; //no cliente tem que passar do que é a imagem, se de mapa ou de usuario, nesse caso, se precisar colocar outro tipo de objeto, precisamos apenas acrecentar um atributo no objeto dentro da funcao.
    var localSave; //recebe o local onde a imagem sera salva.
    var fstream; //usado para verificar quando a imagem e totalmente upada, quando o fs terminar de salvar a imagem ele nos avisa e podemos finalizar o post com isso.

    /**
     * funcao que salva a imagem e avisa ao cliente que terminou.
     */
    var salvaImagem = function(){
        fstream = fs.createWriteStream(__dirname + localSave);
        localFile.pipe(fstream);
        fstream.on('close', function(){
            res.end('{"success":"true", "error":"null", "localImagem":"'+localSave+'"}');
            //todo, aqui temos o objectID e a flag, quando a imagem terminar de ser salva, dar um update no banco para atualizar o caminho.
            localFile = null;
            id = null;
            localFilename = null;
            doque = null;
            localSave = null;
            fstream = null;
        });
    };

    /**
     * atraves da variavel doque, podemos saber onde esta imagem vai ser salva, com isso criamos o caminho correto para
     * savar a imagem e chamamos a funcao que salva apos a criacao do caminho.
     */
    var pegaCaminho = function(){
        var caminho = {
            usuario: '/image/userImagem/',
            mapa: '/image/mapa/',
            dispositivo: '/image/dispositivo/'
        };
        localSave = caminho[doque]+id+path.extname(localFilename);
        salvaImagem();
    };

    /**
     * funcao que verifica se todas as variaveis que precisamos já tem os dados, se sim chama a funcao que seta o caminho
     * correto.
     */
    var verificaSeOk = function(){
        if(localFile && localFilename && id && doque){
            pegaCaminho();
        }
    };

    /**
     * com esse listener, verificamos setamos os valores quem vem nos fildes e que nos interessam nas variaveis corretas.
     */
    req.busboy.on('field', function(label, value){
        console.log("field", label, value);
        if(label == 'id'){
            id = value;
            verificaSeOk();
        }else if(label == 'doque'){
            doque = value;
            verificaSeOk();
        }
    });

    /**
     * com esse leistener pegamos o file e o nome e setamos nas variaveis corretas.
     */
    req.busboy.on('file', function (fieldname, file, filename) {
        localFile = file;
        localFilename = filename;
        verificaSeOk();
    });

    req.pipe(req.busboy);
});