/**
 * Created by Osvaldo on 23/09/15.
 */

app.directive('listaestoque', function(){
    return{
        restrict: 'E',
        transclude: true,
        scope:{
            dispsemestoque: '='
        },
        templateUrl: '../../partial/listaestoque.html',
        link: function(scope, element){

            scope.showdisp = function(disp){
                console.log('quero VER esse disp', disp);
            };

            scope.pegadispmapa = function(disp){
                SIOM.emit('editadisp', disp);
            };
        }
    };
});
