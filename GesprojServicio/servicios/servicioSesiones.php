<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    

    //llamadas a las funciones
    ConsultarSession();
    eliminarSession();
}

/**
 * Funcion encargada de devolver la session de php
 */
function ConsultarSession()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'sesion') {
        // CAMBIARLO
        // echo  json_encode($_SESSION);

        if (isset($_SESSION['correo']) && isset($_SESSION['rol'])) { } else {
            echo -1;
        }
    }
}
function eliminarSession()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'Eliminarsesion') {
        $_SESSION = [];
        session_destroy();
    }
}
