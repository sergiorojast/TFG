
$(function(){

    agregarFuncionalidadBotonesRetroceder();

  
})



/**
 * procedimiento encargado de añadir los eventos click a los botones de volver atras.
 */
function agregarFuncionalidadBotonesRetroceder(){
        //Añadimos  evento y "redireccion" para volver al listado de proyectos
        $('#volverResumenProyectos').click(volverAtras);
        $('#botonAtras').click(volverAtras);
}

/**
 * procedimiento encargado de cambiar  la vista por el resumen de proyectos.
 */
function volverAtras(){
    $('#contenido').empty();
    $('#contenido').html(preload);


     $.post('vistas/proyectos/proyectosResumen.html', function (htmle) {
        $('#contenido').html(htmle);
     }, 'html');
}