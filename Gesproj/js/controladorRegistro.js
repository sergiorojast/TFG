$(document).ready(function () {



    validacionFormulario();
    //modificarBotonFile();
    /* 
        //añadimos funcionalidad al boton de subr imagen
        $('#botonReal').click(function (e) {
            $('#rImagen').click();
        })
        //cambio del texto dle label de la imagen
        $('#rImagen').change(function (e) {
             console.log($('#rImagen')[0].files[0].name)
           // $('#labelImagen').html($('#rImagen')[0].files[0].name)
        })
     */

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
    //let imagen =$('#rImagen').prop('files')[0];
    //console.dir(form);


    //datos.append('nombre', $('#rCorreo').val());
    //datos.append('imagen', $('#rImagen')[0].files[0]);
    //console.log(datos);

    $.ajax({
            type: "POST",
            url: webService,
            data:{
                'accion':'registro',
                'rCorreo': $('#rCorreo').val(),
                'rNombre': $('#rNombre').val(),
                'rApellidos' :$('#rApellidos').val(),
                'rContrasenia': $('#rContrasenia').val()
            } ,

        })
        .done(function (data) {
        
            let mensaje;
            resultado = parseInt(data);

            if (resultado === 1) {
                $('.alertas').empty()

              mensaje =  bootbox.alert({
                    message: "Usuario creado con exito, se le redireccionara al login.",
                    backdrop: true,

                    callback: function () {
                        window.location = "login.html";
                    }
                })



            } else if (resultado === -1) {
                
              mensaje =  bootbox.alert({
                    message: "<span class='text-danger'> Correo no valido</span>",
                    backdrop: true,
                })

            } else if (resultado === -2 || resultado === -3) {
                mensaje =  bootbox.alert({
                    message: "<span class='text-info'> Este correo ya esta en uso </span>",
                    backdrop: true,
                })
            }
            $('#lEnviar').removeClass('disabled');
            $('#lEnviar').html('Enviar');
            
        })
        .fail(function (data) {
            $('.alertas').html("  <div class='alert alert-danger' role='alert'>" +
                "Error AJAX" +
                " </div>");


        });
}