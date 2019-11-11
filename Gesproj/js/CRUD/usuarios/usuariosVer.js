$(function () {

    if (correo == undefined || correo == "") {
        bootbox.alert({   message:"Fallo al extraer el correo de la tabla",  backdrop: true})
        botonUsuarios();
    }
   


    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'visualizarUsuario',
                'correo': correo
            },
        })
        .done(function (datos) {
            let usuario = JSON.parse(datos)[0];
            //console.log(usuario)
            cargarDatosVista(usuario);

        })
        .fail(function (datos) {
            falloAjax();
        });
})

function cargarDatosVista(u) {
    $('#dCorreo').val(u.correo);
    $('#dNombre').val(u.nombre);
    $('#dApellidos').val(u.apellidos);

    $('#imagen').attr('src', repositorioImagenes + "/" + u.imagen);


    $('#volverResumenUsuario').click(botonUsuarios);
}

function botonUsuarios() {
    $('#contenido').empty();
    $('#contenido').html(preload);


    $.post('vistas/usuarios/usuarios.html', function (htmle) {
        $('#contenido').html(htmle);
    }, 'html');

}