<?php

datosIniciales();

devolverUsuarios();

visualizarDatos();

editarUsuario();



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
                    'nombre' => $_SESSION['usuario']->getNombre(),
                    'apellidos' => $_SESSION['usuario']->getApellidos(),
                    'imagen' => $_SESSION['usuario']->getImagen()
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

/**
 * 
 * 
 * @return -1 // la sesion no esta creada.
 * @return -2 // el usuario no tiene permisos para hacer esta accion.
 * 
 * @return "ERROR" // error en la consulta de la base de  datos.
 */
function devolverUsuarios()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'usuarios') {
        if (isset($_SESSION['correo']) && isset($_SESSION['rol'])) {
            if ($_SESSION['rol'] > 90) {
                try {

                    $controlador  = new ConectorBD();
                    $consulta = "Select *  from Usuarios order by nombre , apellidos ";
                    $rows  = $controlador->consultarBD($consulta);
                    $usuarios = [];
                    $usuario =  new Usuario();
                    while ($row =  $rows->fetch()) {
                        // var_dump($row);
                        $usuario->constructorArray($row);
                        $usuarios[]  = $usuario->devolverDatosArray();
                    }
                    //var_dump($usuarios);
                    $controlador->cerrarBD();


                    echo json_encode($usuarios);

                    unset($usuarios);
                    unset($usuario);
                } catch (Exception $e) {
                    echo 'ERROR';
                }
            } else {
                echo -2;
            }
        } else {
            echo -1; // no existe sesion activa
        }
    }
}
/**
 * Función que nos devuelve los datos del usuarios para visualizarlos.
 * 
 * @return -1 //sesion  no creada; deberia redireccionar al login.html;
 * @return -2 // Usuario no tiene permisos para realizar esta acción;
 * @return -3 // error en la base de datos;
 * @return -4 // correo no definido;
 */

function visualizarDatos()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'visualizarUsuario') {
        if (isset($_SESSION['correo']) && isset($_SESSION['rol'])) {
            if ($_SESSION['rol'] > 90) {
                if (isset($_POST['correo'])) {

                    $correo =  filtrado($_POST['correo']);
                    try {

                        $controlador  = new ConectorBD();
                        $consulta = "Select *  from Usuarios where pk_correo ='" . $correo . "' ";


                        $rows  = $controlador->consultarBD($consulta);
                        $usuarios = [];
                        $usuario =  new Usuario();
                        while ($row =  $rows->fetch()) {
                            // var_dump($row);
                            $usuario->constructorArray($row);
                            $usuarios[]  = $usuario->devolverDatosArray();
                        }
                        //var_dump($usuarios);
                        $controlador->cerrarBD();

                        echo json_encode($usuarios);

                        unset($usuarios);
                        unset($usuario);
                    } catch (Exception $e) {
                        echo -3; // error en la conexion a la base de datos.
                    }
                } else {
                    echo -4; // correo no definido.
                }
            } else {
                echo -2;
            }
        } else {
            echo -1; // sesion no creada
        }
    }
}


/**
 * 
 * @return -1; El usuario no tiene la sesion iniciada o no tiene permisos para realizar esta accion;
 */
function editarUsuario()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'editarUsuario') {

        if (isset($_POST['correo'])) {
            $correo = filtrado($_POST['correo']);



            if (gestionarUsuarioExiste(90, $correo)) {

                var_dump($_POST);
                $correoEditar = filtraCorreo($_POST['eCorreo']);
                $nombre  = filtrado($_POST['eNombre']);
                $apellidos = filtrado($_POST['eApellidos']);
                $contrasenia = password_hash($_POST['eContrasenia'], PASSWORD_BCRYPT);
                $rol = $_POST['rol'];

                $consulta = "UPDATE `Usuarios` SET `pk_correo`='$correoEditar',`nombre`='$nombre',`apellidos`='$apellidos',`imagen`='[value-4]',`contrasenia`='$contrasenia',`rol`='$rol' WHERE `pk_correo`='$correo'";
                echo $consulta;
            } else {
                echo -1;
            }
        }
    }
}
