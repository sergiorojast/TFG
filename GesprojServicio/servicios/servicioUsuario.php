<?php

datosIniciales();



/**
 * 
 * 
 * @return = -1 no existe la session de php
 * @return = -2 la variable global que gestiona  el ususario no esta creada.
 */
function datosIniciales()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'datosUsuarioIniciales') {
        if (isset($_SESSION['correo']) && isset($_SESSION['rol'])) {
            if (isset($_SESSION['usuario']) && is_object($_SESSION['usuario'])) {
                $datos = [
                    'nombre' =>$_SESSION['usuario']->getNombre(),
                    'apellidos'=>$_SESSION['usuario']->getApellidos(),
                    'imagen' =>$_SESSION['usuario']->getImagen()
                ];

                echo json_encode($datos);

              //  echo "[{nombre:" . $_SESSION['usuario']->getNombre() . ", imagen:" . $_SESSION['usuario']->getImagen() . "," . $_SESSION['usuario']->getApellidos() . "}]";
            } else {
                echo -2; // la variable global no esta definida
            }
        } else {
            echo -1; // no existe sesion alguna.
        }
    }
}
