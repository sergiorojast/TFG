$(function () {



    $('#volverResumenUsuario').click(botonUsuarios);
    $('#volverAtras').click(botonUsuarios);


    if (correo == undefined || correo == "") {
        bootbox.alert({
            message: "Fallo al extraer el correo de la tabla",
            backdrop: true
        })
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
            cargarDatosVista(usuario);

        })
        .fail(function (datos) {
            falloAjax();
        });


    $('#eRange').mousemove(function () {
        $('#numeroPermisos').html($(this).val());
        console.log($(this).val())
    })
    //añadimos funcionalidad al boton de subr imagen
    $('#botonReal').click(function (e) {
        $('#rImagen').click();
    })
    //cambio del texto dle label de la imagen
    $('#rImagen').change(function (e) {
       // console.log($('#rImagen')[0].files[0].name)
        $('#labelImagen').text($('#rImagen')[0].files[0].name)
    })
    //jquery validate
    $('#formularioEdicion').validate({
        rules: {
            eCorreo: {
                email: true
            },
            eNombre: {

                minlength: 3,
                maxlength: 100
            },
            eApellidos: {

                minlength: 3,
                maxlength: 100
            },

            eContrasenia: {

                minlength: 5,

            },
            eContrasenia2: {

                minlength: 5,
                equalTo: "#eContrasenia"
            }
        }
    })

})


function cargarDatosVista(u) {
    $('#eCorreo').val(u.correo);
    $('#eNombre').val(u.nombre);
    $('#eApellidos').val(u.apellidos);


    $('#imagenActual').attr('src', repositorioImagenes + "/" + u.imagen);

    $('.rango').html("<label for='customRange2'>Rol <small> nivel de permisos <span id='numeroPermisos'>0</span></small><span class='fab fa-keycdn'></span></label>" +
        "<input type='range' class='custom-range' min='0' max='100' value='" + u.rol + "' id='eRange'>");
    $('#numeroPermisos').html(u.rol);

}



function botonUsuarios() {
    $('#contenido').empty();
    $('#contenido').html(preload);


    $.post('vistas/usuarios/usuarios.html', function (htmle) {
        $('#contenido').html(htmle);
    }, 'html');

}