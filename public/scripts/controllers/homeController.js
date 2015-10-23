/**
 * Created by Osvaldo on 23/09/15.
 */

app.controller("homeController",['$scope', "$location", 'getUserLogado', function ($scope, $location, getUserLogado) {

    $scope.wind = "/";
    $scope.teste = true;

    var id = Math.random();

    console.log('agora eh a hora', getUserLogado.getLogado(), $scope, id);

    $scope.listaestoque = 'essa é a lista do estoque';

    $scope.listageral = 'lista geralllll';

    //todo trabalhando no cabecalhooooooo
    $scope.mapa = {
        nome: 'meu mapa',
        tipomapa: 'mapamund',
        disps: [
            {nome: 'disp1'},
            {nome: 'disp2'},
            {nome: 'disp3'}
        ],
        atual: true,
        img: '../image/terreo.JPG'
    };

    $scope.userLogado = {
        nome: 'Osvaldo',
        setor: 'Suporte',
        email: 'osvaldo@osvaldo.com',
        ramal: 1963,
        imagem: '../image/userImagem/osvaldo.JPG'
    };

    $scope.cadastrados = [
        {
            nome: 'Tobias',
            setor: 'Financeiro',
            ramal: 1964,
            email: 'tobias@tobias.com',
            imagem: '../image/userImagem/tobias.JPG'
        },
        {
            nome: 'Basilio',
            setor: 'Portaria',
            ramal: 1965,
            email: 'basilio@basilio.com',
            imagem: '../image/userImagem/basilio.PNG'
        },
        {
            nome: 'Artrides',
            setor: 'Secretaria',
            ramal: 1966,
            email: 'artrides@artrides.com',
            imagem: '../image/userImagem/artrides.JPG'
        }
    ];

    //todo trabalhando no lista geral
    $scope.mapas = [
        {
            nome: 'meu mapa',
            tipomapa: 'mapamund',
            disps: [
                {nome: 'disp1'},
                {nome: 'disp2'},
                {nome: 'disp3'}
            ],
            atual: true,
            img: '../image/terreo.JPG'
        },
        {
            nome: 'mapa lindo',
            tipomapa: 'mapa do brasil',
            disps: [
                {nome: 'disp11'},
                {nome: 'disp12'},
                {nome: 'disp13'}
            ],
            atual: false,
            img: '../image/pavimento_1_andar.JPG'
        },
        {
            nome: 'mapa locao',
            tipomapa: 'mapa de santacatarina',
            disps: [
                {nome: 'disp21'},
                {nome: 'disp22'},
                {nome: 'disp23'}
            ],
            atual: false,
            img: '../image/avignon_planta_11_andar.JPG'
        }
    ];

    $scope.alldisps = [
        {nome: 'disp1'},
        {nome: 'disp2'},
        {nome: 'disp3'},
        {nome: 'disp11'},
        {nome: 'disp12'},
        {nome: 'disp13'},
        {nome: 'disp21'},
        {nome: 'disp22'},
        {nome: 'disp23'}
    ];

    $scope.mostraclicado = function(){
        for(var index in $scope.mapas){
            $scope.mapas[index].atual = false;
        }
    };

}]);