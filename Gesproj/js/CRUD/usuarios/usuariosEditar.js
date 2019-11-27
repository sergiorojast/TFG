$(function () {



    if (correo == undefined || correo == "") {
       mensajeDanger('Fallo al extraer el correo de la tabla',"",3);
       setTimeout(cerrar,3000);
        
    }


    //llamadas a los procemientos.
    asignarAccionesBotonesAtras();

    cargarTituloImagen();

    rellenarConDatosUsuario();

    validarFomulario();




})


/**
 * funcion encargada de cargar el nombre de la imagen en el label del input file
 */
function cargarTituloImagen() {
    $('#rImagen').on('change', function () {
        //get the file name
        let fileName = $(this).val().split('\\').pop();
        //replace the "Choose a file" label
        $('.custom-file-label').html(fileName);
    });
}


/**
 * Procedimiento que rellena los datos correo, nombre , apellidos y muestra la imagen actual del usuario, para poder visualizar los datos.
 * estos datos los meto en los input.
 */
function rellenarConDatosUsuario() {
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


    function cargarDatosVista(u) {
        $('#eCorreo').val(u.correo);
        $('#eCorreoHidden').val(u.correo);
        $('#eNombre').val(u.nombre);
        $('#eApellidos').val(u.apellidos);


        $('#imagenActual').attr('src', repositorioImagenes + "/" + u.imagen);

        $('.rango').html("<label for='customRange2'>Rol <small> nivel de permisos <span id='numeroPermisos'>0</span></small><span class='fab fa-keycdn'></span></label>" +
            "<input type='range' class='custom-range' name='eRol' min='0' max='100' value='" + u.rol + "' id='eRange'>");
        $('#numeroPermisos').html(u.rol);

        $('#eRange').mousemove(function () {
            $('#numeroPermisos').html($(this).val());

        })

    }
}

/**
 * Funcion encargada de validar los datos y a su vez, en la funcion submithandler  llamaremos a 
 * envar datos
 */
function validarFomulario() {
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
            eImagen: {

                extension: "png|jpeg|jpg|svg"
            }
        },
        submitHandler: function (form, event) {

            event.preventDefault();
            enviarDatos(form);
        }
    })

    function enviarDatos(form) {

        //imagen = $('#eImagen').prop("files")[0];
        /* 
                if (imagen == undefined) {
                    imagen = "";
                } else {
                    imagen = btoa(imagen);
                }
         */
        $.ajax({
                type: "POST",
                url: webService,
                data: $(form).serialize(),

            })
            .done(function (data) {
                let mensaje = "";

                if (data == 1) {
               
                    mensajeSuccess("Usuario modificado con éxito");
                } else if (data == -1) {
                   
                    mensajeWarning('No tienes permisos oara realizar esta acción');
                } else if (data == -2) {
                
                    mensajeDanger('Fallo en la inserción en la base de datos')
                } else if (data == -3) {

                    mensajeWarning("Las contraseñas proporcionadas no son iguales.");

                } else if (data == -4) {
                  
                    mensajeInfo("No puedes modificar tu usuario desde aquí");
                }

             
            }).fail(function (e) {
                falloAjax();
            });
    }
}



/**
 * volvemos a la vista anterior.
 */

function asignarAccionesBotonesAtras() {

    $('#volverResumenUsuario').click(cerrar);
    $('#volverAtras').click(cerrar);


}

function cerrar() {
    $('#contenido').empty();
    $('#contenido').html(preload);


    $.post('vistas/usuarios/usuarios.html', function (htmle) {
        $('#contenido').html(htmle);
    }, 'html');

}