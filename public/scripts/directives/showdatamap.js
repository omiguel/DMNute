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
        link: function(scope, element){}
    };
});