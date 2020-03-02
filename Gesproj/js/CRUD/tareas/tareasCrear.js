//ocultamos la columna relacionado con los usuarios, la mostraremos cuando la tarea haya sido creada.

//$('#capaTarea').removeClass('col-lg');

//$('#capaTarea').addClass('col-lg-6');

//$('#capaUsuario').removeClass('d-none');


//añadimos la validacion del formulario para la creación de la nueva tarea.

validarformularioCreacionTarea();


solicitarProyectos();

asignarEventosBotones();


//#region funcionalidad
function asignarEventosBotones() {
    bontonEnviarTareas();

    function bontonEnviarTareas() {
        $('#enviarCrearTarea').click(function () {
            $('#formularioCreacionTarea').submit();

        });
    }
}
/**
 * Funcion encargada de aplicar la validacion de jqValidation al formulario de creacion de tareas.
 * 
 */
function validarformularioCreacionTarea() {
    $('#formularioCreacionTarea').validate({

        rules: {
            nombreTarea: {
                required: true,
                minlength: 3,
                maxlength: 100
            },
            descripcionTarea: {
                required: true,
                minlength: 3,
                maxlength: 600
            },
            horas: {
                required: true,
                number: true
            },

            minutos: {
                required: true,
                number: true,

            },
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
            enviarTarea();
        }
    });

}

function aniadeProyectosSelect(datos) {
    for (let i = 0; i < datos.length; i++) {
        $('#listadoProyectos').append("<option value='" + datos[i]['pk_idProyecto'] + "'> " + datos[i]['pk_idProyecto'] + " - " + datos[i]['nombre'] + "</option>");
    }
}
//#endregion

//#region solicitud de datos
/**
 * funcion encargada de obtener todos los  nombres y id de los proyectos para mostrarlos en el select de
 * creación de tareas.
 */
function solicitarProyectos() {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'listarProyectosEID'
            }
        })
        .done(function (datos) {
            aniadeProyectosSelect(JSON.parse(datos));
        })
        .fail(function () {
            falloAjax();
        })
}

//#endregion

//#region envio de datos
function enviarTarea() {

    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'insertarTarea',
                'nombre': $('#nombreTarea').val(),
                'descripcion': $('#descripcionTarea').val(),
                'proyecto': $('#listadoProyectos').val(),
                'horas': $('#horas').val(),
                'minutos': $('#minutos').val()

            }

        })
        .done(function (datos) {
            console.log(datos);
            if (datos == 2) {
                mensajeInfo('Usuario añadido como administrador del proyecto', 'Información');
                mensajeSuccess('Tarea ha sido creada con éxito', 'Tarea creada');
            } else if (datos == 1) {
                mensajeSuccess('Tarea ha sido creada con éxito', 'Tarea creada');
            } else if (datos == -1) {
                mensajeDanger("Permisos insuficientes", "¡ERROR!");
            } else if (datos == -2) {
                mensajeDanger("Faltan datos para la inserción", "¡ERROR!");

            } else if (datos == -3) {
                mensajeDanger("Fallo en la inserción de su usuario como administrador del proyecto", "¡ERROR!");

            } else if (datos == -4) {
                mensajeDanger("Tiempo no especificado", "¡ERROR!");

            } else if (datos == -5) {
                mensajeDanger("Este proyecto ya esta finalizado", "¡ERROR!");

            } else if (datos == -6) {
                mensajeDanger("El tiempo asignado sobrepasa el tiempo estimado del proyecto", "¡ERROR!");

            } else if (datos == -7) {
                mensajeDanger("Ya existe una tarea con ese mismo nombre, la tarea no sera creada", "¡ERROR!");
                mensajeInfo('Usuario añadido como administrador del proyecto', 'Información');

            }
        })
        .fail(falloAjax);
}
//#endregion