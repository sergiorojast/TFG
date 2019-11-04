$(document).ready(function () {



    validacionFormulario();


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
            rApellidos:{
                required: true,
                minlength: 3,
                maxlength: 100
            },

            rContrasenia: {
                required: true,
                minlength: 5,

            },
            rContrasenia2:{
                required :true,
                minlength: 5,
                equalTo: "#rContrasenia"
            }

        },
        messages:{
            rContrasenia2:{
                equalTo : 'Por favor, escribe la misma contraseña.'
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
            enviarDatosRegistro();



           

        }
    });
}

function enviarDatosRegistro(){
    $.ajax({
        type: "POST",
        url: webService,
        data: {
            'accion': 'registro',
            'correo': $('#rCorreo').val(),
            'nombre': $('#rNombre').val(),
            'apellidos': $('#rApellidos').val(),
            'contrasenia' :$('#rContrasenia').val() 
            
        }

    })
    .done(function (data) {
       resultado =  parseInt(data);
       if(resultado === 1){
        $('.alertas').empty()
   
        bootbox.alert({
            message: "Usuario creado con exito, se le redireccionara al login.",
            backdrop: true,
         
            callback: function () {
                window.location = "login.html";
            }
        })

          
    
       }else if(resultado === -1){
        $('.alertas').html("  <div class='alert alert-danger' role='alert'>" +
        "Correo invalido" +
        " </div>");

       }else if( resultado === -2){
        $('.alertas').html("  <div class='alert alert-danger' role='alert'>" +
        "El correo ya esta en uso" +
        " </div>");
       }
    })
    .fail(function (data) {
        $('.alertas').html("  <div class='alert alert-danger' role='alert'>" +
            "Error AJAX" +
            " </div>");


    });
}