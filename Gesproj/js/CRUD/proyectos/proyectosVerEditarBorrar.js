$(function () {
    //si id de producto es 0 quiere decir que hubo un fallo.
    if (idProyecto !== -1) {
        $('#cIDProyecto').val(idProyecto);
        solicitarDatosProyectoID();
    } else {
        mensajeDanger("Error al obtener la id del proyecto, Intentelo en unos minutos", "ERROR");
    }
    //añadimos eventos para poder volver atras.btn-warning
    $('#volverResumenProyectos').click(volverAtras);

    solicitarDatosAdministradores();




    enviarActualizacionAdministradores();

})

//#region funcionalidad

function solicitarDatosProyectoID() {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'listarProyectoPorid',
                'idProyecto': idProyecto
            },

        })
        .done(function (datos) {

            let resultado = JSON.parse(datos);
            agregarDatos(resultado);
        })
        .fail(function (datos) {
            falloAjax();

        })
}

function agregarDatos(datos) {

    let nombreProyecto = datos[0]['nombre'];
    let descripcion = datos[0]['descripcion'];
    let fechaInicio = datos[0]['fechaInicio'];
    let fechaFinalizacion = datos[0]['fechaFinalizacion'];
    let estimacion = datos[0]['estimacion'];
    let estado = datos[0]['estado'];

    //cargamos los datos
    $('#eNombreProyecto').val(nombreProyecto);
    $('#eDescripcionProyecto').val(descripcion);

    // console.log(parseInt(estimacion.split(":")[0]))
    $('#horas').val(parseInt(estimacion.split(":")[0])); //> 9) ? estimacion.split(":")[0] : estimacion.split(":")[0]);
    $('#minutos').val(parseInt(estimacion.split(":")[1])); // > 9) ? estimacion.split(":")[1] : estimacion.split(":")[1]);

    $('#eFechaCreacionProyecto').val(fechaInicio);

    if (fechaFinalizacion !== null || fechaFinalizacion !== undefined) {
        if (fechaFinalizacion != "0000-00-00 00:00:00") {
            $('#eFechaFinalizacionProyecto').val(fechaFinalizacion);
        }

    }

    rellenarSelectConEstados(estado);

    agregarEventoBotonFinalizar();



}

function agregarEventoBotonFinalizar() {

    if ($('#eFechaFinalizacionProyecto').val() == "" || $('#eFechaFinalizacionProyecto').val() == "" == null || $('#eFechaFinalizacionProyecto').val() == undefined) {
        $('#botonFinalizar').click(function () {



            let fecha = new Date();
            fecha.setHours(fecha.getHours() + 1);
            fecha = fecha.toJSON();
            let fechaFormateada = fecha.slice(0, -5).replace("T", " ");
            //fechaFormateada = fechaFormateada.replace("T", " ");
            $('#eFechaFinalizacionProyecto').val(fechaFormateada);


            finalizarProyecto();
        })
    } else {
        $('#botonFinalizar').addClass('disabled');
    }
    /**
     * Funcion encargada de enviar los datos para dar un proyecto como finalizado.
     * @param id;
     * @param fechaFinalizacion;
     */
    function finalizarProyecto() {
        $.ajax({
                type: "POST",
                url: webService,
                data: {
                    'accion': 'finalizarProyecto',
                    'id': $('#cIDProyecto').val(),
                    'fFinalizacion': $('#eFechaFinalizacionProyecto').val()
                },

            })
            .done(function (datos) {

                if (datos == 1) {
                    mensajeSuccess("Proyecto finalizado.")
                    //eliminamos los botones  de acción.
                    $('#controlModificacionProyecto').empty();
                    $('#botonActualizarAdministradores').remove();

                    $('#eNombreProyecto').addClass('disabled');
                    $('#eDescripcionProyecto').addClass('disabled');
                    $('#horas').addClass('disabled');
                    $('#minutos').addClass('disabled');

                    $('#listadoAdministradores li button').addClass('disabled');
                    $('#listadoAdministradores li button').off('click');
                    $('#botonSeleccionarAdministradores').off('click');

                } else if (datos == -1) {
                    mensajeDanger('Sin permisos para realizar esta acción');
                } else if (datos == -2) {
                    mensajeDanger("Faltan datos", "Error");
                } else if (datos == -3) {
                    mensajeDanger("Fallo en la consulta", "Error");
                }
            })
            .fail(function (datos) {
                falloAjax();
            })
    }
}

function rellenarSelectConEstados(estado) {
    let selector = $('#selectorDeEstados');
    let boton = $('#botonModificar');
    if (estado === 'Creado') {
        selector.addClass('btn-info');
        selector.append("<option selected value='Creado'>Creado</option>");
    } else {
        selector.append("<option value='Creado'>Creado</option>");
    }
    if (estado === 'En curso') {
        selector.addClass('btn-success');
        selector.append("<option selected value='En curso'>En curso</option>");
    } else {
        selector.append("<option  value='En curso'>En curso</option>");

    }
    if (estado === 'En espera') {
        selector.addClass('btn-warning');
        selector.append("<option selected value='En espera'>En espera</option>");

    } else {

        selector.append("<option value='En espera'>En espera</option>");
    }

    if (estado === 'Finalizado') {
        $('#controlModificacionProyecto').empty();
        $('#botonActualizarAdministradores').remove();


        setTimeout(function () {
            $('#listadoAdministradores li button').addClass('disabled');
            $('#listadoAdministradores li button').off('click');
            $('#botonSeleccionarAdministradores').off('click');

            $('#eNombreProyecto').attr('readonly', true);
            $('#eDescripcionProyecto').attr('readonly', true);
            $('#horas').attr('readonly', true);
            $('#minutos').attr('readonly', true);
        }, 1000)

    }
    // if (estado === 'Finalizado') {
    //     selector.addClass('btn-secondary');
    //     selector.append("<option selected value='Finalizado'>Finalizado</option>");

    // } else {
    //     selector.append("<option value='Finalizado'>Finalizado</option>");

    // }

    cambiarColorSelect();
    validarFormularioUpdate();
}
/**
 * Funcion encargada de cambiar el color del select dependiendo de lo que tenga seleccionado.
 */
function cambiarColorSelect() {
    $('#selectorDeEstados').change(function (e) {
        if ($(this).val() == 'Creado') {
            $(this).removeClass('form-control  bg-success bg-warning bg-secondary');
            $(this).addClass('form-control  bg-info')
        } else if ($(this).val() == 'En curso') {
            $(this).removeClass('form-control  bg-info bg-warning bg-secondary');
            $(this).addClass('form-control  bg-success')

        } else if ($(this).val() == 'En espera') {
            $(this).removeClass('form-control   bg-info bg-success bg-secondary');
            $(this).addClass('form-control  bg-warning')
        } else if ($(this).val() == 'Finalizado') {
            $(this).removeClass('form-control  bg-info bg-success bg-warning');
            $(this).addClass('form-control  bg-secondary')
        }

    })
}
/**
 * Funcion encargada de validar el formulario
 */
function validarFormularioUpdate() {
    $('#formularioProyecto').validate({
        rules: {
            'eNombreProyecto': {
                required: true
            },
            'eDescripcionProyecto': {
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
            'eNombreProyecto': {
                required: "Dato requerido"
            },
            'eDescripcionProyecto': {
                required: "Dato requerido",
                maxlength: "Descripción demasiado larga, el texto que esta introduciendo como descripción es superior a 1000 palabras.",
                minlength: "Descipción demasiado corta."
            }
        },
        submitHandler: function (form, event) {
            event.preventDefault();

            enviarActualizacionProyecto();
        },
    })
}

function volverAtras() {

    $('#contenido').fadeToggle('slow');
    $('#contenido').empty();
    $('#contenido').html(preload);


    setTimeout(function () {
        $.post('vistas/Proyectos/proyectosResumen.html', function (htmle) {
            $('#contenido').html(htmle);
        }, 'html');
    }, 1000)

}

function agrearFuncionalidadSelectorAdministradores() {


    $('#botonSeleccionarAdministradores').click(function () {
        let correoSeleccionado = $('#selectorAdministradores').val();
        if (correoSeleccionado !== 'Seleccionar Administradores...') {

            $('#listadoAdministradores').append("<li class='list-group-item' value='" + correoSeleccionado + "'> <button class='btn btn-outline-danger'><i class='fas fa-trash'></i></button> " + correoSeleccionado + "</li>");
            $("#selectorAdministradores option[value='" + correoSeleccionado + "']").remove();

            $("#listadoAdministradores li[value='" + correoSeleccionado + "'] button").click(function (e) {

                let correo = $(this).parent("li").attr('value');
                $('#selectorAdministradores').append("<option value='" + correo + "'>" + correo + "</option>");

                $("#listadoAdministradores li[value='" + correoSeleccionado + "']").remove()
            })

        }
    })

}

/**
 * Funcion encargada de añadir los administradores del proyecto a una lista 
 * para que el usuario pueda decicir si añadir más  administradores o eliminarlos.
 * Elimina del Select #selectorAdministradores el nombre que ya este dentro.
 * @param {JSON} datos ;
 */
function dibujarAdministradores(datos) {
    $('#listadoAdministradores').empty();

    for (let i = 0; i < datos.length; i++) {
        $('#listadoAdministradores').append("<li class='list-group-item' value='" + datos[i]['fk_correo'] + "'><button class='btn btn-outline-danger'><i class='fas fa-trash'></i></button> " + datos[i]['fk_correo'] + "</li>")

        //Eliminamos la opcion de añadir a este usuario en select
        $("#selectorAdministradores option").each(function (it, e) {
            if ($(e).val() === datos[i]['fk_correo']) {
                // en el caso de que el administrador este en la lista, se elimina.
                $(e).remove();
            }
        })
        //añadimos el  evento para eliminar el elemento de la lista 
        $('#listadoAdministradores li:last button').click(function (e) {

            let correo = $(this).parent("li").attr('value');
            $('#selectorAdministradores').append("<option value='" + correo + "'>" + correo + "</option>");

            $("#listadoAdministradores li[value='" + correo + "']").remove()
        })

    }

    agrearFuncionalidadSelectorAdministradores();
}
//#endregion
//#region  SolicitudDatos

function solicitarDatosProyectoID() {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'listarProyectoPorid',
                'idProyecto': idProyecto
            },

        })
        .done(function (datos) {
            let resultado = JSON.parse(datos);
            agregarDatos(resultado);
        })
        .fail(function (datos) {
            falloAjax();
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

            solicitarAdministradoresProyecto();
        })
        .fail(function (data) {
            falloAjax();
        })
}


function solicitarAdministradoresProyecto() {
    //Añadimos el preload
    $('#listadoAdministradores').append(preloadAzul);

    $.ajax({
        type: "POST",
        url: webService,
        data: {
            'accion': 'devolverAdministradores',
            'idProyecto': idProyecto
        },
    }).done(function (datos) {
        dibujarAdministradores(JSON.parse(datos));
    }).fail(falloAjax);
}
//#endregion
//#region EnvioDeDatos

function enviarActualizacionProyecto() {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'actualizarProyecto',
                'idProyecto': $('#cIDProyecto').val(),
                'nonbreProyecto': $('#eNombreProyecto').val(),
                'descripcionProyecto': $('#eDescripcionProyecto').val(),
                'horas': $('#horas').val(),
                'minutos': $('#minutos').val(),
                'estado': $('#selectorDeEstados').val(),
            },
        })
        .done(function (datos) {

            if (datos == 1) {
                mensajeSuccess('Proyecto modificado');
            } else if (datos == -1) {
                mensajeDanger('No tienes permisos para realizar esta accion');
            } else if (datos == -2) {
                mensajeInfo('Error en la conexion con el servicio, Intentelo en unos minutos');
            } else if (datos == -3) {
                mensajeWarning("Error en la consulta, Intentelo en unos minutos");
            }
        })
        .fail(function () {
            falloAjax();
        })
}
//funcion encargada de optener del listado los administradores del proyecto.
function enviarActualizacionAdministradores() {

    //asignamos el evento al boton de actualizar.
    $('#botonActualizarAdministradores').click(function (evento) {

        $('#botonActualizarAdministradores').html(preload);
        let listado;
        let datos = new Array(); //los correos que se le enviara al servicio.

        listado = $('#listadoAdministradores').children();
        listado.each(function (i, e) {
            datos.push($(e).attr('value'));
        })

        if (datos.length != 0) {
            EnviarDatosActualizacionAdministradores(datos);
        } else {
            mensajeDanger('No se han selecionado administradores', 'error en la inserción de datos');
            $('#botonActualizarAdministradores').html("<i class='fas fa-upload'></i> Actualizar");

        }
    })

    function EnviarDatosActualizacionAdministradores(datos) {
        $.ajax({
                type: "POST",
                url: webService,
                data: {
                    'accion': 'actualizarAdministradoresProyecto',
                    'id': $('#cIDProyecto').val(),
                    'correos': datos
                },
            })
            .done(function (datos) {

                console.log(datos)
                if (datos == 1) {
                    mensajeSuccess('Administrador/es añadido al proyecto', 'Cambios almacenados')
                } else if (datos == -1) {
                    mensajeInfo('Usuario sin permisos para realizar esta acción', 'Notificación');
                } else if (datos == -2 || datos == -3) {
                    mensajeWarning('No se han introducido administradores');
                } else if (datos == -4) {
                    mensajeWarning('Error en la consulta de insercion de administradores', 'Contacte al programador.')
                } else if (datos == -5) {
                    mensajeWarning('Error en la consulta de borrado de administradores', 'Contacte al programador.')
                }

                $('#botonActualizarAdministradores').html("<i class='fas fa-upload'></i> Actualizar");
            })
            .fail(function (datos) {
                falloAjax();
                $('#botonActualizarAdministradores').html("<i class='fas fa-upload'></i> Actualizar");
            })
    }

}
//#endregion