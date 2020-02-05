selectorTemas();

/**
 * Funcion encargada de gestionar los temas, si no existe la cookie
 * encargada de obtener la url del tema, se seleccionara el por defecto (COSMO).
 */
function selectorTemas() {
    //variable donde almacenaremos  la url de bootstrap con los temas 

    let enlace = null;

    if (obtenerCookie('tema') == undefined) {
        document.cookie = "tema=Cosmo";
    }
    let tema = obtenerCookie('tema');
    switch (tema) {
        case "Cosmo":
            enlace = "https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/cosmo/bootstrap.min.css";
            break;
        case "Darkly":
            enlace = "https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/darkly/bootstrap.min.css";
            break;
        case "Flatly":
            enlace = "https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/flatly/bootstrap.min.css";
            break;
        case "Litera":
            enlace = "https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/litera/bootstrap.min.css";
            break;
        case "Lumen":
            enlace = "https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/lumen/bootstrap.min.css";
            break;
        case "Lux":
            enlace = "https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/lux/bootstrap.min.css";
            break;
        case "Materia":
            enlace = "https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/materia/bootstrap.min.css";
            break;
        case "Minty":
            enlace = "https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/minty/bootstrap.min.css";
            break;
    }

    //creamos el link para despues añadirlo al dom
    var link = document.createElement("link");
    link.setAttribute('href', enlace);
    link.type = "text/css";
    link.rel = "stylesheet";
    link.media = "screen,print";

    document.getElementsByTagName("head")[0].appendChild(link);
    

    function obtenerCookie(nombreCookie) {
        var valor = "; " + document.cookie;
        var cookie = valor.split("; " + nombreCookie + "=");
        if (cookie.length == 2) return cookie.pop().split(";").shift();
    }
}