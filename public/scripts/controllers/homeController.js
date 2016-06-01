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
                    console.log('entrei no if da recursao', arraymapas[map], 'id do pai', idmapa);
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

        $scope.mapa.img = '/image/mapa/marca.png';
        SIOM.emit('start', $scope.mapa.img);
        var dispositivos = new Mensagem(me, 'dispositivocomplete.read', {}, 'dispositivo');
        SIOM.emitirServer(dispositivos);
    };

    me.setDisps = function(msg){
        $scope.alldisps = msg.getDado();
        console.log('setando os disps');
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
        console.log('vou dar apply');
        SIOM.emit('mapasprontos', $scope.mapas);
        $scope.$apply();
        console.log('todos os mapas', $scope.mapas);
        console.log('arvore mapas', $scope.arvoremapas);
        console.log('mapas filho', $scope.mapasfilho);
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
        me.listeners['trocamapa'] = me.mostraclicado.bind(me);

        for(var name in me.listeners){
            SIOM.on(name, me.listeners[name]);
        }

        SIOM.emit('entrouusuario', me);

        me.fazPedidos();
    };

    me.wiring();

}]);