//añadimos la validacion del formulario para la creación de la nueva tarea.

validarformularioCreacionTarea();


solicitarProyectos();

asignarEventosBotones();

//#region funcionalidad
function aniadeUsuariosSelect(datos) {


    for (let i = 0; i < datos.length; i++) {

        $('#selectorUsuarios').append("<option >" + datos[i]['pk_correo'] + "</option>")
    }
}

function asignarEventosBotones() {
    bontonEnviarTareas();
    botonaniadirSelectUsuarios();
    botonAniadirUsuarios();

    function bontonEnviarTareas() {
        $('#enviarCrearTarea').click(function () {
            $('#formularioCreacionTarea').submit();

        });
    }

    function botonaniadirSelectUsuarios() {
        $('#botonSeleccionarUsuarios').click(function (e) {

            if ($('#selectorUsuarios').val() != "Seleccionar usuarios...") {

                $('#listadoUsuarios').append("<li class='list-group-item' value='" + $('#selectorUsuarios').val() + "'> <button class='btn btn-outline-danger'><i class='fas fa-trash'></i></button> " + $('#selectorUsuarios').val() + "</li>")

                $('#selectorUsuarios option:selected').remove();

                //añadimos el evento a los botones que vamos añadiendo para borrar a los usuarios.


                $('#listadoUsuarios li button:last').click(function (e) {

                    $('#selectorUsuarios').append("<option >" + $(this).parent('li').attr('value') + "</option>")

                    $(this).parent('li').remove();

                });

            }
        })
    }

    function botonAniadirUsuarios() {
        $('#botonaniadirUsuarios').click(function (e) {
            let correos = [];

            let lista = $('#listadoUsuarios li')
            if (lista.length == 0) {
                mensajeDanger("Debe añadir al menos un usuario que pueda crear anotaciones", '¡ERROR!');
            } else {
                for (let i = 0; i < lista.length; i++) {
                    correos.push($(lista[i]).attr('value'));

                }

                enviarUsuarios(correos);
            }

        })
    }
}
/**
 * Funcion encargada de convertir el formulario de creacion de nuevas tareas en columna de 6
 * y mostrar la lista de usuarios del sistema.
 */
function habilitarSeccionUsuarios() {
    $('#capaTarea').removeClass('col-lg');
    $('#capaTarea').addClass('col-lg-6');

    $('#capaUsuario').fadeToggle();


    $('#capaUsuario').removeClass('d-none');

    solicitarUsuarios();

    $('#nombreTarea').attr('disabled', 'true');
    $('#descripcionTarea').attr('disabled', 'true');
    $('#listadoProyectos').attr('disabled', 'true');
    $('#minutos').attr('disabled', 'true');
    $('#horas').attr('disabled', 'true');

    $('#enviarCrearTarea').attr('disabled', 'true');
    $('#enviarCrearTarea').off('click');

    $('#botonReset').attr('disabled', 'true');
    $('#botonReset').off('click');

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

function solicitarUsuarios() {
    $.ajax({
        type: "POST",
        url: webService,
        data: {
            'accion': 'obtenerUsuarios'
        }
    }).done(function (data) {
        if (data == -1) {
            mensajeDanger('Permisos necesarios', 'ERROR')
        } else {
            aniadeUsuariosSelect(JSON.parse(data));
        }

    }).fail(falloAjax);
}
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
function enviarUsuarios(datos) {
    let dato = JSON.stringify(datos);



    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'aniadeUsuariosTareaParaNotificaciones',
                'usuarios': dato,
                'nombreTarea': $('#nombreTarea').val()

            }

        })
        .done(function (datos) {
            console.log(datos)

            if (datos == 1) {
                mensajeSuccess('Usuarios añadidos con éxito', 'Todo ok');
                $('#botonaniadirUsuarios').attr('disabled', 'true');
                $('#botonaniadirUsuarios').off('click');

            } else if (datos == -1) {
                mensajeDanger('Hubo un fallo en la inserción de los usuarios', 'Error');
            }

        })
        .fail(falloAjax);

}

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
                habilitarSeccionUsuarios();
            } else if (datos == 1) {
                mensajeSuccess('Tarea ha sido creada con éxito', 'Tarea creada');
                habilitarSeccionUsuarios();
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