/**
 * Created by Osvaldo on 23/09/15.
 */

app.directive('mapa', function(){
    return{
        restrict: 'E',
        transclude: true,
        scope:{
            imagem: '='
        },
        templateUrl: '../../partial/mapa.html',
        link: function(scope, element){}
    };
});
