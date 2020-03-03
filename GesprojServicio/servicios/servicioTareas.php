<?php

listarProyectosYTareas();

solicitarDatosTareaProyectoPorIdProyecto();

insertarTarea();
insertarUsuariosQuePuedenAniadirNotificaciones();

/**
 * 
 * @return 2;// el usuario no tiene ninguna tarea asignada.
 * @return JSON;//proyectos en json
 */
function listarProyectosYTareas()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'solicitarProyectosYtareas') {
        if (controlarRolExacto(50)) {

            $respuesta =  []; // variable que se usara para almacenar los proyectos y enviarlos como json
            //echo $_SESSION['correo'];

            $consulta = 'SELECT
            pk_idProyecto ,
            nombre AS nombreProyecto
     
            
        FROM
            Proyectos,
            `Usuarios:Proyectos`
        WHERE
            fk_correo = \'' . $_SESSION['correo'] . '\' && fk_idProyecto = pk_idProyecto';

            //lanzamos la consulta.

            $controlador =  new ConectorBD();



            $resultados =  $controlador->consultarBD($consulta);



            while ($resultado = $resultados->fetch(PDO::FETCH_ASSOC)) {

                array_push($respuesta, $resultado);
            }


            echo json_encode($respuesta);
        } else if (controlarRolExacto(0)) {

            $respuesta =  []; // variable que se usara para almacenar los proyectos y enviarlos como json
            //echo $_SESSION['correo'];

            $consulta = 'SELECT
            pk_idProyecto ,
            nombre AS nombreProyecto
     
            
        FROM
            Proyectos,
            Tareas,
            `Usuarios:Tareas`
        WHERE
            fk_correo = \'' . $_SESSION['correo'] . '\' && pk_idTarea = fk_idTarea && fk_idProyecto = pk_idProyecto';

            //lanzamos la consulta.

            $controlador =  new ConectorBD();



            $resultados =  $controlador->consultarBD($consulta);
            if ($resultados->fetch()) {
                while ($resultado = $resultados->fetch(PDO::FETCH_ASSOC)) {

                    array_push($respuesta, $resultado);
                }

                echo json_encode($respuesta);
            } else {
                echo 2; // no tiene ninguna tarea este usuario
            }
        } else if (controlarRolExacto(90)) {

            $respuesta =  []; // variable que se usara para almacenar los proyectos y enviarlos como json
            //echo $_SESSION['correo'];

            $consulta = 'SELECT
            pk_idProyecto ,
            nombre AS nombreProyecto
     
            
        FROM
            Proyectos,
            Tareas,
            `Usuarios:Tareas`
        WHERE
            fk_correo = \'' . $_SESSION['correo'] . '\' && pk_idTarea = fk_idTarea && fk_idProyecto = pk_idProyecto';

            //lanzamos la consulta.

            $controlador =  new ConectorBD();



            $resultados =  $controlador->consultarBD($consulta);
            if ($resultados->fetch()) {
                while ($resultado = $resultados->fetch(PDO::FETCH_ASSOC)) {

                    array_push($respuesta, $resultado);
                }

                echo json_encode($respuesta);
            } else {
                echo 2; // no tiene ninguna tarea este usuario
            }
        }
    }
}

/**
 * Function encargada de devolver los datos de un proyecto y sus tareas recibiendo como parametro  la id del proyecto.
 * solo se podra listar los  del usuario.
 */
function solicitarDatosTareaProyectoPorIdProyecto()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'solicitarTareasYProyectoID') {
        if (gestionarSesionyRol(0) == 1) {
            $respuesta =  []; // variable que se usara para almacenar los proyectos y enviarlos como json
            $consulta = 'SELECT
            pk_idProyecto ,
            nombre AS nombreProyecto,
            Proyectos.descripcion AS descripcionProyecto,
            Proyectos.fechaInicio AS fechaInicioProyecto,
            Proyectos.fechaFinalizacion As fechaFinalizacionProyecto,
            Proyectos.estado AS estadoProyecto,
            Proyectos.estimacion AS estimacionProyecto,
            pk_idTarea,
            fk_idProyecto,
            nombreTarea,
            Tareas.descripcion AS descripcionTarea,
            Tareas.fechaInicio AS fechaInicioTare,
            Tareas.fechaFinalizacion AS fechaFinalizacionTarea,
            Tareas.estado AS estadoTarea,
            Tareas.estimacion AS estimacionTarea,
            fk_correo,
            fk_idTarea
            
            
        FROM
            Proyectos,
            Tareas,
            `Usuarios:Tareas`
        WHERE
            fk_correo = \'' . $_SESSION['correo'] . '\' && pk_idTarea = fk_idTarea && fk_idProyecto = pk_idProyecto && fk_idProyecto=' . filtrado($_POST['idProyecto']);

            //lanzamos la consulta.
            //echo $consulta;

            $controlador =  new ConectorBD();
            //pasamos la consulta  directamente a js

            $resultados =  $controlador->consultarBD($consulta);

            while ($resultado = $resultados->fetch(PDO::FETCH_ASSOC)) {

                array_push($respuesta, $resultado);
            }

            echo json_encode($respuesta);
        } else {
            echo -1; //permisos o sesion no activa.
        }
    }
}
/**
 * Funcion encargada de insertar en la base de datos la nueva tarea
 *
 * @return 2; // Tarea creada con exito, añadido administrador al proyecto
 * @return 1; // Tarea creada con exito.
 * @return -1;//permisos insuficientes
 * @return -2; //faltan datos para la insercion.
 * @return -3; //falllo en la insercion de datos en la administración de proyectos
 * @return -4; //Tiempo no especificado
 * @return -5; // proyecto finalizado
 * @return -6; //La tarea tiene demasiado tiempo asignado.
 * @return -7; //Fallo en la consulta de insercion de la tarea.
 * @return -8; //Fallo en la consulta
 */
function insertarTarea()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'insertarTarea') {
        if (gestionarSesionyRol(90) == 1) {
            if (isset($_POST['nombre']) && isset($_POST['descripcion'])) {
                $aniadidoAdmin = false; //variable que nos indica el  usuario se ha añadido como adminitrador del proyecto.
                $nombreTarea =  filtrado($_POST['nombre']);
                $descripcion = filtrado($_POST['descripcion']);
                $idProyecto = (int) filtrado($_POST['proyecto']);
                $horas = (int) filtrado($_POST['horas']);
                $minutos = (int) filtrado($_POST['minutos']);

                if ($minutos == 0 && $horas == 0) {
                    echo -4; // tiempo requerido
                } else {

                    $consulta = "SELECT fechaFinalizacion, estado,estimacion FROM Proyectos WHERE pk_idProyecto = $idProyecto";


                    $conector =  new ConectorBD();

                    $resultado = $conector->consultarBD($consulta)->fetch(PDO::FETCH_ASSOC);


                    if ($resultado['estado'] != 'Finalizado') {
                        //calculamos la horas que tiene el proyecto en total, contando las horas del proyecto
                        $horasDelProyecto = $resultado['estimacion'];
                        $horasTotalesTareas = 0;
                        $horasTareas = 0; //variable donde almaceno las horas de la tarea
                        $minutosTareas = 0; //variable donde almaceno los minutos de las tareas
                        // echo json_encode($resultado);
                        // echo $horasDelProyecto;

                        $consulta = "SELECT estimacion FROM Tareas WHERE fk_idProyecto = $idProyecto ";

                        $resultadoTareas = $conector->consultarBD($consulta);
                        while ($fila = $resultadoTareas->fetch(PDO::FETCH_NUM)) {

                            $aux = explode(':', $fila[0]); //variable donde almaceno momentaneamente las horas y minutos de la tarea.
                            $horasTareas += (int) $aux[0];

                            $minutosTareas += (int) $aux[1];
                        }
                        //ajustamos las horas y minutos de las tareas, calculando los minutos .
                        $horasTareas += floor($minutosTareas / 60);
                        $minutosTareas = floor($minutosTareas % 60);
                        $horasTotalesTareas = $horasTareas . ":" . $minutosTareas;

                        //comparamos las horas del proyecto con las horas de las tareas en minutos para saber si el tiempo esta dentro de lo exigido por el proyecto
                        $tiempoProyecto =  explode(':', $horasDelProyecto);
                        $minutosTotalesProyecto  = ($tiempoProyecto[0] * 60) + $tiempoProyecto[1];
                        $tiempoTareas  = explode(':', $horasTotalesTareas);
                        $minutosTotalesTareas  = ($tiempoTareas[0] * 60) + $tiempoTareas[1];


                        //añadimos el tiempo de la tarea actual para comprobar si nos pasamos
                        $minutosTotalesTareas += ((int) floor($horas / 60) + $minutos);

                        //comparamos si el tiempo de las tareas es mayor al del proyecto.
                        if ($minutosTotalesTareas >= $minutosTotalesProyecto) {
                            echo -6; //La tarea tiene demasiado tiempo asignado.
                        } else {
                            //comprobamos si el usuario  que va a crear la tarea es administrador del proyecto.
                            $consulta =  "SELECT * FROM `Usuarios:Proyectos` WHERE fk_idProyecto = " . $idProyecto . " && fk_correo = '" . $_SESSION['correo'] . "'";
                            $resultado = $conector->consultarBD($consulta)->fetch();
                            // si resultado tiene como contenido false, añadimos al usuario como administrador del proyecto sino, el usuario ya es administrador del mismo.
                            if (!$resultado) {
                                $consulta =  "INSERT INTO `Usuarios:Proyectos`(`fk_correo`, `fk_idProyecto`) VALUES ('" . $_SESSION['correo'] . "','" . $idProyecto . "') ";
                                //lanzamos la consulta para hacer al usuario un administrador del proyecto

                                if (!$conector->actualizarBD($consulta)) {
                                    echo -3; //fallo en la insercion de datos ADMIN
                                } else {
                                    $aniadidoAdmin = true;
                                }
                            }

                            //comenzamos a añadir la nueva tarea.
                            $consulta = "INSERT INTO Tareas (`fk_idProyecto`,`nombreTarea`,`descripcion`,`estado`,`estimacion`)" .
                                "VALUES('$idProyecto','$nombreTarea','$descripcion','Creado','$horas:$minutos')";
                            //lanzamos la consulta.

                            if ($conector->actualizarBD($consulta)) {
                                $consulta = "SELECT pk_idTarea FROM Tareas WHERE nombreTarea ='$nombreTarea'";


                                $resultado = $conector->consultarBD($consulta)->fetch(PDO::FETCH_ASSOC);


                                $consulta = "INSERT INTO `Usuarios:Tareas`(`fk_correo`, `fk_idTarea`)VALUES('" . $_SESSION['correo'] . "','" . $resultado['pk_idTarea'] . "')";
                                if ($conector->actualizarBD($consulta)) {
                                    if ($aniadidoAdmin) {
                                        echo 2; //admin añadido y tarea creada con exito
                                    } else {
                                        echo 1; //tarea creada con exito.
                                    }
                                } else {
                                    echo -8; //fallo en la consulta
                                }
                            } else {
                                echo -7;
                            }
                        }
                    } else {
                        echo -5; // proyecto finalizado, no se le pueden añadir más tareas.
                    }

                    // //comprobamos si el usuario que tiene la sesion activa y manda esta solicitud es administrador del 
                    // //proyecto.

                    // //lanzamos la consulta


                    // $resultado = $conector->consultarBD($consulta)->fetch();
                    // //si resultado tiene como contenido false, añadimos al usuario como administrador del proyecto sino, el usuario ya es administrador del mismo.

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
 * Funcion encargada de recivir un JSON con los usuarios que podran añadir anotaciones a la tarea.
 * 
 * @return 1; //todo ok;
 * @return -1; //fallo ne la insercion de los usuarios.
 */

function insertarUsuariosQuePuedenAniadirNotificaciones()
{


    if (isset($_POST['accion']) && $_POST['accion'] === 'aniadeUsuariosTareaParaNotificaciones') {
        if (gestionarSesionyRol(90) == 1) {
            $estado = true;

            $usuarios = json_decode($_POST['usuarios']);

            $conector = new ConectorBD();
            //obtenemos el id de la tarea a partir del nombre
            $consulta = "SELECT pk_idTarea FROM Tareas WHERE nombreTarea = '" . filtrado($_POST['nombreTarea']) . "'";

            $idTarea = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

            for ($i = 0; $i < count($usuarios); $i++) {
                $consulta = "INSERT INTO `Usuarios:Tareas:PermisosNotificaciones`(`fk_idTarea`, `fk_correo`) VALUES ('".$idTarea[0]['pk_idTarea']."','".$usuarios[$i]."')";
                
                if($conector->actualizarBD($consulta)){

                }else{
                    $estado = false;
                }
            }

            if($estado){
                echo 1;
            }else{
                echo -1;
            }
        }
    }
}
