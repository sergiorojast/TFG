$(document).ready(function () {



    validacionFormulario();

    $('#formularioLogin').submit(function (e) {
        e.preventDefault();
    })


});


function validacionFormulario() {
    $.validator.setDefaults({
        submitHandler: function () {
            alert("submitted!");
        }
    })

    $("#formularioLogin").validate({
        rules: {
            lCorreo: {
                required: true,
                email: true
            },
            lContrasenia: {
                required: true,
                minlength: 5,

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
            enviarDatosLogin();



            //ahora vaciamos el formulario

        }
    });
}



/**
 * enviaremos los datos al servicio por medio de ajax y jquery
 */
function enviarDatosLogin() {
    $.ajax({
            type: "POST",
            url: "http://localhost/TFG/GesprojServicio/servicios/servicioLogin.php",
            data: {
                'correo': $('#lCorreo').val(),
                'contrasenia': $('#lContrasenia').val()
            }

        })
        .done(function (data) {
            let usuario = JSON.parse(data)
            // console.dir(usuario)
            if (isNaN(usuario)) {
                $('.alertas').empty()
                //borramos la cookie si existiera

                document.cookie = 'usuario  =;expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                //convertimos el objeto en un array y lo almacenamos en array
                document.cookie = "usuario=" + Object.values(usuario);

                //let cookie = document.cookie.split(';')

                //console.dir(cookie)
            } else {
                $('.alertas').html("  <div class='alert alert-danger' role='alert'>" +
                    "Los datos introducidos son erroneos" +
                    " </div>");
            }



        })
        .fail(function (data) {
            $('.alertas').html("  <div class='alert alert-danger' role='alert'>" +
            "Error AJAX" +
            " </div>");


        });


}