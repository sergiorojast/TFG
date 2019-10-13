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
    consultarUsuario($usuario->getCorreo());

    //  echo $consulta;

    //var_dump($controlador->actualizarBD($consulta));

}

/**
 * Funcion encargada de devolver el usuario
 */
function consultarUsuario($correo): Usuario
{
    $controlador  = new ConectorBD();
    $consulta = "Select *  from Usuarios where pk_correo ='" . $correo . "'";
    $rows  = $controlador->consultarBD($consulta);
    while ($row =  $rows->fetch()) {
        $usuario =  new Usuario();
        $usuario->constructorArray($row);
    }
    return $usuario;
}
