<?php

crearProyecto();

/**
 * Funcion encargada  de crear proyectos, necesita un nivel de permisos 90
 * 
 * @return -1; El usuario que intenta crear el usuario no tiene permisos.
 * @return -2; El usuario no existe en la base de datos.
 * @return -3; Faltan datos.
 */
function crearProyecto()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'crearProyecto') {
        if (gestionarSesionyRol(90) === 1) {
            if (comprobarUsuario($_SESSION['correo'])) {
                if (isset($_POST['nombre']) && isset($_POST['descripcion']) && isset($_POST['horas']) && isset($_POST['minutos']) && isset($_POST['administradores'])) {
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
