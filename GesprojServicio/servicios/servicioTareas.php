<?php

listarProyectosYTareas();

solicitarDatosTareaProyectoPorIdProyecto();


function listarProyectosYTareas()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'solicitarProyectosYtareas') {
        if (gestionarSesionyRol(0) == 1) {

            $respuesta =  []; // variable que se usara para almacenar los proyectos y enviarlos como json
            //echo $_SESSION['correo'];

            $consulta = 'SELECT
            pk_idProyecto ,
            nombre AS nombreProyecto
            -- ,
            -- Proyectos.descripcion AS descripcionProyecto,
            -- Proyectos.fechaInicio AS fechaInicioProyecto,
            -- Proyectos.fechaFinalizacion As fechaFinalizacionProyecto,
            -- Proyectos.estado AS estadoProyecto,
            -- Proyectos.estimacion AS estimacionProyecto,
            -- pk_idTarea,
            -- fk_idProyecto,
            -- nombreTarea,
            -- Tareas.descripcion AS descripcionTarea,
            -- Tareas.fechaInicio AS fechaInicioTare,
            -- Tareas.fechaFinalizacion AS fechaFinalizacionTarea,
            -- Tareas.estado AS estadoTarea,
            -- Tareas.estimacion AS estimacionTarea,
            -- fk_correo,
            -- fk_idTarea
            
            
        FROM
            Proyectos,
            Tareas,
            `Usuarios:Tareas`
        WHERE
            fk_correo = \'' . $_SESSION['correo'] . '\' && pk_idTarea = fk_idTarea && fk_idProyecto = pk_idProyecto';
            // echo $consulta;
            //lanzamos la consulta.

            $controlador =  new ConectorBD();

            $resultados =  $controlador->consultarBD($consulta);

            while ($resultado = $resultados->fetch(PDO::FETCH_ASSOC)) {

                array_push($respuesta, $resultado);
            }

            echo json_encode($respuesta);
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
            // echo $consulta;
            //lanzamos la consulta.

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
