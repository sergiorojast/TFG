$(function () {



    //Modificamos el nombre del label al de la imagen seleccionada
    $('#rImagen').on('change', function () {
        let fileName = $(this).val().split('\\').pop();
        $('.custom-file-label').html(fileName);
    });

    validarFormularioCreacion();

    validarFormularioInvitacion();

    //añadimos funcionalidad al boton enviar formulario crear
    $('#lEnviar').on('click', function (evento) {
        $("#formularioCreacion").submit();

    })
    //añadimos funcionalidad al boton enviar formulario crear
    $('#botonInvitacion').on('click', function (evento) {
        $("#formularioInvitacion").submit();

    })

    //asignamos el evento click al boton atras

    $('#volverAtras').click(function (event) {
        cerrar();
    });
    $('#volverResumenUsuario').click(function (event) {
        cerrar();
    })


})

function validarFormularioCreacion() {
    let $formulario = $("#formularioCreacion");



    $formulario.validate({
        rules: {
            rCorreo: {
                required: true,
                email: true
            },
            rNombre: {
                required: true,
                minlength: 3,
                maxlength: 100
            },
            rApellidos: {
                required: true,
                minlength: 3,
                maxlength: 100
            },

            rContrasenia: {
                required: true,
                minlength: 5,

            },
            rContrasenia2: {
                required: true,
                minlength: 5,
                equalTo: "#rContrasenia"
            },
            rImagen: {
                required: true,
                extension: "png|jpeg|jpg|svg"
            }

        },
        messages: {
            rContrasenia2: {
                equalTo: 'Por favor, escribe la misma contraseña.'
            },
            rImagen: {
                extension: 'El fichero introducido no tiene una extensión permitida.Las extensiones permitidas son --> png, jpeg,jpg,svg.'
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

            event.preventDefault();
            $('#lEnviar').addClass('disabled');
            $('#lEnviar').html(preload);

            enviarDatosCreacion(form);
        }
    });
}

function enviarDatosCreacion(form) {

    $.ajax({
            type: "POST",
            url: webService,
            data: new FormData(form),
            contentType: false,
            cache: false,
            processData: false,

        })
        .done(function (datos) {

            let dato = parseInt(datos);


            if (dato == 1) {
                mensajeSuccess("El  usuario se ha creado correctamente, se procedera a la redirección para el acceso", "Exito");

            }
            if (dato == -1) {
                mensajeDanger("El correo introducido no es valido", "Error en la dirección de correo");
            }
            if (dato == -2) {
                mensajeDanger("Error en el acceso a la base de datos", "Contacte con el programador.");

            }
            if (dato == -3) {
                mensajeWarning("La direccion de correo ya esta en uso", "Error en la dirección de correo");
            }
            $('#lEnviar').html("Enviar");

            recargarVista();
        })
        .fail(function (datos) {
            falloAjax();
            $('#lEnviar').html("Enviar");
        })

}
/**
 * Función encargada de recargas la vista actual.
 */
function recargarVista() {
    $('#contenido').empty();
    $('#contenido').html(preload);


    $.post('vistas/usuarios/usuariosCrear.html', function (htmle) {
        $('#contenido').html(htmle);
    }, 'html');
}

/**
 * Funcion encargada de eliminar el contenido del container principal y mostrar la vista de los ususarios.
 */
function cerrar() {
    $('#contenido').empty();
    $('#contenido').html(preload);


    $.post('vistas/usuarios/usuarios.html', function (htmle) {
        $('#contenido').html(htmle);
    }, 'html');

}

function validarFormularioInvitacion() {
    let $formulario = $('#formularioInvitacion');

    $formulario.validate({
        rules: {
            iCorreo: {
                required: true,
                email: true
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

            event.preventDefault();
            $('#botonInvitacion').addClass('disabled');
            $('#botonInvitacion').html(preload);


        }
    })

}