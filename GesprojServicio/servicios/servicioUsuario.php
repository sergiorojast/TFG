<?php

datosIniciales();

devolverUsuarios();



/**
 * 
 * 
 * @return = -1 no existe la session de php
 * @return = -2 la variable global que gestiona  el ususario no esta creada.
 */
function datosIniciales()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'datosUsuarioIniciales') {
        if (isset($_SESSION['correo']) && isset($_SESSION['rol'])) {
            if (isset($_SESSION['usuario']) && is_object($_SESSION['usuario'])) {
                $datos = [
                    'nombre' => $_SESSION['usuario']->getNombre(),
                    'apellidos' => $_SESSION['usuario']->getApellidos(),
                    'imagen' => $_SESSION['usuario']->getImagen()
                ];

                echo json_encode($datos);

                //  echo "[{nombre:" . $_SESSION['usuario']->getNombre() . ", imagen:" . $_SESSION['usuario']->getImagen() . "," . $_SESSION['usuario']->getApellidos() . "}]";
            } else {
                echo -2; // la variable global no esta definida
            }
        } else {
            echo -1; // no existe sesion alguna.
        }
    }
}

/**
 * 
 * 
 * @return -1 // la sesion no esta creada.
 * @return -2 // el usuario no tiene permisos para hacer esta accion.
 * 
 * @return "ERROR" // error en la consulta de la base de  datos.
 */
function devolverUsuarios()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'usuarios') {
        if (isset($_SESSION['correo']) && isset($_SESSION['rol'])) {
            if ($_SESSION['rol'] > 90) {
                try{
                
                $controlador  = new ConectorBD();
                $consulta = "Select *  from Usuarios order by nombre , apellidos ";
                $rows  = $controlador->consultarBD($consulta);
                $usuarios = [];
                $usuario =  new Usuario();
                while ($row =  $rows->fetch()) {
                    // var_dump($row);
                    $usuario->constructorArray($row);
                    $usuarios[]  = $usuario->devolverDatosArray();
                    
                }
                //var_dump($usuarios);
                $controlador->cerrarBD();
                

                echo json_encode($usuarios);

                unset($usuarios);
                unset($usuario);

            }catch(Exception $e){
                echo 'ERROR';
            }
            } else {
                echo -2;
            }
        } else {
            echo -1; // no existe sesion activa
        }
    }
}
