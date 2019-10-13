<?php

/**
 * Controlador encargado de gestionar las operaciones de login
 */
gestionarLogin();


function gestionarLogin()
{
    if (isset($_POST['Lenviar'])) {
        $errores = array();


        if (isset($_POST['Lcorreo'])) {
            if (filter_var($_POST['Lcorreo'], FILTER_VALIDATE_EMAIL)) { } else {
                array_push($errores, 'Dirección de correo invalida');
            }
        } else {
            array_push($errores, 'Dirección de correo requerida');
        }

        if (isset($_POST['Lcontrasenia'])) {
            if(strlen($_POST['Lcontrasenia']) >= 6){

            }else{
                array_push($errores, 'Contraseña no valida');
            }
         }


        if (count($errores) === 0) {
            echo 'Sin errores';
        } else {
            foreach ($errores as $key => $value) {
                echo $value . "<br>";
            }
        }
    }
}
