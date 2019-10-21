<?php
require('../includes/ConectorBD.php');
require('../includes/Usuario.php');




/**
 * 
 * @return 0->Usuario,1->usuario no encontrado,2->contraseña no coincide.
 */

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['correo']) && isset($_GET['contrasenia'])) {
        $usuario = consultarUsuario($_GET['correo']);

        if ($usuario->getCorreo() != null) {

            $passAux = hash('sha256', $_GET['contrasenia']);

            if ($usuario->getContrasenia() == $passAux) {
                session_start();
                
                $_SESSION['correo'] = $usuario->getCorreo();
                $_SESSION['nombre'] = $usuario->getNombre();
                $_SESSION['apellidos']= $usuario->getApellidos();
                $_SESSION['contrasenia'] = $usuario->getContrasenia();
                $_SESSION['rol'] = $usuario->getRol();
                 
                echo json_encode($_SESSION);
            } else {
                echo 2; // contraseña no coinciden
            }
        } else {
            echo 1; //correo no existe en la base de datos
        }
    }

   // var_dump($_GET);
    $_GET = null;
    $usuario = null;
    unset($_GET);
    
}




function consultarUsuario($correo): Usuario
{
    unset($usuario);
    $controlador  = new ConectorBD();
    $consulta = "Select *  from Usuarios where pk_correo ='" . $correo . "'";
    $rows  = $controlador->consultarBD($consulta);
    $usuario =  new Usuario();
    while ($row =  $rows->fetch()) {
       // var_dump($row);
       $usuario->constructorArray($row);
    }

    return $usuario;
}
