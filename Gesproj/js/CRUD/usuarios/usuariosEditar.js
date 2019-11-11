$(function () {



    $('#volverResumenUsuario').click(botonUsuarios);


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
            console.log(usuario)
            cargarDatosVista(usuario);

        })
        .fail(function (datos) {
            falloAjax();
        });


        $('#eRange').mousemove(function(){
            $('#numeroPermisos').html($(this).val());
           // console.log($(this).val())
        })
})


function cargarDatosVista(u) {
    $('#eCorreo').val(u.correo);
    $('#eNombre').val(u.nombre);
    $('#eApellidos').val(u.apellidos);
   

    $('#imagen').attr('src', repositorioImagenes + "/" + u.imagen);

    $('.rango').html("<label for='customRange2'>Rol <small> nivel de permisos <span id='numeroPermisos'></span></small><span class='fab fa-keycdn'></span></label>"+
    "<input type='range' class='custom-range' min='0' max='100' value='"+u.rol+"' id='eRange'>");
    $('#eRange').attr('value',u.rol);

}



function botonUsuarios() {
    $('#contenido').empty();
    $('#contenido').html(preload);


    $.post('vistas/usuarios/usuarios.html', function (htmle) {
        $('#contenido').html(htmle);
    }, 'html');

}