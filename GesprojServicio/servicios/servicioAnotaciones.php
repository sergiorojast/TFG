<?php

obtenerAnotaciones();

crearAnotacionTipoComentario();

eliminarAnotacion();

obtenerAnotacionesUsuario();

/**
 * Funcion encargada de devolver un listado de las anotaciones que tiene la tarea que se le solicite
 * @return 1; la tarea no tiene anotaciones
 * @return JSON; listado de tareas;
 * @return -1; faltan datos;
 * @return -2; // el usuario no tiene permisos para ver las anotaciones de esta tarea;
 */


function obtenerAnotaciones()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'obtenerAnotacionesPorTarea') {
        if (gestionarSesionyRol(0) == 1) {

            if (isset($_POST['id'])) {

                //comprobamos si el usuario tiene permisos para crear anotaciones en la tarea.

                $consulta = "SELECT * FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE `fk_idTarea` ='" . filtrado($_POST['id']) . "' AND`fk_correo` ='" . $_SESSION['correo'] . "'";

                $conector = new ConectorBD();

                $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                if (count($resultado) > 0) {



                    //obtenemos las anotaciones de la tarea

                    $consulta  = "SELECT * FROM `Usuarios:Anotaciones`, Anotaciones WHERE pk_idAnotacion = `fk_idAnotacion` AND fk_IdTarea='" . filtrado($_POST['id']) . "'";

                    $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                    if (count($resultado) > 0) {
                        echo json_encode($resultado);
                    } else {
                        echo 1; // la tarea no tiene anotaciones.
                    }
                } else {
                    if (gestionarSesionyRol(50) == 1) {
                        //obtenemos las anotaciones de la tarea

                        $consulta  = "SELECT * FROM `Usuarios:Anotaciones`, Anotaciones WHERE pk_idAnotacion = `fk_idAnotacion` AND fk_IdTarea='" . filtrado($_POST['id']) . "'";

                        $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                        if (count($resultado) > 0) {
                            echo json_encode($resultado);
                        } else {
                            echo 1; // la tarea no tiene anotaciones.
                        }
                    } else {
                        echo -2; // el usuario no tiene permisos para ver las anotaciones de esta tarea
                    }
                }
            } else {
                echo -1; //faltan datos;
            }
        }
    }
}


/**
 * Funcion encargada de obtener los datos del nuevo comentario, validarlos e  introducirlos  como una anotacion de tipo
 * comentario.
 * 
 * @return 2; todo ok, usuario sin permisos para la creacion de anotaciones pero administrador. 
 * @return 1; todo ok
 * @return -1; faltan datos;
 * @return -2; datos erroneos;
 * @return -3; el usuario no tiene permiso para añadir una nueva anotacion
 * @return -4; fallo en la consulta de insercion de la nueva tarea, posiblemente  ya haya una anotacion con ese mismo nombre
 * @return -5;Fallo en la insercion de la relacion entre anotacion  y usuario
 * 
 */
function crearAnotacionTipoComentario()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'aniadeNuevaAnotacionComentario') {
        if (gestionarSesionyRol(0) == 1) {

            //validamos que todos los datos se envian.



            if (isset($_POST['idTarea']) && isset($_POST['nombre']) && isset($_POST['descripcion'])) {

                $idTarea = filtrado($_POST['idTarea']);
                $nombre = filtrado($_POST['nombre']);
                $descripcion  = filtrado($_POST['descripcion']);

                //eliminamos apostrofes

                $descripcion = addslashes($descripcion);

                //comprobamos que las variables no estan vacias y tiene una logitud adecuada.

                if ($nombre != "" && strlen($nombre) >= 6 && strlen($nombre) <= 60) {
                    if ($descripcion != "" && strlen($descripcion) >= 6 && strlen($descripcion) <= 600) {

                        //Comporbamos si el usuario tiene permitido crear la tarea.

                        $consulta =  "SELECT * FROM `Usuarios:Tareas:PermisosNotificaciones` WHERE `fk_idTarea` = '" . $idTarea . "' AND  `fk_correo` = '" . $_SESSION['correo'] . "'";

                        $conector  = new ConectorBD();

                        $respuesta = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                        if (count($respuesta) > 0) {
                            //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
                            //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
                            //copiar desde aqui para los moderadores
                            //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
                            //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡

                            //  Creamos la consulta;

                            $consulta =  "INSERT INTO `Anotaciones`( `nombre`, `descripcion`, `tipo`, `fk_idTarea`) VALUES ('" . $nombre . "','" . $descripcion . "','Comentario','" . $idTarea . "')";


                            if ($conector->actualizarBD($consulta)) {

                                //consultamos el id de la tarea que acabamos de introducir.
                                $consulta  = "SELECT `pk_idAnotacion` FROM `Anotaciones` WHERE nombre = '" . $nombre . "'";


                                $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                                //creamos la consulta que relaciona el usuario con la anotacion

                                $consulta = "INSERT INTO `Usuarios:Anotaciones`(`fk_correo`, `fk_idAnotacion`) VALUES ('" . $_SESSION['correo'] . "','" . $resultado[0]['pk_idAnotacion'] . "')";

                                if ($conector->actualizarBD($consulta)) {
                                    echo 1; //todo ok;
                                } else {
                                    echo -5; //fallo en la insercion de la relacion entre anotacion  y usuario
                                }
                            } else {
                                echo -4; //fallo en la consulta de insercion
                            }

                            //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
                            //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
                            //copiar hasta aqui para los moderadores
                            //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
                            //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡

                        } else {
                            if (gestionarSesionyRol(50) == 1) {
                                //  Creamos la consulta;

                                $consulta =  "INSERT INTO `Anotaciones`( `nombre`, `descripcion`, `tipo`, `fk_idTarea`) VALUES ('" . $nombre . "','" . $descripcion . "','Comentario','" . $idTarea . "')";


                                if ($conector->actualizarBD($consulta)) {

                                    //consultamos el id de la tarea que acabamos de introducir.
                                    $consulta  = "SELECT `pk_idAnotacion` FROM `Anotaciones` WHERE nombre = '" . $nombre . "'";


                                    $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                                    //creamos la consulta que relaciona el usuario con la anotacion

                                    $consulta = "INSERT INTO `Usuarios:Anotaciones`(`fk_correo`, `fk_idAnotacion`) VALUES ('" . $_SESSION['correo'] . "','" . $resultado[0]['pk_idAnotacion'] . "')";

                                    if ($conector->actualizarBD($consulta)) {
                                        echo 2; //todo ok;
                                    } else {
                                        echo -5; //fallo en la insercion de la relacion entre anotacion  y usuario
                                    }
                                } else {
                                    echo -4; //fallo en la consulta de insercion
                                }
                            } else {
                                echo -3; // el usuario no tiene permisos para la creacion de un nuevo comentario.
                            }
                        }
                    } else {
                        echo -2; //datos erroneos;
                    }
                } else {
                    echo -2; //datos erroneos;
                }
            } else {
                echo -1; // faltan datos;
            }
        }
    }
}

/**
 * Funcion encargada de eliminar las anotaciones, esta accion la puede acer el usuario propietario de la  anotacion o tanto moderadores de la tarea como los
 * administradores de la plataforma
 * 
 * @return 2; anotacion eliminada por administrador
 * @return 1; anotacion elminado con exito
 * @return -1; faltan datos;
 * @return -2; la anotacion no existe
 * @return -3; el usuario no es propitario de la anotacion, ni es administrador de la tarea ni de la plataforma
 * @return -4; Error en la consulta de borrado 
 */

function eliminarAnotacion()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'eliminarAnotacion') {
        if (gestionarSesionyRol(0) == 1) {

            if (isset($_POST['id'])) {

                $id = filtrado($_POST['id']);
                //consultamos que la tarea exista
                $consulta = "SELECT * FROM Anotaciones WHERE pk_idAnotacion = $id";

                $conector = new ConectorBD();

                $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                if (count($resultado) > 0) {
                    //consultamos si el usuario es el propietario de la tarea.
                    $consulta = "SELECT * FROM `Usuarios:Anotaciones` WHERE  `fk_correo` ='" . $_SESSION['correo'] . "' AND `fk_idAnotacion` = $id";

                    $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                    if (count($resultado) > 0) {

                        //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
                        //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡

                        //creamos la consulta de borrado.
                        $consulta = "DELETE FROM `Usuarios:Anotaciones` WHERE `fk_idAnotacion`  = $id; ";
                        $consulta .= "DELETE FROM `Usuarios:Anotaciones` WHERE `fk_correo`= '" . $_SESSION['correo'] . "' AND `fk_idAnotacion` =$id";


                        if ($conector->actualizarBD($consulta)) {
                            echo 1;
                        } else {
                            echo -4; // fallo en la consulta 
                        }

                        //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡
                        //¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡¡

                    } else {
                        if (gestionarSesionyRol(50) == 1) {
                            //creamos la consulta de borrado.
                            $consulta = "DELETE FROM `Usuarios:Anotaciones` WHERE `fk_idAnotacion`  = $id; ";
                            $consulta .= "DELETE FROM `Usuarios:Anotaciones` WHERE `fk_correo`= '" . $_SESSION['correo'] . "' AND `fk_idAnotacion` =$id";


                            if ($conector->actualizarBD($consulta)) {
                                echo 2;
                            } else {
                                echo -4; // fallo en la consulta 
                            }
                        } else {
                            echo -3; // el usuario no es propitario de la anotacion, ni es administrador de la tarea ni de la plataforma
                        }
                    }
                } else {
                    echo -2; // la anotacion no existe.
                }
            } else {
                echo -1; //faltan datos;
            }
        }
    }
}

/**
 * Función encargada de devolver las anotaciones de un usuario.Esta acción solo puede hacerse como administrador.
 * @return -1; // el usuario no tiene los permisos necesarios para realizar esta acción.
 * @return -2;// Faltan datos.
 */
function obtenerAnotacionesUsuario()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'obtenerAnotacionesDeUsuario') {
        if (gestionarSesionyRol(90) == 1) {
        
            if (isset($_POST['correo'])) {
     
                $correo = filtraCorreo($_POST['correo']);
                $conector =  new ConectorBD();
                $respuesta = [];
                $consulta = "SELECT fk_idAnotacion as id FROM `Usuarios:Anotaciones` WHERE fk_correo ='" . $correo . "'";

                $resultado = $conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC);

                
                for ($i = 0; $i < count($resultado); $i++) {
                   $consulta = "SELECT pk_idAnotacion, Anotaciones.nombre,pk_idTarea, nombreTarea, pk_idProyecto, Proyectos.nombre as nombreProyecto FROM Anotaciones,Tareas,Proyectos WHERE fk_idTarea = pk_idTarea AND fk_idProyecto = pk_idProyecto AND pk_idAnotacion =".$resultado[$i]['id'];
                   
                   array_push($respuesta,$conector->consultarBD($consulta)->fetchAll(PDO::FETCH_ASSOC));
                }

                echo json_encode($respuesta);
          
            } else {
                echo -2; //faltan daots
            }
        } else {
            echo -1; //El usuario no tiene los permisos necesarios para realizar esta acción
        }
    }
}
