//variable global que me ayuda a pasar el correo por los diferentes views;
var correo = '';

solicitarYPintarDatos();
$('#contenido').fadeToggle(2000);
$('#botonNuevoUsuario').on('click', crearUnNuevoUsuriof)

eventosModales();

// cargamos los datos de los usuarios
function solicitarYPintarDatos() {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'usuarios'
            }
        })
        .done(function (data) {
            pintarTabla(data)

        }).fail(function () {
            falloAjax();
        })


    function pintarTabla(data) {

        let usuarioAdministrador = 0;
        let usuarioAvanzado = 0;
        let usuarioNormal = 0;
        let rolEnTexto = "";
        let usuarios = JSON.parse(data);
        if (usuarios.length > 0) {
            $('#botonesPaginacion').removeClass('d-none')
            $(usuarios).each(function (i, e) {
                let columna = "";
                let celda = ""
                columna = document.createElement('tr');

                celda = document.createElement("td");
                $(celda).html("<img src='" + repositorioImagenes + "/" + e.imagen +
                    "' class='img-fluid imagenCrud'>");
                columna.appendChild(celda);

                celda = document.createElement("td");
                $(celda).attr('id', 'correo');
                $(celda).html(e.correo);
                columna.appendChild(celda);
                celda = document.createElement("td");
                $(celda).html(e.nombre + ", " + e.apellidos);
                columna.appendChild(celda);

                if (e.rol >= 90) {
                    usuarioAdministrador++;
                    rolEnTexto = "<span class='text-danger'>Administrador</span>";
                } else if (e.rol >= 50 && e.rol < 90) {
                    usuarioAvanzado++;
                    rolEnTexto = "<span class='text-warning'>Moderador</span>";

                } else {
                    usuarioNormal++;
                    rolEnTexto = "<span class='text-primary'>Normal</span>";

                }
                celda = document.createElement("td");
                $(celda).html(rolEnTexto);
                columna.appendChild(celda);


                celda = document.createElement("td");
                $(celda).html("" +
                    "<div class='btn-group btn-group-sm' role='group'>" +
                    "<button id='verUsuario' class='btn btn-primary'  data-toggle='tooltip' data-placement='top'title='Visualizar'><span class=' text-white fa fa-eye'></span></button>" +
                    "<button  id='editarUsuario' class='btn btn-warning '   data-toggle='tooltip' data-placement='top'title='Modificar'><span class='  text-white fa fa-pencil-alt'></span></button>" +
                    "<button id='borrarUsuario' class='btn btn-danger' data-toggle='tooltip' data-placement='top'title='Eliminar'><span class='  text-white    fa fa-trash'  ></span></button>" +

                    "<div class='btn-group btn-group-sm' role='group'>" +
                    "<button id='btnGroupDrop1' type='button' class='btn btn-secondary dropdown-toggle' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                    "" +
                    "</button>" +
                    "<div class='dropdown-menu' >" +
                    "<a class='dropdown-item' data-toggle='modal' data-correo='" + e.correo + "' data-target='#modalVerProyectos' >Ver proyectos administrados</a>" +
                    "<a class='dropdown-item' data-toggle='modal' data-correo='" + e.correo + "' data-target='#modalVerTareas'>Ver tareas administradas</a>" +
                    "<a class='dropdown-item' data-toggle='modal' data-correo='" + e.correo + "' data-target='#modalVerAnotaciones'>Ver anotaciones del usuario</a>" +
                    "</div>" +
                    "</div>" +
                    "</div>");
                //añadimos los eventos a los ddiferentes botones.
                // $('#verUsuario').click(solicitarDatos);
                columna.appendChild(celda);

                $(columna).addClass('d-none');
                $(columna).attr('id', i + 1);

                $('#cuerpoTabla').append(columna);

            })


            $('#usuariosTotales').html(usuarios.length);

            $('#usuariosAdministradores').html(usuarioAdministrador);
            $('#usuariosAvanzados').html(usuarioAvanzado);
            $('#usuariosNormales').html(usuarioNormal);



            $('button[data-toggle="tooltip"]').tooltip();
            paginacion();
            //hacemos la llamada para ver el  los datos del usuario.
            llamarVer();
            llamarEditar();
            llamarBorrar();
        } else {
            $('#botonesPaginacion').addClass('d-none')
        }
    };


    function paginacion() {
        let numeroElementosPorPagina = 4;
        let cantidadElmentosTotales = $('tbody tr').length;
        let idUltimoElementovisible = 1;
        // idUltimoElementovisible=  $('tbody tr:not(d-none)').attr('id');


        //muestra los primeros datos 
        for (let i = idUltimoElementovisible; i < idUltimoElementovisible + numeroElementosPorPagina; i++) {
            if (i <= cantidadElmentosTotales) {
                $('#' + i).removeClass('d-none');
            }

        }
        comprobarBotonesActivos();

        $('#botonSiguiente').click(botonSiguiente);
        //$('#botonAnterior').click(botonAnterior)
        //$('#botonAlPrincipio').click(botonAlPrincipio);
        $('#botonAlFinal').click(botonAlFinal);



        function comprobarBotonesActivos() {


            idUltimoElementovisible = parseInt($('tbody tr:not(.d-none):last').attr('id'));


            if (idUltimoElementovisible == 1 || idUltimoElementovisible <= numeroElementosPorPagina) {
                $('#botonAnterior').addClass('disabled');
                $('#botonAlPrincipio').addClass('disabled');
                $('#paginasIniciales').addClass('disabled');

                $('#botonAnterior').off('click');
                $('#botonAlPrincipio').off('click');
            } else {
                $('#botonAnterior').removeClass('disabled');
                $('#botonAlPrincipio').removeClass('disabled');
                $('#paginasIniciales').removeClass('disabled');

                if ($('#botonAnterior').attr('class') !== 'btn btn-primary disabled') {

                    $('#botonAnterior').off('click');
                    $('#botonAlPrincipio').off('click');
                    $('#botonAnterior').click(botonAnterior);
                    $('#botonAlPrincipio').click(botonAlPrincipio);
                }


            }
            if (idUltimoElementovisible >= cantidadElmentosTotales) {
                $('#botonSiguiente').addClass('disabled');
                $('#botonAlFinal').addClass('disabled');
                $('#paginasFinales').addClass('disabled');
                $('#botonSiguiente').off('click');
                $('#botonAlFinal').off('click');
            } else {
                if ($('#botonSiguiente').attr('class') !== 'btn btn-primary') {

                    $('#botonSiguiente').removeClass('disabled');
                    $('#paginasFinales').removeClass('disabled');
                    $('#botonAlFinal').removeClass('disabled');
                    $('#botonSiguiente').off('click');
                    $('#botonAlFinal').off('click');
                    $('#botonSiguiente').click(botonSiguiente);
                    $('#botonAlFinal').click(botonAlFinal);
                }

            }
            cambiarNumeracion();
        }

        function botonSiguiente() {

            idUltimoElementovisible = parseInt($('tbody tr:not(.d-none):last').attr('id'));
            for (let i = idUltimoElementovisible; i > idUltimoElementovisible -
                numeroElementosPorPagina; i--) {
                $('#' + i).removeClass('d-none');
                $('#' + i).addClass('d-none');

            }
            for (let i = idUltimoElementovisible + 1; i < idUltimoElementovisible +
                numeroElementosPorPagina + 1; i++) {

                $('#' + i).removeClass('d-none');


            }
            comprobarBotonesActivos();
        }

        function botonAnterior() {
            idUltimoElementovisible = parseInt($('tbody tr:not(.d-none):first').attr('id'));

            $('#cuerpoTabla tr').addClass('d-none');



            if (idUltimoElementovisible % numeroElementosPorPagina != 0) {
                idUltimoElementovisible = parseInt(idUltimoElementovisible - idUltimoElementovisible %
                    numeroElementosPorPagina);
            }



            for (let i = idUltimoElementovisible; i > idUltimoElementovisible -
                numeroElementosPorPagina; i--) {

                $('#' + i).removeClass('d-none');


                if (i <= 1) {
                    for (let u = i; u <= numeroElementosPorPagina; u++) {
                        $('#' + u).removeClass('d-none');


                    }
                }
            }

            comprobarBotonesActivos();


        }

        function botonAlPrincipio() {


            $('tbody tr').addClass('d-none');

            for (let i = 1; i <= numeroElementosPorPagina; i++) {
                $('#' + i).removeClass('d-none');


            }
            comprobarBotonesActivos();
        }

        function botonAlFinal() {

            cantidadElementosMostrar = parseInt(cantidadElmentosTotales % numeroElementosPorPagina);
            if (cantidadElementosMostrar == 0) {
                cantidadElementosMostrar = numeroElementosPorPagina;
            }

            $('tbody tr').addClass('d-none');

            for (let i = cantidadElmentosTotales; i >
                cantidadElmentosTotales - cantidadElementosMostrar; i--) {
                $('#' + i).removeClass('d-none');

            }
            comprobarBotonesActivos();
        }

        function cambiarNumeracion() {
            $('#paginasActuales').html(parseInt($('tbody tr:not(.d-none):first').attr('id')) + "···" + parseInt($(
                'tbody tr:not(.d-none):last').attr('id')))
            if (cantidadElmentosTotales % numeroElementosPorPagina == 0) {
                $('#paginasFinales').html(cantidadElmentosTotales);

            } else {
                $('#paginasFinales').html(cantidadElmentosTotales);

            }
            $('#paginasIniciales').html(1);
        }

    }
}

function llamarVer() {

    $('#cuerpoTabla tr #verUsuario').each(function (i, e) {
        $(e).click(solicitarDatos);

    });

    function solicitarDatos() {


        let padre = $(this).parent().parent().parent().attr('id');

        correo = $("#" + padre + " td[id=correo]").html();
        $('button[data-toggle="tooltip"]').tooltip('dispose');

        $('#contenido').html(preload);
        $.post("vistas/usuarios/usuariosVer.html",
            function (data, textStatus, jqXHR) {
                $('button[data-toggle="tooltip"]').tooltip('dispose')
                $('#contenido').empty();
                $('#contenido').html(data);


            },
            "html"
        );
    }
}

function llamarEditar() {
    $('#cuerpoTabla tr #editarUsuario').each(function (i, e) {
        $(e).click(solicitarDatosEdicion);

    });

    function solicitarDatosEdicion() {


        let padre = $(this).parent().parent().parent().attr('id');

        correo = $("#" + padre + " td[id=correo]").html();
        $('button[data-toggle="tooltip"]').tooltip('dispose');

        $('#contenido').html(preload);
        $.post("vistas/usuarios/usuariosEditar.html",
            function (data, textStatus, jqXHR) {
                $('button[data-toggle="tooltip"]').tooltip('dispose')
                $('#contenido').empty();
                $('#contenido').html(data);


            },
            "html"
        );
    }
}

function llamarBorrar() {
    $('#cuerpoTabla tr #borrarUsuario').each(function (i, e) {
        $(e).click(borrarUsuario);
    });
}

function borrarUsuario() {

    let padre = $(this).parent().parent().parent().attr('id');

    let correoParaBorrar = $("#" + padre + " td[id=correo]").html();

    let mensaje = bootbox.dialog({
        title: 'Está apunto de borrar un usuario',
        message: "<p>¿Seguro qué quiere borrarlo?</p>",
        buttons: {
            cancel: {
                label: "Eliminar",
                className: 'btn-danger',
                callback: function () {
                    $.ajax({
                        type: "POST",
                        url: webService,
                        data: {
                            'accion': 'borrarUsuario',
                            'correoBorrar': correoParaBorrar
                        }


                    }).done(function (data) {

                        let mensaje;
                        if (data == 1) {

                            mensajeSuccess("Usuario eliminado con éxito");


                        } else if (data == -1) {

                            mensajeWarning("No tienes permisos para realizar esta acción");
                        } else if (data == -2) {

                            mensajeDanger('El usuario que intenta borrar ya no existe');
                        } else {

                            mensajeWarning('fallo, intentelo más tarde')
                        }


                        // setTimeout(mensaje.modal('hide'), 2000);

                        recargarListado();
                    }).fail(function (e) {
                        falloAjax();


                    })
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

}

function crearUnNuevoUsuriof() {
    $('#contenido').empty();
    $('#contenido').html(preload);

    $.post('vistas/usuarios/usuariosCrear.html', function (htmle) {
        $('#contenido').html(htmle);
    }, 'html');
}


function recargarListado() {
    $('#contenido').fadeToggle('slow');
    $('#contenido').empty();
    $('#contenido').html(preload);


    setTimeout(function () {
        $.post('vistas/usuarios/usuarios.html', function (htmle) {
            $('#contenido').html(htmle);
        }, 'html');
    }, 1000)

}

/**
 * Función encargada de  hacer una llamada al servicio cada vez que el modal se haya abierto.
 */
function eventosModales() {
    $('#modalVerProyectos').on('show.bs.modal', function (e) {
        //obtenemos la dirección de correo del usuario.
        let boton = $(e.relatedTarget);
        let lista = "";

        $.ajax({
                type: "POST",
                url: webService,
                data: {
                    'accion': 'obtenerProyectoDeUsuario',
                    'correo': $(boton).attr('data-correo')
                }
            })
            .done(function (datos) {

                if (datos == -1) {
                    mensajeDanger('Su usuario no tiene permisos para realizar esta acción.', '¡ERROR!');
                } else if (datos == -2) {
                    mensajeDanger('Fallo en la solicitud, falta el usuario que quiere solicitar.', '¡ERROR!');
                } else {
                    datos = JSON.parse(datos);

                    if (datos.length > 0) {
                        lista = '<ul class="list-group">';

                        for (let i = 0; i < datos.length; i++) {
                            lista += '<li class="list-group-item"><i class="fas fa-project-diagram text-info"></i> ' + datos[i]['id'] + ' - <span class="text-truncate">  ' + datos[i]['nombre'] + ' </span></li>';

                        }

                        lista += '</ul>'


                        $('#cuerpoModalProyectos').empty(); //eliminamos le preload. 
                        $('#cuerpoModalProyectos').append(lista)
                    } else {
                        // el usuario no administra proyectos.

                        $('#cuerpoModalProyectos').empty(); //eliminamos le preload. 
                        $('#cuerpoModalProyectos').append("<h4 class=' text-center text-warning'>El usuario no administra proyectos</h4>")
                    }


                }
            })
            .fail(falloAjax);
    })

    $('#modalVerTareas').on('show.bs.modal', function (e) {
        let boton = $(e.relatedTarget);
        let lista = "";
        $.ajax({
                type: "POST",
                url: webService,
                data: {
                    'accion': 'obtenerTareasDeUsuario',
                    'correo': $(boton).attr('data-correo')
                }
            })
            .done(function (datos) {
                if (datos == -1) {
                    mensajeDanger('Su usuario no tiene permisos para realizar esta acción.', '¡ERROR!');
                } else if (datos == -2) {
                    mensajeDanger('Fallo en la solicitud, falta el usuario que quiere solicitar.', '¡ERROR!');
                } else {
                    datos = JSON.parse(datos);

                    if (datos.length > 0) {


                        lista = '<ul class="list-group">';
                        for (let i = 0; i < datos.length; i++) {
                            console.log(datos[i])
                            lista += '<li class="list-group-item">';
                            lista += "<div class='row'>";
                            lista += "<div class='col-3'>";
                            lista += '<i class="fas fa-project-diagram text-info"></i> ' + datos[i][0]['idProyecto'];
                            lista += "</div>"; //cierre col
                            lista += "<div class='col'>";
                            lista += "<span class='text-truncate'> " + datos[i][0]['nombreProyecto'] + "</span>";

                            lista += "</div>"; //cierre col
                            lista += "</div>"; //cierre row
                            lista += "<hr class='ml-5 mr-5'>"; //cierre row

                            lista += "<div class='row'>";
                            lista += "<div class='col-3'>";
                            lista += '<i class="fas fa-tasks text-secondary"></i> ' + datos[i][0]['idTarea'];
                            lista += "</div>"; //cierre col
                            lista += "<div class='col'>";
                            lista += "<span class='text-truncate'> " + datos[i][0]['nombreTarea'] + "</span>";
                            lista += "</div>"; //cierre col

                            lista += "</div>"; //cierre row

                            lista += "</li>"; //cierre li

                        }

                        lista += '</ul>';
                        $('#cuerpoModalTareas').empty(); //eliminamos le preload. 
                        $('#cuerpoModalTareas').append(lista);
                    } else {
                        // el usuario no administra proyectos.

                        $('#cuerpoModalTareas').empty(); //eliminamos le preload. 
                        $('#cuerpoModalTareas').append("<h4 class=' text-center text-warning'>El usuario no administra Tareas</h4>")
                    }
                }
            })
            .fail(falloAjax);
    })

    $('#modalVerAnotaciones').on('show.bs.modal', function (e) {
        let boton = $(e.relatedTarget);
        let lista = "";

        $.ajax({
                type: "POST",
                url: webService,
                data: {
                    "accion": "obtenerAnotacionesDeUsuario",
                    "correo": $(boton).attr("data-correo")
                }
            })
            .done(function (datos) {
                if (datos == -1) {
                    mensajeDanger("El usuario no tiene permisos para realizar esta acción", "¡ERROR!");
                } else if (datos == -2) {
                    mensajeDanger("Faltan datos para realizar la consulta", "¡ERROR!");
                } else {
                    datos = JSON.parse(datos);
                    console.log(datos)
                    if (datos.length > 0) {

                        lista = '<ul class="list-group">';

                        for (let i = 0; i < datos.length; i++) {
                            lista += '<li class="list-group-item">';
                            lista += "<div class='row'>";
                            lista += "<div class='col'>";
                            //datos proyecto
                            lista += '<i class="fas fa-project-diagram text-info"></i> ' + datos[i][0]['pk_idProyecto'];
                            lista += ' - <span class="text-truncate">' + datos[i][0]['nombreProyecto']+'</span>';

                            lista += "</div>"; //cierre col
                            lista += "<div class='col'>";
                            //datos tarea
                            lista += '<p><i class="fas fa-tasks text-secondary"></i> ' + datos[i][0]['pk_idTarea'];
                            lista += ' - <span class="text-truncate">' + datos[i][0]['nombreTarea']+'</span></p>';

                            lista += "</div>"; //cierre col
                            lista += "</div>"; //cierre row

                            lista += "<hr class='ml-5 mr-5'>"; //separador

                            lista += "<div class='row'>";
                            lista += "<div class='col text-center'>";
                            //datos anotación
                            lista += '<small class="">' + datos[i][0]['nombre']+'</small></p>';

                            lista += "</div>"; //cierre col
                            lista += "</div>"; //cierre row
                            lista += "</li>"; //cierre li


                        }


                        $('#cuerpoModalAnotaciones').empty(); //eliminamos le preload. 
                        $('#cuerpoModalAnotaciones').append(lista);

                    } else {
                        $('#cuerpoModalAnotaciones').empty(); //eliminamos le preload. 
                        $('#cuerpoModalAnotaciones').append("<h4 class=' text-center text-warning'>El usuario no tiene ninguna anotación creada</h4>");
                    }
                }
            })
            .fail(falloAjax)


    })
    //evento cierre modal.
    $('#modalVerProyectos').on('hidden.bs.modal', function (e) {
        $('#cuerpoModalProyectos').html(preloadAzul);
    })
    $('#modalVerTareas').on('hidden.bs.modal', function (e) {
        $('#cuerpoModalTareas').html(preloadRojo);

    })

    $('#modalVerAnotaciones').on('hidden.bs.modal', function (e) {
        $('#cuerpoModalAnotacion').html(preloadVerde);
    })
}