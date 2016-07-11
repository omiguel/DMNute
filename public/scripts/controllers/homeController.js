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
    $scope.arvoremapas = [];
    $scope.mapasfilho = [];
    $scope.alldisps = [];

    me.mostraclicado = function(mapa){
        $scope.mapa = mapa;
        SIOM.emit('mapaatual', $scope.mapa);
    };

    var montapartearvore = function (idmapa, arraymapas, cb) {
        var filhos = [];
        for(var map in arraymapas){
            if(arraymapas[map].pai == idmapa){
                if(arraymapas[map].ehapai){
                    montapartearvore(arraymapas[map]._id, arraymapas, function (filfilho) {
                        arraymapas[map].filhos = filfilho;
                        filhos.push(arraymapas[map]);
                        $scope.mapasfilho.push(arraymapas[map]);
                    })
                } else {
                    arraymapas[map].disps = [];
                    filhos.push(arraymapas[map]);
                    $scope.mapasfilho.push(arraymapas[map]);
                }
            }
        }

        cb(filhos);

    };

    me.setMapas = function(msg){
        $scope.mapa = {};
        $scope.mapas = [];
        $scope.arvoremapas = [];
        $scope.mapasfilho = [];
        $scope.alldisps = [];
        
        var allmapas = msg.getDado();
        $scope.mapas = allmapas;

        for(var index in allmapas){

            if(allmapas[index].ehapai && !allmapas[index].pai){
                montapartearvore(allmapas[index]._id, allmapas, function (filhos) {
                    allmapas[index].filhos = filhos;
                    $scope.arvoremapas.push(allmapas[index]);
                });
            }

        }

        var mapa = {
            img: '/image/mapa/marca.png',
            nome: 'Cadevice'
        };
        $scope.mapa = mapa;
        $scope.m
        SIOM.emit('start', $scope.mapa.img);
        var dispositivos = new Mensagem(me, 'dispositivocomplete.read', {}, 'dispositivo');
        SIOM.emitirServer(dispositivos);
    };

    $scope.setmapainicio = function () {
        closeallmapas(function () {
            var mapa = {
                img: '/image/mapa/marca.png',
                nome: 'Cadevice'
            };
            $scope.mapa = mapa;
            SIOM.emit('mapaatual', $scope.mapa);
        });
    };

    var closeallmapas = function (cb) {
        for(var map in $scope.mapas){
            $scope.mapas[map].atual = false;
        }

        cb();
    };

    me.setDisps = function(msg){
        $scope.alldisps = msg.getDado();
        for(var disp in $scope.alldisps){
            if($scope.alldisps[disp].mapa){
                $scope.alldisps[disp].cor = 'color:blue';
                for(var map in $scope.mapasfilho){
                    if($scope.mapasfilho[map]._id == $scope.alldisps[disp].mapa._id){
                        $scope.mapasfilho[map].disps.push($scope.alldisps[disp]);
                    }
                }
            } else{
                $scope.alldisps[disp].cor = 'color:red';
            }
        }

        SIOM.emit('mapasprontos', $scope.mapas);
        $scope.$apply();
    };

    me.fazPedidos = function(){
        var solicitacoes = {
            mapas: new Mensagem(me, 'mapa.read', {}, 'mapa')
        };

        for(var pedido in solicitacoes){
            SIOM.emitirServer(solicitacoes[pedido]);
        }

    };

    me.destroy = function(){
        for(var name in me.listeners){
            SIOM.removeListener(name, me.listeners[name]);
        }
    };

    me.fechamodal = function () {
        $scope.mapa = {};
        $scope.mapas = [];
        $scope.arvoremapas = [];
        $scope.mapasfilho = [];
        $scope.alldisps = [];
        me.fazPedidos();
        $('#showdatamap').modal('toggle');
    };

    me.wiring = function(){
        me.listeners['mapa.readed'] = me.setMapas.bind(me);
        me.listeners['dispositivo.readed'] = me.setDisps.bind(me);
        me.listeners['mapadel.destroied'] = me.fechamodal.bind(me);
        me.listeners['novoMapa'] = me.fazPedidos.bind(me);
        me.listeners['mapaup.updated'] = me.fechamodal.bind(me);
        me.listeners['mapadel.deleted'] = me.fechamodal.bind(me);
        me.listeners['trocamapa'] = me.mostraclicado.bind(me);

        for(var name in me.listeners){
            SIOM.on(name, me.listeners[name]);
        }

        SIOM.emit('entrouusuario', me);

        me.fazPedidos();
    };

    me.wiring();

}]);