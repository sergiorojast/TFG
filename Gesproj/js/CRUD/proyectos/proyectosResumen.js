//variable que nos ayuda a pasarnos la id del proyecto entre las vistas
var idProyecto = -1;
$(function () {

    //Añadimos la funcion al boton de crear proyectos
    $('#crearProyectos').click(function (e) {
        $('#contenido').empty();
        $('#contenido').html(preload);


        $.post('vistas/Proyectos/proyectosCrear.html', function (htmle) {
            $('#contenido').html(htmle);
        }, 'html');
    })

    solicitarProyectos();

    //Una vez tenemos los datos en el doom mostramos la vista.
    // $('#contenido').fadeToggle(2500);
    $('#contenido').fadeIn('250');

    //asignamos el evento para ocultar los proyectos finalizados.
    $('#ocultarProyectosFinalizados').click(botonOcultarProyectosFinalizados);

})

/**
 * Funcion encargada de solicitar por medio de ajax los proyectos de usuario.
 */
function solicitarProyectos(estado) {
    //console.log(webService);
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'listarProyectosPropietario'
            },

        })
        .done(function (datos) {
            //console.log(datos)
            agregarDatosProyectosAlDoM(JSON.parse(datos), estado);

            solicitarBarrasEstadoProyecto();

        })
        .fail(function (datos) {

            falloAjax();
        });
}
/**
 * Funcion encargada de dibujar los datos de un array que le llegan de la llamada ajax.
 * @param {Array} datos 
 */
function agregarDatosProyectosAlDoM(datos, estado) {


    let carta;
    let dibujar;
    $('#capaProyectos').empty();
    for (let i = 0, j = 1; i < datos.length; i++, j++) {
      
        if (j === 1) {
            $('#capaProyectos').append('<div id="columnasProyectos" class="row"> </div>')

        } else if (j === 4) {
            j = 0;
        }
        //construimos el elmento que nos muestra los proyectos
        carta = "<div class='col-6 col-sm-4 col-lg-3 mb-2 ' >" +
            "<div class = 'card rounded-lg' id='cartasProyectos' >" +
            "<div class = 'row' >" +
            "<div class = 'col col-sm-4'>" +
            "<span id='idProyecto' class='d-none'>" + datos[i]['pk_idProyecto'] + "</span>";


        if (datos[i]['estado'] === "Creado") {
            carta += "<span id='estadoProyecto' class=' m-1 badge badge-pill badge-primary'> Creado </span>" +
                "</div>";




        } else if (datos[i]['estado'] === "En curso") {
            carta += "<span id='estadoProyecto' class=' m-1 badge badge-pill badge-success'> En curso </span>" +
                "</div>";

        } else if (datos[i]['estado'] === "En espera") {
            carta += "<span id='estadoProyecto' class=' m-1 badge badge-pill badge-warning'>En espera</span>" +
                "</div>";

        } else if (datos[i]['estado'] === "Finalizado") {
            carta += "<span id='estadoProyecto' class=' m-1 badge badge-pill badge-secondary'>Finalizado</span>" +
                "</div>";

        }

        carta += "<div class ='col col-sm-8 text-truncate'> <small>" + datos[i]['nombre'] + " </small> </div>";

        carta += "</div>";
        carta += "<hr class='m-2 bg-secondary'>";

        carta += "<div class='row m-1'>" +
            "<small class='col '>Descripción : </small>" +
            "</div>";

        carta += "<div class='row m-1'>" +
            "<div class='col text-truncate'> <small>" + datos[i]['descripcion'] + "</small></div>" +
            "</div>";
        carta += "<hr class='m-2 bg-secondary'>";

        carta += "<div class='row m-1'>" +
            "<small class='col '>Fecha creación </small>" +
            "</div>";
        carta += "<div class='row m-1'>" +

            "<div class='col '> <small>" + datos[i]['fechaInicio'] + "</small></div>" +
            "</div>";
        carta += "<hr class='m-2 bg-darck'>";
        if (datos[i]['estado'] === "Finalizado") {
            carta += "<div class='row m-1'>" +
                "<small class='col '>Fecha finalización: </small>" +
                "</div>";
            carta += "<div class='row m-1'>" +

                "<div class='col '> <small>" + datos[i]['fechaFinalizacion'] + "</small></div>" +
                "</div>";
            carta += "<hr class='m-2 bg-darck'>";
        }


        carta += "<div class='row m-1'>" +
            "<small class='col '>Tiempo estimado: </small>" +
            "</div>";
        carta += "<div class='row m-1'>" +
            "<div class='col'> <small>" + datos[i]['estimacion'] + "</small></div>" +
            "</div>";



        carta += "<hr class='m-2 bg-secondary'>";

        carta += "<div id='barraProgreso'>" + preloadPequenioAleatorio() + "</div>";

        carta += "</div>";


            $('#capaProyectos #columnasProyectos:last-child').append(carta);

   

    }

    asignarEventosCartasProyectos();



}

/**
 * Funcion encargada de asignar  el evento click a las cartas que contienen el proyecto.
 */
function asignarEventosCartasProyectos() {
    $('#cartasProyectos ').each(function (i, e) {
        $(e).click(function () {
            //reseteamos la idProyecto para que no haya fallos y nos envie a editar un proyecto que no queremos.
            idProyecto = 0;

            // Obtenemos la id del proyecto, lo cogemos de esta manera porque esta en un span oculto dentro de la "carta";
            let columna = $(this).children('div')[0];
            let fila = $(columna).children('div')[0];
            let aux = $(fila).children('span')[0];

            idProyecto = $(aux).html();
            //hacemos la llamada a la vista.
            $('#contenido').empty();
            $('#contenido').html(preload);


            $.post('vistas/Proyectos/proyectosVerEditarBorrar.html', function (htmle) {
                $('#contenido').html(htmle);
            }, 'html');
        })

    })
}

function solicitarBarrasEstadoProyecto() {
    let elementosProyectos = $('div #cartasProyectos');
    let id = "";

    for (let i = 0; i < elementosProyectos.length; i++) {
        id = $(elementosProyectos[i]).find('#idProyecto').text();
        let estadoProyecto = $(elementosProyectos[i]).find('#estadoProyecto').text();
        let barraDeProgreso = "";


        $.ajax({
                type: "POST",
                url: webService,
                data: {
                    'accion': 'obtenerTareasYestado',
                    id
                },
            })
            .done(function (e) {
                let datos = JSON.parse(e);
                let enEspera = 0;
                let enCurso = 0;
                let finalizado = 0;
                let creado = 0;
                let totalTareas = 0;
                let porcentaje = 0;
                if (datos.length > 0) {

                    for (let i = 0; i < datos.length; i++) {
                        if (datos[i]['estado'] == 'Finalizado') {
                            finalizado++;
                        } else if (datos[i]['estado'] == 'Creado') {
                            creado++;
                        }
                        if (datos[i]['estado'] == 'En espera') {
                            enEspera++;
                        }
                        if (datos[i]['estado'] == 'En curso') {
                            enCurso++;
                        }
                    }

                    totalTareas = enEspera + enCurso + finalizado + creado;
                    porcentaje = Math.trunc((finalizado / totalTareas) * 100);


                    if (porcentaje > 0) {

                        if (estadoProyecto == 'En espera') {
                            barraDeProgreso = "<div class='row m-1'>" +
                                "<div class='col'>" +
                                "<div class='progress'>" +
                                "<div id='barraProgreso' class='progress-bar bg-warning' role='progressbar' style='width: " + porcentaje + "%;' aria-valuenow='" + porcentaje + "' aria-valuemin='0' aria-valuemax='100'>" + porcentaje + "%</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                        } else {

                            barraDeProgreso = "<div class='row m-1'>" +
                                "<div class='col'>" +
                                "<div class='progress'>" +
                                "<div id='barraProgreso' class='progress-bar bg-success' role='progressbar' style='width: " + porcentaje + "%;' aria-valuenow='" + porcentaje + "' aria-valuemin='0' aria-valuemax='100'>" + porcentaje + "%</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                        }

                    } else {
                        if (estadoProyecto == 'En espera') {
                            barraDeProgreso = "<div class='row m-1'>" +
                                "<div class='col'>" +
                                "<div class='progress'>" +
                                "  <div class='progress-bar progress-bar-striped  bg-warning progress-bar-animated' role='progressbar' style='width: 100%' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100'>0%</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                        } else {

                            barraDeProgreso = "<div class='row m-1'>" +
                                "<div class='col'>" +
                                "<div class='progress'>" +
                                "  <div class='progress-bar progress-bar-striped  bg-info progress-bar-animated' role='progressbar' style='width: 100%' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100'>0%</div>" +
                                "</div>" +
                                "</div>" +
                                "</div>";
                        }

                    }

                    if (estadoProyecto != 'Finalizado') {
                        $(elementosProyectos[i]).find('#barraProgreso').html(barraDeProgreso);

                    } else {
                        $(elementosProyectos[i]).find('#barraProgreso').empty();
                    }

                } else {
                    barraDeProgreso = "<div class='row m-1'>" +
                        "<div class='col'>" +
                        "<div class='progress'>" +
                        "<div id='barraProgreso' class='progress-bar bg-secondary' role='progressbar' style='width: 0%;' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'>0%</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>";

                    if (estadoProyecto != 'Finalizado') {
                        $(elementosProyectos[i]).find('#barraProgreso').html(barraDeProgreso);

                    } else {
                        $(elementosProyectos[i]).find('#barraProgreso').empty();
                    }

                }
            })
            .fail(falloAjax);



    }

}

function botonOcultarProyectosFinalizados() {
    let estado = $(this).attr('data-estado');



    if (estado == '1') {

        $('#capaProyectos').html(preload);
        solicitarProyectos(false);
        $(this).attr('data-estado', '0');

    } else {
        $('#capaProyectos').html(preload);
        solicitarProyectos(true);
        $(this).attr('data-estado', '1');
    }
}