$(function () {
    // $('#contenido').fadeToggle(2000);
    $('#contenido').fadeIn('250');

    //solicitud de datos.
    solicitarProyectosPorTareas();

    //eliminamos el boton de crear tarea para los usuarios no administradores.
    controlBotonesPorRol();

    //añadimos un preload para mostrar la espera de las tareas.
    $('#listadoTareas').html(preloadAzul)


    //asignamos el evento al boton de crear tareas 
    $('#crearTarea').click(function (e) {
        $('#contenido').empty();
        $('#contenido').html(preload);

        $.post('vistas/Tareas/tareasCrear.html', function (htmle) {
            $('#contenido').html(htmle);
        }, 'html');
    })

    botonCrearTareaSegunProyecto();
    validarFormularioCrearTareaPorProyecto();
    validarFormularioEditarTarea();
    solicitarUsuarios();
    botonAniadirSelectUsuarios();
    botonesModalCrearTareaPorProyecto();

    botonesModalEditarTareaPorProyecto();

    eventosAlCerrarModales();

    ModalSolicitarTarea();

})



//#region Solicitud Datos;


/**
 * Funcion encargada de traer las tareas de cada proyecto que tiene el  usuario.
 * 
 */
function solicitarProyectosPorTareas() {
    let proyectos = new Array();
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'solicitarProyectosYtareas'
            }

        })
        .done(function (datos) {

            if (datos == 2) {
                $('#listadoTareas').empty();
                $('#crearTareaSegunProyecto').remove();
                $('#solicitarTareaSegunProyecto').remove();
                $('#listadoTareas').html("<h4 class='text-center'>Usted no tiene ninguna tarea, ni es administrador de ningun proyecto.</h4>")
            } else {
                let respuesta = JSON.parse(datos);


                for (let i = 0; i < respuesta.length; i++) {

                    //le meto un espacio a la clave del array, porque como es un identificador numerico, nos crea un array con X posiciones vacias hasta llegar al indice.
                    // ejemplo, si el indice es 1001, nos crea un array con 1002 posiciones y las 1001 posiciones anteriores estan vacias.
                    if (proyectos[respuesta[i]['pk_idProyecto'] + " "]) {
                        //si existe el array añadimos el objeto al completo.
                        proyectos[respuesta[i]['pk_idProyecto'] + " "].push(respuesta[i]);
                    } else {
                        //si no existe la entrada en el array la creamos con los datos necesarios.
                        proyectos[respuesta[i]['pk_idProyecto'] + " "] = [respuesta[i]];
                    }

                }


                dibujarProyectos(proyectos);
            }


        })
        .fail(function (datos) {
            falloAjax();
        })
}

function solicitarDatosPorId(id) {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'solicitarTareasYProyectoID',
                'idProyecto': id
            },
        })
        .done(function (datos) {
            // console.log(datos);

            if (JSON.parse(datos)[0]['pk_idTarea'] == undefined) {

                $('#listadoTareas').html("")
                dibujarDatosProyectoSinTareas(JSON.parse(datos));
            } else {


                //añadimos un preload para mostrar la espera de las tareas.
                $('#listadoTareas').html(preloadAzul);

                dibujarTareasPorProyectos(JSON.parse(datos));

            }
        })
        .fail(function (datos) {
            falloAjax();
        })
}

/**
 * Funcion encargada de obtener los datos del proyecto seleccionado por defecto ( el primero)
 */
function solicitarDatosPrimerProyectoSeleccionado() {
    solicitarDatosPorId($("#Proyecto1").attr('data-idProyecto'))
}
/**
 * solicitamos los datos de los usuarios para dibujarlos en el select del modal.
 **/
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
            aniadeUsuariosSelectModal(JSON.parse(data));
        }

    }).fail(falloAjax);
}
/**
 * Funcion que nos devolvera los datos de la tarea para la edicion de la misma, necesita una id.
 */
function solicitarTareaPorID(id) {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'solicitarTareaId',
                'id': id
            },
        })
        .done(function (datos) {
            cargarDatosModalEditar(datos);
        })
        .fail(falloAjax);
}


function solicitarAnotacionesPorTarea(id, btn) {



    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'obtenerAnotacionesPorTarea',
                'id': id
            }
        }).done(function (e) {

            let elementos = "";

            if (e == 1) {
                //tarea sin anotaciones
                //vaciamos la lista.
                $('#listaAnotacionesModal').empty();
                elementos = " <li class='list-group-item active'> <h4> Anotaciones de la Tarea </h4> </li> ";
                elementos += " <li class='list-group-item list-group-item-warning'> Esta tarea no tiene anotaciones </li>";
                $('#listaAnotacionesModal').append(elementos);
            } else if (e == -1) {
                mensajeDanger('Faltan datos en la solicitud, contacte con el administrador', 'ERROR')
            } else if (e == -2) {
                mensajeDanger('Su usuario no tiene permisos para visualizar las anotaciones de esta tarea');
            } else {
                let anotaciones = JSON.parse(e);

                //vaciamos la lista de anotaciones
                $('#listaAnotacionesModal').empty();
                elementos = " <li class='list-group-item active'> <h4> Anotaciones de la Tarea </h4> </li> ";
                for (let i = 0; i < anotaciones.length; i++) {

                    elementos += "<li class='list-group-item'>";
                    elementos += "<div class='row'>";
                    elementos += "<div class='col-9'><small><strong>Nombre:<br> </strong>" + anotaciones[i]['nombre'];
                    elementos += "</small></div>";
                    elementos += "<div class='col-3'>";
                    elementos += "<button data-toggle='tooltip' data-placement='top' title='" + anotaciones[i]['fk_correo'] + "' class='btn btn-sm btn-outline-info'><i class='fas fa-user'></i></button>";
                    elementos += "<button data-toggle='tooltip' id='eliminarAnotacion' data-idAnotacion='" + anotaciones[i]['pk_idAnotacion'] + "' data-placement='bottom' title='eliminar anotación' class='btn btn-sm btn-outline-danger'><i class='fas fa-trash'></i></button>";
                    elementos += "</div>";
                    elementos += "</div>";
                    elementos += "<hr class='ml-5 mr-5'>";
                    elementos += "<div class='row'>";


                    if (anotaciones[i]['descripcion'].length > 60) {
                        elementos += "<div class='col text-truncate mt-1 ' id='descripcion'><small><strong class=''>Descripción: </strong> <button data-estado='false' id='ampliarDescipcion' class='btn btn-sm'><i class='fas fa-chevron-down'></i></button> <br> "

                    } else {
                        elementos += "<div class='col text-truncate '><small><strong class=''>Descripción: </strong><br> "

                    }
                    elementos += anotaciones[i]['descripcion'];
                    elementos += "</small></div>";
                    elementos += "</div>";
                    elementos += "</li>";
                    $('#listaAnotacionesModal').append(elementos);
                    elementos = "";


                    $('button #ampliarDescipcion:last').off('click');

                    $('div #descripcion button#ampliarDescipcion:last').click(function (e) {

                        let descripcion = $(this).parent().parent();
                        let boton = this;





                        if ($(boton).attr('data-estado') == 'true') {
                            $(descripcion).addClass('text-truncate');
                            $(boton).html('<i class="fas fa-chevron-down"></i>')
                            $(boton).attr('data-estado', 'false');
                        } else {
                            $(descripcion).removeClass('text-truncate');
                            $(boton).html('<i class="fas fa-chevron-up"></i>')
                            $(boton).attr('data-estado', 'true')
                        }
                    })
                }

                $('#listaAnotacionesModal button[data-toggle="tooltip"]').tooltip();


            }
            $('#modalAnotaciones').modal('show');

            if (btn == "") {

            } else {
                $(btn).html('<i class="fas fa-th-list"></i>');

            }
            //asignamos evento a botones borrar
            $('div #eliminarAnotacion').click(function (e) {
                let idAnotacion = $(this).attr('data-idAnotacion');

                $(this).html(preloadPequenio);

                eliminarAnotacion(idAnotacion, this);


            })
        })
        .fail(falloAjax);



}
//#endregion




//#region funcionalidad

function eventosAlCerrarModales() {
    $('#modalEditarTarea').on('hidden.bs.modal', function (e) {

        $('#listaAdministradores').empty();
        $('#listadoUsuariosEdicion').empty();

        recargarVista();
    });
}

function validarFormularioEditarTarea() {
    let formulario = $('#formularioEdicionTarea');

    formulario.validate({

        rules: {
            nombreTareaEdicion: {
                required: true,
                minlength: 3,
                maxlength: 100
            },
            descripcionTareaEdicion: {
                required: true,
                minlength: 3,
                maxlength: 600
            },
            horasEdicion: {
                required: true,
                number: true
            },

            minutosEdicion: {
                required: true,
                number: true

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

            enviarDatosModalEdicion();
        }
    });
}
/**
 * Funcion encargada de dibujar los datos de los proyectos en las  diferentes pestañas, tambien 
 * se encarga de solicitar los datos del primer proyecto que se muestra y
 * por ultimo hace una llamada a la funcion para asignar eventos a las pestañas
 * 
 */
function dibujarProyectos(proyectos) {
    let aux = true; //funcion que nos permite mostrar como visible el primer proyecto en la seccion de las ventanas de tareas.

    for (const key in proyectos) {

        if (aux) {
            $('#listaProyectos').append("<a class='nav-item nav-link active ' id='Proyecto1' data-idProyecto='" +
                proyectos[key][0]['pk_idProyecto'] +
                "' data-toggle='tab'  role='tab'  aria-selected='true'><span class='mb-1 d-inline-block text-truncate' style='max-width: 200px;'> <span id='contenedorIcono'><i id='icono' class='mb-0 fas fa-sync-alt'></i></span><span id='texto' class=''> " +
                proyectos[key][0]['nombreProyecto'] +
                " </span> </span> </a>")
            aux = false;
        } else {
            $('#listaProyectos').append("<a class='nav-item nav-link w-25' id='nav-home-tab' data-toggle='tab' data-idProyecto='" +
                proyectos[key][0]['pk_idProyecto'] +
                "'  role='tab'  aria-selected='false'> <span class='d-inline-block text-truncate' style='max-width: 200px;'><span id='contenedorIcono'>  <i id='icono' class='mb-0 fas fa-plus'></i></span> <span id='texto' class='text-primary'>" +
                proyectos[key][0]['nombreProyecto'] + "</span> </span></a>")
        }


    }
    solicitarDatosPrimerProyectoSeleccionado();
    asignarEventosPestanias();

}

/**
 * Funcion encargada de asignar el evento click a las pestañas y hacer una llamada a la funcion 
 * solicitarDatosPorID para obtener todos los datos relacionados con cada proyecto
 */
function asignarEventosPestanias() {
    let iconoReload = '<svg id="icono" class="svg-inline--fa fa-sync-alt fa-w-16 mb-0" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sync-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z"></path></svg>';
    let iconoAspa = '<svg id="icono" class="svg-inline--fa fa-plus fa-w-14 mb-0" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>'
    let pestania = ($('#listaProyectos a'));



    pestania.click(function (e) {

        for (let i = 0; i < pestania.length; i++) {
            $(pestania[i] + " #contenedorIcono").html(iconoAspa);
            $(pestania[i] + " #texto").removeClass('text-secondary');
            $(pestania[i] + " #texto").addClass('text-primary');
        }
        $(this).find('span #texto').removeClass('text-primary');
        $(this).find('span #texto').addClass('text-secondary');
        $(this).find('span #contenedorIcono').html(iconoReload);
        // $(this)fund.html(iconoReload);



        //$(this +'#contenedorIcono').html(iconoReload)





        $('#listadoTareas').html(preloadAzul);
        solicitarDatosPorId($(this).attr('data-idproyecto'))
    })
}
/**
 * Funcion encargada de dibujar los datos del proyecto, ya que no tiene tareas, mostrara un mensaje.
 * @param {*} datos 
 * 
 */
function dibujarDatosProyectoSinTareas(datos) {

    let elementos = "   <div class='container'>" +
        " <br>" +
        "  <div class='row '>" +
        "      <div class='col col-lg-4 text-truncate'>Nombre: <strong>" + datos[0]['nombreProyecto'] + "</strong></div>";

    if (datos[0]['estadoProyecto'] == "En curso") {
        elementos += "     <div class='col col-lg-3'> <span class='badge badge-success'>" + datos[0]['estadoProyecto'] + "</span></div>"
    } else if (datos[0]['estadoProyecto'] == "En espera") {
        elementos += "     <div class='col col-lg-3'> <span class='badge badge-warning'>" + datos[0]['estadoProyecto'] + "</span></div>"
    } else if (datos[0]['estadoProyecto'] == "Creado") {
        elementos += "     <div class='col col-lg-3'> <span class='badge badge-primary'>" + datos[0]['estadoProyecto'] + "</span></div>"
    } else if (datos[0]['estadoProyecto'] == "Finalizado") {
        elementos += "     <div class='col col-lg-3'> <span class='badge badge-secondary'>" + datos[0]['estadoProyecto'] + "</span></div>"
    }

    // "     <div class='col col-lg-3'>" + datos[0]['estadoProyecto'] + "</div>";


    elementos += "      <div class='col col-lg-3'> tiempo estimado: <strong>" + datos[0]['estimacionProyecto'] + "</strong></div>" +
        "      <div class='col col-lg-2'> id: <input type='text' size='5' class='form-control-sm' disabled readonly" +
        "             id='idProyecto' value='" + datos[0]['pk_idProyecto'] + "'></div>" +
        "" +
        "  </div>" +
        "  <hr>";
    if (rolUsuario == 0) {
        elementos += "<h4 class='text-center'>No tienes tareas asignadas</h4>";

    } else {
        elementos += "<h4 class='text-center'>El proyecto no tiene tareas asignadas</h4>";

    }

    $('#listadoTareas').html(elementos);


}
/**
 * funcion encargada de dibujar en el dom las tareas de cada proyecto.
 */
function dibujarTareasPorProyectos(datos) {



    let elementos = "   <div class='container'>" +
        " <br>" +
        "  <div class='row '>" +
        "      <div class='col col-lg-4'>Nombre: <strong>" + datos[0]['nombreProyecto'] + "</strong></div>";

    if (datos[0]['estadoProyecto'] == "En curso") {
        elementos += "     <div class='col col-lg-3'> <span class='badge badge-success'>" + datos[0]['estadoProyecto'] + "</span></div>"
    } else if (datos[0]['estadoProyecto'] == "En espera") {
        elementos += "     <div class='col col-lg-3'> <span class='badge badge-warning'>" + datos[0]['estadoProyecto'] + "</span></div>"
    } else if (datos[0]['estadoProyecto'] == "Creado") {
        elementos += "     <div class='col col-lg-3'> <span class='badge badge-primary'>" + datos[0]['estadoProyecto'] + "</span></div>"
    } else if (datos[0]['estadoProyecto'] == "Finalizado") {
        elementos += "     <div class='col col-lg-3'> <span class='badge badge-secondary'>" + datos[0]['estadoProyecto'] + "</span></div>"
    }

    // "     <div class='col col-lg-3'>" + datos[0]['estadoProyecto'] + "</div>";


    elementos += "      <div class='col col-lg-3'> tiempo estimado: <strong>" + datos[0]['estimacionProyecto'] + "</strong></div>" +
        "      <div class='col col-lg-2'> id: <input type='text' size='5' class='form-control-sm' disabled readonly" +
        "             id='idProyecto' value='" + datos[0]['pk_idProyecto'] + "'></div>" +
        "" +
        "  </div>" +
        "  </div>" +
        "  </div>" +
        "  <hr>";





    for (let i = 0, j = 1; i < datos.length; i++, j++) {

        if (j == 1) {
            elementos += " <div class='row mb-3'>";
        }
        elementos += "<div class='col-6 col-sm-4 col-lg-3 mb-2 '>" +
            "<div class='card' id='tareas'>" +
            "<div class='row m-1'>" +
            "<small class='col col-lg-6 text-truncate'>" + datos[i]['nombreTarea'] + "</small>";


        if (datos[i]['estadoTarea'] == "En curso") {
            elementos += "     <div class='col col-lg-3'> <span class='badge badge-success'>" + datos[i]['estadoTarea'] + "</span></div>"
        } else if (datos[i]['estadoTarea'] == "En espera") {
            elementos += "     <div class='col col-lg-3'> <span class='badge badge-warning'>" + datos[i]['estadoTarea'] + "</span></div>"
        } else if (datos[i]['estadoTarea'] == "Creado") {
            elementos += "     <div class='col col-lg-3'> <span class='badge badge-primary'>" + datos[i]['estadoTarea'] + "</span></div>"
        } else if (datos[i]['estadoTarea'] == "Finalizado") {
            elementos += "     <div class='col col-lg-3'> <span class='badge badge-secondary'>" + datos[i]['estadoTarea'] + "</span></div>"
        }
        elementos += "</div>" +
            "<hr class='m-2 bg-secondary'>" +
            "<div class='row m-1'>" +
            "<div class='col'>" +
            "<div class='row'>" +
            "<small class='col '>Descripción:</small>" +
            "</div>" +
            "<div class='row '>" +
            "<small class='col text-truncate '>" + datos[i]['descripcionTarea'] + "</small>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<hr class='m-2 bg-secondary'>" +
            "<div class='row m-1'>" +
            "<div class='col'>" +
            "<div class='row'>" +
            "<small class='col '>Fecha de creación:</small>" +
            "</div>" +
            "<div class='row '>" +
            "<small class='col '>" + datos[i]['fechaInicioTare'] + "</small>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<hr class='m-2 bg-secondary'>" +
            "<div class='row m-1'>";


        if (datos[i]['estimacionTarea'].split(':')[0] < 10) {
            elementos += "<small class='col col-lg-6'>Estimación: <br> 0" + datos[i]['estimacionTarea'].split(':')[0] + ":";
            if (datos[i]['estimacionTarea'].split(':')[1] < 10) {
                elementos += "0" + datos[i]['estimacionTarea'].split(':')[1];
            } else {
                elementos += datos[i]['estimacionTarea'].split(':')[1];
            }
            elementos += "</small>"
        } else {
            elementos += "<small class='col col-lg-6'>Estimación: <br>" + datos[i]['estimacionTarea'].split(':')[0] + ":";
            if (datos[i]['estimacionTarea'].split(':')[1] < 10) {
                elementos += "0" + datos[i]['estimacionTarea'].split(':')[1];
            } else {
                elementos += datos[i]['estimacionTarea'].split(':')[1];
            }
            elementos += "</small>"
        }


        // "<small class='col col-lg-6'>Estimación: <br> " + datos[i]['estimacionTarea'] + "</small>" ;
        elementos +=
            "<div class='col col-lg-6'>" +
            "<div class='btn-group' id='contenedorBotonesAccionTarea' role='group' aria-label='Basic example'>";

        if (rolUsuario == 90) {

            elementos += "<button type='button' id='botonEliminarTareaAdministrador' data-idTarea='" + datos[i]['pk_idTarea'] + "' class='btn btn-sm btn-outline-danger'><i class='fas fa-trash'></i></button>";
            elementos += "<button type='button' id='botonVerTareaAdministrador' data-idTarea='" + datos[i]['pk_idTarea'] + "' class='btn btn-sm btn-outline-info '><i class='fas fa-pen'></i></button>"
            elementos += "<button type='button' id='botonVerAnotaciones' data-idTarea='" + datos[i]['pk_idTarea'] + "' class='btn btn-sm btn-outline-secondary '><i class='fas fa-th-list'></i></button>"
        } else if (rolUsuario == 0) {
            elementos += "<button type='button' id='botonVerAnotaciones' data-idTarea='" + datos[i]['pk_idTarea'] + "' class='btn btn-outline-secondary '><i class='fas fa-th-list'></i></button>"

        } else {
            elementos += "<button type='button'  id='botonVerTareaAdministrador' data-idTarea='" + datos[i]['pk_idTarea'] + "' class='btn btn-outline-info '><i class='fas fa-pen'></i></button>"
            elementos += "<button type='button' id='botonVerAnotaciones' data-idTarea='" + datos[i]['pk_idTarea'] + "' class='btn btn-outline-secondary '><i class='fas fa-th-list'></i></button>"

        }

        elementos += " </div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>";








        if (j == 4) { //controlamos que el contador auxiliar no pase de 4 para dibujar las diferentes filas de tareas.
            elementos += "</div>";
            j = 0;
        }
    }
    if (datos.length <= 3) {
        elementos += "</div>";
    }

    elementos += " </div>"; //cierre del container


    //Añadimos los datos formateados al DOM

    $('#listadoTareas').html(elementos);


    eventosBotonesAccionesTareas();

    abrirModalAnotaciones();
}
/**
 * Funcion encargada de cargar los datos en el modal de edicion y mostrarlo.
 */
function cargarDatosModalEditar(datosRaw) {


    if (datosRaw == -1) {
        mensajeDanger('Faltan permisos', '¡ERROR!')
    } else if (datosRaw == -2) {
        mensajeDanger('Faltan datos', '¡ERROR!')
    } else if (datosRaw == -3) {
        mensajeDanger('La tarea que intenta solicitar no existe', '¡ERROR!')
    } else {
        let datos = JSON.parse(datosRaw);
        let hora = datos['tarea'][0]['estimacion'].split(':');
        let option;
        //rellenamos la parte de la tarea en el modal.

        $('#idTareaEditar').val(datos['tarea'][0]['pk_idTarea'])
        $('#nombreTareaEdicion').val(datos['tarea'][0]['nombreTarea'])
        $('#descripcionTareaEdicion').val(datos['tarea'][0]['descripcion'])
        $('#fechaCreacionTareaEditar').val(datos['tarea'][0]['fechaInicio'])
        if (hora[0] < 10) {
            $('#horasEdicion').val("0" + hora[0]);
        } else {
            $('#horasEdicion').val(hora[0]);
        }
        if (hora[1] < 10) {
            $('#minutosEdicion').val("0" + hora[1]);
        } else {
            $('#minutosEdicion').val(hora[1]);
        }

        // $('#nombreTareaEdicion').val(datos['tarea'][0]['estado'])
        option = $('#selectorEstadoTarea option');

        for (let i = 0; i < option.length; i++) {

            if (datos['tarea'][0]['estado'] == $(option[i]).val()) {
                $(option).attr('selected', true);

            } else {
                $(option).attr('selected', false);
            }

        }
        //rellenamos la parte de administradores.
        for (let i = 0; i < datos['administradores'].length; i++) {

            datos['administradores'][i]['fk_correo'];

            $('#listaAdministradores').append("<li class='list-group-item' value='" + datos['administradores'][i]['fk_correo'] + "'> <i class='fas fa-user-cog  fa-lg text-success'></i>  " + datos['administradores'][i]['fk_correo'] + "</li>")

        }

        //rellenamos la seccion usuarios
        for (let i = 0; i < datos['usuarios'].length; i++) {

            $('#listadoUsuariosEdicion').append("<li class='list-group-item text-truncate' value='" + datos['usuarios'][i]['fk_correo'] + "'> <button class='btn btn-outline-danger'><i class='fas fa-trash'></i></button> " + datos['usuarios'][i]['fk_correo'] + "</li>")

        }

        //asignamos los eventos a los botones de borrar usuarios de la lista;
        actualizarEventoBorradoUsuariosEditar();
        //eliminamos los usuarios del select que ya este en la lista.

        let listaUsuarios = $('#listadoUsuariosEdicion li');
        let listaOption = $('#selectorUsuariosModalEdicion option');

        for (let i = 0; i < listaUsuarios.length; i++) {

            for (let j = 0; j < listaOption.length; j++) {


                if ($(listaUsuarios[i]).attr('value') == $(listaOption[j]).text()) {
                    $(listaOption[j]).remove();
                }

            }

        }

        //mostramos el modal;
        $('#modalEditarTarea').modal('show');

        //al cerrar los modales, eliminamos las listas.


    }



}

function eventosBotonesAccionesTareas() {

    let botonesBorrarTarea = $('#contenedorBotonesAccionTarea #botonEliminarTareaAdministrador');
    let botonesEditarTarea = $('#contenedorBotonesAccionTarea #botonVerTareaAdministrador');

    for (let i = 0; i < botonesBorrarTarea.length; i++) {
        $(botonesBorrarTarea[i]).click(function () {

            let id = $(this).attr('data-idTarea')


            let mensaje = bootbox.dialog({
                title: 'Está apunto de borrar una tarea',
                message: "<p>¿Seguro qué quiere borrarla?</p>",
                buttons: {
                    cancel: {
                        label: "Eliminar",
                        className: 'btn-danger',
                        callback: function () {
                            $.ajax({
                                    type: "POST",
                                    url: webService,
                                    data: {
                                        'accion': 'borrarTareaPorId',
                                        'id': id
                                    }
                                }).done(function (data) {

                                    recargarVista();
                                    if (data == 1) {
                                        mensajeSuccess('Tarea eliminada con éxito')
                                    } else if (data = -1) {
                                        mensajeDanger('No tiene permisos para realizar esta accion', '¡ERROR!')
                                    } else if (data = -2) {
                                        mensajeDanger('Hubo un error al borrar los datos, contacte con el administrador', '¡ERROR!')
                                    }


                                })
                                .fail(falloAjax)
                        }
                    },
                    ok: {
                        label: "cancelar",
                        className: 'btn-success',
                        callback: function () {
                            mensaje.modal('hide');
                        }
                    }


                },

            });

        })

    }


    for (let i = 0; i < botonesEditarTarea.length; i++) {

        $(botonesEditarTarea[i]).click(function () {
            let boton = this;
            $(boton).html(preloadPequenio);
            solicitarTareaPorID($(this).attr('data-idtarea'))

            setTimeout(function () {
                $(boton).html("<i class='fas fa-pen'></i>");
            }, 3000)

        });
    }

}

function botonCrearTareaSegunProyecto() {

    $('#crearTareaSegunProyecto').click(function () {
        $('#modalModeradorCrearTarea').modal('show')

    })

    $('#modalModeradorCrearTarea').on('hidden.bs.modal', function (e) {

        $('#listadoUsuarios').empty();
        recargarVista();
    });


}

function validarFormularioCrearTareaPorProyecto() {
    $('#formularioCreacionTareaModal').validate({

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
                number: true

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
            $('#botonEnviarFormularioModal').html(preloadPequenio);
            enviarTareaModal();
        }
    });
}

function aniadeUsuariosSelectModal(datos) {


    for (let i = 0; i < datos.length; i++) {

        $('#selectorUsuariosModal').append("<option >" + datos[i]['pk_correo'] + "</option>")
        $('#selectorUsuariosModalEdicion').append("<option value='" + datos[i]['pk_correo'] + "' >" + datos[i]['pk_correo'] + "</option>")


    }

}

function botonAniadirSelectUsuarios() {
    $('#botonSeleccionarUsuarios').click(function (e) {

        if ($('#selectorUsuariosModal').val() != "Seleccionar usuarios...") {

            $('#listadoUsuarios').append("<li class='list-group-item' value='" + $('#selectorUsuariosModal').val() + "'> <button class='btn btn-outline-danger'><i class='fas fa-trash'></i></button> " + $('#selectorUsuariosModal').val() + "</li>")

            $('#selectorUsuariosModal option:selected').remove();

            //añadimos el evento a los botones que vamos añadiendo para borrar a los usuarios.


            $('#listadoUsuarios li button:last').click(function (e) {

                $('#selectorUsuariosModal').append("<option >" + $(this).parent('li').attr('value') + "</option>")

                $(this).parent('li').remove();

            });

        }
    })
}

function botonesModalCrearTareaPorProyecto() {

    botonResetModal();
    botonEnviarModal();


    function botonResetModal() {
        $('#resetFormularioModal').click(function () {
            $('#formularioCreacionTareaModal')[0].reset();

        })
    }

    function botonEnviarModal() {

        $('#botonEnviarFormularioModal').click(function (e) {
            $('#formularioCreacionTareaModal').submit();
        })
    }



}

function botonesModalEditarTareaPorProyecto() {
    botonEnviarModalEditar();
    botonAniadirSelectUsuariosEditarTarea();

    function botonEnviarModalEditar() {
        $('#botonEnviarFormularioModalEdicion').click(function (e) {
            $('#formularioEdicionTarea').submit();
        })
    }

    function botonAniadirSelectUsuariosEditarTarea() {

        $('#botonSeleccionarUsuariosEdicion').click(function (e) {
            let contenido = $('#selectorUsuariosModalEdicion').val();

            if (contenido != 'Seleccionar usuarios...') {
                $("#selectorUsuariosModalEdicion option[value='" + contenido + "']").remove();
                $('#listadoUsuariosEdicion').append("<li class='list-group-item text-truncate' value='" + contenido + "'> <button class='btn btn-outline-danger'><i class='fas fa-trash'></i></button> " + contenido + "</li>");
                // let elemento = $('#listadoUsuariosEdicion li:last button');
                actualizarEventoBorradoUsuariosEditar();
            }



        })

    }
}


function actualizarEventoBorradoUsuariosEditar() {
    let listado = $('#listadoUsuariosEdicion li');

    for (let i = 0; i < listado.length; i++) {
        //eliminamos el evento.
        $(listado[i]).find('button').off('click');

        //asignamos el evento de nuevo.
        $(listado[i]).find('button').click(function (e) {

            $("#selectorUsuariosModalEdicion").append("<option value='" + $(listado[i]).text().trim() + "'>" + $(listado[i]).text().trim() + "</option>");

            $(listado[i]).remove();

        })

    }
}


function recargarVista() {

    let id = $('#idProyecto').val();
    $('#listadoTareas').html(preloadRojo);


    solicitarDatosPorId(id);





    // $('#contenido').empty();
    // $('#contenido').html(preload);


    // setTimeout(function () {
    //     $.post('vistas/Tareas/tareasResumen.html', function (htmle) {
    //         $('#contenido').html(htmle);
    //     }, 'html');
    // }, 1000)
}

function abrirModalAnotaciones() {



    $('#contenedorBotonesAccionTarea #botonVerAnotaciones').click(function (e) {

        //obtenemos el id de la tarea y la almacenamos en una variable y en un input hidden;
        let idTarea = $(this).attr('data-idTarea');
        $('#idTareaModalAnotaciones').val('idTarea');

        //añadimos preload al boton de las tareas;
        $(this).html(preloadPequenio);

        let contenedorTarea = ($(this).parent().parent().parent().parent());

        let nombreTarea = $(contenedorTarea).find('small')[0];
        //obtenemos el nombre de la  tarea, lo haremos a traves del boton.

        $('#datosTareaModalNotificaciones').empty();
        $('#datosTareaModalNotificaciones').append("<h4 class='text-truncate text-center'>" + $(nombreTarea).text() + "</h4>")


        //generamos los botones de acción, donde se podra crear nuevas anotaciones;
        $('#accionesModalAnotaciones').empty(); //limpiamos la zona.
        $('#accionesModalAnotaciones').append("<button id='comentarioTarea' class='btn  text-left btn-block btn-primary' data-idTarea=" + idTarea + "><i class='fas fa-plus'></i> Comentario</button>")
        $('#accionesModalAnotaciones').append("<button disabled id='listaTarea' class='btn  text-left btn-block btn-primary' data-idTarea=" + idTarea + "><i class='fas fa-list-ul'></i> Lista</button>")

        //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
        //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
        //AÑADIR AUI LOS EVENTOS PARA AÑADIR NUEVAS ANOTACIONES.



        $('#comentarioTarea').click(function (e) {
            var envioNuevoComentarioNombre = false;
            var envioNuevoComentarioDescripcion = false;
            let idTarea = $(this).attr('data-idTarea');
            let elementos = "";


            elementos += "<li id='formularioCrearAnotacion' class='list-group-item list-group-item'>";

            elementos += "<div class='row form-inline'>";
            elementos += "<div class='col-11'><small><strong>Nombre: <br><input id='nombreCrearAnotacion' name='nombreCrearAnotacion' type='text' class='form-control'>";

            elementos += "<span class='text-danger' id='errorNombreAnotacion'></span></small></div>";
            elementos += "<div class='col-1'><button id='cerrarCrearAnotacion' class='btn btn-sm'> <i class='fas fa-times text-danger'></i></button>";
            elementos += "</small></div>";
            elementos += "</div>";

            elementos += "<hr class='ml-5 mr-5'>";

            elementos += "<div class='row'>";
            elementos += "<div class='col-11'><small><strong>Descripción: <textarea id='descripcionCrearAnotacion' name='descripcionAnotacion' class='form-control'></textarea>";

            elementos += "<span class='text-danger' id='errorDescripcion'></span></small></div>";
            elementos += "</div>";

            elementos += "<div class='row mt-2'>";
            elementos += "<div class='col text-center'>";
            elementos += "<button data-idTarea='" + idTarea + "' id='botonEnviarNuevaAnotacionComentario' class='btn btn-success'><i class='fas fa-upload'></i> Crear</button>";
            elementos += "</div>";
            elementos += "</div>";







            elementos += "</li>";


            $('#listaAnotacionesModal').append(elementos);
            $('#comentarioTarea').attr('disabled', 'true');

            $('#cerrarCrearAnotacion').click(function (e) {

                $('#formularioCrearAnotacion').remove();

                $('#comentarioTarea').removeAttr('disabled');
            })




            //validamos el formulario
            $('#nombreCrearAnotacion').blur(function (e) {

                $('#errorNombreAnotacion').empty();
                if ($('#nombreCrearAnotacion').val() == "") {
                    $('#errorNombreAnotacion').html(' Campo requerido.');
                    envioNuevoComentarioNombre = false;

                } else if ($('#nombreCrearAnotacion').val().length <= 6) {
                    $('#errorNombreAnotacion').html(' Se necesita un minimo de 6 caracteres.');
                    envioNuevoComentarioNombre = false;

                } else if ($('#nombreCrearAnotacion').val().length >= 60) {
                    $('#errorNombreAnotacion').html(' Numero máximo de caracteres alcanzado');
                    envioNuevoComentarioNombre = false;

                } else {
                    envioNuevoComentarioNombre = true;

                }
            })

            $('#descripcionCrearAnotacion').blur(function (e) {

                $('#errorDescripcion').empty();
                if ($('#descripcionCrearAnotacion').val() == "") {
                    $('#errorDescripcion').html(' Campo requerido.');
                    envioNuevoComentarioDescripcion = false;

                } else if ($('#descripcionCrearAnotacion').val().length <= 6) {
                    $('#errorDescripcion').html(' Se necesita un minimo de 6 caracteres.');
                    envioNuevoComentarioDescripcion = false;

                } else if ($('#descripcionCrearAnotacion').val().length >= 600) {
                    $('#errorDescripcion').html(' Numero máximo de caracteres alcanzado');
                    envioNuevoComentarioDescripcion = false;

                } else {
                    envioNuevoComentarioDescripcion = true;

                }
            })

            $('#nombreCrearAnotacion').focus();

            $('#botonEnviarNuevaAnotacionComentario').click(function (e) {

                $(this).html(preloadPequenio);

                if (envioNuevoComentarioNombre && envioNuevoComentarioDescripcion) {
                    //enviamos el nuevo comentario
                    enviarAnotacionComentario($(this).attr('data-idTarea'), $('#nombreCrearAnotacion').val(), $('#descripcionCrearAnotacion').val());
                } else {
                    mensajeDanger('Necesita rellenar los datos para añadir un comentario a la tarea');
                }
            })
        })
        //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
        //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡


        //hacemos la llamada  para solitar las anotaciones de la tarea.
        solicitarAnotacionesPorTarea(idTarea, this);


    })

}

function ModalSolicitarTarea() {

    //validamos el formulario de solicitud de nuevas tareas.
    $('#solicitarTarea').validate({

        rules: {
            solicitudNombre: {
                required: true,
                minlength: 3,
                maxlength: 60
            },
            solicitudDescripcion: {
                required: true,
                minlength: 3,
                maxlength: 600
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
            enviarDatosModalSolicitud();
        }
    });

    //asignamos el evento al boton enviar;
    $('#botonEnviarSolicitud').click(function (e) {
        $('#botonEnviarSolicitud').html(preloadPequenio)
        $('#solicitarTarea').submit();
    });

    $('#solicitarTareaSegunProyecto').click(function (e) {
        $('#modalSolicitud').modal('show');
    })
}
//#endregion





//#region envio de datos;
function enviarTareaModal() {
    let nombre = $('#nombreTarea').val();
    let descripcion = $('#descripcionTarea').val();
    let horas = $('#horas').val();
    let minutos = $('#minutos').val();
    let usuarios = [];
    let idProyecto = $('#idProyecto').val();

    if (nombre.length != 0 && descripcion.length != 0 && horas.length != 0 && minutos.length != 0) {
        let aux = $('#listadoUsuarios li'); //variable donde almacenare momentaneamente la lista de usuarios.
        if (aux.length > 0) {
            for (let i = 0; i < aux.length; i++) {
                usuarios.push($(aux[i]).attr('value'));
            }

            //enviamos los datos por ajax.
            $.ajax({
                    type: "POST",
                    url: webService,
                    data: {
                        'accion': 'insertarTareaPorProyecto',
                        'nombre': nombre,
                        'idProyecto': idProyecto,
                        'des': descripcion,
                        'horas': horas,
                        'minutos': minutos,
                        'usuarios': JSON.stringify(usuarios)
                    },
                })
                .done(function (datos) {


                    if (datos == 1) {
                        mensajeSuccess('Tarea creada con éxito');
                        mensajeSuccess('Usuarios añadidos a la tarea');

                        $('#formularioCreacionTareaModal')[0].reset();

                    } else if (datos == 2) {
                        mensajeSuccess('Tarea creada con éxito');
                        mensajeSuccess('Usuarios añadidos a la tarea');
                        mensajeSuccess('Usuario añadido como administrador del proyecto');

                        $('#formularioCreacionTareaModal')[0].reset();
                    } else if (datos == -1) {
                        mensajeDanger("No cumple los requisitos minimos de permisos", "¡Error!");
                    } else if (datos == -2) {
                        mensajeDanger("Tu usuario no es administrador del proyecto", "¡Error!");

                    } else if (datos == -3) {
                        mensajeDanger("El proyecto esta finalizado", "¡Error!");

                    } else if (datos == -5) {
                        mensajeDanger("Este proyecto ya tiene ocupado todo el tiempo estimado, contacte con el administrador", "¡Error!");

                    } else if (datos == -4) {
                        mensajeDanger("La tarea excede el tiempo estimado del proyecto", "¡Error!");

                    } else if (datos == -6) {
                        mensajeDanger("Faltan datos", "¡Error!");

                    } else if (datos == -7) {
                        mensajeDanger("Ya existe una tarea con ese nombre, cámbiela.", "¡Error!");

                    } else if (datos == -8) {
                        mensajeDanger("No se ha podido obtener la id de la tarea, contacte con el administrador", "¡Error!");

                    } else if (datos == -9) {
                        mensajeDanger("No se han añadido los usuarios, contacte con el administrador", "¡Error!");

                    }


                    $('#botonEnviarFormularioModal').html("<i class='fas fa-upload'></i> Crear tarea");

                    $('#modalModeradorCrearTarea').modal('show');
                })
                .fail(function () {
                    falloAjax();
                    $('#botonEnviarFormularioModal').html("<i class='fas fa-upload'></i> Crear tarea");
                });
        } else {
            mensajeDanger('Debe seleccionar como mínimo a un usuarios.', 'Error');
        }
    } else {
        mensajeDanger('Faltan datos para crear la tarea', 'Error');
    }
}


function enviarDatosModalEdicion() {

    let lista = $('#listadoUsuariosEdicion li');
    let usuarios = [];


    for (let i = 0; i < lista.length; i++) {


        usuarios.push($(lista[i]).attr('value'));

    }


    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'actualizarTarea',
                'idTarea': $('#idTareaEditar').val(),
                'nombre': $('#nombreTareaEdicion').val(),
                'descripcion': $('#descripcionTareaEdicion').val(),
                'hora': $('#horasEdicion').val(),
                'minutos': $('#minutosEdicion').val(),
                'estado': $('#selectorEstadoTarea').val(),
                'usuarios': usuarios
            }

        })
        .done(function (e) {


            if (e == 1) {
                mensajeSuccess('Tarea actualizada con éxito')
            } else if (e == -1) {
                mensajeDanger('Faltan permisos', '¡ERROR!')
            } else if (e == -3) {
                mensajeDanger('El tiempo estimado de la tarea supera al tiempo estimado del proyecto', '¡ERROR!')
            } else if (e == -4) {
                mensajeDanger('fallo en la consulta de tareas', '¡ERROR!')
            } else if (e == -5) {
                mensajeDanger('fallo en la consulta de usuarios', '¡ERROR!')
            } else if (e == -6) {
                mensajeDanger('El usuario no es administrador de esta tarea. Tampoco eres administrador de la plaforma', '¡ERROR!')
            }
        })
        .fail(falloAjax);
}


function enviarAnotacionComentario(idTarea, nombre, descripcion) {


    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'aniadeNuevaAnotacionComentario',
                idTarea,
                nombre,
                descripcion
            },

        })
        .done(function (e) {

            $('#botonEnviarNuevaAnotacionComentario').html("<i class='fas fa-upload'></i>");

            if (e == 2) {
                mensajeSuccess('Comentario añadido correctamente por administrador de la tarea');
                solicitarAnotacionesPorTarea(idTarea, "");

                $('#comentarioTarea').removeAttr('disabled');
            } else if (e == 1) {
                mensajeSuccess('Comentario añadido correctamente');
                solicitarAnotacionesPorTarea(idTarea, "");

                $('#comentarioTarea').removeAttr('disabled');
            } else if (e == -1) {
                mensajeDanger('Faltan datos', '¡ERROR!')
            } else if (e == -2) {
                mensajeDanger('Datos erroneos', '¡ERROR!')

            } else if (e == -3) {
                mensajeDanger('El usuario no tiene permisos para añadir un nuevo comentario', '¡ERROR!')

            } else if (e == -4) {
                mensajeDanger('Ya existe una tarea con ese nombre, por favor cambie el nombre de la misma', '¡ERROR!')

            } else if (e == -5) {
                mensajeDanger('Error en la consulta, contacte con el administrador de la plataforma', '¡ERROR!')

            }


        })
        .fail(falloAjax);
}

function eliminarAnotacion(id, btn) {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'eliminarAnotacion',
                id
            }
        }).done(function (e) {
            console.log(e)

            $(btn).html("<i class='fas fa-trash'></i>");

            if (e == 2) {
                mensajeSuccess('Tarea eliminada con éxito');
                mensajeInfo('La tarea fue eliminada por un administrador');
            } else if (e == 1) {
                mensajeSuccess('Tarea eliminada con éxito');
            } else if (e == -1) {
                mensajeDanger('faltan datos para eliminar la tarea');
            } else if (e == -2) {
                mensajeDanger('La tarea que intenta borrar no existe');
            } else if (e == -3) {
                mensajeDanger('Usted no es propietario de esta anotación');
            } else if (e == -4) {
                mensajeDanger('Fallo en la consulta de borrado');
            }

            solicitarAnotacionesPorTarea($('#idTareaModalAnotaciones').val(), "")
        })
        .fail(falloAjax);
}


function enviarDatosModalSolicitud() {
    let idTarea = $('#idProyecto').val();
    let nombre = $('#solicitudNombre').val();
    let desc = $('#solicitudDescripcion').val();


    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'crearAlertaSolicitudTarea',
                idTarea,
                nombre,
                desc

            }
        })
        .done(function (e) {
      
            $('#botonEnviarSolicitud').html('<i class="fas fa-upload"></i> Enviar');
            if(e==1){
                mensajeSuccess('Los administradores del proyecto han sido notificados. Espere su respuesta');
            }else if(e == -1){
                mensajeDanger("Faltan datos  para poder solicitar la tarea","¡ERROR!")
            }else if(e == -2){
                mensajeDanger("Su usuario no tiene permisos  para solicitar tareas en este proyecto","¡ERROR!")
            }else if(e == -3){
                mensajeDanger("Fallo en la consulta de notificaciones","¡ERROR!")
            }
        })
        .fail(falloAjax);
}
//#endregion