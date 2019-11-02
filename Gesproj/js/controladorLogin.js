$(document).ready(function () {



    validacionFormulario();

    $('#recuerdame').on('click',funcionalidadBotonRecuerdame);



});
/**
 * Controlamos el value del boton switch del formulario
 */
function funcionalidadBotonRecuerdame() {
let $boton  = $('#recuerdame');

    if($boton.val()=='false'){
        $boton.val('true'); 
    }else{
        $boton.val('false'); 
    }
  
}


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
                'accion': 'login',
                'correo': $('#lCorreo').val(),
                'contrasenia': $('#lContrasenia').val()
            }

        })
        .done(function (data) {
            let usuario = data
            // console.dir(usuario
            if (isNaN(usuario)) {
                $('.alertas').empty()
                //borramos la cookie si existiera

                document.cookie = 'usuario  =;expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                //si el switch esta en on, se almacenaran los datos en una cookie
                if($('#recuerdame').val()== 'true'){
                    document.cookie = "usuario=" + Object.values(usuario);
                }
                //let cookie = document.cookie.split(';')
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