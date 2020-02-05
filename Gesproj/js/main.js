var webService = 'http://www.iestrassierra.net/alumnado/curso1920/DAWS/daws1920a7/GesprojServicio/Servicio.php';
var LOGIN = 'http://www.iestrassierra.net/alumnado/curso1920/DAWS/daws1920a7/Gesproj/login.html';
var cpanel = 'http://localhost/TFG/Gesproj/cpanel.html';
var js = '/js/';

var repositorioImagenes = 'http://www.iestrassierra.net/alumnado/curso1920/DAWS/daws1920a7/GesprojServicio/imagenes';

//preload normales.
var preload = "<div class='text-center'><div class='spinner-border' role='status'><span class='sr-only'>Loading...</span></div> </div>";
var preloadAzul = "<div class='text-center'><div class='spinner-border text-primary' role='status'><span class='sr-only'>Loading...</span></div> </div>";
var preloadRojo = "<div class='text-center'><div class='spinner-border text-danger' role='status'><span class='sr-only'>Loading...</span></div> </div>";
var preloadVerde = "<div class='text-center'><div class='spinner-border text-success' role='status'><span class='sr-only'>Loading...</span></div> </div>";

//preload Pulso colores
var preloadPulsoVerde = "<div class='container '> <div class='row '><div class='col text-center'><div class='spinner-grow text-success' role='status'><span class='sr-only'>Loading...</span></div></div></div></div>";
var preloadPulsoRojo = "<div class='container '> <div class='row '><div class='col text-center'><div class='spinner-grow text-danger' role='status'><span class='sr-only'>Loading...</span></div></div></div></div>";
var preloadPulsoAzul = "<div class='container '> <div class='row '><div class='col text-center'><div class='spinner-grow text-primary' role='status'><span class='sr-only'>Loading...</span></div></div></div></div>";



//muestra una barra en las alertas toastr
toastr.options.progressBar = true;
// prevenimos que se  muestren multiples alertas iguales
toastr.options.preventDuplicates = true;
//Añadimos boton cerrar
toastr.options.closeButton = true;

function falloAjax() {
    toastr.error('Parece haber un error en la petición AJAX, le recomendamos que pruebe en unos minutos', 'Error AjaX!', {
        timeOut: 5000
    });
}

/**
 * Funcion encargada de mostrar un mensaje de exito. 
 * @param {string} mensaje 
 * @param {String} titulo 
 * @param {int} tiempo ; // segundos  que tarda la alerta en marcharse.
 */
function mensajeSuccess(mensaje, titulo = "", tiempo = 5) {
    tiempo = tiempo * 1000;
    toastr.success(mensaje, titulo, {
        timeOut: tiempo
    });
};

/**
 * Funcion encargada de mostrar un mensaje de advertencia. 
 * @param {string} mensaje 
 * @param {String} titulo 
 * @param {int} tiempo ; // segundos  que tarda la alerta en marcharse.
 */
function mensajeWarning(mensaje, titulo = "", tiempo = 5) {
    tiempo = tiempo * 1000;
    toastr.warning(mensaje, titulo, {
        timeOut: tiempo
    });
};
/**
 * Funcion encargada de mostrar un mensaje de informacion. 
 * @param {string} mensaje 
 * @param {String} titulo 
 * @param {int} tiempo ; // segundos  que tarda la alerta en marcharse.
 */
function mensajeInfo(mensaje, titulo = "", tiempo = 5) {
    tiempo = tiempo * 1000;
    toastr.info(mensaje, titulo, {
        timeOut: tiempo
    });
};

/**
 * Funcion encargada de mostrar un mensaje de Error. 
 * @param {string} mensaje 
 * @param {String} titulo 
 * @param {int} tiempo ; // segundos  que tarda la alerta en marcharse.
 */
function mensajeDanger(mensaje, titulo = "", tiempo = 5) {
    tiempo = tiempo * 1000;
    toastr.error(mensaje, titulo, {
        timeOut: tiempo
    });
};


function obtenerCookie(nombreCookie) {
    let valor = "; " + document.cookie;
    let cookie = valor.split("; " + nombreCookie + "=");
    if (cookie.length == 2) return cookie.pop().split(";").shift();
}