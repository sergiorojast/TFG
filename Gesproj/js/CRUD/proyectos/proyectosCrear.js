$(function () {

    agregarFuncionalidadBotonesRetroceder();

    validarFormulario();

    //Añadimos  el envio del formulario  con el evento 
    $('#botonCrear').click(function () {
        $('#formularioProyecto').submit();
    })

    solicitarDatosAdministradores();

    agrearFuncionalidadSelectorAdministradores();
})



/**
 * procedimiento encargado de añadir los eventos click a los botones de volver atras.
 */
function agregarFuncionalidadBotonesRetroceder() {
    //Añadimos  evento y "redireccion" para volver al listado de proyectos
    $('#volverResumenProyectos').click(volverAtras);
    $('#botonAtras').click(volverAtras);
}

/**
 * procedimiento encargado de cambiar  la vista por el resumen de proyectos.
 */
function volverAtras() {
    $('#contenido').empty();
    $('#contenido').html(preload);


    $.post('vistas/proyectos/proyectosResumen.html', function (htmle) {
        $('#contenido').html(htmle);
    }, 'html');
}

/**
 * Funcion encargada de validar el formulario de envio de datos para crear el proyecto en la base de datos.
 */

function validarFormulario() {
    $('#formularioProyecto').validate({
        rules: {
            'cNombreProyecto': {
                required: true
            },
            'cDescripcionProyecto': {
                required: true,
                minlength: 10,
                maxlength: 6000

            },
            'horas': {
                number: true,
                min: 0,
                max: 99999
            },
            'minutos': {
                number: true,
                min: 0,
                max: 59
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
        messages: {
            'cNombreProyecto': {
                required: "Dato requerido"
            },
            'cDescripcionProyecto': {
                required: "Dato requerido",
                maxlength: "Descripción demasiado larga, el texto que esta introduciendo como descripción es superior a 1000 palabras.",
                minlength: "Descipción demasiado corta."
            }
        },


        submitHandler: function (form, event) {
            event.preventDefault();
        }
    })
}

function solicitarDatosAdministradores() {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'listadoAdministradores'
            },
        })
        .done(function (data) {

            if (isNaN(data)) {
                let datos = JSON.parse(data);

                for (let i = 0; i < datos.length; i++) {
                    $('#selectorAdministradores').append("<option value='" + datos[i] + "'> " + datos[i] + " </option>");
                }
            } else if (data === -1) {
                mensajeDanger('Sesion no iniciada')
            } else {
                mensajeDanger('No tienes permisos para hacer esta acción');
            }
        })
        .fail(function (data) {
            falloAjax();
        })
}

function agrearFuncionalidadSelectorAdministradores() {


    $('#botonSeleccionarAdministradores').click(function () {
        let correoSeleccionado = $('#selectorAdministradores').val();
        if (correoSeleccionado !== 'Seleccionar Administradores...') {

            $('#listadoAdministradores').append("<li value='" + correoSeleccionado + "'>" + correoSeleccionado + "</li>");
            $("#selectorAdministradores option[value='" + correoSeleccionado + "']").remove();

            $("#listadoAdministradores li[value='" + correoSeleccionado + "']").click(function (e) {
                let correo = $(this).attr('value');
                $('#selectorAdministradores').append("<option value='" + correo + "'>" + correo + "</option>");

                $("#listadoAdministradores li[value='" + correoSeleccionado + "']").remove()
            })

        }
    })

}