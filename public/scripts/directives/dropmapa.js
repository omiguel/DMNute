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

            console.log('dropmapa', scope.$parent.$parent);

            scope.mostrameusdisps = function(){
                scope.mostradisps = scope.mostradisps? false: true;
                scope.$parent.$parent.mapa = scope.mapa;
                scope.$parent.$parent.mostraclicado();
                scope.mapa.atual = true;
            };

            scope.showdisp = function(disp){
                console.log('quer VER esse disp', disp);
            };

            scope.pegadispmapa = function(disp){
                console.log('quero config esse cara>>>', disp);
            };

            scope.configmapa = function(map){
                console.log('quero config esse mapa>>>>>', map);
            }

        }
    };
});
