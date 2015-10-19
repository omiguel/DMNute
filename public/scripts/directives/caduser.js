/**
 * Created by Osvaldo on 29/09/15.
 */

app.directive('caduser', function(){
    return{
        restrict: 'E',
        transclude: true,
        scope:{},
        templateUrl: '../../partial/caduser.html',
        link: function(scope, element){

            scope.tipoUser = {
                tipoSelecionado: 'Selecione o tipo',
                tipos: [
                    {id: 1, nome: "Administrador"},
                    {id: 2, nome: "Usuario comum"}
                ]
            };

            scope.cadastrarUsuario = function(){
                console.log("funciona mesmoooo", scope.user);
            }
        }
    };
});