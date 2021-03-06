$(function () {



    if (correo == undefined || correo == "") {
        mensajeDanger('Fallo al extraer el correo de la tabla', "", 3);
        setTimeout(cerrar, 3000);

    }


    //llamadas a los procemientos.
    asignarAccionesBotonesAtras();



    rellenarConDatosUsuario();

    validarFomulario();


    cargarTituloImagen();


})


/**
 * funcion encargada de cargar el nombre de la imagen en el label del input file
 */
function cargarTituloImagen() {
    $('#eImagen').on('change', function () {
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

        if (parseInt(u.rol) >= 90) {
            $('#administrador').attr('selected', 'true');
        } else if (parseInt(u.rol) >= 50 && parseInt(u.rol) < 90) {
            $('#moderador').attr('selected', 'true');
        } else {
            $('#usuario').attr('selected', 'true');
        }


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
                required: true,
                email: true
            },
            eNombre: {
                required: true,
                minlength: 3,
                maxlength: 100
            },
            eApellidos: {
                required: true,
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
        errorElement: "small",
        errorPlacement: function (error, element) {
            // Add the `invalid-feedback` class to the error element
            error.addClass("invalid-feedback");


            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.next("label"));
            } else {
                error.insertAfter(element);

            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        },
        submitHandler: function (form, event) {
            $('#botonModificarUsuario').html(preload);
            event.preventDefault();
            enviarDatos(form);
        }
    })

    function enviarDatos(form) {

        $.ajax({
                type: "POST",
                url: webService,
                data: new FormData(form),
                contentType: false,
                cache: false,
                processData: false,

            })
            .done(function (data) {


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
                } else if (data == -5) {
                    mensajeDanger('Imagen demasiado pesada. El tamaño máximo son 10mb', 'Error en la imagen');
                } else if (data == -6) {
                    mensajeInfo('Datos modificados con exito, pero no notificados');
                }

                $('#botonModificarUsuario').html("<i class='fa fa-save'></i> Modificar");

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

    $('#contenido').fadeToggle('slow');
    $('#contenido').empty();
    $('#contenido').html(preload);


    setTimeout(function () {
        $.post('vistas/usuarios/usuarios.html', function (htmle) {
            $('#contenido').html(htmle);
        }, 'html');
    }, 250)


}