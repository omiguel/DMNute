/**
 * Created by Osvaldo on 29/09/15.
 */

app.directive('showdatamap', function(){
    return{
        restrict: 'E',
        transclude: true,
        scope:{
            mapa: '='
        },
        templateUrl: '../../partial/showdatamap.html',
        link: function(scope, element){
            var me = this;

            scope.deletarmapa = function () {
                if(scope.mapa.ehapai){
                    console.log('informar que para deletar esse tem re remover os filhos.')
                    $('#cantdelete').modal('toggle');
                }else {
                    var msg = new Mensagem(me, 'mapa.remove', scope.mapa, 'mapa');
                    SIOM.emitirServer(msg);
                }
            };

            scope.editarmapa = function () {
                console.log('vou chamar o edit desse cara');
            };

            scope.fechainformativo = function () {
                $('#cantdelete').modal('toggle');
            }
        }
    };
});