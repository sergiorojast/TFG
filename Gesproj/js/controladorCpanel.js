window.addEventListener('load', function () {


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
      $('#iconoComprimir').attr('class', 'fa fa-chevron-right');

      $('svg[data-toggle="tooltip"]').tooltip();

      estadoBarraLateral = !estadoBarraLateral;

    } else {
      $('#barraLateral').animate({
        width: '10%'
      }, 300)
      $('#iconoComprimir').attr('class', 'fa fa-chevron-left')
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
  $('#cerrarSesion').click(botonCerrarSesion);



  ////AREA DE FUNCIONES PARA LOS BOTONES


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
        $('.alertas').html("  <div class='alert alert-danger' role='alert'>" +
          "Error AJAX" +
          " </div>");


      });
  }
}