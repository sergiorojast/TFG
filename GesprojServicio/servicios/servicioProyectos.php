<?php

crearProyecto();
listarProyectos();
devolverProyectoporID();
actualizarProyecto();
devolverAdministradoresProyecto();

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
            $consulta  = "SELECT `pk_idProyecto`,`nombre`,`descripcion`,`fechaInicio`,`fechaFinalizacion`,`estado`,`estimacion`" .
                "FROM `Proyectos` ";

            $controlador =  new ConectorBD();

            $filas = $controlador->consultarBD($consulta);

            //echo $consulta;
            echo json_encode($filas->fetchAll(PDO::FETCH_ASSOC));
        } else if (gestionarSesionyRol(50) == 1) { //solicitud moderador
            $consulta  = "SELECT `pk_idProyecto`,`nombre`,`descripcion`,`fechaInicio`,`fechaFinalizacion`,`estado`,`estimacion`" .
                "FROM `Proyectos` , `Usuarios:Proyectos` WHERE" .
                "`fk_idProyecto` <=> `pk_idProyecto` AND `fk_correo` <=> '" . $_SESSION["correo"] . "'";

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
 * @return -1; // Usuario que no tiene permisos para realizar esta acción
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
