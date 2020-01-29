$(document).ready(function () {

    comprobarInvitacionValida();

    validacionFormulario();


    $('#rImagen').on('change', function () {
        //get the file name
        let fileName = $(this).val().split('\\').pop();
        //replace the "Choose a file" label
        $('.custom-file-label').html(fileName);
    });
});


function validacionFormulario() {
    $.validator.setDefaults({
        submitHandler: function () {
            alert("submitted!");
        }
    })

    $("#formularioLogin").validate({
        rules: {
            rCorreo: {
                required: true,
                email: true
            },
            rNombre: {
                required: true,
                minlength: 3,
                maxlength: 100
            },
            rApellidos: {
                required: true,
                minlength: 3,
                maxlength: 100
            },

            rContrasenia: {
                required: true,
                minlength: 5,

            },
            rContrasenia2: {
                required: true,
                minlength: 5,
                equalTo: "#rContrasenia"
            },
            rImagen: {
                required: true,
                extension: "png|jpeg|jpg|svg"
            }

        },
        messages: {
            rContrasenia2: {
                equalTo: 'Por favor, escribe la misma contraseña.'
            },
            rImagen: {
                extension: 'El fichero introducido no tiene una extensión permitida.Las extensiones permitidas son --> png, jpeg,jpg,svg.'
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
            $('#lEnviar').addClass('disabled');
            $('#lEnviar').html(preload);
            // $(form)[0].submit();


            enviarDatosRegistro(form);





        }
    });
}

function enviarDatosRegistro(form) {


    $.ajax({
            type: "POST",
            url: webService,
            data: new FormData(form),
            contentType: false,
            cache: false,
            processData: false,

        })
        .done(function (datos) {
            console.log(datos)
            console.log(typeof (datos));
            let dato = parseInt(datos);
            console.log(typeof (dato));

            if (dato == 1) {
                mensajeSuccess("El  usuario se ha creado correctamente, se procedera a la redirección para el acceso", "Exito");
                //redireccionamos al login
                setTimeout(redireccionarLogin, 5000);
            }
            if (dato == -1) {
                mensajeDanger("El correo introducido no es valido", "Error en la dirección de correo");
            }
            if (dato == -2) {
                mensajeDanger("Error en el acceso a la base de datos", "Contacte con el programador.");

            }
            if (dato == -3) {
                mensajeWarning("La direccion de correo ya esta en uso", "Error en la dirección de correo");
            }
            $('#lEnviar').html("Enviar");

            setTimeout($(form)[0].reset(), 5000);
        })
        .fail(function (datos) {
            falloAjax();
            $('#lEnviar').html("Enviar");
        })

}

function redireccionarLogin() {
    window.location = "./login.html";
}

function comprobarInvitacionValida() {

    //obtenemos la url.
    let url = window.location.search;
    // obtenemos el base64 decodificado a utf8 donde tenemos el correo.
    let correoURL = atob(url.substr(1));
    //limpiamos la variable para solo dejar el correoURL.
    correoURL = correoURL.split("=")[1];

    //console.log(correoURL)
    //hacemos una llamada ajax para comprobar si tenemos una invitación activa.contenedor

    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'registroInvitacion',
                'correo': correoURL
            }
        })
        .done(function (data) {
            // console.log(data);
            if (data == 1) {

            } else {
                $('.contenedorRegistro').empty();
                bootbox.alert({
                    title: 'No tiene una invitación valida',
                    message: "Será redireccionado al login",
                    size: 'small',
                    backdrop: true,
                    callback: function (resultado) {
                        window.location = "http://www.iestrassierra.net/alumnado/curso1920/DAWS/daws1920a7/Gesproj";
                    }

                });
            }
        })
        .fail(function (data) {
            falloAjax();
        })
}