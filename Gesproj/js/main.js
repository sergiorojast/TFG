var webService =  'http://localhost/TFG/GesprojServicio/Servicio.php';
var LOGIN = 'http://localhost/TFG/Gesproj/login.html';
var cpanel = 'http://localhost/TFG/Gesproj/cpanel.html';
var js = '/js/';

var repositorioImagenes = 'http://localhost/TFG/GesprojServicio/imagenes';

var preload= "<div class='text-center'><div class='spinner-border' role='status'><span class='sr-only'>Loading...</span></div> </div>";



//muestra una barra en las alertas toastr
toastr.options.progressBar = true;
// prevenimos que se  muestren multiples alertas iguales
toastr.options.preventDuplicates = true;
//Añadimos boton cerrar
toastr.options.closeButton = true;
function falloAjax(){
   toastr.error('Parece haber un error en la petición AJAX, le recomendamos que pruebe en unos minutos', 'Error AjaX!', {timeOut: 5000});
}

/**
 * Funcion encargada de mostrar un mensaje de exito. 
 * @param {string} mensaje 
 * @param {String} titulo 
 * @param {int} tiempo ; // segundos  que tarda la alerta en marcharse.
 */
function mensajeSuccess(mensaje,titulo="", tiempo= 5){
    tiempo = tiempo * 1000;
    toastr.success(mensaje, titulo, {timeOut: tiempo});
};

/**
 * Funcion encargada de mostrar un mensaje de advertencia. 
 * @param {string} mensaje 
 * @param {String} titulo 
 * @param {int} tiempo ; // segundos  que tarda la alerta en marcharse.
 */
function mensajeWarning(mensaje,titulo="", tiempo= 5){
    tiempo = tiempo * 1000;
    toastr.warning(mensaje, titulo, {timeOut: tiempo});
};
/**
 * Funcion encargada de mostrar un mensaje de informacion. 
 * @param {string} mensaje 
 * @param {String} titulo 
 * @param {int} tiempo ; // segundos  que tarda la alerta en marcharse.
 */
function mensajeInfo(mensaje,titulo="" , tiempo= 5){
    tiempo = tiempo * 1000;
    toastr.info(mensaje, titulo, {timeOut: tiempo});
};

/**
 * Funcion encargada de mostrar un mensaje de Error. 
 * @param {string} mensaje 
 * @param {String} titulo 
 * @param {int} tiempo ; // segundos  que tarda la alerta en marcharse.
 */
function mensajeDanger(mensaje,titulo="" , tiempo= 5){
    tiempo = tiempo * 1000;
    toastr.error(mensaje, titulo, {timeOut: tiempo});
};