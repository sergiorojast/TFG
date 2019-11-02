<?php
require('includes/ConectorBD.php');
require('includes/Usuario.php');


//crearUsuario();

//controladmos la llamadas para el login
if (isset($_POST['accion']) && $_POST['accion'] == 'login') {

    gestionarLogin();
}

/**
 * funcion encargada de crear un nuevo usuario Sergio
 */

function crearUsuario()
{
    $correo = 'sergio@rojastorres.es';
    $nombre = 'sergio';
    $apellidos = 'Rojas Torres';
    $contrasenia = 'platano';
    $rol = 100;
    $controlador  = new ConectorBD();

    $usuario = new Usuario();
    $usuario->constructor($correo, $nombre, $apellidos, $contrasenia, $rol);


    $consulta = "Insert into Usuarios values('" .
        $usuario->getCorreo() . "','" . $usuario->getNombre() . "','" . $usuario->getApellidos() . "','" . $usuario->getContrasenia() . "','" . $usuario->getRol() . "')";
    $usuarioAux = consultarUsuario($usuario->getCorreo());
    if ($usuarioAux->getCorreo() != null) {
        echo 'Usuario en la base de datos. ' . $usuario;
    } else {
        // 'Usuario no existe, por  lo tanto creamos el usuario en la base de datos';

        $controlador->actualizarBD($consulta);
    }
}

function gestionarLogin()
{

    if (isset($_POST['correo'])) {


        $usuario =  consultarUsuario($_POST['correo']);

        if ($usuario->getCorreo() != null) {
           
            $passAux = hash('sha256',$_POST['contrasenia']);
            
            if($usuario->getContrasenia() == $passAux){
                echo JSON_encode($usuario);
            }else{
                echo 2;
            }
        } else {
            echo 1;
        }
    }
}

/**
 * Funcion encargada de devolver el usuario
 */




