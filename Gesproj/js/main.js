var webService =  'http://localhost/TFG/GesprojServicio/Servicio.php';
var LOGIN = 'http://localhost/TFG/Gesproj/login.html';

var repositorioImagenes = 'http://localhost/TFG/GesprojServicio/imagenes';

var preload= "<div class='text-center'><div class='spinner-border' role='status'><span class='sr-only'>Loading...</span></div> </div>";


function falloAjax(){
    bootbox.alert("Fallo en AJAX¡", function () {
        setTimeout(function(){
            window.location = LOGIN;
        },1000)
    });
}