/**
 * Created by Osvaldo on 21/10/15.
 */

var hub = require('../hub/hub.js');
var Mensagem = require('../util/mensagem.js');

var bdteste = function(){
    var me = this;
    console.log("iniciei o teste do banco");
    me.listeners = {};

    me.mapas = [];
    me.situacoes = [];
    me.modelos = [];

    me.wiring();
};

bdteste.prototype.criaUsers = function(){
    var me = this;

    var users = [];

    var userRoot = {
        login: 'admin',
        senha: 'admin',
        tipo: 0,
        nome: 'Osvaldo',
        setor: 'suporte',
        email: 'osvaldo.miguel@grad.ufsc.br',
        ramal: '1963',
        imagem: '../image/userImagem/osvaldo.JPG'
    };
    users.push(userRoot);

    var userAdmin = {
        login: 'tobias',
        senha: 'tobias',
        tipo: 1,
        nome: 'Tobias',
        setor: 'Financeiro',
        email: 'tobias@tobias.com',
        ramal: '1964',
        imagem: '../image/userImagem/tobias.JPG'
    };
    users.push(userAdmin);

    var comum1 = {
        login: 'basilio',
        senha: 'basilio',
        tipo: 1,
        nome: 'Basilio',
        setor: 'Portaria',
        email: 'basilio@basilio.com',
        ramal: '1965',
        imagem: '../image/userImagem/basilio.PNG'
    };
    users.push(comum1);

    var comum2 = {
        login: 'artrides',
        senha: 'artrides',
        tipo: 1,
        nome: 'Artrides',
        setor: 'Secretaria',
        email: 'artrides@artrides.com',
        ramal: '1966',
        imagem: '../image/userImagem/artrides.PNG'
    };
    users.push(comum2);

    var userMsg = new Mensagem(me, 'banco.usuario.create', users, 'usuario');
    hub.emit(userMsg.getEvento(), userMsg);
};

bdteste.prototype.retUserCreate = function(msg){
    var me = this;
    me.criaMapa();
};

bdteste.prototype.criaMapa = function(){
    var me = this;

    var mapas = [
        {
            nome: 'meu mapa',
            img: '../image/terreo.JPG'
        },
        {
            nome: 'mapa lindo',
            img: '../image/pavimento_1_andar.JPG'
        },
        {
            nome: 'mapa locao',
            img: '../image/avignon_planta_11_andar.JPG'
        }
    ];

    var msg = new Mensagem(me, 'banco.mapa.create', mapas, 'mapa');

    hub.emit(msg.getEvento(), msg);
};

bdteste.prototype.retMapaCreate = function(msg){
    var me = this;
    me.mapas = msg.getDado();
    me.criaSituacao();
};

bdteste.prototype.criaSituacao = function(){
    var me = this;

    var situacoes = [
        {
            nome: 'Em uso'
        },
        {
            nome: 'Com defeito'
        },
        {
            nome: 'Guardado'
        },
        {
            nome: 'Em manutencao'
        }
    ];

    var msg = new Mensagem(me, 'banco.situacao.create', situacoes, 'situacao');

    hub.emit(msg.getEvento(), msg);
};

bdteste.prototype.retSituacaoCreate = function(msg){
    var me = this;
    me.situacoes = msg.getDado();
    me.criaModeloDisp();
};

bdteste.prototype.criaModeloDisp = function(){
    var me = this;
    var modelos = [
        {
            tipodisp: 'monitor',
            marca: 'samsung',
            modelo: 'ss22c300'
        },
        {
            tipodisp: 'micro',
            marca: 'sony',
            modelo: 'vpcz1'
        },
        {
            tipodisp: 'telefone',
            marca: 'intelbras',
            modelo: 'advancedtie 103'
        }
    ];

    var msg = new Mensagem(me, 'banco.modelodisp.create', modelos, 'modelodisp');

    hub.emit(msg.getEvento(), msg);
};

bdteste.prototype.retModeloDispCrete = function(msg){
    var me = this;
    me.modelos = msg.getDado();
    me.criaDispositivo();
};

bdteste.prototype.criaDispositivo = function(){
    var me = this;
    console.log('mapas', me.mapas);
    console.log('situacoes', me.situacoes);
    console.log('modelodisp', me.modelos);
};

bdteste.prototype.wiring = function(){
    var me  = this;
    me.listeners['banco.ready'] = me.criaUsers.bind(me);
    me.listeners['usuario.created'] = me.retUserCreate.bind(me);
    me.listeners['mapa.created'] = me.retMapaCreate.bind(me);
    me.listeners['situacao.created'] = me.retSituacaoCreate.bind(me);
    me.listeners['modelodisp.created'] = me.retModeloDispCrete.bind(me);

    for(var name in me.listeners){
        hub.on(name, me.listeners[name]);
    }
};

module.exports = new bdteste();