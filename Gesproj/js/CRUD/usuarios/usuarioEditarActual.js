$(function () {



    obtenerDatosInicialesUsuario();

    $('#contenido').fadeToggle(2000);
    validarFomularioEdicion();

    cargarTituloImagen();

    funcionalidadSelectorTemas();

    controlBotonesPorRol();
})

/**
 * funcion encargada de cargar el nombre de la imagen en el label del input file
 */
function cargarTituloImagen() {
    $('#eImagen').on('change', function () {
        //get the file name
        let fileName = $(this).val().split('\\').pop();
        //replace the "Choose a file" label
        $('.custom-file-label').html(fileName);
    });
}

function obtenerDatosInicialesUsuario() {


    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'datosUsuarioInicialesUsuarioLogueado'
            },
        })
        .done(function (datos) {
            let usuario = JSON.parse(datos);
            dibujarDatosUsuario(usuario);


            // $('#zonaPreload').empty();
            //$('#formularioEdicionActual').fadeToggle("slow");

        })
        .fail(function (datos) {
            falloAjax();
        })
}


function dibujarDatosUsuario(datos) {
    $("#eCorreo").val(datos['correo'])
    $("#eNombre").val(datos['nombre'])
    $("#eApellidos").val(datos['apellidos'])
    $("#imagenActual").attr("src", "http://www.iestrassierra.net/alumnado/curso1920/DAWS/daws1920a7/GesprojServicio/imagenes/" + datos['imagen']);


    if (parseInt(datos['rol']) >= 90) {
        $('#administrador').attr('selected', 'true');
    } else if (parseInt(datos['rol']) >= 50 && parseInt(datos['rol']) < 90) {
        $('#moderador').attr('selected', 'true');
    } else {
        $('#usuario').attr('selected', 'true');
    }


}

function validarFomularioEdicion() {
    $('#formularioEdicionActual').validate({
        rules: {
            eCorreo: {
                required: true,
                email: true
            },
            eNombre: {
                required: true,
                minlength: 3,
                maxlength: 100
            },
            eApellidos: {
                required: true,
                minlength: 3,
                maxlength: 100
            },

            eContrasenia: {

                minlength: 5,

            },
            eContrasenia2: {

                minlength: 5,
                equalTo: "#eContrasenia"
            },
            eImagen: {

                extension: "png|jpeg|jpg|svg"
            }
        },
        errorElement: "small",
        errorPlacement: function (error, element) {
            // Add the `invalid-feedback` class to the error element
            error.addClass("invalid-feedback");


            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.next("label"));
            } else {
                error.insertAfter(element);

            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        },
        submitHandler: function (form, event) {
            $('#botonModificarEdicionUsuarioActual').html(preload);
            event.preventDefault();
            enviarDatos(form);
        }
    });

    function enviarDatos(form) {
        $.ajax({
                type: "POST",
                url: webService,
                data: new FormData(form),
                contentType: false,
                cache: false,
                processData: false,

            })
            .done(function (data) {
                let resultado = parseInt(data);

                if (resultado == 1) {
                    mensajeSuccess("Los datos representados en la interfaz se mostraran en el próximo acceso.", "Usuario Actualizado con exito");
                } else if (resultado == -1) {
                    mensajeDanger('Se ha producido un error en la sesion', 'Error en la sesión.');
                } else if (resultado == -2) {
                    mensajeDanger('Se ha producido un error en la conexion a la base de datos', 'Error de conexión.')
                } else if (resultado == -3) {
                    mensajeDanger('Las contraseñas no coninciden', 'Error en los datos.')
                } else if (resultado == -4) {
                    mensajeDanger('Se esta intentando modificar un usuario diferente al de la sesion actual.', 'Error')
                } else if (resultado == -5) {
                    mensajeDanger('El tamaño de la imagen es demasiado grande.', 'Error de imagen.')
                } else if (resultado == -6) {
                    mensajeInfo('Datos modificados con exito, pero no notificados');
                }

                $('#botonModificarEdicionUsuarioActual').html("<i lass='fa fa-save'></i> Modificar");
            })
            .fail(function (data) {
                $('#botonModificarEdicionUsuarioActual').html("<i lass='fa fa-save'></i> Modificar");
                falloAjax();
            })
    }
}
/**
 * Funcion encargada de darle funcionalidad al selector de temas.
 */
function funcionalidadSelectorTemas() {

    cambiarImagen();
    cambiarTema();
    cambiarSelector();


    function cambiarImagen() {
        $('#selectorTema').change(function (evento) {
            let tema = $('#selectorTema').val();
            switch (tema) {
                case "Cosmo":
                    $('#imagenTema').attr('src', 'temas/cosmo.png');
                    break;
                case "Darkly":
                    $('#imagenTema').attr('src', 'temas/darkly.png');
                    break;
                case "Flatly":
                    $('#imagenTema').attr('src', 'temas/flatly.png');
                    break;
                case "Litera":
                    $('#imagenTema').attr('src', 'temas/litera.png');
                    break;
                case "Lumen":
                    $('#imagenTema').attr('src', 'temas/lumen.png');
                    break;
                case "Lux":
                    $('#imagenTema').attr('src', 'temas/lux.png');
                    break;
                case "Materia":
                    $('#imagenTema').attr('src', 'temas/materia.png');
                    break;
                case "Minty":
                    $('#imagenTema').attr('src', 'temas/minty.png');
                    break;
            }
        })
    }
    /**
     * Funcion encargada de cambiar el tema y crear una cookie con el mismo.
     */
    function cambiarTema() {
        $('#botonCambiarTema').click(function (evento) {
            let temaSeleccionado = $('#selectorTema').val();
            console.log(document.cookie = "tema =" + temaSeleccionado);

            mensajeSuccess('Espere 5 segundos para ver los cambios', 'Tema cambiado correctamente');

            setTimeout(function () {
                location.reload();
            }, 5000);
        })
    }

    function cambiarSelector() {
        let temaActual = obtenerCookie('tema');
        switch (temaActual) {
            case "Cosmo":
                $('#selectorTema option[value="Cosmo"]').attr("selected", 'true');
                $('#imagenTema').attr('src', 'temas/cosmo.png');
                break;
            case "Darkly":
                $('#selectorTema option[value="Darkly"]').attr("selected", 'true');
                $('#imagenTema').attr('src', 'temas/darkly.png');
                break;
            case "Flatly":
                $('#selectorTema option[value="Flatly"]').attr("selected", 'true');
                $('#imagenTema').attr('src', 'temas/flatly.png');
                break;
            case "Litera":
                $('#selectorTema option[value="Litera"]').attr("selected", 'true');
                $('#imagenTema').attr('src', 'temas/litera.png');
                break;
            case "Lumen":
                $('#selectorTema option[value="Lumen"]').attr("selected", 'true');
                $('#imagenTema').attr('src', 'temas/lumen.png');
                break;
            case "Lux":
                $('#selectorTema option[value="Lux"]').attr("selected", 'true');
                $('#imagenTema').attr('src', 'temas/lux.png');
                break;
            case "Materia":
                $('#selectorTema option[value="Materia"]').attr("selected", 'true');
                $('#imagenTema').attr('src', 'temas/materia.png');
                break;
            case "Minty":
                $('#selectorTema option[value="Minty"]').attr("selected", 'true');
                $('#imagenTema').attr('src', 'temas/minty.png');
                break;
        }
    }


}
