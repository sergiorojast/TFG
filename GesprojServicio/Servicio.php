<?php
require('includes/ConectorBD.php');
require('includes/Usuario.php');


crearUsuario();

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
    if($usuarioAux->getCorreo() != null){
        echo 'Usuario en la base de datos. '.$usuario; 
    }else{
        // 'Usuario no existe, por  lo tanto creamos el usuario en la base de datos';

        $controlador->actualizarBD($consulta);
    }


}

/**
 * Funcion encargada de devolver el usuario
 */
function consultarUsuario($correo): Usuario
{
    unset($usuario);
    $controlador  = new ConectorBD();
    $consulta = "Select *  from Usuarios where pk_correo ='" . $correo . "'";
    $rows  = $controlador->consultarBD($consulta);
    $usuario =  new Usuario();
    while ($row =  $rows->fetch()) {
        
        $usuario->constructorArray($row);
    } 

    return $usuario;
}
