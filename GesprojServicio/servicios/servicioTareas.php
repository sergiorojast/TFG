<?php

listarProyectosYTareas();

solicitarDatosTareaProyectoPorIdProyecto();

insertarTarea();

insertarUsuariosQuePuedenAniadirNotificaciones();

insertarTareaPorIdProyecto();

borrarTareaPorId();

tareaPorId();

actualizarTarea();

devolverTareasPorIdProyecto();

comprobarSiUsuarioFinalizoTarea();

cambiarEstadoFinalizadoTareaPorUsuarios();

finalizarTarea();

devolverListaTareasUsuario();

obtenerNumeroTareasTotales();

devolverPorcentajeTareasFinalizadas();

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
            fk_correo = \'' . $_SESSION['correo'] . '\' && fk_idProyecto = pk_idProyecto ';

            //lanzamos la consulta.

            $controlador =  new ConectorBD();



            $resultados =  $controlador->consultarBD($consulta);




            $resultados =  $controlador->consultarBD($consulta);
            $respuesta  = $resultados->fetchAll(PDO::FETCH_ASSOC);

            if (count($respuesta) > 0) {
                echo json_encode($respuesta);
            } else {
                echo 2;
            }
        } else if (controlarRolExacto(0)) {

            $respuesta =  []; // variable que se usara para almacenar los proyectos y enviarlos como json
            //echo $_SESSION['correo'];

            $consulta = 'SELECT
            pk_idProyecto ,
            nombre AS nombreProyecto
     
            
        FROM
            Proyectos,
            Tareas,
            `Usuarios:Tareas:PermisosNotificaciones`
        WHERE
            fk_correo = \'' . $_SESSION['correo'] . '\' && pk_idTarea = fk_idTarea && fk_idProyecto = pk_idProyecto';

            //lanzamos la consulta.

            $controlador =  new ConectorBD();




            $resultados =  $controlador->consultarBD($consulta);
            $respuesta  = $resultados->fetchAll(PDO::FETCH_ASSOC);

            if (count($respuesta) > 0) {
                echo json_encode($respuesta);
            } else {
                echo 2;
            }
        } else if (controlarRolExacto(90)) {

            $respuesta =  []; // variable que se usara para almacenar los proyectos y enviarlos como json
            //echo $_SESSION['correo'];

            $consulta = 'SELECT
            pk_idProyecto ,
            nombre AS nombreProyecto
     
            
        FROM
            Proyectos';

            //lanzamos la consulta.

            $controlador =  new ConectorBD();



            $resultados =  $controlador->consultarBD($consulta);
            $respuesta  = $resultados->fetchAll(PDO::FETCH_ASSOC);

            if (count($respuesta) > 0) {
                echo json_encode($respuesta);
            } else {
                echo 2;
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
        if (controlarRolExacto(0)) {

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
            fk_idTarea,
            `Usuarios:Tareas:PermisosNotificaciones`.fk_idTarea
            
            
        FROM
            Proyectos,
            Tareas,
            `Usuarios:Tareas:PermisosNotificaciones`
        WHERE
            fk_correo = \'' . $_SESSION['correo'] . '\' && pk_idTarea = fk_idTarea && fk_idProyecto = pk_idProyecto && fk_idProyecto=' . filtrado($_POST['idProyecto']);

            //lanzamos la consulta.
            //echo $consulta;

            $controlador =  new ConectorBD();
            //pasamos la consulta  directamente a js

            $resultados =  $controlador->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

            if (count($resultados) > 0) {
                echo json_encode($resultados);
            } else {
                $consulta = "SELECT
                pk_idProyecto ,
                nombre AS nombreProyecto,
                Proyectos.descripcion AS descripcionProyecto,
                Proyectos.fechaInicio AS fechaInicioProyecto,
                Proyectos.fechaFinalizacion As fechaFinalizacionProyecto,
                Proyectos.estado AS estadoProyecto,
                Proyectos.estimacion AS estimacionProyecto
                FROM
                Proyectos
                WHERE
                pk_idProyecto='" . filtrado($_POST['idProyecto']) . "'";
                $resultados =  $controlador->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($resultados);
            }
        } else if (controlarRolExacto(50) == 1) {
            $consulta = 'SELECT
            pk_idProyecto ,
            nombre AS nombreProyecto,
            Proyectos.descripcion AS descripcionProyecto,
            Proyectos.fechaInicio AS fechaInicioProyecto,
            Proyectos.fechaFinalizacion As fechaFinalizacionProyecto,
            Proyectos.estado AS estadoProyecto,
            Proyectos.estimacion AS estimacionProyecto,
            pk_idTarea,
            pk_idTarea,
            `Usuarios:Proyectos`.fk_idProyecto,
            Tareas.fk_idProyecto,
            nombreTarea,
            Tareas.descripcion AS descripcionTarea,
            Tareas.fechaInicio AS fechaInicioTare,
            Tareas.fechaFinalizacion AS fechaFinalizacionTarea,
            Tareas.estado AS estadoTarea,
            Tareas.estimacion AS estimacionTarea,
            fk_correo
            
            
        FROM
            Proyectos,
            Tareas,
            `Usuarios:Proyectos`
        WHERE
            fk_correo = \'' . $_SESSION['correo'] . '\' &&   `Usuarios:Proyectos`.fk_idProyecto = pk_idProyecto &&  `Usuarios:Proyectos`.fk_idProyecto = ' . filtrado($_POST['idProyecto']) . ' && `Usuarios:Proyectos`.fk_idProyecto = Tareas.fk_idProyecto';

            //lanzamos la consulta.
            // echo $consulta;

            $controlador =  new ConectorBD();
            //pasamos la consulta  directamente a js

            $resultados =  $controlador->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

            if (count($resultados) > 0) {
                echo json_encode($resultados);
            } else {
                $consulta = "SELECT
                pk_idProyecto ,
                nombre AS nombreProyecto,
                Proyectos.descripcion AS descripcionProyecto,
                Proyectos.fechaInicio AS fechaInicioProyecto,
                Proyectos.fechaFinalizacion As fechaFinalizacionProyecto,
                Proyectos.estado AS estadoProyecto,
                Proyectos.estimacion AS estimacionProyecto
                FROM
                Proyectos
                WHERE
                pk_idProyecto='" . filtrado($_POST['idProyecto']) . "'";
                $resultados =  $controlador->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($resultados);
            }
        } else if (controlarRolExacto(90) == 1) {

            // echo "ADMIN---------------------------";
            $consulta = "SELECT
            pk_idProyecto ,
            nombre AS nombreProyecto,
            Proyectos.descripcion AS descripcionProyecto,
            Proyectos.fechaInicio AS fechaInicioProyecto,
            Proyectos.fechaFinalizacion As fechaFinalizacionProyecto,
            Proyectos.estado AS estadoProyecto,
            Proyectos.estimacion AS estimacionProyecto,
            pk_idTarea,
            pk_idTarea,
         
            Tareas.fk_idProyecto,
            nombreTarea,
            Tareas.descripcion AS descripcionTarea,
            Tareas.fechaInicio AS fechaInicioTare,
            Tareas.fechaFinalizacion AS fechaFinalizacionTarea,
            Tareas.estado AS estadoTarea,
            Tareas.estimacion AS estimacionTarea
           
            
            
        FROM
            Proyectos,
            Tareas
           
        WHERE
        pk_idProyecto='" . filtrado($_POST['idProyecto']) . "' AND   fk_idProyecto = pk_idProyecto";

            //lanzamos la consulta.
            // echo $consulta;
            // echo "----------------------------------------------------";


            $controlador =  new ConectorBD();
            //pasamos la consulta  directamente a js

            $resultados =  $controlador->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

            if (count($resultados) > 0) {
                echo json_encode($resultados);
            } else {
                $consulta = "SELECT
                pk_idProyecto ,
                nombre AS nombreProyecto,
                Proyectos.descripcion AS descripcionProyecto,
                Proyectos.fechaInicio AS fechaInicioProyecto,
                Proyectos.fechaFinalizacion As fechaFinalizacionProyecto,
                Proyectos.estado AS estadoProyecto,
                Proyectos.estimacion AS estimacionProyecto
                FROM
                Proyectos
                WHERE
                pk_idProyecto='" . filtrado($_POST['idProyecto']) . "'";
                $resultados =  $controlador->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($resultados);
            }
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
                $estadoProyecto = ""; //variable en la que almaceno el estado del proyecto para cambiarlo despues o no.

                if ($minutos == 0 && $horas == 0) {
                    echo -4; // tiempo requerido
                } else {

                    $consulta = "SELECT fechaFinalizacion, estado,estimacion FROM Proyectos WHERE pk_idProyecto = $idProyecto";


                    $conector =  new ConectorBD();

                    $resultado = $conector->consultarBD($consulta)->fetch(PDO::FETCH_ASSOC);

                    $estadoProyecto = $resultado['estado'];

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



                        //comparamos si el tiempo de las tareas es mayor al del proyecto.
                        if ($minutosTotalesTareas >= $minutosTotalesProyecto) {
                            echo -6; //La tarea tiene demasiado tiempo asignado.
                        } else {

                            //añadimos el tiempo de la tarea actual para comprobar si nos pasamos
                            $minutosTotalesTareas += ((int) floor($horas * 60) + $minutos);
                            if ($minutosTotalesTareas >= $minutosTotalesProyecto) {
                                echo -9; // la tarea sobrepasa el tiempo estimado del proyecto.
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
                                        //cambiamos el estado del proyecto de creado a En curso

                                        if ($estadoProyecto == 'Creado') {
                                            $consulta = "UPDATE `Proyectos` SET `estado`='En curso'WHERE  `pk_idProyecto` = $idProyecto";
                                            $conector->actualizarBD($consulta);
                                        }

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
                        }
                    } else {
                        echo -5; // proyecto finalizado, no se le pueden añadir más tareas.
                    }
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
                $consulta = "INSERT INTO `Usuarios:Tareas:PermisosNotificaciones`(`fk_idTarea`, `fk_correo`) VALUES ('" . $idTarea[0]['pk_idTarea'] . "','" . $usuarios[$i] . "')";

                if ($conector->actualizarBD($consulta)) {
                } else {
                    $estado = false;
                }
            }

            if ($estado) {
                echo 1;

                for ($i = 0; $i < count($usuarios); $i++) {
                    crearAlertaUsuarioAniadidoTarea($idTarea[0]['pk_idTarea'], $usuarios[$i]);
                }
            } else {
                echo -1;
            }
        }
    }
}

/**
 * Funcion encargada de introducir una tarea y los usuarios que pueden crear 
 * notificaciones, esta funcion sera usada principalmente por moderadores.
 * @return -1; //usuario sin permisos
 * @return -2; //el usuario no es administrador del proyecto
 * @return -3; //el proyecto esta finalizado.
 
 * @return -5; //la tarea escede el tiempo estimado del proyecto
 * @return -6; //faltan datos
 * @return -7; //Fallo en la consulta de insercion de la tarea, TAREA CON EL MISMO NOMBRE QUE OTRA
 * @return -8; //No se ha podido obtener el id de la tarea
 * @return -9; //Hubo un fallo en la insercion de los usuarios. // 

 */
function insertarTareaPorIdProyecto()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'insertarTareaPorProyecto') {
        if (gestionarSesionyRol(50) == 1) {
            //comprobamos que todos los datos nos llegan por post
            if (isset($_POST['nombre']) && isset($_POST['idProyecto']) && isset($_POST['des']) && isset($_POST['horas']) && isset($_POST['minutos']) && ((int) $_POST['horas'] != 0 || (int) $_POST['minutos'] != 0)) {
                $estado  = true; //variable encargada de gestionar si todos los usuarios se añaden correctamente

                //comprobamos si el usuario es administrador del proyecto
                $consulta = "SELECT * FROM `Usuarios:Proyectos` WHERE fk_correo ='" . $_SESSION['correo'] . "' && fk_idProyecto = '" . filtrado($_POST['idProyecto']) . "'";

                $conector =  new ConectorBD();

                $respuesta = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);
                if (count($respuesta) == 1) {

                    //comprobamos el estado del proyecto. Si esta finalizado damos un codigo de error
                    $consulta = "SELECT estado, estimacion FROM Proyectos where pk_idProyecto = '" . filtrado($_POST['idProyecto']) . "'";

                    $respuesta = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);
                    $estadoProyecto = $respuesta[0]['estado'];
                    if ($respuesta[0]['estado'] != 'Finalizado') {
                        ///almacenaremos la estimación del proyecto y consultaremos cual  es el tiempo ocupado  ahora mismo por el proyecto.
                        $estimacionProyecto = $respuesta[0]['estimacion'];
                        $horasTareasProyecto  = 0;
                        $minutosTareasProyecto = 0;
                        $minutosTotalesProyecto = 0; // variable donde almacenamos el tiempo del proyecto en minutos.

                        //obtenemos la estimacion del proyecto en cuestion
                        $consulta =  "SELECT estimacion FROM Tareas WHERE fk_idProyecto = '" . filtrado($_POST['idProyecto']) . "'";
                        $respuesta = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                        if (count($respuesta) > 0) {
                            for ($i = 0; $i < count($respuesta); $i++) {

                                $aux = explode(':', $respuesta[$i]['estimacion']); //variable  donde almaceno momentaneamente las horas separadas con un explode;

                                $horasTareasProyecto += (int) $aux[0];
                                $minutosTareasProyecto += (int) $aux[1];
                            }
                            if ($minutosTareasProyecto > 60) {
                                $horasTareasProyecto += floor((int) $minutosTareasProyecto / 60);
                                $minutosTareasProyecto = floor((int) $minutosTareasProyecto % 60);
                            }
                        }
                        // partimos la hora en un array con dos posiciones 
                        $aux = explode(':', $estimacionProyecto);
                        $minutosTotalesProyecto = (int) ($aux[0] * 60 + $aux[1]);
                        //calculamos los tiempos del proyecto en minutos
                        if (($horasTareasProyecto * 60 + $minutosTareasProyecto) < $minutosTotalesProyecto) {




                            if (($horasTareasProyecto * 60 + $minutosTareasProyecto) + ((int) $_POST['horas'] * 60 + (int) $_POST['minutos']) < $minutosTotalesProyecto) {


                                //creamos la consulta de insercion.
                                $consulta = "INSERT INTO Tareas(`fk_idProyecto`,`nombreTarea`,`descripcion`,`estado`,`estimacion`) VALUES(" .
                                    "'" . filtrado($_POST['idProyecto']) . "'," .
                                    "'" . filtrado($_POST['nombre']) . "'," .
                                    "'" . filtrado($_POST['des']) . "'," .
                                    "'Creado'," .
                                    "'" . filtrado($_POST['horas']) . ":" . filtrado($_POST['minutos']) . "'"
                                    . ")";
                                if ($conector->actualizarBD($consulta)) {
                                    $usuarios = json_decode($_POST['usuarios']);
                                    //obtenemos la id de la tarea que acabamos de crear
                                    $consulta = "SELECT pk_idTarea FROM Tareas WHERE nombreTarea = '" . filtrado($_POST['nombre']) . "'";
                                    //echo $consulta;
                                    $resultado  = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);
                                    $idTarea =  $resultado[0]['pk_idTarea'];
                                    if (count($resultado) > 0) {

                                        for ($i = 0; $i < count($usuarios); $i++) {


                                            $consulta = "INSERT INTO `Usuarios:Tareas:PermisosNotificaciones`(`fk_idTarea`, `fk_correo`) VALUES ('" . $resultado[0]['pk_idTarea'] . "','" . $usuarios[$i] . "')";
                                            // echo $consulta;
                                            if ($conector->actualizarBD($consulta)) {
                                            } else {
                                                $estado = false;
                                            }
                                        }
                                        if ($estado) {
                                            $consulta = "SELECT pk_idTarea FROM Tareas WHERE nombreTarea ='" . filtrado($_POST['nombre']) . "'";


                                            $resultado = $conector->consultarBD($consulta)->fetch(PDO::FETCH_ASSOC);



                                            //actualizamos el estado del proyecto
                                            if ($estadoProyecto == 'Creado') {
                                                $consulta = "UPDATE `Proyectos` SET `estado`='En curso'WHERE  `pk_idProyecto` = '" . filtrado($_POST['idProyecto']) . "'";
                                                $conector->actualizarBD($consulta);
                                            }

                                            $consulta = "INSERT INTO `Usuarios:Tareas`(`fk_correo`, `fk_idTarea`)VALUES('" . $_SESSION['correo'] . "','" . $resultado['pk_idTarea'] . "')";

                                            if ($conector->actualizarBD($consulta)) {

                                                echo 1;
                                                for ($i = 0; $i < count($usuarios); $i++) {

                                                    crearAlertaUsuarioAniadidoTarea($idTarea, $usuarios[$i]);
                                                }
                                            } else {
                                                echo -9;
                                            }
                                        } else {
                                            echo -9;
                                        }
                                    } else {
                                        echo -8; // No se ha podido obtener el id de la tarea.
                                    }
                                } else {
                                    echo -7; //fallo en la consulta de insercion de la tarea, //posiblemente ya haya una tarea con ese nombre
                                }
                            } else {
                                echo -4;
                            }
                        } else {
                            echo -5;
                        }
                    } else {
                        echo -3;
                    }
                } else {
                    if (controlarRolExacto(90)) {

                        //si el usuario que tiene la sesion iniciada es administrador, creamos la tarea añadiendolo como administrador del proyecto.
                        $consulta = "INSERT INTO `Usuarios:Proyectos`(`fk_correo`, `fk_idProyecto`) VALUES ('" . $_SESSION['correo'] . "','" . filtrado($_POST['idProyecto']) . "')";

                        $conector->actualizarBD($consulta);

                        //comprobamos el estado del proyecto. Si esta finalizado damos un codigo de error
                        $consulta = "SELECT estado, estimacion FROM Proyectos where pk_idProyecto = '" . filtrado($_POST['idProyecto']) . "'";

                        $respuesta = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                        $estadoProyecto = $respuesta[0]['estado'];
                        if ($respuesta[0]['estado'] != 'Finalizado') {
                            ///almacenaremos la estimación del proyecto y consultaremos cual  es el tiempo ocupado  ahora mismo por el proyecto.
                            $estimacionProyecto = $respuesta[0]['estimacion'];
                            $horasTareasProyecto  = 0;
                            $minutosTareasProyecto = 0;
                            $minutosTotalesProyecto = 0; // variable donde almacenamos el tiempo del proyecto en minutos.

                            //obtenemos la estimacion del proyecto en cuestion
                            $consulta =  "SELECT estimacion FROM Tareas WHERE fk_idProyecto = '" . filtrado($_POST['idProyecto']) . "'";
                            $respuesta = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                            if (count($respuesta) > 0) {
                                for ($i = 0; $i < count($respuesta); $i++) {

                                    $aux = explode(':', $respuesta[$i]['estimacion']); //variable  donde almaceno momentaneamente las horas separadas con un explode;

                                    $horasTareasProyecto += (int) $aux[0];
                                    $minutosTareasProyecto += (int) $aux[1];
                                }
                                if ($minutosTareasProyecto > 60) {
                                    $horasTareasProyecto += floor((int) $minutosTareasProyecto / 60);
                                    $minutosTareasProyecto = floor((int) $minutosTareasProyecto % 60);
                                }
                            }
                            // partimos la hora en un array con dos posiciones 
                            $aux = explode(':', $estimacionProyecto);
                            $minutosTotalesProyecto = (int) ($aux[0] * 60 + $aux[1]);
                            //calculamos los tiempos del proyecto en minutos
                            if (($horasTareasProyecto * 60 + $minutosTareasProyecto) < $minutosTotalesProyecto) {
                                //creamos la consulta de insercion.
                                $consulta = "INSERT INTO Tareas(`fk_idProyecto`,`nombreTarea`,`descripcion`,`estado`,`estimacion`) VALUES(" .
                                    "'" . filtrado($_POST['idProyecto']) . "'," .
                                    "'" . filtrado($_POST['nombre']) . "'," .
                                    "'" . filtrado($_POST['des']) . "'," .
                                    "'Creado'," .
                                    "'" . filtrado($_POST['horas']) . ":" . filtrado($_POST['minutos']) . "'"
                                    . ")";
                                if ($conector->actualizarBD($consulta)) {
                                    $usuarios = json_decode($_POST['usuarios']);
                                    //obtenemos la id de la tarea que acabamos de crear
                                    $consulta = "SELECT pk_idTarea FROM Tareas WHERE nombreTarea = '" . filtrado($_POST['nombre']) . "'";
                                    //echo $consulta;
                                    $resultado  = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);
                                    if (count($resultado) > 0) {

                                        for ($i = 0; $i < count($usuarios); $i++) {


                                            $consulta = "INSERT INTO `Usuarios:Tareas:PermisosNotificaciones`(`fk_idTarea`, `fk_correo`) VALUES ('" . $resultado[0]['pk_idTarea'] . "','" . $usuarios[$i] . "')";
                                            // echo $consulta;
                                            if ($conector->actualizarBD($consulta)) {
                                            } else {
                                                $estado = false;
                                            }
                                        }
                                        if ($estado) {


                                            $consulta = "INSERT INTO `Usuarios:Tareas`(`fk_correo`, `fk_idTarea`)VALUES('" . $_SESSION['correo'] . "','" . $resultado[0]['pk_idTarea'] . "')";

                                            //actualizamos el estado del proyecto

                                            if ($conector->actualizarBD($consulta)) {


                                                for ($i = 0; $i < count($usuarios); $i++) {

                                                    crearAlertaUsuarioAniadidoTarea($idTarea, $usuarios[$i]);
                                                }
                                            }
                                            if ($estadoProyecto == 'Creado') {
                                                $consulta = "UPDATE `Proyectos` SET `estado`='En curso'WHERE  `pk_idProyecto` = '" . filtrado($_POST['idProyecto']) . "'";
                                                $conector->actualizarBD($consulta);
                                            }
                                            //actualizamos el estado del proyecto
                                            if ($estadoProyecto == 'Creado') {
                                                $consulta = "UPDATE `Proyectos` SET `estado`='En curso'WHERE  `pk_idProyecto` = '" . filtrado($_POST['idProyecto']) . "'";
                                                $conector->actualizarBD($consulta);
                                            }
                                            echo 2;
                                        } else {
                                            echo -9;
                                        }
                                    } else {
                                        echo -8; // No se ha podido obtener el id de la tarea.
                                    }
                                } else {
                                    echo -7; //fallo en la consulta de insercion de la tarea, //posiblemente ya haya una tarea con ese nombre
                                }
                            } else {
                                echo -5;
                            }
                        } else {
                            echo -3;
                        }
                    } else {
                        echo -2;
                    }
                }
            } else {
                echo -6;
            }
        } else {
            echo -1;
        }
    }
}

function borrarTareaPorId()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'borrarTareaPorId') {
        if (gestionarSesionyRol(90) == 1) {

            if (isset($_POST['id'])) {
                $consulta = "DELETE FROM `Tareas` WHERE pk_idTarea = " . $_POST['id'];


                $conector = new ConectorBD();

                $conector->actualizarBD($consulta);

                echo 1;
            } else {
                echo -2; //faltan datos
            }
        } else {
            echo -1; //sin permisos
        }
    }
}

/**
 * Obtenemos todos los datos de la tarea dando su id;
 * @return -1; no tiene permisos para realizar esta accion;
 * @return -2; no se ha pasado id
 * @return -3; No existe ninguna tarea con esa id;
 */
function tareaPorId()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'solicitarTareaId') {
        if (gestionarSesionyRol(50) == 1) {

            if (isset($_POST['id'])) {
                $resultado = [];
                $tarea = null;
                $administradores = null;
                $usuarios = null;
                $id = (int) filtrado($_POST['id']);
                $consulta = "SELECT * FROM Tareas where pk_idTarea = $id";

                $conector = new ConectorBD();

                $tarea = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                if (count($tarea) > 0) {



                    $consulta = "SELECT * FROM `Usuarios:Tareas` WHERE `fk_idTarea` = $id";

                    $conector = new ConectorBD();

                    $administradores = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);


                    $consulta = "SELECT * FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE `fk_idTarea` = $id";

                    $conector = new ConectorBD();

                    $usuarios = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);




                    $resultado = ['tarea' => $tarea, 'administradores' => $administradores, 'usuarios' => $usuarios];

                    echo json_encode($resultado);
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
 * Funcion  encargada de actualizar tarea, se le pasan parametros como el nombre 
 * la descripcion, el tiempo, estado y usuarios y los actualiza, se necesita ser moderador (tiene que ser administrador de la tarea) para 
 * poder realizar esta accion.
 * 
 * los administradores de la plataforma, pueden modificarlo sin ser administradores de la tarea.
 * @return 1; Todo ok
 * @return -1; Uusario sin permisos.
 * @return -2; Faltan datos.
 * @return -3; //el tiempo de estimado para la tarea ha superado al del proyecto.
 * @return -4; // Fallo en la consulta de actualizacion de la tarea
 * @return -5; // fallo en la consulta de insercion de datos de los usuarios
 * @return -6; // El usario no es administrador de la tarea ni de la plataforma.
 */

function actualizarTarea()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'actualizarTarea') {
        if (gestionarSesionyRol(50) == 1) {
            //comprobamos que todos los datos se pasan correctamente.
            if (isset($_POST['idTarea']) && isset($_POST['nombre']) && isset($_POST['descripcion']) && isset($_POST['hora']) && isset($_POST['minutos']) && isset($_POST['estado']) && isset($_POST['usuarios'])) {
                $idTarea = (int) filtrado($_POST['idTarea']);
                $nombre = filtrado($_POST['nombre']);
                $descripcion = filtrado($_POST['descripcion']);
                $horas = filtrado($_POST['hora']);
                $minutos = filtrado($_POST['minutos']);
                $estado = filtrado($_POST['estado']);
                $usuarios = $_POST['usuarios'];
                $todoOk = true;

                //comprobamos que el usuario sea administrador de la tarea

                $consulta = "SELECT `fk_correo` FROM `Usuarios:Tareas` WHERE `fk_correo` = '" . $_SESSION['correo'] . "' AND `fk_idTarea` = $idTarea";

                //definimos el objeto conector para la base de datos.

                $conector = new ConectorBD();

                $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                if (count($resultado) == 1) {


                    //comenzamos con el calculo de tiempo de las tareas.
                    //consultamos la estimacion del proyecto al que pertenece la tarea.

                    $consulta = "SELECT fk_idProyecto FROM Tareas WHERE `pk_idTarea` = $idTarea";

                    $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                    $consulta = "SELECT estimacion FROM Proyectos WHERE `pk_idProyecto` = " . $resultado[0]['fk_idProyecto'];

                    $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                    $horaProyecto  = explode(':', $resultado[0]['estimacion']);

                    // pasamos las horas del proyecto y las de la actualización a minutos y las comprobamos.

                    $minutosTotalesActualizacion = floor((int) $horas * 60 + (int) $minutos);

                    $minutosTotalesProyecto = floor((int) $horaProyecto[0] * 60 + (int) $horaProyecto[1]);

                    if ($minutosTotalesActualizacion <= $minutosTotalesProyecto) {
                        // Creamos las consultas de actualizacion;

                        $consulta = "UPDATE
                        `Tareas`
                    SET
                        `nombreTarea` = '$nombre',
                        `descripcion` = '$descripcion',
                        `estado` = '$estado',
                        `estimacion` ='" . $horas . ":" . $minutos . "'
                    WHERE
                    `pk_idTarea` = $idTarea";




                        //lanzamos la consulta de actualziacion
                        if ($conector->actualizarBD($consulta)) {
                            //procedemos a actualizar a los usuarios 
                            for ($i = 0; $i < count($usuarios); $i++) {
                                $consulta  = null;
                                $resultado = null;
                                //consultamos si el usuario esta en la base de datos
                                $consulta = "SELECT * FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE `fk_correo` = '" . filtraCorreo($usuarios[$i]) . "' AND `fk_idTarea` = $idTarea";



                                $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);


                                if (count($resultado) != 1) {
                                    //insertamos al usuarios en la base de datos.
                                    $consulta  =  "INSERT INTO `Usuarios:Tareas:PermisosNotificaciones`(`fk_idTarea`, `fk_correo`) VALUES ($idTarea, '" . filtraCorreo($usuarios[$i]) . "')";

                                    if ($conector->actualizarBD($consulta)) {
                                    } else {
                                        $todoOk = false;
                                    }
                                }
                            }

                            //borramos los usuarios

                            $consulta = "SELECT  `fk_correo` FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE  `fk_idTarea` = $idTarea";

                            $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                            for ($i = 0; $i < count($resultado); $i++) {
                                if (!in_array($resultado[$i]['fk_correo'], $usuarios)) {
                                    $consulta = "DELETE FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE  `fk_idTarea` = $idTarea  AND `fk_correo` = '" . $resultado[$i]['fk_correo'] . "'";

                                    if ($conector->actualizarBD($consulta)) {
                                        crearAlertaUsuarioBorradoTarea($idTarea, $resultado[$i]['fk_correo']);
                                    } else {
                                        $todoOk = false;
                                    }
                                }
                            }

                            if ($todoOk) {
                                echo 1; // todo ok

                            } else {
                                echo -5; //  fallo en la consulta relacionada con usuarios, contacte con administrador
                            }
                        } else {
                            echo -4;
                        }
                    } else {
                        echo -3; //el tiempo de estimado para la tarea ha superado al del proyecto.
                    }
                } else {


                    if (gestionarSesionyRol(90)) {


                        //comenzamos con el calculo de tiempo de las tareas.
                        //consultamos la estimacion del proyecto al que pertenece la tarea.

                        $consulta = "SELECT fk_idProyecto FROM Tareas WHERE `pk_idTarea` = $idTarea";

                        $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                        $consulta = "SELECT estimacion FROM Proyectos WHERE `pk_idProyecto` = " . $resultado[0]['fk_idProyecto'];

                        $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                        $horaProyecto  = explode(':', $resultado[0]['estimacion']);

                        // pasamos las horas del proyecto y las de la actualización a minutos y las comprobamos.

                        $minutosTotalesActualizacion = floor((int) $horas * 60 + (int) $minutos);

                        $minutosTotalesProyecto = floor((int) $horaProyecto[0] * 60 + (int) $horaProyecto[1]);

                        if ($minutosTotalesActualizacion <= $minutosTotalesProyecto) {
                            // Creamos las consultas de actualizacion;

                            $consulta = "UPDATE
                        `Tareas`
                    SET
                        `nombreTarea` = '$nombre',
                        `descripcion` = '$descripcion',
                        `estado` = '$estado',
                        `estimacion` ='" . $horas . ":" . $minutos . "'
                    WHERE
                    `pk_idTarea` = $idTarea";




                            //lanzamos la consulta de actualziacion
                            if ($conector->actualizarBD($consulta)) {
                                //procedemos a actualizar a los usuarios 
                                for ($i = 0; $i < count($usuarios); $i++) {
                                    $consulta  = null;
                                    $resultado = null;
                                    //consultamos si el usuario esta en la base de datos
                                    $consulta = "SELECT * FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE `fk_correo` = '" . filtraCorreo($usuarios[$i]) . "' AND `fk_idTarea` = $idTarea";



                                    $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);


                                    if (count($resultado) != 1) {
                                        //insertamos al usuarios en la base de datos.
                                        $consulta  =  "INSERT INTO `Usuarios:Tareas:PermisosNotificaciones`(`fk_idTarea`, `fk_correo`) VALUES ($idTarea, '" . filtraCorreo($usuarios[$i]) . "')";

                                        if ($conector->actualizarBD($consulta)) {
                                        } else {
                                            $todoOk = false;
                                        }
                                    }
                                }

                                //borramos los usuarios

                                $consulta = "SELECT  `fk_correo` FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE  `fk_idTarea` = $idTarea";

                                $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                                for ($i = 0; $i < count($resultado); $i++) {
                                    if (!in_array($resultado[$i]['fk_correo'], $usuarios)) {
                                        $consulta = "DELETE FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE  `fk_idTarea` = $idTarea  AND `fk_correo` = '" . $resultado[$i]['fk_correo'] . "'";

                                        if ($conector->actualizarBD($consulta)) {
                                            crearAlertaUsuarioBorradoTarea($idTarea, $resultado[$i]['fk_correo']);
                                        } else {
                                            $todoOk = false;
                                        }
                                    }
                                }

                                if ($todoOk) {
                                    echo 1; // todo ok

                                } else {
                                    echo -5; //  fallo en la consulta relacionada con usuarios, contacte con administrador
                                }
                            } else {
                                echo -4;
                            }
                        } else {
                            echo -3; //el tiempo de estimado para la tarea ha superado al del proyecto.
                        }
                    } else {
                        echo -6; // el usuario no es administrador del proyecto ni de la plataforma.
                    }
                }
            } else {
                echo -2; //faltan datos
            }
        } else {
            echo -1; //permisos
        }
    }
}


function devolverTareasPorIdProyecto()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'obtenerTareasPorIdProyecto') {
        if (gestionarSesionyRol(50) == 1) {

            //  echo var_dump($_POST);

            if (isset($_POST['id'])) {
                $consulta = "SELECT nombreTarea FROM Tareas WHERE fk_idProyecto ='" . $_POST['id'] . "'";



                $conector = new ConectorBD();

                $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                if (count($resultado) > 0) {
                    echo json_encode($resultado);
                } else {
                    echo 1; // el proyecto no tiene tareas
                }
            } else {
                echo -2; // faltan datos
            }
        } else {
            echo -1; //sin permisos
        }
    }
}

/**
 * Funcion encargada de  devolver si el usuario tiene permisos para crear anotaciones en la tarea 
 * y ver si le ha dado a finalizar tarea.
 * 
 * @return -1; el usuario  no tiene permisos para la creacion de nuevas anotaciones por lo tanto es administrador de la tarea.
 * @return 1; el usuario no ha notificado la finalizacion de la tarea
 * @return 2 ; el usuario notifico la finaliacion de la tarea
 */
function comprobarSiUsuarioFinalizoTarea()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'usuarioFinalizoTarea') {
        if (gestionarSesionyRol(0) == 1) {
            $conector  = new ConectorBD();

            //comprobamos que el usuario tenga permisos para crear anotaciones en la tarea
            $consulta  = "SELECT * FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE fk_correo ='" . $_SESSION['correo'] . "' AND fk_idTarea  = '" . $_POST['id'] . "'";


            $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

            if (count($resultado) > 0) {
                //ahora comprobamos si el usuario le ha  dado a tarea finalizada.


                if ($resultado[0]['finalizacionTarea'] == NULL ||  $resultado[0]['finalizacionTarea'] == 0) {
                    echo 1;
                } else {
                    echo 2;
                }
            } else {
                echo -1;
            }
        }
    }
}


/**
 * Funcion encargada de modificar el estado de la notificacion de finalizacion del usuario.
 * 
 * @return 3;  //Usuario a cancelado la solicitud de finalizacion de la tarea
 * @return 2; // No todos los usuarios han  solicitado la finalizacion de la tarea.
 * @return 1; // se notificara al administrador  que puede finalizar la tarea.
 * 
 * @return -1; //faltan datos.
 * @return -2; //usuario no tiene permisos para notificar la finalizacion de la tarea.
 * @return -3; // ha fallado la actualización de finalizacion de la tarea.
 * @return -4; // la tarea ya esta finalizada.
 * 
 */
function cambiarEstadoFinalizadoTareaPorUsuarios()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'cambiarEstadoFinalizadoTarea') {
        if (gestionarSesionyRol(0) == 1) {
            //comporbamos los datos que nos llegan desde la parte del cliente.
            if (isset($_POST['estado']) && isset($_POST['idTarea'])) {

                $conector  = new ConectorBD();

                $estado = filtrado($_POST['estado']);
                $idTarea = filtrado($_POST['idTarea']);
                //comprobamos que el usuario tenga permisos en la tarea.


                $consulta  = "SELECT * FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE fk_correo ='" . $_SESSION['correo'] . "' AND fk_idTarea  = '" . $idTarea . "'";

                //echo $consulta;
                $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                if (count($resultado) > 0) {
                    $consulta  = "SELECT estado FROM Tareas WHERE pk_idTarea = $idTarea";

                    $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                    if ($resultado[0]['estado'] == 'Finalizado') {
                        echo -4;
                    } else {

                        $consulta = "UPDATE `Usuarios:Tareas:PermisosNotificaciones` SET `finalizacionTarea`='$estado' WHERE `fk_idTarea` = '$idTarea' AND `fk_correo` = '" . $_SESSION['correo'] . "'";

                        if ($conector->actualizarBD($consulta)) {
                            if ($estado) { // el usuario  quiere solicitar la finalizacion de la tarea
                                $notificarAdministrador = true;
                                //comprobamos si todos los usuarios de la tarea han marcado la opcion de notificar la finalizacion de la tarea. 
                                $consulta = "SELECT fk_correo, finalizacionTarea FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE fk_idTarea  = '$idTarea'";
                                $resultado =  $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);
                                for ($i = 0; $i < count($resultado); $i++) {
                                    if ($resultado[$i]['finalizacionTarea'] == NULL || $resultado[$i]['finalizacionTarea'] == 0) {
                                        $notificarAdministrador = false;
                                        //Alertamos al usuario de que la tarea debe finalizarse y uno de sus compañeros ya ha notificado su finalización.
                                        crearSolicitudFinalizacionParaUsuarios($idTarea, $resultado[$i]['fk_correo']);
                                        enviarNotificacionUsuarioPendienteFinalizarTarea($resultado[$i]['fk_correo'], $idTarea); //enviamos un correo a los usuarios que quedan por finaliar.
                                    }
                                }

                                //ahora comprobamos si tenemos que notificar al administrador de la tarea para que proceda a finalizarla.

                                if ($notificarAdministrador) {
                                    echo 1; // se notificara al administrador de la  finalizacion de la tarea
                                    crearAlertaFinalizacionTarea($idTarea);
                                    enviarNotificacionFinalizarTareaAdmin($idTarea);
                                } else {
                                    echo 2; // se ha almacenado la consulta, pero aun quedan usuarios sin finalizar la tarea.
                                }
                            } else { // el usuario quiere cancelar su solicitud de finalización de la tarea.
                                echo 3;
                                $consulta = "SELECT fk_correo, finalizacionTarea FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE fk_idTarea  = '$idTarea'";
                                $resultado =  $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);
                                for ($i = 0; $i < count($resultado); $i++) {
                                    if ($resultado[$i]['finalizacionTarea'] == NULL || $resultado[$i]['finalizacionTarea'] == 0) {

                                        //Alertamos al usuario de que la tarea debe finalizarse y uno de sus compañeros ya ha notificado su finalización.
                                        crearSolicitudFinalizacionParaUsuarios($idTarea, $resultado[$i]['fk_correo']);
                                        enviarNotificacionUsuarioPendienteFinalizarTarea($resultado[$i]['fk_correo'], $idTarea); //enviamos un correo a los usuarios que quedan por finaliar.
                                    }
                                }
                            }
                        } else {
                            echo -3; // la consulta de actualizacion d la tarea ha fallado.
                        }
                    }
                } else {
                    echo -2; //usuario sin  permisos para notificar la finalizacion de la tarea.
                }
            } else {
                echo -1; // faltan datos
            }
        }
    }
}

/**
 * Funcion encargada de finalizar las tareas
 * 
 * @return 4; //Tarea finalizada con restricciones de notificaciones de usuario por administrador de la plataforma
 * @return 3; //Tarea finalizada sin restricciones de notificaciones de usuario por administrador de la plataforma
 * @return 2; Tarea finalizada con restricciones de notificacion de usuario.
 * @return 1; Tarea finalizada sin restricciones de notificaciones de usuario
 * @return -1; fallo en la consulta de finalizacion sin restricciones;
 * @return -2; un o varios usuarios no han solicitado la finalizacion de la tarea
 * @return -3; fallo en la consulta;
 * @return -4; el usuario no es administrador de la plataforma ni de la tarea
 */

function finalizarTarea()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'finalizarTarea') {
        if (gestionarSesionyRol(50) == 1) {
            // var_dump($_POST);
            $restricciones =  $_POST['noRestricciones'];
            //comprobamos que el usuario sea administrador de la tarea
            $conector = new ConectorBD();

            $consulta = "SELECT * FROM `Usuarios:Tareas` WHERE `fk_idTarea` ='" . $_POST['id'] . "' AND `fk_correo` ='" . $_SESSION['correo'] . "' ";

            $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

            if (count($resultado) > 0) {
                if ($restricciones == 'true') {
                    //sin restricciones
                    $consulta = "UPDATE `Tareas` SET `fechaFinalizacion`=SYSDATE(),`estado`='Finalizado' WHERE `pk_idTarea` = '" . $_POST['id'] . "'";
                    if ($conector->actualizarBD($consulta)) {
                        echo 1;
                        alertaFinalizacion($_POST['id']);
                    } else {
                        echo -1;
                    }
                } else if ($restricciones == "false") {
                    $sefinaliza = true;
                    $consulta = "SELECT   `finalizacionTarea` FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE `fk_idTarea` = '" . $_POST['id'] . "'";

                    $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                    for ($i = 0; $i < count($resultado); $i++) {
                        if ($resultado[$i]['finalizacionTarea'] == NULL || $resultado[$i]['finalizacionTarea'] == 0) {
                            $sefinaliza = false;
                        }
                    }
                    if ($sefinaliza) {
                        $consulta = "UPDATE `Tareas` SET `fechaFinalizacion`=SYSDATE(),`estado`='Finalizado' WHERE `pk_idTarea` = '" . $_POST['id'] . "'";
                        if ($conector->actualizarBD($consulta)) {
                            echo 2; // todo ok, con restricciones
                            alertaFinalizacion($_POST['id']);
                        } else {
                            echo -3; // fallo en la actualizacion
                        }
                    } else {
                        echo -2; // Uno o varios usuarios no ha solicitado la finalizacion de la tarea
                    }
                }
            } else {
                if (gestionarSesionyRol(90) == 1) {
                    if ($restricciones == 'true') {
                        //sin restricciones
                        $consulta = "UPDATE `Tareas` SET `fechaFinalizacion`=SYSDATE(),`estado`='Finalizado' WHERE `pk_idTarea` = '" . $_POST['id'] . "'";
                        if ($conector->actualizarBD($consulta)) {
                            echo 3;
                            alertaFinalizacion($_POST['id']);
                        } else {
                            echo -1;
                        }
                    } else if ($restricciones == "false") {
                        $sefinaliza = true;
                        $consulta = "SELECT   `finalizacionTarea` FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE `fk_idTarea` = '" . $_POST['id'] . "'";

                        $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                        for ($i = 0; $i < count($resultado); $i++) {
                            if ($resultado[$i]['finalizacionTarea'] == NULL || $resultado[$i]['finalizacionTarea'] == 0) {
                                $sefinaliza = false;
                            }
                        }
                        if ($sefinaliza) {
                            $consulta = "UPDATE `Tareas` SET `fechaFinalizacion`=SYSDATE(),`estado`='Finalizado' WHERE `pk_idTarea` = '" . $_POST['id'] . "'";
                            if ($conector->actualizarBD($consulta)) {
                                echo 4; // todo ok, con restricciones
                                alertaFinalizacion($_POST['id']);
                            } else {
                                echo -3; // fallo en la actualizacion
                            }
                        } else {
                            echo -2; // Uno o varios usuarios no ha solicitado la finalizacion de la tarea
                        }
                    }
                } else {
                    echo -4;
                }
            }
        }
    }
}

/**
 * Funcion encargada de devolver la lista de tareas que tiene un usuario, solo puede ser llamada por el administrador
 * ya que solo se puede acceder a las listas desde la gestion de usuarios.
 * 
 * @return -1; //El usuario no tiene los permisos necesarios para realizar esta acción.
 * @return -2; // FLATAN DATOS
 */
function devolverListaTareasUsuario()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'obtenerTareasDeUsuario') {
        if (gestionarSesionyRol(90) == 1) {
            if (isset($_POST['correo'])) {
                $correo = filtraCorreo($_POST['correo']);
                $conector =  new ConectorBD();
                $respuesta = [];
                $consulta = "SELECT fk_idTarea as id FROM `Usuarios:Tareas` WHERE fk_correo ='" . $correo . "'";


                $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);


                for ($i = 0; $i < count($resultado); $i++) {
                    $consulta = "SELECT pk_idTarea as idTarea, nombreTarea,pk_idProyecto as idProyecto,nombre as nombreProyecto FROM Tareas, Proyectos WHERE fk_idProyecto = pk_idProyecto AND pk_idTarea=" . $resultado[$i]['id'] . "";

                    array_push($respuesta, $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC));
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
function obtenerNumeroTareasTotales(){
    if (isset($_POST['accion']) && $_POST['accion'] === 'solicitarNumeroTareas') {
        if (gestionarSesionyRol(90)) {

            $consulta = "SELECT count(*) as num FROM Tareas";
            $conector = new ConectorBD();
           
            echo $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC)[0]['num'];
        }
    }
}

function devolverPorcentajeTareasFinalizadas(){
    if (isset($_POST['accion']) && $_POST['accion'] === 'solicitarPorcentajeTareasFinalizadas') {
        if (gestionarSesionyRol(90)) {

            $consulta = "SELECT count(*) as num FROM Tareas";
            $conector = new ConectorBD();
            $numeroTareasTotales = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC)[0]['num'];


            $consulta  ="SELECT count(*) as num FROM Tareas WHERE estado = 'Finalizado'";
            $numeroTareasFinalizadas = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC)[0]['num'];

            echo floor($numeroTareasFinalizadas/$numeroTareasTotales *100);
          
        }
    }
}