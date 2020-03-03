$(function () {
    $('#contenido').fadeToggle(2000);

    //solicitud de datos.
    solicitarProyectosPorTareas();

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
            //console.log(datos)
            if (datos == 2) {
                $('#listadoTareas').empty();
                $('#crearTareaSegunProyecto').remove();
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
          //  console.log(datos)
            if (datos == '[]') {

                $('#listadoTareas').html("")
                dibujarDatosProyectoSinTareas(datos);
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
//#endregion

//#region funcionalidad
/**
 * Funcion encargada de dibujar los datos de los proyectos en las  diferentes pestañas, tambien 
 * se encarga de solicitar los datos del primer proyecto que se muestra y
 * por ultimo hace una llamada a la funcion para asignar eventos a las pestañas
 * @param {} proyectos 
 */
function dibujarProyectos(proyectos) {
    // console.log(proyectos);
    let aux = true; //funcion que nos permite mostrar como visible el primer proyecto en la seccion de las ventanas de tareas.

    for (const key in proyectos) {
        //console.log(proyectos[key][0]['pk_idProyecto']);

        if (aux) {
            $('#listaProyectos').append("<a class='nav-item nav-link active' id='Proyecto1' data-idProyecto='" + proyectos[key][0]['pk_idProyecto'] + "' data-toggle='tab'  role='tab'  aria-selected='true'>" + proyectos[key][0]['nombreProyecto'] + "</a>")
            aux = false;
        } else {
            $('#listaProyectos').append("<a class='nav-item nav-link' id='nav-home-tab' data-toggle='tab' data-idProyecto='" + proyectos[key][0]['pk_idProyecto'] + "'  role='tab'  aria-selected='false'>" + proyectos[key][0]['nombreProyecto'] + "</a>")
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
    let pestania = ($('#listaProyectos a'));
    pestania.click(function (e) {
        $('#listadoTareas').html(preloadAzul);
        solicitarDatosPorId($(this).attr('data-idProyecto'))
    })
}

function dibujarDatosProyectoSinTareas(datos) {
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
        "  <hr>";

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
            "<div class='card'>" +
            "<div class='row m-1'>" +
            "<small class='col col-lg-6'>" + datos[i]['nombreTarea'] + "</small>";


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
            "<small class='col text-secondary'>Descripción:</small>" +
            "</div>" +
            "<div class='row '>" +
            "<small class='col text-secondary'>" + datos[i]['descripcionTarea'] + "</small>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<hr class='m-2 bg-secondary'>" +
            "<div class='row m-1'>" +
            "<div class='col'>" +
            "<div class='row'>" +
            "<small class='col text-secondary'>Fecha de creación:</small>" +
            "</div>" +
            "<div class='row '>" +
            "<small class='col text-secondary'>" + datos[i]['fechaInicioTare'] + "</small>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "<hr class='m-2 bg-secondary'>" +
            "<div class='row m-1'>" +
            "<small class='col col-lg-6'>Estimación: <br> " + datos[i]['estimacionTarea'] + "</small>" +
            "<div class='col col-lg-6'>opciones</div>" +
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
}
//#endregion