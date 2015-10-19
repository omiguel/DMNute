/**
 * Created by Osvaldo on 29/09/15.
 */

app.directive('addmapa', function(){
    return{
        restrict: 'E',
        transclude: true,
        scope:{},
        templateUrl: '../../partial/addmapa.html',
        link: function(scope, element){
            scope.adicionarMapa = function(){
                console.log("novo mapa eh ", scope.mapa);
            }
        }
    };
});