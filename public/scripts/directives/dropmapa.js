/**
 * Created by Osvaldo on 23/09/15.
 */

app.directive('dropmapa', function(){
    return{
        restrict: 'E',
        transclude: true,
        scope:{
            mapa: '='
        },
        templateUrl: '../../partial/dropmapa.html',
        link: function(scope, element){
            
            scope.pai = false;
            scope.filho = false;

            scope.mostra = function () {
                if(scope.mapa.ehapai){
                    scope.pai = true;
                } else {
                    scope.filho = true;
                }

                SIOM.emit('trocamapa', scope.mapa);

                scope.mapa.atual = scope.mapa.atual ? false : true;
                if(scope.mapa.ehapai){
                    fechafilhos(scope.mapa.filhos);
                }

            };

            var fechafilhos = function (filhos) {
                for(var fil in filhos){
                    filhos[fil].atual = false;
                    if(filhos[fil].ehapai){
                        fechafilhos(filhos[fil].filhos);
                    }
                }
            };

            scope.showdisp = function(disp){
                console.log('quer VER esse disp', disp);
            };

            scope.pegadispmapa = function(disp){
                console.log('quero config esse cara>>>', disp);
            };

            scope.configmapa = function(map){
                console.log('quero config esse mapa>>>>>', map);
            };

        }
    };
});
