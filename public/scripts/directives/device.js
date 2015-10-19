'use strict';

app.directive('tanque', function(xasanCrud,xasanValues, xasanCompiler, xasanFunctions){

    return{
        scope:{
            uid : '=',
            config : '=',
            dispositivo: '=',
            destroy:'&'
        },
        restrict: 'E',
        replace:true,
        templateUrl:'partials/tanque.html',

        controller : function($scope){
            $scope.xasanValues = xasanValues;
            //quando destruir tem que parar, ver uma forma melhor de fazer, baita de uma gambiarra pra fazer o bind.
            /*$scope.intervalAtualiza = setInterval(function(){
             $scope.$apply(function(){ /*console.log("KK")});*/
            /*$scope.erro = $scope.dispositivo.erro;
             console.log("valor da leitura", $scope.dispositivo.volume);
             },800);*/
            $scope.teste = $scope.dispositivo.teste;
            $scope.xasanValues = xasanValues;
            $scope.listeners = {};
            $scope.alertas = {};
            $scope.mostraErro = function(){
                var me = this;
                if($scope.dispositivo.erro == 3){
                    bootbox.dialog({
                        message: "Falha de comunicação com o dispositivo",
                        title: "Log de erro",
                        buttons: {
                            "Ok": {
                                className: "btn-primary",
                                callback: function() {

                                }
                            }
                        }
                    });
                }else if($scope.dispositivo.erro == 4){
                    bootbox.dialog({
                        message: "Falha no dispositivo de leitura",
                        title: "Log de erro",
                        buttons: {
                            "Ok": {
                                className: "btn-primary",
                                callback: function () {

                                }
                            }
                        }
                    });
                }
                else if($scope.dispositivo.erro == 2){
                    bootbox.dialog({
                        message: "Barreira sem energia",
                        title: "Log de erro",
                        buttons: {
                            "Ok": {
                                className: "btn-primary",
                                callback: function () {

                                }
                            }
                        }
                    });
                }
            };
            $scope.calculaPorcentoVolume = function(){
                //Transforma mm para m
                var altlarg = $scope.dispositivo.config.larguraAltura / 1000;
                //Transforma diametro em mm para raio em m
                var raio = ($scope.dispositivo.config.diametro/1000) / 2;
                //por ser em m³, 1 m³ == 1000L
                var volumeTotal = (Math.PI * Math.pow(raio, 2) * altlarg) * 1000;
                //Calcula a porcentagem do tanque que está cheia
                return  isNaN(($scope.dispositivo.volume / volumeTotal) * 100) ? 0 : ($scope.dispositivo.volume / volumeTotal) * 100;
            };
            $scope.calculaVolume = function(){
                var porcentagem = $scope.calculaPorcentoVolume();

                //Pega a parte inteira da porcentagem
                var indiceImg = parseInt(porcentagem/10);
                //Arredonda para cima caso o resto seja > 5, para ficar multiplo de 10
                return porcentagem % 10 > 5 ? ++indiceImg : indiceImg;
            };

            $scope.criaTanque = function(){
                xasanCrud.create('tanque',
                    {
                        id: $scope.config.id,
                        idmapa:$scope.config.idmapa,
                        height:$scope.config.height,
                        width:$scope.config.width,
                        posx:$scope.config.posx,
                        posy:$scope.config.posy,
                        iddispositivo:$scope.config.iddispositivo
                    }, null, function(ret){
                        $scope.config.id = ret.result[0].id;
                        xasanValues.mapas[$scope.config.idmapa].tanques[$scope.config.id] = $scope.config;
                        //$scope.dispositivo.id = msg.result.id;
                        xasanValues.logs.unshift({Texto:"Um tanque foi criado"});
                    });
            };
            $scope.confirmaDestruir = function() {
                var me = this;

                bootbox.dialog({
                    message: "Deseja mesmo remover este dispositivo?",
                    title: "Remover dispositivo",
                    buttons: {
                        "Cancelar": {
                            className: "btn-primary",
                            callback: function() {

                            }
                        },
                        danger: {
                            label: "Remover",
                            className: "btn-danger",
                            callback: function() {
                                me.destruir();
                                delete xasanValues.mapas[$scope.config.idmapa].tanques[$scope.config.id];
                                xasanCrud.destroy('tanque',$scope.config);
                            }
                        }
                    }
                });
            }
            $scope.destruir = function(){
                delete xasanValues.tanquesNoMapa[$scope.uid];
                //retirando nosso interval que da o apply
                clearInterval($scope.intervalAtualiza);
                $scope.$apply();
                //removendo os listeners
                for(var name in $scope.listeners){
                    SIOM.removeListener(name, $scope.listeners[name]);
                }

                $scope.$destroy();
            };

            var handleAlerta = function(msg){
                if(msg.result.status){
                    $scope.alertas[msg.result.alerta.id] = msg.result.alerta;
                }else{
                    delete $scope.alertas[msg.result.alerta.id];
                }

                $scope.emAlerta = Object.keys($scope.alertas).length ? "emAlerta" :     "";

            };

            var wiring = function(){
                $scope.listeners['barreira.barreira.disconnected.'+$scope.dispositivo.idbarreira] =  $scope.destruir;
                $scope.listeners['handleralertadispositivo.alerta.'+$scope.dispositivo.id] =  handleAlerta;

                for(var name in $scope.listeners){
                    SIOM.on(name, $scope.listeners[name]);
                }
            };

            $scope.carregaTanque = function(){
                $scope.tempDispTanque = angular.copy($scope.dispositivo);
                var dom = xasanCompiler.compile('<modal identificador="telaTanque" titulo="Configuração do dispositivo" on-close="fechando()">'+
                '<configuracaotanque dispositivo="tempDispTanque"></configuracaotanque>'+
                '</modal>', $scope);
                $('body').append(dom);
            };

            $scope.carregaAlerta = function(){
                $scope.tempDisp = angular.copy($scope.dispositivo);
                var x = xasanCompiler.compile('<modal identificador="telaAlerta" titulo="Configuração dos Alertas" on-close="fechando()"><configalerta dispositivo="tempDisp"></configalerta></modal>', $scope);
                $('body').append(x);
            };

            //se eu não tenho id ainda, então vou mandar me criar no banco.
            if(!$scope.config.id){
                $scope.criaTanque();
            }
            wiring();
        },

        link: function(scope, element, attrs){
            scope.xasanValues = xasanValues;
            $(element[0]).find(".textoTanque").css({
                'font-size':scope.config.width/10
            });

            scope.alteraFont = function(tam){
                $(element[0]).find(".textoTanque").css({
                    'font-size': tam/10
                });
            };

            if(true){
                /*Torna o elemento redimensionavel, e a funcao resize dispara um evento quando algum elemento for ajustado, que pode ser usada para gravar a posição que foi ajustada*/
                element.draggable({
                    containment: $('.corpoPrincipal'),
                    stop: function() {
                        var Stoppos = $(this).position();
                        //chamada para atualizar a posição.
                        scope.config.posx= Stoppos.left;
                        scope.config.posy = Stoppos.top;

                        var tanque = {
                            id: scope.config.id,
                            idmapa:scope.config.idmapa,
                            height:scope.config.height,
                            width:scope.config.width,
                            posx:scope.config.posx,
                            posy:scope.config.posy,
                            iddispositivo:scope.config.iddispositivo
                        };
                        xasanValues.mapas[tanque.idmapa].tanques[tanque.id].posx = tanque.posx;
                        xasanValues.mapas[tanque.idmapa].tanques[tanque.id].posy = tanque.posy;

                        xasanCrud.update('tanque', tanque);
                    }
                });
                if(scope.dispositivo.config.modelo == 1 || scope.dispositivo.config.modelo == 2){
                    element.resizable({
                        handles: 'e',
                        maxHeight: 300,
                        minHeight: scope.dispositivo.config.modelo == 1 ? 225 : 200,
                        maxWidth: scope.dispositivo.config.modelo == 1 ? 300 : 200,
                        minWidth: scope.dispositivo.config.modelo == 1 ? 160 : 115,

                        resize: function(event, ui){
                            $(element[0]).find(".imagemVolume").css(
                                'width', ui.size.width
                            );
                            $(element[0]).find(".redimencionar").css(
                                'width', ui.size.width
                            );
                            scope.alteraFont(ui.size.width);
                        },
                        stop: function( event, ui ) {
                            scope.config.height = ui.size.height;
                            scope.config.width = ui.size.width;
                            scope.alteraFont(ui.size.width);
                            var tanque = {
                                id: scope.config.id,
                                idmapa:scope.config.idmapa,
                                height:scope.config.height,
                                width:scope.config.width,
                                posx:scope.config.posx,
                                posy:scope.config.posy,
                                iddispositivo:scope.config.iddispositivo
                            };

                            xasanCrud.update('tanque', tanque, {}, function(msg){
                                if(msg.success){
                                    xasanValues.mapas[tanque.idmapa].tanques[tanque.id].height = tanque.height;
                                    xasanValues.mapas[tanque.idmapa].tanques[tanque.id].width = tanque.width;
                                }else{
                                    xasanValues.logs.unshift({Texto:"Erro ao redimencionar um tanque"});
                                }

                            });
                        }
                    })
                }
            }
        }
    };
});