window.addEventListener('load', function () {

  comprobarSesion();
  controladorBarraLateral();
  aniadeFuncionalidadBotonesBarraLateral();
  dibujarDatosUsarioBarraLateral();

  cargarTablero();

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
      $('#barraLateral').animate({
        width: '5%'
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
      contadorGiroIcono = 45;
      $('#barraLateral').animate({
        width: '10%'
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
  $('#crudUsuarios').click(botonUsuarios);
  $('#cerrarSesion').click(botonCerrarSesion);
  $('#tablero').click(cargarTablero);




  ////AREA DE FUNCIONES PARA LOS BOTONES

  /**
   * Borramos el contenido de la capa "contenido" y dibujamos los datos de la nueva vista
   */
  function botonUsuarios() {
    comprobarSesion();
    $('#contenido').empty();
    $('#contenido').html(preload);


    $.post('vistas/usuarios/usuarios.html', function (htmle) {
      $('#contenido').html(htmle);
    }, 'html');

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
        bootbox.alert({
          message: "Fallo en AJAX!",
          backdrop: true
        });
      });
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

    })
}

function cargarTablero() {
  comprobarSesion();
  $('#contenido').empty();
  $('#contenido').html(preload);


  $.post('vistas/tablero.html', function (htmle) {
    $('#contenido').html(htmle);
  }, 'html');
}