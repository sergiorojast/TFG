$(function () {
    $('#contenido').fadeIn('250');

    obtenerNumeroNotificaciones();

    añadirFuncionalidadBotones();

    obtenerSolcitudesSinLeer();

    obtenerAlertasSinLeer();
})

//#region funcionalidad

function añadirFuncionalidadBotones() {

    botonSolicitarSolicitudes();

    botonSolicitarAlertas();

    function botonSolicitarSolicitudes() {
        $('#solicitarSolicitudes').click(function (e) {
            $('#solicitudesSinLeer').html(preloadRojo);
            if ($(this).attr('data-estado') == 0) {
                $(this).html(preloadPequenio);
                obtenerSolcitudesLeidas();
                $('#solicitudesLeidas').removeClass('d-none');
                $(this).attr('data-estado', '1');
            } else {

                $(this).attr('data-estado', '0');
                $('#solicitudesLeidas').removeClass('d-none');
                $('#solicitudesLeidas').addClass('d-none');
                $(this).html('<span class="fas fa-chevron-down"></span>');




            }
            obtenerSolcitudesSinLeer();
        })
    }

    function botonSolicitarAlertas() {
        $('#solicitarAlertas').click(function (e) {
            $('#alertasSinLeer').html(preloadRojo);
            if ($(this).attr('data-estado') == 0) {
                $(this).html(preloadPequenio);
                obtenerAlertasLeidas();
                $('#alertasLeidas').removeClass('d-none');
                $(this).attr('data-estado', '1');
            } else {

                $(this).attr('data-estado', '0');
                $('#alertasLeidas').removeClass('d-none');
                $('#alertasLeidas').addClass('d-none');
                $(this).html('<span class="fas fa-chevron-down"></span>');



            }
            obtenerAlertasSinLeer();
        })
    }
}

function dibujarSolicitudesSinLeer(datos) {
    let solicitudes = JSON.parse(datos);
    let lista = "";



    for (let i = 0; i < solicitudes.length; i++) {

        lista = '<li class="list-group-item">'
        lista += "<div class='row'>"

        lista += "<div class='col-5'>"
        lista += "<small>Emisor <br>"
        lista += solicitudes[i]['fk_correo_emisor']
        lista += "</small></div>"
        lista += "<div class='col-5'>"
        lista += "<input readonly class='form-control' value='" + solicitudes[i]['fecha'] + "'>"
        lista += "</div>"
        lista += "<div class='col-2'>"
        lista += "<button id='leerSolicitud' data-leido='0' class='btn btn-sm btn-info' data-idSolicitud='" + solicitudes[i]['pk_idAlerta'] + "'><i class='fas fa-envelope'></i></button>"
        lista += "</div>"

        lista += "</div>"

        lista += "<div id='datosSolicitud' class='row d-none'>"
        lista += "<div class='col'>"
        lista += "<hr class='ml-5 mr-5'>"

        lista += "<small>Solicitud: <br>"
        lista += solicitudes[i]['mensaje']
        lista += "</small></div>"
        lista += "</div>"


        lista += "</li>"





        $('#solicitudesSinLeer').append(lista)

        //animacion de abrir correo del boton leersolicitud;



        $('#solicitudesSinLeer div #leerSolicitud').off('click');
        $('#solicitudesSinLeer div #leerSolicitud').click(function (e) {
            //$('#datosSolicitud').removeClass('d-none');
            if ($(this).attr('data-leido') == 0) {
                $(this).html("<i class='fas fa-envelope-open'></i>")
                $(this).parent().parent().parent().find('#datosSolicitud').removeClass('d-none');
                $(this).attr('data-leido', '1');
                let numeroNotificaciones = parseInt($('#contadorSolicitudesSinLeer').html());

                $('#contadorSolicitudesSinLeer').html(numeroNotificaciones - 1);


            } else if ($(this).attr('data-leido') == 1) {
                $(this).parent().parent().parent().find('#datosSolicitud').addClass('d-none');
                $(this).attr('data-leido', '0');
                $(this).html("<i class='fas fa-envelope'></i>")
                let numeroNotificaciones = parseInt($('#contadorSolicitudesSinLeer').html());

                $('#contadorSolicitudesSinLeer').html(numeroNotificaciones + 1);

            }
            cambiarEstadoLeidoNoLeido($(this).attr('data-idsolicitud'), $(this).attr('data-leido'))
        })

    }
}


function dibujarSolicitudesLeidas(e) {
    let solicitudes = JSON.parse(e);


    $('#solicitudesLeidas').empty();
    lista = '<li class="list-group-item list-group-item-info text-center">Solicitudes leidas</li>'
    $('#solicitudesLeidas').append(lista);

    for (let i = 0; i < solicitudes.length; i++) {


        lista = '<li class="list-group-item">'
        lista += "<div class='row'>"

        lista += "<div class='col-5'>"
        lista += "<small>Emisor <br>"
        lista += solicitudes[i]['fk_correo_emisor']
        lista += "</small></div>"
        lista += "<div class='col-5'>"
        lista += "<input readonly class='form-control' value='" + solicitudes[i]['fecha'] + "'>"
        lista += "</div>"
        lista += "<div class='col-2'>"
        lista += "<button id='leerSolicitud' data-leido='1' class='btn btn-sm btn-info' data-idSolicitud='" + solicitudes[i]['pk_idAlerta'] + "'><i class='fas fa-envelope-open'></i></button>"
        lista += "</div>"

        lista += "</div>"

        lista += "<div id='datosSolicitud' class='row'>"
        lista += "<div class='col'>"
        lista += "<hr class='ml-5 mr-5'>"

        lista += "<small>Solicitud: <br>"
        lista += solicitudes[i]['mensaje']
        lista += "</small></div>"
        lista += "</div>"


        lista += "</li>"

        $('#solicitudesLeidas').append(lista)

        $('#solicitudesLeidas div #leerSolicitud').off('click');
        $('#solicitudesLeidas div #leerSolicitud').click(function (e) {
            //$('#datosSolicitud').removeClass('d-none');
            if ($(this).attr('data-leido') == 0) {
                $(this).html("<i class='fas fa-envelope-open'></i>")
                $(this).parent().parent().parent().find('#datosSolicitud').removeClass('d-none');
                $(this).attr('data-leido', '1');
                let numeroNotificaciones = parseInt($('#contadorSolicitudesSinLeer').html());

                $('#contadorSolicitudesSinLeer').html(numeroNotificaciones - 1);


            } else if ($(this).attr('data-leido') == 1) {
                $(this).parent().parent().parent().find('#datosSolicitud').addClass('d-none');
                $(this).attr('data-leido', '0');
                $(this).html("<i class='fas fa-envelope'></i>")
                let numeroNotificaciones = parseInt($('#contadorSolicitudesSinLeer').html());

                $('#contadorSolicitudesSinLeer').html(numeroNotificaciones + 1);

            }
            cambiarEstadoLeidoNoLeido($(this).attr('data-idsolicitud'), $(this).attr('data-leido'))
        })

    }
}

function dibujarAlertasSinLeer(e) {
    let alertas = JSON.parse(e);
    let lista = "";



    for (let i = 0; i < alertas.length; i++) {

        lista = '<li class="list-group-item">'
        lista += "<div class='row'>"

        lista += "<div class='col-5'>"
        lista += "<small>Emisor <br>"
        lista += alertas[i]['fk_correo_emisor']
        lista += "</small></div>"
        lista += "<div class='col-5'>"
        lista += "<input readonly class='form-control' value='" + alertas[i]['fecha'] + "'>"
        lista += "</div>"
        lista += "<div class='col-2'>"
        lista += "<button id='leerAlerta' data-leido='0' class='btn btn-sm btn-info' data-idAlerta='" + alertas[i]['pk_idAlerta'] + "'><i class='fas fa-envelope'></i></button>"
        lista += "</div>"

        lista += "</div>"

        lista += "<div id='datosAlerta' class='row d-none'>"
        lista += "<div class='col'>"
        lista += "<hr class='ml-5 mr-5'>"

        lista += "<small>Alerta: <br>"
        lista += alertas[i]['mensaje']
        lista += "</small></div>"
        lista += "</div>"


        lista += "</li>"





        $('#alertasSinLeer').append(lista)

        //animacion de abrir correo del boton leerAlerta;



        $('#alertasSinLeer div #leerAlerta').off('click');
        $('#alertasSinLeer div #leerAlerta').click(function (e) {
            //$('#datosAlerta').removeClass('d-none');
            if ($(this).attr('data-leido') == 0) {
                $(this).html("<i class='fas fa-envelope-open'></i>")
                $(this).parent().parent().parent().find('#datosAlerta').removeClass('d-none');
                $(this).attr('data-leido', '1');
                let numeroNotificaciones = parseInt($('#contadorAlertasSinLeer').html());

                $('#contadorAlertasSinLeer').html(numeroNotificaciones - 1);


            } else if ($(this).attr('data-leido') == 1) {
                $(this).parent().parent().parent().find('#datosAlerta').addClass('d-none');
                $(this).attr('data-leido', '0');
                $(this).html("<i class='fas fa-envelope'></i>")
                let numeroNotificaciones = parseInt($('#contadorAlertasSinLeer').html());

                $('#contadorAlertasSinLeer').html(numeroNotificaciones + 1);

            }
            cambiarEstadoLeidoNoLeido($(this).attr('data-idAlerta'), $(this).attr('data-leido'))
        })

    }
}

function dibujarAlertasLeidas(e) {
    let alertas = JSON.parse(e);


    $('#alertasLeidas').empty();
    lista = '<li class="list-group-item list-group-item-info text-center">Alertas leidas</li>'
    $('#alertasLeidas').append(lista);

    for (let i = 0; i < alertas.length; i++) {


        lista = '<li class="list-group-item">'
        lista += "<div class='row'>"

        lista += "<div class='col-5'>"
        lista += "<small>Emisor <br>"
        lista += alertas[i]['fk_correo_emisor']
        lista += "</small></div>"
        lista += "<div class='col-5'>"
        lista += "<input readonly class='form-control' value='" + alertas[i]['fecha'] + "'>"
        lista += "</div>"
        lista += "<div class='col-2'>"
        lista += "<button id='leerAlerta' data-leido='1' class='btn btn-sm btn-info' data-idAlerta='" + alertas[i]['pk_idAlerta'] + "'><i class='fas fa-envelope-open'></i></button>"
        lista += "</div>"

        lista += "</div>"

        lista += "<div id='datosAlerta' class='row'>"
        lista += "<div class='col'>"
        lista += "<hr class='ml-5 mr-5'>"

        lista += "<small>Solicitud: <br>"
        lista += alertas[i]['mensaje']
        lista += "</small></div>"
        lista += "</div>"


        lista += "</li>"

        $('#alertasLeidas').append(lista)

        $('#alertasLeidas div #leerAlerta').off('click');
        $('#alertasLeidas div #leerAlerta').click(function (e) {
            //$('#datosAlerta').removeClass('d-none');
            if ($(this).attr('data-leido') == 0) {
                $(this).html("<i class='fas fa-envelope-open'></i>")
                $(this).parent().parent().parent().find('#datosAlerta').removeClass('d-none');
                $(this).attr('data-leido', '1');
                let numeroNotificaciones = parseInt($('#contadorAlertasSinLeer').html());

                $('#contadorAlertasSinLeer').html(numeroNotificaciones - 1);


            } else if ($(this).attr('data-leido') == 1) {
                $(this).parent().parent().parent().find('#datosAlerta').addClass('d-none');
                $(this).attr('data-leido', '0');
                $(this).html("<i class='fas fa-envelope'></i>")
                let numeroNotificaciones = parseInt($('#contadorAlertasSinLeer').html());

                $('#contadorAlertasSinLeer').html(numeroNotificaciones + 1);

            }
            cambiarEstadoLeidoNoLeido($(this).attr('data-idAlerta'), $(this).attr('data-leido'))
        })

    }
}
//#endregion

//#region Solicitud de datos
function obtenerNumeroNotificaciones() {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'obtenerNumeroNotficaciones'
            },
        })
        .done(function (e) {
            let datos = (JSON.parse(e));
            if (datos['alertas'] > 0) {
                $('#contadorAlertasSinLeer').html(datos['alertas'])
            } else {
                $('#contadorAlertasSinLeer').remove()
            }

            if (datos['solicitudes'] > 0) {
                $('#contadorSolicitudesSinLeer').html(datos['solicitudes'])
            } else {
                $('#contadorSolicitudesSinLeer').remove();
            }


        })
        .fail(falloAjax);
}

function obtenerSolcitudesSinLeer() {
    $.ajax({
        type: "POST",
        url: webService,
        data: {
            'accion': 'solicitudesSinLeer'
        },
    }).done(function (e) {
        $('#solicitudesSinLeer').empty();
        if (e == 0) {
            $('#solicitudesSinLeer').append(' <li class="list-group-item list-group-item-danger text-center"><span >No tienes solicitudes sin leer</span> </li>')
        } else {
            dibujarSolicitudesSinLeer(e);
        }

    }).fail(falloAjax);
}

function obtenerSolcitudesLeidas() {
    $.ajax({
        type: "POST",
        url: webService,
        data: {
            'accion': 'solicitudesLeidas'
        },
    }).done(function (e) {

        if (e == 0) {

            $('#solicitarSolicitudes').html('<span class="fas fa-chevron-down"></span>')
            lista = '<li class="list-group-item list-group-item-danger text-center">No tiene solicitudes leidas</li>'
            $('#solicitudesLeidas').empty();
            $('#solicitudesLeidas').append(lista);

        } else {
            dibujarSolicitudesLeidas(e);
            $('#solicitarSolicitudes').html('<span class="fas fa-chevron-up"></span>')
        }
    }).fail(falloAjax);
}

function obtenerAlertasSinLeer() {
    $.ajax({
        type: "POST",
        url: webService,
        data: {
            'accion': 'alertasSinLeer'
        },
    }).done(function (e) {

        $('#alertasSinLeer').empty();
        if (e == 0) {
            $('#alertasSinLeer').append(' <li class="list-group-item list-group-item-danger text-center"><span >No tienes alertas sin leer</span> </li>')
        } else {
            dibujarAlertasSinLeer(e);
        }

    }).fail(falloAjax);
}


function obtenerAlertasLeidas() {

    $.ajax({
        type: "POST",
        url: webService,
        data: {
            'accion': 'alertasLeidas'
        },
    }).done(function (e) {
        console.log(e);
        if (e == 0) {

            $('#solicitarAlertas').html('<span class="fas fa-chevron-down"></span>')
            lista = '<li class="list-group-item list-group-item-danger text-center">No tiene alertas leidas</li>'
            $('#alertasLeidas').empty();
            $('#alertasLeidas').append(lista);

        } else {
            dibujarAlertasLeidas(e);
            $('#solicitarAlertas').html('<span class="fas fa-chevron-up"></span>')
        }
    }).fail(falloAjax);

}
//#endregion

//#region envio de datos

/**
 *  Funcion encargada de cambiar el estado de las solicitudes entre leidas y no leidas.
 * @param {int} id 
 * @param {boolean} leido ; //0 no leido , 1 leido
 */
function cambiarEstadoLeidoNoLeido(id, leido) {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'cambiarEstadoNotificaciones',
                id,
                leido
            },
        }).done(function (e) {
            if (e == -1) {
                mensajeDanger('Ocurrio un error al cambiar el estado de la notificacion', '¡ERROR!')
            }
        })
        .fail(falloAjax);

}
//#endregion