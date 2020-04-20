<?php

crearProyecto();

listarProyectos();

devolverProyectoporID();

actualizarProyecto();

devolverAdministradoresProyecto();

actualizarAdministradoresProyecto();

finalizarProyecto();

devolverTodosProyectosID();

obtenerTareasYEstadoPorProyecto();

obtenerProyectosPorUsuario();
/**
 * Funcion encargada  de crear proyectos, necesita un nivel de permisos 50 o superior
 * 
 * @return 1; todo ok;
 * @return -1; El usuario que intenta crear el usuario no tiene permisos.
 * @return -2; El usuario no existe en la base de datos.
 * @return -3; Faltan datos.
 * @return -4; Fallo en la consulta de insercion del proyecto;
 */
function crearProyecto()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'crearProyecto') {
        if (gestionarSesionyRol(50) == 1) {
            if (comprobarUsuario($_SESSION['correo'])) {
                if (isset($_POST['nombre']) && isset($_POST['descripcion']) && isset($_POST['horas']) && isset($_POST['minutos']) && isset($_POST['administradores'])) {
                    $token = true;
                    $nombre = filtrado($_POST['nombre']);
                    $descripcion = filtrado($_POST['descripcion']);
                    $descripcion = htmlspecialchars($descripcion);
                    $descripcion = addslashes($descripcion);

                    $horas = (int) filtrado($_POST['horas']);
                    $minutos  = (int) filtrado($_POST['minutos']);


                    if ($horas <= 9) {
                        $horas = 0 . $horas;
                    }
                    if ($minutos <= 9) {
                        $minutos  = "0" . filtrado($_POST['minutos']);
                    }
                    $estimacion = $horas . ":" . $minutos;
                    $administradores = $_POST['administradores'];

                    //insertamos el proyecto en la base de datos
                    $consulta =  "INSERT INTO `Proyectos`(`nombre`, `descripcion`, `estado`, `estimacion`) VALUES ('" . $nombre . "','" . $descripcion . "','Creado','" . $estimacion . "')";

                    $conector = new ConectorBD();
                    if ($conector->actualizarBD($consulta)) {

                        //obtenemos la id del proyecto
                        $consulta = null;
                        $consulta =  "Select pk_idProyecto FROM Proyectos WHERE nombre <=>'" . $nombre . "' and descripcion <=> '" . $descripcion . "' and estimacion <=>'" . $estimacion . "' ";

                        $filas = $conector->consultarBD($consulta);

                        while ($fila = $filas->fetch()) {
                            $idProyecto = $fila[0];
                        }
                        //echo $token;
                        // añadimos los datos relacionados  entre los usuarios administradores y los proyectos.
                        for ($i = 0; $i < count($administradores); $i++) {
                            $consulta = null;
                            $consulta = "INSERT INTO `Usuarios:Proyectos`(`fk_correo`, `fk_idProyecto`) VALUES('" . $administradores[$i] . "','" . $idProyecto . "')";

                            if ($conector->actualizarBD($consulta)) {
                            } else {
                                $token = false;
                            };
                        }
                        if ($token) {
                            echo 1;
                        }
                    } else {
                        echo -4;
                    }
                } else {
                    echo -3;
                }
            } else {
                echo -2;
            }
        } else {
            echo -1;
        }
    }
}

/**
 *Funcion encargada de devolver los proyectos, si la solicitud se envia desde una cuenta de administrador, se podran 
 *visualizar todos los proyectos en el sistema, pero si se envia desde la cuenta de un moderador, solo los del propietario
 * @return -1; //Error en la sesion y/o permisos.
 */

function listarProyectos()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'listarProyectosPropietario') {
        if (gestionarSesionyRol(90) == 1) { //solicitud administrador
            if ($_POST['estado'] == "true") {

                $consulta  = "SELECT `pk_idProyecto`,`nombre`,`descripcion`,`fechaInicio`,`fechaFinalizacion`,`estado`,`estimacion`" .
                    "FROM `Proyectos` WHERE estado<>'Finalizado'";
            } else {
                $consulta  = "SELECT `pk_idProyecto`,`nombre`,`descripcion`,`fechaInicio`,`fechaFinalizacion`,`estado`,`estimacion`" .
                    "FROM `Proyectos` ";
            }


            $controlador =  new ConectorBD();

            $filas = $controlador->consultarBD($consulta);


            echo json_encode($filas->fetchAll(PDO::FETCH_ASSOC));
        } else if (gestionarSesionyRol(50) == 1) { //solicitud moderador
            if ($_POST['estado'] == "true") {
                $consulta  = "SELECT `pk_idProyecto`,`nombre`,`descripcion`,`fechaInicio`,`fechaFinalizacion`,`estado`,`estimacion`" .
                    "FROM `Proyectos` , `Usuarios:Proyectos` WHERE" .
                    "`fk_idProyecto` <=> `pk_idProyecto` AND `fk_correo` <=> '" . $_SESSION["correo"] . "' AND estado <> 'Finalizado'";
            } else {
                $consulta  = "SELECT `pk_idProyecto`,`nombre`,`descripcion`,`fechaInicio`,`fechaFinalizacion`,`estado`,`estimacion`" .
                    "FROM `Proyectos` , `Usuarios:Proyectos` WHERE" .
                    "`fk_idProyecto` <=> `pk_idProyecto` AND `fk_correo` <=> '" . $_SESSION["correo"] . "'";
            }


            $controlador =  new ConectorBD();

            $filas = $controlador->consultarBD($consulta);

            //echo $consulta;
            echo json_encode($filas->fetchAll(PDO::FETCH_ASSOC));
        } else {
            echo -1;
        }
    }
}

/**
 * Funcion encargada de devolver un proyecto reciviendo como parametros el id.
 * @return -1; // El usuario tiene la sesion caducada o no tiene permisos para realizar esa acción.
 * @return -2; // El servicio no esta reciviendo parametros correctos.
 */
function devolverProyectoporID()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'listarProyectoPorid') {
        if (gestionarSesionyRol(50) == 1) {
            if (isset($_POST['idProyecto'])) {
                $consulta =  "SELECT * FROM Proyectos WHERE pk_idProyecto <=> '" . filtrado($_POST['idProyecto']) . "'";
                $controlador = new ConectorBD();

                $filas  = $controlador->consultarBD($consulta);

                echo json_encode($filas->fetchAll(PDO::FETCH_ASSOC));
                // var_dump($_POST);

            } else {
                echo -2;
            }
        } else {
            echo -1;
        }
    }
}

/**
 * Funcion encargada de actualizar el proyecto en la base de datos
 * @return 1;// todo ok;
 * @return -1; // El usuario tiene la sesion caducada o no tiene permisos para realizar esa acción.
 * @return -2;//  No se encuentra el id del proyecto. 
 * @return -3;// Error en la consulta. 
 */
function actualizarProyecto()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'actualizarProyecto') {
        if (gestionarSesionyRol(50) == 1) {
            //  var_dump($_POST);

            if (isset($_POST['idProyecto'])) {


                $horas = (int) filtrado($_POST['horas']);
                $minutos  = (int) filtrado($_POST['minutos']);


                if ($horas <= 9) {
                    $horas = 0 . $horas;
                }
                if ($minutos <= 9) {
                    $minutos  = "0" . filtrado($_POST['minutos']);
                }
                $estimacion = $horas . ":" . $minutos;

                $idProyecto =  (int) $_POST['idProyecto'];

                $consulta = "UPDATE `Proyectos` SET `nombre`='" . filtrado($_POST['nonbreProyecto']) . "',`descripcion`='" . filtrado($_POST['descripcionProyecto']) . "',`estado`='" . filtrado($_POST['estado']) . "',`estimacion`='" . $estimacion
                    . "' WHERE `pk_idProyecto` <=> '" .  $idProyecto . "'";

                //echo $consulta;

                $controlador = new ConectorBD();


                if ($controlador->actualizarBD($consulta)) {
                    echo 1;
                } else {
                    echo -3;
                }
            } else {
                echo -2;
            }
        } else {
            echo -1;
        }
    }
}

/**
 * Funcion encargada de devolver los correos de los administradores de un proyecto en concreto.
 * @param idProyecto;
 * @param accion;
 * 
 * @return -1; // Usuario no tiene permisos para realizar esta acción
 * @return -2; // el id no esta definido.
 */

function devolverAdministradoresProyecto()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'devolverAdministradores') {
        if (gestionarSesionyRol(50) == 1) {
            if (isset($_POST['idProyecto'])) {
                $consulta =  "SELECT fk_correo FROM `Usuarios:Proyectos` WHERE `fk_idProyecto` <=> '" . filtrado($_POST['idProyecto']) . "'";
                $controlador = new ConectorBD();

                $filas  = $controlador->consultarBD($consulta);

                echo json_encode($filas->fetchAll(PDO::FETCH_ASSOC));
            } else {
                echo -2;
            }
        } else {
            echo -1;
        }
    }
}


/**
 * Funcion encargada de actualizar los datos de los administradores de los proyectos.
 * @param idProyecto;
 * @param accion;
 * @param correos{array};
 * 
 * @return 1; // todo ok.
 * @return -1; //sin permisos para realizar esta accion.
 * @return -2; // faltan datos.
 * @return -3; // No se han proporcionado correos.
 * @return -4; // Error en la consulta de insercion de nuevos administradores.
 * @return -5; // Error en la consulta de borrado de administradores.
 */
function actualizarAdministradoresProyecto()
{
    $administradoresAntiguos = [];
    $resultado = true; // variable que controla el estado del servicio, si no ocurre nada dara un true.

    if (isset($_POST['accion']) && $_POST['accion'] === 'actualizarAdministradoresProyecto') {
        if (gestionarSesionyRol(50) == 1) {
            if (isset($_POST['id']) && isset($_POST['correos'])) {
                if (count($_POST['correos']) != 0) {
                    //consultamos los administradores actuales del proyecto.accordion
                    $consulta =  "SELECT fk_correo FROM `Usuarios:Proyectos` WHERE fk_idProyecto = " . filtrado($_POST["id"]);
                    $conector = new ConectorBD();
                    $filas  = $conector->consultarBD($consulta);

                    while ($fila  = $filas->fetch()) {

                        array_push($administradoresAntiguos, $fila[0]);
                    }

                    // var_dump($administradoresAntiguos);
                    //adición de nuevos administradores.
                    for ($i = 0; $i < count($_POST['correos']); $i++) {
                        if (!in_array($_POST['correos'][$i], $administradoresAntiguos)) {
                            $consulta  = " INSERT INTO `Usuarios:Proyectos` (`fk_correo`, `fk_idProyecto`) VALUES ('" . filtraCorreo($_POST['correos'][$i]) . "','" . $_POST['id'] . "')";

                            if (!$conector->actualizarBD($consulta)) {
                                echo -4; // error en la insercion de los nuevos administradores
                                $resultado = false;
                            } else {
                                enviarNotificacionAdicionAdministradorProyecto(filtraCorreo($_POST['correos'][$i]), $_POST['id']);
                            }
                        }
                    }
                    //borrado de los administradores.
                    for ($i = 0; $i < count($administradoresAntiguos); $i++) {
                        if (!in_array($administradoresAntiguos[$i], $_POST['correos'])) {
                            $consulta =  "DELETE FROM `Usuarios:Proyectos` WHERE fk_correo = '" . $administradoresAntiguos[$i] . "'  AND fk_idProyecto =  '" . $_POST['id'] . "'";

                            // echo $consulta;

                            if (!$conector->actualizarBD($consulta)) {
                                echo -5; // Error en el borrado de los antiguos administradores.

                                $resultado  = false;
                            } else {
                                enviarNotificacionBorradoAdministradorProyecto($administradoresAntiguos[$i], $_POST['id']);
                            }
                        }
                    }

                    if ($resultado) {
                        echo 1; //todo ok;
                    }
                } else {
                    echo -3; // no se han proporcionado correos.
                }
            } else {
                echo -2; //faltan datos.
            }
        } else {
            echo -1; // No tiene permisos;
        }
    }
}


/**
 * Funcion encargada de finalizar los proyectos, comprobando que todas las tareas estan finalizadas o sin comprobar, dependiendo si el
 * administrador ha decidido  ignorar estas restricciones;
 * 
 * @return 3; // Proyecto finalizado obviando restricciones
 * @return 2;// Proyecto finalizado. No tenia tareas
 * @return 1;//tarea finalizada cumpliendo las restricciones.
 * @return -1; //faltan permisos.
 * @return -2; //faltan datos.
 * @return -3; //Quedan Tareas por finalizar.
 * @return -4; // Fallo en la consulta de modificacion del proyecto con restricciones.
 * @return -5; //Fallo en la consulta de modificacion  de proyecto sin tareas.
 * @return -6; // Fallo ne la consulta de modicacion de proyectos sin restricciones.
 */
function finalizarProyecto()
{
    $id = 0;
    $restricciones  = false;
    $resultado  = null;
    $todoFinalizado =  true;

    if (isset($_POST['accion']) && $_POST['accion'] === 'finalizarProyecto') {
        if (gestionarSesionyRol(50) == 1) {

            if (isset($_POST['id']) && isset($_POST['restricciones'])) {
                $id = filtrado($_POST['id']);
                $restricciones  = filtrado($_POST['restricciones']);
                $conector = new ConectorBD();

                if ($restricciones == 'false') {
                    // si restricciones esta a false,  respetaremos las restricciones de finalizacion de proyecto
                    //obtenemos las tareas que tiene el proyecto y obtenemos sus estados.
                    $consulta = "SELECT estado FROM Tareas WHERE fk_idProyecto  = '" . $id . "'";

                    $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                    if (count($resultado) > 0) {
                        for ($i = 0; $i < count($resultado); $i++) {
                            if ($resultado[$i]['estado'] != 'Finalizado') {
                                $todoFinalizado = false;
                            }
                        }
                        if ($todoFinalizado) {
                            //creamos el uptadate para finalizar le proyecto.
                            $consulta = "UPDATE
                            `Proyectos`
                        SET
                            `fechaFinalizacion` = SYSDATE(),
                            `estado` = 'Finalizado'
                        WHERE
                            pk_idProyecto= $id ";
                            if ($conector->actualizarBD($consulta)) {
                                echo 1; // Proyecto finalizado cumpliendo las restricciones
                            } else {
                                echo -4;
                            }
                        } else {
                            echo -3; // Quedan tareas por finalizar.
                        }
                    } else {
                        //el proyecto no tiene tareas asignadas.
                        $consulta = "UPDATE
                        `Proyectos`
                    SET
                        `fechaFinalizacion` = SYSDATE(),
                        `estado` = 'Finalizado'
                    WHERE
                        pk_idProyecto= $id ";
                        if ($conector->actualizarBD($consulta)) {
                            echo 2; // Proyecto finalizado. No tenia tareas.
                        } else {
                            echo -5;
                        }
                    }
                } else if ($restricciones == 'true') {
                    $consulta = "UPDATE
                    `Proyectos`
                SET
                    `fechaFinalizacion` = SYSDATE(),
                    `estado` = 'Finalizado'
                WHERE
                    pk_idProyecto= $id ";

                    if ($conector->actualizarBD($consulta)) {
                        echo 3; //proyecto finalizado, Obviando restricciones
                    } else {
                        echo -6;
                    }
                }
            } else {
                echo -2; //faltan datos
            }
        } else {
            echo -1; // permisos requeridos.
        }
    }
}
/**
 * Funcion encargada de devolver un JSON con los nombres de los proyectos  y su id, para
 * la asignación de tareas.
 * 
 * @return JSON;
 * @return -1; // el usuario no tiene permisos para listar los proyectos
 */
function devolverTodosProyectosID()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'listarProyectosEID') {
        if (gestionarSesionyRol(90) == 1) {
            $consulta = "SELECT pk_idProyecto, nombre FROM Proyectos";
            $controlador =  new ConectorBD();
            $resultado  = [];
            $filas = $controlador->consultarBD($consulta);
            while ($fila = $filas->fetch(PDO::FETCH_ASSOC)) {
                array_push($resultado, $fila);
            }

            echo json_encode($resultado);
        } else {
            echo -1;
        }
    }
}


function obtenerTareasYEstadoPorProyecto()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'obtenerTareasYestado') {
        if (gestionarSesionyRol(50) == 1) {

            $consulta = "SELECT estado FROM Tareas where fk_idProyecto = '" . filtrado($_POST['id']) . "'";

            $conector = new ConectorBD();

            echo json_encode($conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC));
        }
    }
}

/**
 * Funcion encargada de devolver el nombre y la id de los proyectos que tiene asignados un usuario.
 * @return -1;//El usuario que acaba de solicitar la accion no tiene permisos de administración
 * @return -2;//Faltan datos
 */
function obtenerProyectosPorUsuario()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'obtenerProyectoDeUsuario') {
        if (gestionarSesionyRol(90) == 1) {
            $respuesta = []; // variable que usaremos para devolver el listado de proyectos del usuario
            if (isset($_POST['correo'])) {
                $correo = filtraCorreo($_POST['correo']);
                $conector = new ConectorBD();

                $consulta = "SELECT fk_idProyecto as id FROM `Usuarios:Proyectos` WHERE fk_correo = '$correo'";

                $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                for ($i = 0; $i < count($resultado); $i++) {
                    $resultado2 = "";
                    $consulta = "SELECT pk_idProyecto as id,  nombre FROM Proyectos WHERE pk_idProyecto  ='" . $resultado[$i]['id'] . "'";
                    $resultado2 = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                    array_push($respuesta, $resultado2[0]);
                }

                echo json_encode($respuesta);
            } else {
                echo -2;
            }
        } else {
            echo -1;
        }
    }
}
