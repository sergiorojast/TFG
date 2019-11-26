<?php

crearProyecto();

/**
 * Funcion encargada  de crear proyectos, necesita un nivel de permisos 90
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
        if (gestionarSesionyRol(90) === 1) {
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
                    $consulta =  "INSERT INTO `proyectos`(`nombre`, `descripcion`, `estado`, `estimacion`) VALUES ('" . $nombre . "','" . $descripcion . "','Creado','" . $estimacion . "')";

                    $conector = new ConectorBD();
                    if ($conector->actualizarBD($consulta)) {

                        //obtenemos la id del proyecto
                        $consulta = null;
                        $consulta =  "Select pk_idProyecto FROM proyectos WHERE nombre <=>'" . $nombre . "' and descripcion <=> '" . $descripcion . "' and estimacion <=>'" . $estimacion . "' ";

                        $filas = $conector->consultarBD($consulta);

                        while ($fila = $filas->fetch()) {
                            $idProyecto = $fila[0];
                        }
                        //echo $token;
                        // añadimos los datos relacionados  entre los usuarios administradores y los proyectos.
                        for ($i = 0; $i < count($administradores); $i++) {
                            $consulta = null;
                            $consulta = "INSERT INTO `usuarios:proyectos`(`fk_correo`, `fk_idProyecto`) VALUES('" . $administradores[$i] . "','" . $idProyecto . "')";

                            if ($conector->actualizarBD($consulta)) { } else {
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
