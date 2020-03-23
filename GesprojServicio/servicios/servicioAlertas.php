<?php


crearAlertaSolicitudNuevaTarea();


consultarAlertas();

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
