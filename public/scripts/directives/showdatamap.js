/**
 * Created by Osvaldo on 29/09/15.
 */

app.directive('showdatamap', function(utilFactory, $route){
    return{
        restrict: 'E',
        transclude: true,
        scope:{
            mapa: '='
        },
        templateUrl: '../../partial/showdatamap.html',
        link: function(scope, element){
            var me = this;
            scope.edit = false;
            scope.mapaedit = {};

            scope.deletarmapa = function () {
                if(scope.mapa.ehapai && (scope.mapa.filhos.length > 0)){
                    $('#cantdelete').modal('toggle');
                } else if(scope.mapa.disps && scope.mapa.disps.length > 0){
                    console.log('nao posso deletar, tem disps', scope.mapa.disps);
                    $('#hasdisp').modal('toggle');
                } else {
                    var msg = new Mensagem(me, 'mapa.remove', scope.mapa, 'mapadel');
                    SIOM.emitirServer(msg);
                }
            };

            scope.deletaassimmesmo = function () {
                $('#hasdisp').modal('toggle');
                var msg = new Mensagem(me, 'mapa.remove', scope.mapa, 'mapadel');
                SIOM.emitirServer(msg);
            };

            var alteraimagem = function (file) {
                var idmapa = scope.mapaedit._id;

                var retorno = function(data){
                    scope.mapaedit.img = data.localImagem;
                    console.log('dataaaa', data.localImagem);
                    var msg = new Mensagem(me, 'mapa.update', scope.mapaedit, 'mapaup');
                    SIOM.emitirServer(msg);
                    scope.mapaedit = {};
                    element.find('input.file')[0].files[0] = null;
                    scope.edit = false;
                };

                utilFactory.upImagem(idmapa, file, 'mapa', retorno);
            };

            scope.atualizamapa = function () {

                var file = element.find('input.file')[0].files[0];

                if(file){
                    alteraimagem(file);
                }else {
                    var msg = new Mensagem(me, 'mapa.update', scope.mapaedit, 'mapaup');
                    SIOM.emitirServer(msg);
                    scope.mapaedit = {};
                    scope.edit = false;
                }
            };

            scope.editarmapa = function () {
                scope.mapaedit = angular.copy(scope.mapa);
                scope.edit = true;
            };

            scope.fechainformativo = function () {
                $('#cantdelete').modal('toggle');
            };

            scope.fechainformativofilho = function () {
                $('#hasdisp').modal('toggle');
            };
        }
    };
});