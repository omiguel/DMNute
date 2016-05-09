/**
 * Created by Osvaldo on 10/03/2016.
 */
app.directive('imgdraggable', ['$document', function($document) {
    return {
        restrict: 'A',
        
        link: function(scope, element, attr) {

            var meuid =  '#'+attr.id;
            var startX = 0;
            var startY = 0;
            var x = 0;
            var y = 0;
            var jaSetei = false;
            var maxrigth = 0;
            var maxbotton = 0;
            var minbotton = 0;

            function setMaximos() {
                jaSetei = true;
                var myposition = $(meuid).position().top;
                var myheight = element.context.offsetWidth;
                // var myheight = element.context.offsetWidth + myposition - 14;
                var mywidth = element.context.offsetWidth;
                var mapaheight = $("#mapadiv").height();
                var mapawidth = $("#mapadiv").width();
                maxbotton = mapaheight - myheight;
                // minbotton = 14 - myposition;
                minbotton = 0;
                maxrigth = mapawidth - mywidth;

                console.log('myposition', myposition);
                console.log('myheight', myheight);
                console.log('mywidth', mywidth);
                console.log('mapaheight', mapaheight);
                console.log('mapawidth', mapawidth);
                console.log('minbotton', minbotton);
                console.log('maxbotton', maxbotton);
                console.log('maxrigth', maxrigth);
                console.log('-------------------------------');

            }

            var pos = attr.imgdraggable;
            var meio = pos.lastIndexOf(',');
            var fim = pos.lastIndexOf('.');

            x = parseInt(pos.substring(0, meio));
            y = parseInt(pos.substring(meio+1, fim));

            element.css({
                position: 'relative',
                border: '1px solid red',
                cursor: 'pointer',
                top: y + 'px',
                left:  x + 'px'
            });

            element.on('mousedown', function(event) {

                if (!jaSetei){
                    setMaximos();
                }

                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);

            });

            function mousemove(event) {

                y = event.pageY - startY;
                x = event.pageX - startX;

                if(x < 0){
                    x = 0;
                    element.css({
                        left: 0 + 'px'
                    });
                } else if(y < minbotton){
                    y = minbotton;
                    element.css({
                        top: minbotton + 'px'
                    });
                } else if(x > maxrigth){
                    x = maxrigth;
                    element.css({
                        left: maxrigth + 'px'
                    });
                } else if(y > maxbotton){
                    y = maxbotton;
                    element.css({
                        top: maxbotton + 'px'
                    });
                } else{
                    element.css({
                        top: y + 'px',
                        left:  x + 'px'
                    });
                }
            }

            function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
            }
        }
    };
}]);