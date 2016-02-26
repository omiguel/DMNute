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
    $scope.alldisps = [];

    $scope.mostraclicado = function(){
        for(var index in $scope.mapas){
            $scope.mapas[index].atual = false;
        }
    };

    me.setMapas = function(msg){
        $scope.mapas = msg.getDado();
        for(var index in $scope.mapas){
            $scope.mapas[index].disps = [];
        }
        $scope.mapa = msg.getDado()[0];
        SIOM.emit('start', $scope.mapa.img);
        var dispositivos = new Mensagem(me, 'dispositivocomplete.read', {}, 'dispositivo');
        SIOM.emitirServer(dispositivos);
    };

    me.setDisps = function(msg){
        $scope.alldisps = msg.getDado();
        for(var disp in $scope.alldisps){
            if($scope.alldisps[disp].mapa){
                $scope.alldisps[disp].cor = 'color:blue';
                for(var map in $scope.mapas){
                    if($scope.mapas[map]._id == $scope.alldisps[disp].mapa._id){
                        $scope.mapas[map].disps.push($scope.alldisps[disp]);
                    }
                }
            } else{
                $scope.alldisps[disp].cor = 'color:red';
            }
        }
        SIOM.emit('mapasprontos', $scope.mapas);
        $scope.$apply();
        console.log('depois do $apply', $scope.mapas);
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

    me.wiring = function(){
        me.listeners['mapa.readed'] = me.setMapas.bind(me);
        me.listeners['dispositivo.readed'] = me.setDisps.bind(me);
        me.listeners['novoMapa'] = me.fazPedidos.bind(me);

        for(var name in me.listeners){
            SIOM.on(name, me.listeners[name]);
        }

        SIOM.emit('entrouusuario', me);

        me.fazPedidos();
    };

    me.wiring();

}]);