window.addEventListener('load', function () {

  comprobarSesion();
  controladorBarraLateral();
  aniadeFuncionalidadBotonesBarraLateral();

})


/**
 * Función encargada de darle animacion a la barra lateral del cpanel.
 */
function controladorBarraLateral() {
  //variable con la que controlaremos si la barra lateral esta colapsada o no.

  var estadoBarraLateral = true;

  $('#btnComprimir').click(function () {

    if (estadoBarraLateral) {
      $('#barraLateral').animate({
        width: '5%'
      }, 300)
      $('#iconoComprimir').attr('class', 'fa fa-bars');

      $('svg[data-toggle="tooltip"]').tooltip();

      estadoBarraLateral = !estadoBarraLateral;

    } else {
      $('#barraLateral').animate({
        width: '10%'
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




  ////AREA DE FUNCIONES PARA LOS BOTONES

  /**
   * Borramos el contenido de la capa "contenido" y dibujamos los datos de la nueva vista
   */
  function botonUsuarios() {
    $('#contenido').empty();
    $('#contenido').html(preload);
    

    $.post('vistas/usuarios/usuarios.html', function (htmle) {
      $('#contenido').html(htmle);
    }, 'html');

  }

  function botonCerrarSesion() {
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
      if (data === '[]') {
        window.location = 'login.html';
      }

    })
    .fail(function (data) {

    });
}