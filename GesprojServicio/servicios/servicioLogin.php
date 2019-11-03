<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    session_start();

    //llamadas a las funciones
    ConsultarSession();
    login();
    registro();
}

/**
 * Funcion encargada de comprobar los datos para hacer login
 * 
 * @return 0->Usuario,1->usuario no encontrado,2->contraseña no coincide.
 */
function login()
{
    //login
    if (isset($_POST['accion']) && $_POST['accion'] === 'login') {
       
        if (isset($_POST['correo']) && isset($_POST['contrasenia'])) {
            $usuario = consultarUsuario($_POST['correo']);

            if ($usuario->getCorreo() != null) {

                $passAux = hash('sha256', $_POST['contrasenia']);

                if (password_verify($_POST['contrasenia'],$usuario->getContrasenia())) {

                    $_SESSION['correo'] = $usuario->getCorreo();
                    $_SESSION['nombre'] = $usuario->getNombre();
                    $_SESSION['apellidos'] = $usuario->getApellidos();
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
}

/**
 * Funcion encargada de recoger todos los datos, validarlos y crear un nuevo usuario en la base de datos.
 * @return =  -1; //correo no valido
 * @return = -2 // error en la consulta, usuario en la bd.
 * @return = 1; // Usuario insertado con exito
 */
function registro()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'registro') {

        $controlador = new ConectorBD();

        $correo = filter_var($_POST['correo'], FILTER_SANITIZE_EMAIL);
        $nombre = $_POST['nombre'];
        $apellidos =  $_POST['apellidos'];
        $contrasenia = password_hash($_POST['contrasenia'], PASSWORD_BCRYPT);
        $rol  = 0;

        //procesamos los datos 
        if (filter_var($correo, FILTER_VALIDATE_EMAIL)) {

            $consulta =  "INSERT INTO Usuarios(pk_correo,nombre,apellidos,contrasenia,rol)" .
                " VALUES('" . $correo . "','"
                . $nombre . "','"
                . $apellidos . "','"
                . $contrasenia . "',"
                . $rol . ")";
           

            if ($controlador->actualizarBD($consulta)) {
                echo 1;
            }else{
                echo -2;
            }
        } else {
            echo -1; //error en el correo

        }




        $controlador->cerrarBD();
    }
}

/**
 * Funcion encargada de devolver la session de php
 */
function ConsultarSession()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'sesion') {

        echo  json_encode($_SESSION);
    }
}
function eliminarSession(){
    if (isset($_POST['accion']) && $_POST['accion'] === 'Eliminarsesion') {

        $_SESSION = null;
    }
}

/**
 * Funcion auxiliar que nos devuelve un objeto Usuario por medio de la consulta
 * en la base de datos de un correo.
 */
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
    $controlador->cerrarBD();

    return $usuario;
}
