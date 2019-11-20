    //array que almacena cada fecha que  nos traemos de la base de datos y el numero de usuarios registrados esa fecha.
    // para despues dibujar el diagrama 
    var fechas = [];
    var fechasAux = [];

    $(function () {


        solicitarDatosUsuariosRegistrados();

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
                    if(fechas[datos]!== undefined){
                        
                        fechas[datos[i][1]] +=1; 
                    }else{
                        fechas[datos[i][1]] =1
                    }
                }
     
             
               

                dibujarDiagramaUsuariosRegistrados();

            }).fail(function (data) {
                falloAjax();
            });
    }

    function dibujarDiagramaUsuariosRegistrados() {
        let canvas = $('#diagramaUsarios');


        let diagrama = new Chart(canvas, {
            type: 'line',
            data: {
                labels:fechas,
                datasets: [{
                    label: 'Número de usuarios registrados',
                    data: [12, 19, 3, 5, 2, 3],
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