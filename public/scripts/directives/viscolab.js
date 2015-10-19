/**
 * Created by Osvaldo on 29/09/15.
 */

app.directive('viscolab', function(){
    return{
        restrict: 'E',
        transclude: true,
        scope:{
            user: '='
        },
        templateUrl: '../../partial/viscolab.html',
        link: function(scope, element){
        }
    };
});