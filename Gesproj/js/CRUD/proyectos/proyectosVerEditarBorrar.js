$(function () {
    //si id de producto es 0 quiere decir que hubo un fallo.
    if (idProyecto !== 0) {
        $('#cIDProyecto').val(idProyecto);
        solicitarDatosProyectoID();
    } else {
        mensajeDanger("Error al obtener la id del proyecto, Intentelo en unos minutos", "ERROR");
    }
    //añadimos eventos para poder volver atras.btn-warning
    $('#volverResumenProyectos').click(volverAtras);

    solicitarDatosAdministradores();

    agrearFuncionalidadSelectorAdministradores();



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
        $('#eFechaFinalizacionProyecto').val(fechaFinalizacion);
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
        })
    } else {
        $('#botonFinalizar').addClass('disabled');
    }
}

function rellenarSelectConEstados(estado) {
    let selector = $('#selectorDeEstados');
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
        selector.addClass('btn-secondary');
        selector.append("<option selected value='Finalizado'>Finalizado</option>");

    } else {
        selector.append("<option value='Finalizado'>Finalizado</option>");

    }

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
    $('#contenido').empty();
    $('#contenido').html(preload);


    $.post('vistas/proyectos/proyectosResumen.html', function (htmle) {
        $('#contenido').html(htmle);
    }, 'html');
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

function solicitarAdministradoresProyecto() {
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
//#endregion