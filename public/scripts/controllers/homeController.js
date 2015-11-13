/**
 * Created by Osvaldo on 23/09/15.
 */

app.controller("homeController",['$scope', "$location", 'getUserLogado', function ($scope, $location, getUserLogado) {
    var me = this;

    me.listeners = {};

    $scope.userLogado = getUserLogado.getLogado();
    $scope.listaestoque = 'essa é a lista do estoque';
    $scope.listageral = 'lista geralllll';
    $scope.mapa = {};
    $scope.mapas = [];
//    $scope.mapas = [
//        {
//            nome: 'meu mapa',
//            tipomapa: 'mapamund',
//            disps: [
//                {nome: 'disp1'},
//                {nome: 'disp2'},
//                {nome: 'disp3'}
//            ],
//            atual: true,
//            img: '../image/terreo.JPG'
//        },
//        {
//            nome: 'mapa lindo',
//            tipomapa: 'mapa do brasil',
//            disps: [
//                {nome: 'disp11'},
//                {nome: 'disp12'},
//                {nome: 'disp13'}
//            ],
//            atual: false,
//            img: '../image/pavimento_1_andar.JPG'
//        },
//        {
//            nome: 'mapa locao',
//            tipomapa: 'mapa de santacatarina',
//            disps: [
//                {nome: 'disp21'},
//                {nome: 'disp22'},
//                {nome: 'disp23'}
//            ],
//            atual: false,
//            img: '../image/avignon_planta_11_andar.JPG'
//        }
//    ];

    $scope.alldisps = [
        {nome: 'disp1'},
        {nome: 'disp2'},
        {nome: 'disp3'},
        {nome: 'disp11'},
        {nome: 'disp12'},
        {nome: 'disp13'},
        {nome: 'disp21'},
        {nome: 'disp22'},
        {nome: 'disp23'}
    ];

    $scope.mostraclicado = function(){
        for(var index in $scope.mapas){
            $scope.mapas[index].atual = false;
        }
    };

    me.setMapas = function(msg){
        $scope.mapas = msg.getDado();
        $scope.mapa = msg.getDado()[0];
        SIOM.emit('start', $scope.mapa.img);
        $scope.$apply();
    };

    me.setDisps = function(msg){
        console.log('esses dips chegaram do banco', msg);
    };

    me.fazPedidos = function(){
        var solicitacoes = {
            mapas: new Mensagem(me, 'mapa.read', {}, 'mapa'),
            dispositivos: new Mensagem(me, 'dispositivo.read', {}, 'dispositivo')
        };

        for(var pedido in solicitacoes){
            SIOM.emitirServer(solicitacoes[pedido]);
            console.log('era pra mandar isso', pedido, solicitacoes[pedido]);
        }

    };

    me.wiring = function(){

        me.listeners['mapa.readed'] = me.setMapas.bind(me);
        me.listeners['dispositivo.readed'] = me.setDisps.bind(me);

        for(var name in me.listeners){
            SIOM.on(name, me.listeners[name]);
        }

        me.fazPedidos();
    };

    me.wiring();

}]);