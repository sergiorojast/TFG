$(document).ready(function () {

    comprobarRecuerdame();

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
            enviarDatosLogin($('#lCorreo').val(),$('#lContrasenia').val());



            //ahora vaciamos el formulario

        }
    });
}

/**
 * enviaremos los datos al servicio por medio de ajax y jquery
 */
function enviarDatosLogin(correo , contrasenia) {
    $.ajax({
            type: "POST",
            url: webService,
            data: {
                'accion': 'login',
                'correo': correo,
                'contrasenia': contrasenia
            }

        })
        .done(function (data) {
            let usuario = data;
           // console.log(data);
            
            if (isNaN(usuario)) {
                $('.alertas').empty()
                //borramos la cookie si existiera

                document.cookie = 'usuario  =;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'recuerdame = ;expires=Thu, 01 Jan 1970 00:00:01 GMT;'

                document.cookie = "usuario=" + usuario;

                //si el switch esta en on, se almacenaran los datos en una cookie
                if($('#recuerdame').val()== 'true'){
                    document.cookie = "recuerdame=["+$('#lCorreo').val()+","+$('#lContrasenia').val()+"]";
                   // console.log(document.cookie);
                }

                window.location = 'cpanel.html'


                //let cookie = document.cookie.split(';')
            } else {
                $('.alertas').html("  <div class='alert alert-danger' role='alert'>" +
                    "Los datos introducidos son erróneos" +
                    " </div>");
            }



        })
        .fail(function (data) {
            falloAjax();
        });


}
/**
 * Función encargada de ver si existe la cookie d e usuario, comprobar si los datos son correctos y hacer login automatico
 */
function comprobarRecuerdame(){

    let cookiesSinFormato =document.cookie.split(';');
    let cookisFormateadas= new Array() ;
    let aux = new Array(); // variable auxiliar, su funcionmiento es hacer de almacen temporal.

    for(let i = 0; i < cookiesSinFormato.length; i++) {
        aux= cookiesSinFormato[i].split('=');
      
        //es necesario hacer el trim, porque le intruduce un espacio delante al indice asociativo
       cookisFormateadas[aux[0].trim()] = aux[1];
       
       
    
}
    if(cookisFormateadas['recuerdame']!= undefined){
        let recuerdame = cookisFormateadas['recuerdame'].split(',');
        //llamamos a la funcion de enviar datos

        
        enviarDatosLogin(recuerdame[0].substr(1),recuerdame[1]);
    }
  

  
}