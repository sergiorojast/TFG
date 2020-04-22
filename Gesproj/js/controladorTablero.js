$(function () {



    if (rolUsuario == 90) {
        $("div #estadisticasAdministrador").removeClass("d-none");
        solicitarDatosUsuariosRegistrados();
        solicitarDatosRoles();
        solicitarProyectosSegunEstados();
        solicitarDatosGenerales();

    }
    if (rolUsuario >= 50) {


        $("div #estadisticasModerador").removeClass("d-none");
    }
    if (rolUsuario == 0) {
        $("div #estadisticasAdministrador").removeClass("d-none");
        $("div #estadisticasAdministrador").addClass("d-none");
    }


    // $('#contenido').fadeToggle(2000);
    $('#contenido').fadeIn('250');

})

function solicitarDatosUsuariosRegistrados() {
    //array que almacena cada fecha que  nos traemos de la base de datos y el numero de usuarios registrados esa fecha.
    // para despues dibujar el diagrama 
    var fechas = [];
    var cantidades = [];
    var fechasFinal = [];

    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'correoyfecha'
            }
        })
        .done(function (data) {
            datos = JSON.parse(data);
            //primero rellenamos el array; y contamos las veces que aparencen
            for (let i = 0; i < datos.length; i++) {
                if (fechas[datos[i][1].substr(0, datos[i][1].indexOf(" "))] !== undefined) {

                    fechas[datos[i][1].substr(0, datos[i][1].indexOf(" "))] += 1;
                } else {
                    fechas[datos[i][1].substr(0, datos[i][1].indexOf(" "))] = 1
                }
            }

            for (let key in fechas) {

                cantidades.push(fechas[key]);
                fechasFinal.push(key);
            }


            dibujarDiagramaUsuariosRegistrados();

        }).fail(function (data) {
            falloAjax();
        });

    function dibujarDiagramaUsuariosRegistrados() {
        let canvas = $('#diagramaUsarios');


        let diagrama = new Chart(canvas, {
            type: 'line',
            data: {
                labels: fechasFinal,
                datasets: [{
                    label: 'Número de usuarios registrados',
                    data: cantidades,
                    pointRadius: 0,
                    fill: false,
                    lineTension: 0,
                    borderWidth: 2,
                    borderColor: "#428bca",
                    backgroundColor: "#5bc0de",
                    fill: true

                }]
            }
        })
    }
}



/**
 * Funcion encargada de devolver los roles que existen en nuestro sistema
 * los mostraremos en un diagrama circular
 */
function solicitarDatosRoles() {
    let administradores = 0;
    let Avanzados = 0;
    let usuarios = 0;
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'roles'
            }
        })
        .done(function (data) {
            let datos = JSON.parse(data);

            for (let i = 0; i < datos.length; i++) {
                if (datos[i][0] >= 90) {
                    administradores++;
                } else if (datos[i][0] >= 50 && datos[i][0] < 90) {
                    Avanzados++;
                } else {
                    usuarios++;
                }

            }
            dibujarDatos();

        })
        .fail(function (data) {
            falloAjax();
        })

    function dibujarDatos() {
        let canvas = $('#diagramaRoles');

        let diagrama = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ["Administradores", "Moderadores", "usuarios"],
                datasets: [{

                    data: [administradores, Avanzados, usuarios],
                    pointRadius: 0,
                    fill: false,
                    lineTension: 0,
                    borderWidth: 2,
                    borderColor: "#428bca",
                    backgroundColor: ['#22CECE', "#FF3D67", "#059BFF"],
                    fill: true

                }]
            }
        })
    }
}

/**
 * funcion encargada de solicitar la cantidad de proyecto englobada segun el estado. despues se representara 
 * en un diagrama de "PIE" mostrando los 4 estados.
 */
function solicitarProyectosSegunEstados() {

    let estados = [];
    let numeroProyectos = [];

    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'solicitarProyectosPorEstado'
            }
        }).done(function (e) {
            datos = JSON.parse(e);

            for (let i = 0; i < datos.length; i++) {

                for (let clave in datos[i][0]) {

                    estados.push(clave);
                    numeroProyectos.push((datos[i][0][clave]));
                }




            }
            dibujarDiagramaProyectosSegunEstados(estados, numeroProyectos);
        })
        .fail(falloAjax)


    function dibujarDiagramaProyectosSegunEstados(estados, numeroProyectos) {

        let canvas = $('#diagramaProyectosSegunEstado');
        var proyectosSegunEstados = new Chart(canvas, {

            type: 'horizontalBar',
            data: {

                labels: estados,

                datasets: [{
                    label: "Numero de proyectos",
                    data: [numeroProyectos[0], numeroProyectos[1], numeroProyectos[2], numeroProyectos[3]],
                    borderColor: "#428bca",
                    backgroundColor: ['#FF9124', "#FF3D67", "#059BFF", "#22CECE"]
                }]
            }

        });
    }

}

/**
 * Funcion encargada de obtener los datos generales del tablero, los cuales osn el numero total de usuarios, el numero total de proyectos entre otros datos
 * la funcion solicita y dibuja los datos.
 */
function solicitarDatosGenerales() {

    numUsuarios();
    numProyectos();
    numTareas();
    porcentajeProyectosFinalizados();
    porcentajeTareasFinalizadas();

    function numUsuarios() {
        $("#numUsuariosTotalesPlataforma").html(preloadPequenio);
        $.ajax({
                type: "POST",
                url: webService,
                data: {
                    "accion": "solicitarNumeroUsuarios"
                }
            })
            .done(function (e) {
                $("#numUsuariosTotalesPlataforma").text(e);
            }).fail(falloAjax)
    }

    function numProyectos() {

        $("#numProyectosTotalesPlataforma").html(preloadPequenio);

        $.ajax({
                type: "POST",
                url: webService,
                data: {
                    "accion": "solicitarNumeroProyectos"
                }
            })
            .done(function (e) {

                $("#numProyectosTotalesPlataforma").text(e);
            }).fail(falloAjax)
    }

    function numTareas() {
        $("#numTareasTotalesPlataforma").html(preloadPequenio);

        $.ajax({
            type: "POST",
            url: webService,
            data: {
                "accion": "solicitarNumeroTareas"
            }
        })
        .done(function (e) {

            $("#numTareasTotalesPlataforma").text(e);
        }).fail(falloAjax)
    }


    function porcentajeProyectosFinalizados(){
        $("#barra-progreso").html(preloadPequenioAleatorio);

        
        $.ajax({
            type: "POST",
            url: webService,
            data: {
                "accion": "solicitarPorcentajeProyectosFinalizados"
            }
        })
        .done(function (e) {
 
            $("#barra-progreso").html(
                '<div class="progress"><div class="progress-bar bg-success" role="progressbar " style="width: '+e+'%;" aria-valuenow="'+e+'" aria-valuemin="0" aria-valuemax="100">'+e+'%</div></div>'
            )
        }).fail(falloAjax)
    }

    function porcentajeTareasFinalizadas(){
        $("#barraProgresoTareas").html(preloadPequenioAleatorio);

        $.ajax({
            type: "POST",
            url: webService,
            data: {
                "accion": "solicitarPorcentajeTareasFinalizadas"
            }
        })
        .done(function (e) {
          
            $("#barraProgresoTareas").html(
                '<div class="progress"><div class="progress-bar bg-info" role="progressbar " style="width: '+e+'%;" aria-valuenow="'+e+'" aria-valuemin="0" aria-valuemax="100">'+e+'%</div></div>'
            )
        }).fail(falloAjax)
    }
}