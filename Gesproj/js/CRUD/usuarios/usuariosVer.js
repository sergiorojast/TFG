$(function(){


   

    $.ajax({
        type: "POST",
        url: webService,
        data: {
            'accion' : 'visualizarUsuario',
            'correo' : correo
        },
    })
    .done(function(datos){
        let usuario  = JSON.parse(datos)[0];
        console.log(usuario)
        cargarDatosVista(usuario);

    })
    .fail(function(datos){
        falloAjax();
    });
})

function cargarDatosVista(u){
    $('#correoBack').html(u.nombre+" "+u.apellidos);

    $('#dCorreo').val(u.correo);
    $('#dNombre').val(u.nombre);
    $('#dApellidos').val(u.apellidos);

    $('#imagen').attr('src',repositorioImagenes+"/"+u.imagen);
}