window.addEventListener('load', function () {


  comprobarSesion();
  controladorBarraLateral();
  aniadeFuncionalidadBotonesBarraLateral();
  dibujarDatosUsarioBarraLateral();

  cargarTablero();

  controlBotonesPorRol();

})

/**
 * Función encargada de darle animacion a la barra lateral del cpanel.
 */
function controladorBarraLateral() {
  //variable con la que controlaremos si la barra lateral esta colapsada o no.

  var estadoBarraLateral = true;
  //variable para girar el aspa al comprimir la barra
  let contadorGiroIcono = 0;

  $('#btnComprimir').click(function () {
    contadorGiroIcono = 0;

    if (estadoBarraLateral) {
      $('#barraLateral .row p').addClass('text-center');
      $('#barraLateral').animate({
        width: '75px'
      }, {
        step: function () {
          contadorGiroIcono = parseInt(contadorGiroIcono + 5);

          if (contadorGiroIcono <= 45) {

            $('#iconoComprimir').css({
              '-webkit-transform': 'rotate(' + contadorGiroIcono + 'deg)',
              '-moz-transform': 'rotate(' + contadorGiroIcono + 'deg)',
              '-ms-transform': 'rotate(' + contadorGiroIcono + 'deg)',
              'transform': 'rotate(' + contadorGiroIcono + 'deg)'
            })
          } else {
            // contadorGiroIcono = 0;
          }
        },
        start: function () {
          $('#filaContenidoPrincipal').animate({
            paddingLeft: '5%',
          }, 300)
        }
      }, 300)




      $('svg[data-toggle="tooltip"]').tooltip();

      estadoBarraLateral = !estadoBarraLateral;

    } else {
      $('#barraLateral .row p').removeClass('text-center');
      contadorGiroIcono = 45;
      $('#barraLateral').animate({
        width: '140px'
      }, {
        step: function () {
          contadorGiroIcono = parseInt(contadorGiroIcono + 5);

          if (contadorGiroIcono <= 90) {

            $('#iconoComprimir').css({
              '-webkit-transform': 'rotate(' + contadorGiroIcono + 'deg)',
              '-moz-transform': 'rotate(' + contadorGiroIcono + 'deg)',
              '-ms-transform': 'rotate(' + contadorGiroIcono + 'deg)',
              'transform': 'rotate(' + contadorGiroIcono + 'deg)'
            })
          } else {
            // contadorGiroIcono = 0;
          }
        },
        start: function () {
          $('#filaContenidoPrincipal').animate({
            paddingLeft: '10%',
          }, 300)
        }
      }, 300)

      $('#iconoComprimir').attr('class', 'fa fa-times')
      estadoBarraLateral = !estadoBarraLateral;
      $('svg[data-toggle="tooltip"]').tooltip('dispose');
    }
    $("small[id='textoBarraLateral']").toggle('fast');
  })

}
/**
 * Función creada para añadir los eventos de click.
 */
function aniadeFuncionalidadBotonesBarraLateral() {

  $('#usuarioActual').click(botonEditarUsuario)
  $('#imagenUsuario').click(botonEditarUsuario)
  $('#crudUsuarios').click(botonUsuarios);
  $('#cerrarSesion').click(botonCerrarSesion);
  $('#tablero').click(cargarTablero);
  $('#crudProyectos').click(cargarProyectos);
  $('#botonTareas').click(botonTareas);




  ////AREA DE FUNCIONES PARA LOS BOTONES
  /**
   * Función encargada de  editar el usuario actual que tiene la sesion iniciada.
   */
  function botonEditarUsuario() {
    comprobarSesion();

    $('#contenido').fadeToggle('slow');
    $('#contenido').empty();
    $('#contenido').html(preload);

    setTimeout(function () {
      $.post('vistas/usuarios/usuarioEditarActual.html', function (htmle) {
        $('#contenido').html(htmle);
      }, 'html');
    }, 1000)
  }
  /**
   * Borramos el contenido de la capa "contenido" y dibujamos los datos de la nueva vista
   */
  function botonUsuarios() {
    comprobarSesion();

    $('#contenido').fadeToggle('slow');
    $('#contenido').empty();
    $('#contenido').html(preload);


    setTimeout(function () {
      $.post('vistas/usuarios/usuarios.html', function (htmle) {
        $('#contenido').html(htmle);
      }, 'html');
    }, 1000)
  }

  function botonCerrarSesion() {
    comprobarSesion();
    //borramos la cookie de recuerdame y la de usuario
    document.cookie = 'recuerdame = ;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    document.cookie = 'usuario = ;expires=Thu, 01 Jan 1970 00:00:01 GMT;'

    //borramos la sesion de php
    $.ajax({
        type: "POST",
        url: webService,
        data: {
          'accion': 'Eliminarsesion'
        }

      })
      .done(function (data) {
        // console.log(data)
        window.location = 'login.html';
      })
      .fail(function (data) {
        falloAjax();
      });
  }

  function botonTareas() {

    comprobarSesion();

    $('#contenido').fadeToggle('slow');
    $('#contenido').empty();
    $('#contenido').html(preload);


    setTimeout(function () {
      $.post('vistas/Tareas/tareasResumen.html', function (htmle) {
        $('#contenido').html(htmle);
      }, 'html');
    }, 1000)
  }


  function cargarProyectos() {

    comprobarSesion();

    $('#contenido').fadeToggle('slow');
    $('#contenido').empty();
    $('#contenido').html(preload);



    setTimeout(function () {
      $.post('vistas/Proyectos/proyectosResumen.html', function (htmle) {
        $('#contenido').html(htmle);
      }, 'html');
    }, 1000);

  }
}

function comprobarSesion() {
  $.ajax({
      type: "POST",
      url: webService,
      data: {
        "accion": "sesion"
      }

    })
    .done(function (data) {

      //si la llamada ajax nos devuelve un string con dos corchetes quiere decir que no existe sesion alguna.
      if (data == "-1") {
        window.location = 'login.html';
      }

    })
    .fail(function (data) {

      falloAjax();
    });
}

/**
 * ponemos la imagen del usuario y el nombre en la barra lateral.
 */
function dibujarDatosUsarioBarraLateral() {
  $.ajax({
      type: "POST",
      url: webService,
      data: {
        'accion': 'datosUsuarioIniciales'
      },
    })
    .done(function (data) {

      let datos = JSON.parse(data);
      //console.dir(datos);
      $('.usuarioImg').attr('src', repositorioImagenes + "/" + datos['imagen']);
      $('.nombreUsuario').html(datos['nombre']);
      $('.apellidosUsuario').html(datos['apellidos']);
    })
    .fail(function (data) {
      console.log(data)
      falloAjax()
    })
}

function cargarTablero() {
  comprobarSesion();
  $('#contenido').fadeToggle('slow');
  $('#contenido').empty();
  $('#contenido').html(preload);



  setTimeout(function () {

    $.post('vistas/tablero.html', function (htmle) {
      $('#contenido').html(htmle);
    }, 'html');
  }, 1000);
}
/**
 * Funcion encargada de ocultar los botones para los usuarios que no tengan los permisos.
 */
function controlBotonesPorRol() {
  let cookies = document.cookie.split(';');
  let cookie;
  let rol;



  for (let i = 0; i < cookies.length; i++) {
    let aux = cookies[i].split('=');

    if (aux[0] == " usuario" || aux[0] == "usuario") {
      cookie = aux[1];
    }
  }

  cookie = cookie.split(',')
  for (let i = 0; i < cookie.length; i++) {
    aux = cookie[i].split(':');

    if (aux[0] == '"rol"') {
      rol = aux[1].substr(0, aux[1].length - 1);

    }

  }
  rolUsuario = rol;

  if (rolUsuario == 0) {
    //eliminamos los botones de la barra lateral izquierda
    $('#columnaUsuario').remove();
    $('#columnaProyectos').remove();
    //eliminamos crear tarea de la seccion tareas
    $('#crearTarea').remove();
    //Eliminamos las option del select de editar usuario actual
    $('#administrador').remove();
    $('#moderador').remove();


  } else if (rolUsuario == 50) {
    //eliminamos los botones de la barra lateral izquierda
    $('#columnaUsuario').remove();
    //eliminamos crear tarea de la seccion tareas
    $('#crearTarea').remove();
    //Eliminamos las option del select de editar usuario actual
    $('#administrador').remove();


  }
}