$(function () {

    //Añadimos la funcion al boton de crear proyectos
    $('#crearProyectos').click(function (e) {
        $('#contenido').empty();
        $('#contenido').html(preload);
    
    
         $.post('vistas/proyectos/proyectosCrear.html', function (htmle) {
            $('#contenido').html(htmle);
         }, 'html');
    })
})