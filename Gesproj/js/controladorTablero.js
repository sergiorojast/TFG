    //array que almacena cada fecha que  nos traemos de la base de datos y el numero de usuarios registrados esa fecha.
    // para despues dibujar el diagrama 
    var fechas = [];
    var cantidades = [];
    var fechasFinal = [];

    $(function () {


        solicitarDatosUsuariosRegistrados();

        solicitarDatosRoles();

    })

    function solicitarDatosUsuariosRegistrados() {
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
        $.ajax({
                type: "POST",
                url: webService,
                data: {
                    'accion': 'roles'
                }
            })
            .done(function (data) {
                let datos = JSON.parse(data);


            })
            .fail(function (data) {
                falloAjax();
            })

        function dibujarDatos() {
            let canvas = $('diagramaRoles');
        }
    }