$(function () {


    notificarUsuarioConPreload();
    obtenerDatosInicialesUsuario();


    validarFomularioEdicion();

    cargarTituloImagen();



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


            $('#zonaPreload').empty();
            $('#formularioEdicionActual').fadeToggle("slow");

        })
        .fail(function (datos) {
            falloAjax();
        })
}

function notificarUsuarioConPreload() {
    $('#zonaPreload').html(preload)
    $('#formularioEdicionActual').hide();
    $('#formularioEdicionActual').removeClass("d-none")

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

                email: true
            },
            eNombre: {

                minlength: 3,
                maxlength: 100
            },
            eApellidos: {

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
                    mensajeDanger('Se ha producido un error en la sesion','Error en la sesión.');
                } else if (resultado == -2) {
                    mensajeDanger('Se ha producido un error en la conexion a la base de datos','Error de conexión.')
                } else if (resultado == -3) {
                    mensajeDanger('Las contraseñas no coninciden','Error en los datos.')
                } else if (resultado == -4) {
                    mensajeDanger('Se esta intentando modificar un usuario diferente al de la sesion actual.','Error')
                }else if (resultado == -5) {
                    mensajeDanger('El tamaño de la imagen es demasiado grande.','Error de imagen.')
                }
            })
            .fail(function (data) {
                falloAjax();
            })
    }
}