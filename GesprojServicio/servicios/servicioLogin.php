<?php
require('../includes/ConectorBD.php');
require('../includes/Usuario.php');






if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    login();
    
}

/**
 * 
 * @return 0->Usuario,1->usuario no encontrado,2->contraseña no coincide.
 */
function login(){
    //login
    if (isset($_POST['correo']) && isset($_POST['contrasenia'])) {
        $usuario = consultarUsuario($_POST['correo']);

        if ($usuario->getCorreo() != null) {

            $passAux = hash('sha256', $_POST['contrasenia']);

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

   // var_dump($_POST);
    $_POST = null;
    $usuario = null;
    unset($_POST);
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
