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


    $('#rImagen').on('change', function () {
        //get the file name
        let fileName = $(this).val().split('\\').pop();
        //replace the "Choose a file" label
        $('.custom-file-label').html(fileName);
    });
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
            },
            eImagen:{
               
                extension: "png|jpeg|jpg|svg"
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

    $('#eRange').mousemove(function () {
        $('#numeroPermisos').html($(this).val());

    })

}



function botonUsuarios() {
    $('#contenido').empty();
    $('#contenido').html(preload);


    $.post('vistas/usuarios/usuarios.html', function (htmle) {
        $('#contenido').html(htmle);
    }, 'html');

}