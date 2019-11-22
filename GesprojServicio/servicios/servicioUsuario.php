<?php

datosIniciales();

devolverUsuarios();

devolverCorreoFechaUsuarios();

devolverRoles();

visualizarDatos();

editarUsuario();

borrarUsuario();



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
 * @return 1 ; todo ok;
 * @return -1; El usuario no tiene la sesion iniciada o no tiene permisos para realizar esta accion;
 * @return -2; fallo en la insercioón en la base de datos.
 * @return -3; las contraseñas no coinciden.
 * @return -4; No puedes modificar el ususario que estas usando.
 */
function editarUsuario()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'editarUsuario') {

        if (isset($_POST['correo'])) {
            $correo = filtrado($_POST['correo']);
            if ($_SESSION['correo'] == $correo) {
                echo -4;
            } else {
                if (gestionarUsuarioExiste(90, $correo)) {
                    $correoEditar = filtraCorreo($_POST['eCorreo']);
                    $nombre  = filtrado($_POST['eNombre']);
                    $apellidos = filtrado($_POST['eApellidos']);
                    $rol = $_POST['eRol'];

                    //var_dump($_POST);
                    $consulta = "UPDATE `Usuarios` SET";

                    if ($correoEditar !== $correo) {
                        $consulta .= "`pk_correo`='$correoEditar',";
                    }

                    $consulta .= "`nombre`='$nombre',`apellidos`='$apellidos',";
                    ////////////////////////////////
                    //imagen/////


                    if (!empty($_POST['eContrasenia']) && !empty($_POST['eContrasenia2'])) {
                        if ($_POST['eContrasenia'] === $_POST['eContrasenia2']) {
                            $contrasenia = password_hash($_POST['eContrasenia'], PASSWORD_BCRYPT);
                            $consulta .= "`contrasenia`='$contrasenia',";
                        } else {
                            echo -3;
                        }
                    }
                    $consulta .= " `rol`='$rol' WHERE `pk_correo`='$correo'";


                    $controlador = new ConectorBD();


                    if ($controlador->actualizarBD($consulta)) {
                        echo 1;
                    } else {
                        echo -2;
                    }
                    $controlador->cerrarBD();
                } else {
                    echo -1;
                }
                //  echo $consulta;
            }
        }
    }
}

/**
 * @return 1// usuario borrado.
 * @return -1 //usuario sin permisos para la accion.
 * @return -2 //el usuario no existe en la base de datos.
 * @return -3 // fallo en la consulta de la base de datos.
 */
function borrarUsuario()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'borrarUsuario') {

        if (isset($_POST['correoBorrar'])) {

            if (gestionarUsuarioExiste(99, filtraCorreo($_POST['correoBorrar'])) == 1) {
                $consulta = "DELETE FROM `Usuarios` WHERE `pk_correo`='" . filtraCorreo($_POST['correoBorrar']) . "'";

                $conector  = new ConectorBD();

                if ($conector->actualizarBD($consulta)) {
                    echo 1;
                } else {
                    echo -3;
                }
            } else if (gestionarUsuarioExiste(99, filtraCorreo($_POST['correoBorrar'])) == -1) {
                echo -1;
            } else if (gestionarUsuarioExiste(99, filtraCorreo($_POST['correoBorrar'])) == -2) {
                echo -2;
            }
        } else {
            echo -1;
        }
    }
}

//funcion encargada de  enviar los datos para el primer diagrama de lineas del tablero
function devolverCorreoFechaUsuarios()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'correoyfecha') {

        if (gestionarSesionyRol(0)) {
            $resultado  = [];
            $consulta  = "select pk_correo , fCreacion from Usuarios";

            // echo $consulta;
            $controlador  = new ConectorBD();

            $filas =  $controlador->consultarBD($consulta);
            //  var_dump($filas);
            while ($fila = $filas->fetch()) {
                array_push($resultado, $fila);
            }

            echo json_encode($resultado);
            $controlador->cerrarBD();
        }
    }
}

function devolverRoles()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'roles') {

        if (gestionarSesionyRol(0)) {
            $resultado  = [];
            $consulta  = "select rol from Usuarios";

            // echo $consulta;
            $controlador  = new ConectorBD();

            $filas =  $controlador->consultarBD($consulta);
            //  var_dump($filas);
            while ($fila = $filas->fetch()) {
                array_push($resultado, $fila);
            }

            echo json_encode($resultado);
            $controlador->cerrarBD();
        } else {
            echo -1; // sin permisos para realizar la accion
        }
    }
}
