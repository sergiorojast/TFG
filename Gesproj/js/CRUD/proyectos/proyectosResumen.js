$(function () {

    //Añadimos la funcion al boton de crear proyectos
    $('#crearProyectos').click(function (e) {
        $('#contenido').empty();
        $('#contenido').html(preload);


        $.post('vistas/proyectos/proyectosCrear.html', function (htmle) {
            $('#contenido').html(htmle);
        }, 'html');
    })

    solicitarProyectos();
})

/**
 * Funcion encargada de solicitar por medio de ajax los proyectos de usuario.
 */
function solicitarProyectos() {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'listarProyectosPropietario'
            },

        })
        .done(function (datos) {
            agregarDatosProyectosAlDoM(JSON.parse(datos));
        })
        .fail(function (datos) {
            falloAjax();
        });
}
/**
 * Funcion encargada de dibujar los datos de un array que le llegan de la llamada ajax.
 * @param {Array} datos 
 */
function agregarDatosProyectosAlDoM(datos) {
    let carta;
    let barraDeProgreso;

    for (let i = 0, j = 1; i < datos.length; i++, j++) {

        if (j === 1) {
            $('#capaProyectos').append('<div id="columnasProyectos" class="row"> </div>')

        } else if (j === 4) {
            j = 0;
        }
        //construimos el elmento que nos muestra los proyectos
        carta = "<div class='col-6 col-sm-4 col-lg-3 mb-2 ' >" +
            "<div class = 'card' >" +
            "<div class = 'row' >" +
            "<div class = 'col col-sm-6'>";


        if (datos[i]['estado'] === "Creado") {
            carta += "<span class=' m-1 badge badge-pill badge-primary'> Creado </span>" +
                "</div>";


            barraDeProgreso = "<div class='row m-1'>" +
                "<div class='col'>" +
                "<div class='progress'>" +
                "<div  id='barraProgreso' class='progress-bar text-secondary' role='progressbar' style='width: 0%;' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100'>0%</div>" +
                "</div>" +
                "</div>" +
                "</div>";

        } else if (datos[i]['estado'] === "En curso") {
            carta += "<span class=' m-1 badge badge-pill badge-success'> En curso </span>" +
                "</div>";
            barraDeProgreso = "<div class='row m-1'>" +
                "<div class='col'>" +
                "<div class='progress'>" +
                "<div  id='barraProgreso' class='progress-bar bg-success progress-bar-striped progress-bar-animated ' role='progressbar' style='width: 100%;' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100'>100%</div>" +
                "</div>" +
                "</div>" +
                "</div>";
        } else if (datos[i]['estado'] === "En espera") {
            carta += "<span class=' m-1 badge badge-pill badge-warning'>En espera</span>" +
                "</div>";
            barraDeProgreso = "<div class='row m-1'>" +
                "<div class='col'>" +
                "<div class='progress'>" +
                "<div id='barraProgreso' class='progress-bar bg-warning' role='progressbar' style='width: 100%;' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100'>100%</div>" +
                "</div>" +
                "</div>" +
                "</div>";
        } else if (datos[i]['estado'] === "Finalizado") {
            carta += "<span class=' m-1 badge badge-pill badge-secondary'>Finalizado</span>" +
                "</div>";
            barraDeProgreso = "";
        }

        carta += "<div class ='col col-sm-6'> <small>" + datos[i]['nombre'] + " </small> </div>";

        carta += "</div>";
        carta += "<hr class='m-2 bg-secondary'>";

        carta += "<div class='row m-1'>" +
            "<small class='col text-secondary'>Descripción : </small>" +
            "</div>";

        carta += "<div class='row m-1'>" +
            "<div class='col'> <small>" + datos[i]['descripcion'] + "</small></div>" +
            "</div>";
        carta += "<hr class='m-2 bg-secondary'>";

        carta += "<div class='row m-1'>" +
            "<small class='col text-secondary'>Fecha creación </small>" +
            "</div>";
        carta += "<div class='row m-1'>" +

            "<div class='col '> <small>" + datos[i]['fechaInicio'] + "</small></div>" +
            "</div>";
        carta += "<hr class='m-2 bg-darck'>";
        if (datos[i]['estado'] === "Finalizado") {
            carta += "<div class='row m-1'>" +
                "<small class='col text-secondary'>Fecha finalización: </small>" +
                "</div>";
            carta += "<div class='row m-1'>" +

                "<div class='col '> <small>" + datos[i]['fechaFinalizacion'] + "</small></div>" +
                "</div>";
            carta += "<hr class='m-2 bg-darck'>";
        }


        carta += "<div class='row m-1'>" +
            "<small class='col text-secondary'>Tiempo estimado: </small>" +
            "</div>";
        carta += "<div class='row m-1'>" +
            "<div class='col'> <small>" + datos[i]['estimacion'] + "</small></div>" +
            "</div>";



        carta += "<hr class='m-2 bg-secondary'>";

        carta += barraDeProgreso;

        carta += "</div>";



        $('#capaProyectos #columnasProyectos:last-child').append(carta);

    }

}




// "<span class=' m-1 badge badge-pill badge-primary'> Primary </span>" +
// "</div>" +
// "</div>" +
// "esto es un mensaje" +