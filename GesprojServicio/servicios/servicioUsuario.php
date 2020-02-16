<?php

datosIniciales();

devolverUsuarios();

devolverCorreoFechaUsuarios();

devolverRoles();

visualizarDatos();

editarUsuario();

borrarUsuario();

devolverAdministradores();

devolverModeradoresYAdministradores();

enviarInvitacion();

datosUsuarioLogueado();

editarUsuarioActual();

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
            if ($_SESSION['rol'] >= 90) {
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
                    // $controlador->cerrarBD();


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
            if ($_SESSION['rol'] >= 90) {
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
                        // $controlador->cerrarBD();

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
 * @return -5; La imagen es demasiado grande.
 * @return -6; Error en el envio de la notificación.
 */
function editarUsuario()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'editarUsuario') {
        // variable encargada de controlar si la imagen sera sustituida en el servidor.
        $subidaImagen = false;

        $controlador = new ConectorBD();

        $nombreImagenAntigua = "";

        if (isset($_POST['correo'])) {
            $correo = filtrado($_POST['correo']);
            if ($_SESSION['correo'] == $correo) {
                echo -4;
            } else {
                if (gestionarUsuarioExiste(90, $correo)) {
                    $correoEditar = filtraCorreo($_POST['eCorreo']);
                    $nombre  = filtrado($_POST['eNombre']);
                    $apellidos = filtrado($_POST['eApellidos']);
                    $rol = filtrado($_POST['eRol']);
                    if ($rol === "usuario") {
                        $rol = 0;
                    } else if ($rol === "moderador") {
                        $rol = 50;
                    } else if ($rol === "administrador") {
                        $rol = 90;
                    }

                    //             //var_dump($_POST);
                    $consulta = "UPDATE `Usuarios` SET";

                    if ($correoEditar !== $correo) {
                        $consulta .= "`pk_correo`='$correoEditar',";
                    }

                    $consulta .= "`nombre`='$nombre',`apellidos`='$apellidos',";
                    //             ////////////////////////////////
                    //             //imagen/////

                    if (count($_FILES) === 1 || $_FILES['eImagen']['name'] != '') {
                        if (explode('/', $_FILES['eImagen']['type'])[1] == "png" || explode('/', $_FILES['eImagen']['type'])[1] == "jpeg" || explode('/', $_FILES['eImagen']['type'])[1] == "jpg" || explode('/', $_FILES['eImagen']['type'])[1] == "svg") {


                            if ($_FILES['eImagen']['size'] <= 1000000) {

                                $nombreImagen = hash('md5', $_FILES['eImagen']['tmp_name']) . rand(0, 10000) . "." . explode('/', $_FILES['eImagen']['type'])[1];
                                //echo $nombreImagen;
                                $consulta .= "`imagen`='$nombreImagen',";
                                $subidaImagen = true;
                                //consultamos para almacenar el nombre de la imagen del usuario anterior.accordion
                                $consultaImagen = "SELECT imagen FROM Usuarios WHERE pk_correo='$correo'";

                                $row = $controlador->consultarBD($consultaImagen);
                                while ($fila = $row->fetch()) {
                                    $nombreImagenAntigua = $fila['imagen'];
                                }
                            } else {
                                echo -5; //la imagen es demasiado grande.
                            }
                        }
                    }


                    if (!empty($_POST['eContrasenia']) && !empty($_POST['eContrasenia2'])) {
                        if ($_POST['eContrasenia'] === $_POST['eContrasenia2']) {
                            $contrasenia = password_hash($_POST['eContrasenia'], PASSWORD_BCRYPT);
                            $consulta .= "`contrasenia`='$contrasenia',";
                        } else {
                            echo -3;
                        }
                    }
                    $consulta .= " `rol`='$rol' WHERE `pk_correo`='$correo'";





                    if ($controlador->actualizarBD($consulta)) {
                        //si la imagen no es actualizada, devolveremos ok.
                        if ($subidaImagen) {
                            //borramos la imagen anterior y movemos la nueva.
                            unlink("imagenes/$nombreImagenAntigua");

                            //movemos la imagen nueva.

                            move_uploaded_file($_FILES['eImagen']['tmp_name'], 'imagenes/' . $nombreImagen);

                            if (enviarNotificacionModificacion($correoEditar) == 1) {
                                echo 1;
                            } else {
                                echo -6;
                            }
                        } else {

                            if (enviarNotificacionModificacion($correoEditar) == 1) {
                                echo 1;
                            } else {
                                echo -6;
                            }
                        }
                    } else {
                        echo -2;
                    }




                    // $controlador->cerrarBD();
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

            if (gestionarUsuarioExiste(90, filtraCorreo($_POST['correoBorrar'])) == 1) {
                $consulta = "DELETE FROM `Usuarios` WHERE `pk_correo`='" . filtraCorreo($_POST['correoBorrar']) . "'";

                $conector  = new ConectorBD();

                if ($conector->actualizarBD($consulta)) {
                    echo 1;
                } else {
                    echo -3;
                }
            } else if (gestionarUsuarioExiste(90, filtraCorreo($_POST['correoBorrar'])) == -1) {
                echo -1;
            } else if (gestionarUsuarioExiste(90, filtraCorreo($_POST['correoBorrar'])) == -2) {
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
            $consulta  = "select pk_correo , fCreacion from Usuarios ORDER BY fCreacion DESC LIMIT 30";

            // echo $consulta;
            $controlador  = new ConectorBD();

            $filas =  $controlador->consultarBD($consulta);
            //  var_dump($filas);
            while ($fila = $filas->fetch()) {
                array_push($resultado, $fila);
            }

            echo json_encode($resultado);
            // $controlador->cerrarBD();
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
            // $controlador->cerrarBD();
        } else {
            echo -1; // sin permisos para realizar la accion
        }
    }
}

/**
 * Funcion encargada de devolver una lista con  los correos de los administradores.
 * 
 * @return json; correos de los ususarios adminsotradores.
 * @return -1; No existe una sesion iniciaza.
 * @return -2; El usuario que tiene la sesion iniciada no tiene los permisos necesario.
 */
function devolverAdministradores()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'listadoAdministradores') {
        if (gestionarSesionyRol(90) == 1) {
            $controlador =  new ConectorBD();


            $consulta = "select pk_correo  from Usuarios where rol >= 90";

            $filas = $controlador->consultarBD($consulta);
            $filas->setFetchMode(PDO::FETCH_NUM);

            echo json_encode($filas->fetchAll());
        } else if (gestionarSesionyRol(90) == -1) {
            echo -1;
        } else if (gestionarSesionyRol(90) == -2) {
            echo -2;
        }
    }
}

/**
 * Funcion encargada de devolver una lista con  los correos de los administradores.
 * 
 * @return json; correos de los ususarios adminsotradores.
 * @return -1; No existe una sesion iniciaza.
 * @return -2; El usuario que tiene la sesion iniciada no tiene los permisos necesario.
 */
function devolverModeradoresYAdministradores()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'listadoModeradoresYAdministradores') {
        if (gestionarSesionyRol(50) == 1) {
            $controlador =  new ConectorBD();


            $consulta = "select pk_correo  from Usuarios where rol >= 50";

            $filas = $controlador->consultarBD($consulta);
            $filas->setFetchMode(PDO::FETCH_NUM);

            echo json_encode($filas->fetchAll());
        } else if (gestionarSesionyRol(50) == -1) {
            echo -1;
        } else if (gestionarSesionyRol(50) == -2) {
            echo -2;
        }
    }
}

/**
 * Funcion encargada de enviar las invitaciones a los usuarios.
 * @return 1;//el correo a sido enviado.
 * @return -1;//correo no enviado. 
 * @return -2;//fallo en la consulta 
 * @return -3;//fallo en el borrado de las invitaciones cumplidas.
 */
function enviarInvitacion()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'enviarNotificacion') {
        if (gestionarSesionyRol(90) == 1) {
            $conector = new ConectorBD();

            //borramos las invitaciones caducadas.
            $consulta =  "SELECT pk_correoInvitacion FROM Registros where SYSDATE() >= fechaCaducidadInvitacion";
            //echo $consulta;

            $filas = $conector->consultarBD($consulta);

            while ($fila = $filas->fetch()) {
                $consulta  = "DELETE FROM Registros WHERE pk_correoInvitacion = '" . $fila[0] . "'";

                if (!$conector->actualizarBD($consulta)) {
                    echo -3;
                }
            }
            $correo = filtraCorreo($_POST['iCorreo']);





            //Obtenemos la fecha actual, y le sumamos 30 minutos.
            $fechaActual = new DateTime();
            $fechaActual->modify('+30 minute');

            $consulta = "INSERT INTO `Registros`(`pk_correoInvitacion`, `fechaCaducidadInvitacion`) VALUES ('$correo', '" . $fechaActual->format('Y-m-d H:i:s') . "')";



            if ($conector->actualizarBD($consulta)) {
                //envio de correo, devuelve 1 ó -1 si el correo fué enviado o no.
                enviarInvitacionUsuario($correo);
            } else {
                echo -2;
            }
        }
    }
}


/**
 * Funcion encargada de devolver todos los datos del usuario para su posterior edición.
 * 
 * 
 * @return -1;//sesion no iniciada.
 */
function datosUsuarioLogueado()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'datosUsuarioInicialesUsuarioLogueado') {
        if (isset($_SESSION['correo'])) {

            $consulta =  "SELECT * FROM Usuarios WHERE pk_correo  ='" . $_SESSION['correo'] . "'";
            $usuario = new Usuario();

            $controlador =  new ConectorBD();
            $filas = $controlador->consultarBD($consulta);
            while ($fila =  $filas->fetch()) {
                $usuario->constructorArray($fila);
                echo json_encode($usuario->devolverDatosArray());
            }
        } else {
            echo -1; //sesion no iniciada.
        }
    }
}

/**
 * Funcion encargada de modificarl el usuario actual.
 * @return 1 ; todo ok;
 * @return -1; El usuario no tiene la sesion iniciada o no tiene permisos para realizar esta accion;
 * @return -2; fallo en la insercioón en la base de datos.
 * @return -3; las contraseñas no coinciden.
 * @return -4; Esta intentando modificar un usuario diferente al de la sesion actual.
 * @return -5; La imagen es demasiado grande.
 * @return -6; Error en el envio de la notificación.
 */
function editarUsuarioActual()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'editarUsuarioActual') {

        // variable encargada de controlar si la imagen sera sustituida en el servidor.

        $subidaImagen = false;

        $controlador = new ConectorBD();

        $nombreImagenAntigua = "";

        if (isset($_POST['correo'])) {
            $correo = filtrado($_POST['correo']);
            if ($_SESSION['correo'] != filtraCorreo($_POST['eCorreo'])) {

                echo -4;
            } else {
                if (gestionarUsuarioExiste(00, $correo)) {
                    $correoEditar = filtraCorreo($_POST['eCorreo']);
                    $nombre  = filtrado($_POST['eNombre']);
                    $apellidos = filtrado($_POST['eApellidos']);
                    $rol = filtrado($_POST['eRol']);
                    if ($rol === "usuario") {
                        $rol = 0;
                    } else if ($rol === "moderador") {
                        $rol = 50;
                    } else if ($rol === "administrador") {
                        $rol = 90;
                    }

                    //             //var_dump($_POST);
                    $consulta = "UPDATE `Usuarios` SET";

                    if ($correoEditar !== $correo) {
                        $consulta .= "`pk_correo`='$correoEditar',";
                    }

                    $consulta .= "`nombre`='$nombre',`apellidos`='$apellidos',";
                    //             ////////////////////////////////
                    //             //imagen/////

                    if (count($_FILES) === 1 || $_FILES['eImagen']['name'] != '') {
                        if (explode('/', $_FILES['eImagen']['type'])[1] == "png" || explode('/', $_FILES['eImagen']['type'])[1] == "jpeg" || explode('/', $_FILES['eImagen']['type'])[1] == "jpg" || explode('/', $_FILES['eImagen']['type'])[1] == "svg") {


                            if ($_FILES['eImagen']['size'] <= 1000000) {

                                $nombreImagen = hash('md5', $_FILES['eImagen']['tmp_name']) . rand(0, 10000) . "." . explode('/', $_FILES['eImagen']['type'])[1];
                                //echo $nombreImagen;
                                $consulta .= "`imagen`='$nombreImagen',";
                                $subidaImagen = true;
                                //consultamos para almacenar el nombre de la imagen del usuario anterior.accordion
                                $consultaImagen = "SELECT imagen FROM Usuarios WHERE pk_correo='$correo'";

                                $row = $controlador->consultarBD($consultaImagen);
                                while ($fila = $row->fetch()) {
                                    $nombreImagenAntigua = $fila['imagen'];
                                }
                            } else {
                                echo -5; //la imagen es demasiado grande.
                            }
                        }
                    }


                    if (!empty($_POST['eContrasenia']) && !empty($_POST['eContrasenia2'])) {
                        if ($_POST['eContrasenia'] === $_POST['eContrasenia2']) {
                            $contrasenia = password_hash($_POST['eContrasenia'], PASSWORD_BCRYPT);
                            $consulta .= "`contrasenia`='$contrasenia',";
                        } else {
                            echo -3;
                        }
                    }
                    $consulta .= " `rol`='$rol' WHERE `pk_correo`='$correoEditar'";





                    if ($controlador->actualizarBD($consulta)) {
                        //si la imagen no es actualizada, devolveremos ok.
                        if ($subidaImagen) {
                            //borramos la imagen anterior y movemos la nueva.
                            unlink("imagenes/$nombreImagenAntigua");

                            //movemos la imagen nueva.

                            move_uploaded_file($_FILES['eImagen']['tmp_name'], 'imagenes/' . $nombreImagen);


                            //actualizamos los datos de la sesion 




                            if (enviarNotificacionModificacion($correoEditar) == 1) {
                                echo 1;
                            } else {
                                echo -6;
                            }
                        } else {
                            if (enviarNotificacionModificacion($correoEditar) == 1) {
                                echo 1;
                            } else {
                                echo -6;
                            }
                        }
                    } else {
                        echo -2;
                    }




                    // $controlador->cerrarBD();
                } else {
                    echo -1;
                }
                //  echo $consulta;
            }
        }
    }
}
