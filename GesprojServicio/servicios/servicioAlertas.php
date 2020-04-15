<?php


crearAlertaSolicitudNuevaTarea();


consultarAlertas();

obtenerNumeroNotficaciones();

obtenerSolicitudesSinLeer();

cambiarEstadoNotificaciones();

obtenerSolicitudesLeidas();

obtenerAlertasSinLeer();

obtenerAlertasLeidas();

/**
 * Funcion encargada de crear una nueva  alerta para los administradores donde se le notificara
 * que creen una tarea para X usuario, solicitada por el mismo dando un nombre y una descripción.
 * @return 1; usuarios administradores notificados correctamente.
 * @return -1; Faltan datos.
 * @return -2; El usuario no tiene permisos para  solicitar una nueva tarea
 * @return -3; Fallo en la consulta de insercion
 */
function crearAlertaSolicitudNuevaTarea()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'crearAlertaSolicitudTarea') {
        if (gestionarSesionyRol(0) == 1) {

            //comprobamos los datos 
            if (isset($_POST['idTarea']) && isset($_POST['nombre']) && isset($_POST['desc'])) {
                //comprobamos que el usuario  tiene alguna tarea dentro del proyecto, sino es asi. no puede solicitar tareas.
                $id = filtrado($_POST['idTarea']);
                $nombre  = filtrado($_POST['nombre']);
                $descripcion = filtrado($_POST['desc']);
                $tienePermisos =  false; // con esta variable comprobamos si el usuario tiene permisos en el proyecto
                $mensaje = "El usuario solicita una nueva tarea en el proyecto: $id, con el nombre: $nombre y la descripcion de la solicitud es: $descripcion";
                $aux = true; //variablle que uso para controlar  que ninguna de las peticiones de insercion fallen.


                $conector = new ConectorBD();


                $consulta = "SELECT fk_idTarea FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE  `fk_correo` = '" . $_SESSION['correo'] . "'";

                //lanzamos la consulta para obtener un listado de todas las tareas en las que el usuario tiene permisos.
                $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                for ($i = 0; $i < count($resultado); $i++) {
                    //consultamos las tareas que tiene  el usuario para obtener el id del proyecto al que pertenecen.
                    $consulta = "SELECT `fk_idProyecto` FROM `Tareas` WHERE `pk_idTarea` = " . $resultado[$i]['fk_idTarea'];

                    $resultado2 = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                    //comprobamos que el proyecto sea igual al que queremos añadir la nueva solicitud.
                    if ($resultado2[0]['fk_idProyecto']  == $id) {
                        $tienePermisos = true;
                    }
                }

                if ($tienePermisos) {
                    //obtenemos los administradores del proyecto.
                    $consulta =  "SELECT `fk_correo` FROM `Usuarios:Proyectos` WHERE `fk_idProyecto` = $id";

                    $resultado =  $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                    for ($i = 0; $i < count($resultado); $i++) {


                        //creamos las consultas  para las notificaciones
                        $consulta = "INSERT INTO `Alertas`( `fk_correo_emisor`, `fk_correo_receptor`, `mensaje`, `estado`, `fecha`, `tipo`)
                         VALUES ('" . $_SESSION['correo'] . "','" . $resultado[$i]['fk_correo'] . "','" . $mensaje . "',0,SYSDATE(),'Solicitud')";

                        if ($conector->actualizarBD($consulta)) {
                        } else {
                            $aux = false;
                        }
                    }

                    if ($aux) {
                        echo 1;

                        //enviamos los correos
                        for ($i = 0; $i < count($resultado); $i++) {
                            enviarNotificacionSolicitudNuevaTarea($_SESSION['correo'], $resultado[$i]['fk_correo'], $id);
                        }
                    } else {
                        echo -3;
                    }
                } else {
                    echo -2; // el usuario no tiene permisos para realizar esta solicitud.
                }
            } else {
                echo -1;
            }
        }
    }
}


/**
 * Funcion que se encarga de devolver si el usuario tiene alguna alerta, se envia una peticion cada minuto
 * @return 1; el usuario tiene alertas
 * @return -1 ; el usuario no tiene alertas
 */
function consultarAlertas()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'consultarNotificaciones') {
        if (gestionarSesionyRol(0) == 1) {

            $consulta = "SELECT * FROM Alertas WHERE `fk_correo_receptor` = '" . $_SESSION['correo'] . "' AND estado = 0";


            $conector = new ConectorBD();

            $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);



            if (count($resultado)) {
                echo 1;
            } else {
                echo -1;
            }
        }
    }
}

/**
 * Funcion que devuelve el numero de notificaciones que tiene el usuario sin leer, divididas en dos tipos, alertas y solicitudes.
 * @return -1 ;
 */
function obtenerNumeroNotficaciones()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'obtenerNumeroNotficaciones') {
        if (gestionarSesionyRol(0) == 1) {
            //obtenemos el numero de alertas
            $consulta1 = "SELECT COUNT(`pk_idAlerta`) as Alertas FROM Alertas WHERE`estado` = 0 AND `tipo` = 'Alerta' AND `fk_correo_receptor` = '" . $_SESSION['correo'] . "';";
            $consulta2 = "SELECT COUNT(`pk_idAlerta`) as Solicitudes FROM Alertas WHERE`estado` = 0 AND `tipo` = 'Solicitud' AND `fk_correo_receptor` = '" . $_SESSION['correo'] . "';";
            $controlador = new ConectorBD();

            $resultado1 = $controlador->consultarBD($consulta1)->fetchAll(PDO::FETCH_ASSOC);
            $resultado2 = $controlador->consultarBD($consulta2)->fetchAll(PDO::FETCH_ASSOC);

            $resultado = [
                'alertas' => $resultado1[0]['Alertas'],
                'solicitudes' => $resultado2[0]['Solicitudes']
            ];

            echo json_encode($resultado);
        }
    }
}

/**
 * Funcion que devolvera las solicitudes del usuario que tenga sin leer.
 * @return json // Envio de la notificacion
 * @return 0; el usuario no tiene solicitudes sin leer;
 */
function obtenerSolicitudesSinLeer()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'solicitudesSinLeer') {
        if (gestionarSesionyRol(0) == 1) {

            //creamos la consulta que nos devolvera si el usuario tiene alguna solicitud sin leer.

            $consulta = "SELECT * FROM Alertas WHERE fk_correo_receptor ='" . $_SESSION['correo'] . "' AND estado  = 0 AND tipo = 'Solicitud'";


            $conector = new ConectorBD();

            $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

            if (count($resultado) > 0) {
                echo json_encode($resultado);
            } else {
                echo 0;
            }
        }
    }
}


/**
 * Funcion encargada de cambiar el estado de las anotaciones entre leidas y no leidas.
 * @return 1; todo ok.
 * @return -1; fallo;
 */
function cambiarEstadoNotificaciones()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'cambiarEstadoNotificaciones') {
        if (gestionarSesionyRol(0) == 1) {
            if ($_POST['leido'] == 0) {
                // cambiar de leido a no leido
                $consulta = "UPDATE `Alertas` SET`estado` = 0 WHERE `pk_idAlerta`  =" . $_POST['id'];
            } else if ($_POST['leido'] == 1) {
                // cambiar de no leido a leido
                $consulta = "UPDATE `Alertas` SET`estado` = 1 WHERE `pk_idAlerta`  =" . $_POST['id'];
            }

            $conector = new ConectorBD();

            if ($conector->actualizarBD($consulta)) {
                echo 1;
            } else {
                echo -1;
            }
        }
    }
}

/**
 * Funcion encargada de devolver las solicitudes leidas del usuario.
 */
function obtenerSolicitudesLeidas()
{


    if (isset($_POST['accion']) && $_POST['accion'] === 'solicitudesLeidas') {
        if (gestionarSesionyRol(0) == 1) {


            //creamos la consulta que nos devolvera si el usuario tiene alguna solicitud sin leer.

            $consulta = "SELECT * FROM Alertas WHERE fk_correo_receptor ='" . $_SESSION['correo'] . "' AND estado  = 1 AND tipo = 'Solicitud'";


            $conector = new ConectorBD();

            $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

            if (count($resultado) > 0) {
                echo json_encode($resultado);
            } else {
                echo 0;
            }
        }
    }
}

/**
 * Funcion que devolvera las solicitudes del usuario que tenga sin leer.
 * @return json // Envio de la notificacion
 * @return 0; el usuario no tiene solicitudes sin leer;
 */

function obtenerAlertasSinLeer()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'alertasSinLeer') {
        if (gestionarSesionyRol(0) == 1) {

            //creamos la consulta que nos devolvera si el usuario tiene alguna solicitud sin leer.

            $consulta = "SELECT * FROM Alertas WHERE fk_correo_receptor ='" . $_SESSION['correo'] . "' AND estado  = 0 AND tipo = 'Alerta'";


            $conector = new ConectorBD();

            $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

            if (count($resultado) > 0) {
                echo json_encode($resultado);
            } else {
                echo 0;
            }
        }
    }
}


/**
 * Funcion que devolvera las solicitudes del usuario que tenga sin leer.
 * @return json // Envio de la notificacion
 * @return 0; el usuario no tiene solicitudes sin leer;
 */

function obtenerAlertasLeidas()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'alertasLeidas') {
        if (gestionarSesionyRol(0) == 1) {

            //creamos la consulta que nos devolvera si el usuario tiene alguna solicitud sin leer.

            $consulta = "SELECT * FROM Alertas WHERE fk_correo_receptor ='" . $_SESSION['correo'] . "' AND estado  = 1 AND tipo = 'Alerta'";


            $conector = new ConectorBD();

            $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

            if (count($resultado) > 0) {
                echo json_encode($resultado);
            } else {
                echo 0;
            }
        }
    }
}


function crearAlertaUsuarioAniadidoTarea($idTarea, $usuario)
{
    $mensaje = "Su usuario acaba de ser añadido a la tarea: $idTarea";
    if (gestionarSesionyRol(50) == 1) {
        $consulta = "INSERT INTO `Alertas`( `fk_correo_emisor`, `fk_correo_receptor`, `mensaje`, `estado`, `fecha`, `tipo`)
        VALUES ('" . $_SESSION['correo'] . "','$usuario','" . $mensaje . "',0,SYSDATE(),'Alerta')";

        $conector = new ConectorBD();

        $conector->actualizarBD($consulta);
    }
}

function crearAlertaUsuarioBorradoTarea($idTarea, $usuario)
{
    $mensaje = "Su usuario acaba de ser borrado de la tarea: $idTarea";
    if (gestionarSesionyRol(50) == 1) {
        $consulta = "INSERT INTO `Alertas`( `fk_correo_emisor`, `fk_correo_receptor`, `mensaje`, `estado`, `fecha`, `tipo`)
        VALUES ('" . $_SESSION['correo'] . "','$usuario','" . $mensaje . "',0,SYSDATE(),'Alerta')";

        $conector = new ConectorBD();

        $conector->actualizarBD($consulta);
    }
}

function crearSolicitudFinalizacionParaUsuarios($idTarea, $usuario)
{
    $mensaje = "Los usuarios de la tarea: $idTarea han solicitado que se proceda a finalizarla. para que esto pueda realizarse, debe notificar su finalización";
    if (gestionarSesionyRol(0) == 1) {
        $consulta = "INSERT INTO `Alertas`( `fk_correo_emisor`, `fk_correo_receptor`, `mensaje`, `estado`, `fecha`, `tipo`)
        VALUES ('" . $_SESSION['correo'] . "','$usuario','" . $mensaje . "',0,SYSDATE(),'Alerta')";

        $conector = new ConectorBD();

        $conector->actualizarBD($consulta);
    }
}

function crearAlertaFinalizacionTarea($idTarea)
{
    $mensaje = "Los usuarios de la tarea: $idTarea han solicitado que se proceda a finalizarla.";
    if (gestionarSesionyRol(0) == 1) {
        //obtenemos el administrador de la tarea
        $conector = new ConectorBD();
        $consulta = "SELECT `fk_correo` FROM `Usuarios:Tareas` WHERE `fk_idTarea`  = $idTarea";

        $resultado  = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);


        $consulta = "INSERT INTO `Alertas`( `fk_correo_emisor`, `fk_correo_receptor`, `mensaje`, `estado`, `fecha`, `tipo`)
        VALUES ('" . $resultado[0]['fk_correo'] . "','" . $resultado[0]['fk_correo'] . "','" . $mensaje . "',0,SYSDATE(),'Solicitud')";


        $conector->actualizarBD($consulta);
    }
}

/**
 * Funcion encargada de notificar a todos los integrantes de una tarea de que esta fue finalizada.
 */
function alertaFinalizacion($id)
{
    $mensaje = "La tarea: $id a finalizado.";
    $conector = new ConectorBD();

    //notificamos al administrador de la tarea
    $consulta = "SELECT `fk_correo` FROM `Usuarios:Tareas` WHERE `fk_idTarea` = $id";

    $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

    $administrador = $resultado[0]['fk_correo'];


    $consulta = "INSERT INTO `Alertas`( `fk_correo_emisor`, `fk_correo_receptor`, `mensaje`, `estado`, `fecha`, `tipo`)
    VALUES ('" . $administrador . "','" . $administrador . "','" . $mensaje . "',0,SYSDATE(),'Alerta')";

    enviarCorreoTareaFinalizada($administrador, $id);


    $conector->actualizarBD($consulta);

    $consulta = "SELECT `fk_correo` FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE `fk_idTarea` =  $id";
    $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

    for ($i = 0; $i < count($resultado); $i++) {
        $consulta = "INSERT INTO `Alertas`( `fk_correo_emisor`, `fk_correo_receptor`, `mensaje`, `estado`, `fecha`, `tipo`)
    VALUES ('" . $administrador . "','" . $resultado[$i]['fk_correo'] . "','" . $mensaje . "',0,SYSDATE(),'Alerta')";
        $conector->actualizarBD($consulta);

        enviarCorreoTareaFinalizada($resultado[$i]['fk_correo'], $id);
    }
}
