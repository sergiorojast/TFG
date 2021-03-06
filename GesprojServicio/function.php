<?php

/**
 * @author Sergio Rojas Torres;
 */


function filtrado($datos)
{
    $datos = trim($datos); // Elimina espacios antes y después de los datos
    $datos = stripslashes($datos); // Elimina backslashes \
    $datos = htmlspecialchars($datos); // Traduce caracteres especiales en entidades HTML
    return $datos;
}
/**
 * Función encargada de comprobar si el usuario tiene la sesion iniciada en el servidor.
 * Tambien comprueba si puede realizar la accion solicitada;
 * Y si el usuario de la sesión existe en la base de datos.
 * 
 * @param $rolNecesario el rol que necesita la accion;
 * @return 1; // todo ok;
 * @return -1; // la sesion no esta iniciada;
 * @return -2 ; // el usuario no tiene los permisos para realizar la accion.
 * @return -3; // El usuario de la sesion no existe en la base de datos.
 */
function gestionarSesionyRol(int $rolNecesario)
{
    if (isset($_SESSION['correo']) && isset($_SESSION['rol'])) {
        if (controlarRol($rolNecesario)) {
            if (comprobarUsuario($_SESSION['correo'])) {
                return 1;
            } else {
                return -3;
            }
        } else {
            return -2;
        }
    } else {
        return -1;
    }
}

/**
 * Funcion encargada de filtrar los datos, por ejemplo, si  existe una sesion en el servidor
 * si existe el usuario o si el rol que tiene el usuario de la sesion es realmente la que se necesita
 * para la accion que quiere realizar
 * @return 1 ; Todo ok, El usuario tiene permisos y existe.
 * @return -1 ; // el usuario,  no tiene la sesion iniciaza o no tiene permisos para hacer la accion.
 * @return -2 ; // el usuario introducido existe en la base de datos.
 */
function gestionarUsuarioExiste(int $rolRequerido, string $correo)
{

    //primero comprobamos si existe sesión inciada

    if (gestionarSesionyRol($rolRequerido) == 1) {
        if (comprobarUsuario($correo)) {
            return 1;
        } else {
            return -2;
        }
    } else {
        return -1;
    }
}

//comprueba si el rol requerido es mayor o menor  que el del usuario.
function controlarRol(int $rolRequerido)
{
    $resultado  = false;
    if ($_SESSION['rol'] >= $rolRequerido) {
        $resultado = true;
    }

    return $resultado;
}
//comprueba si el rol requerido es mayor o menor  que el del usuario de manera exacta.
function controlarRolExacto(int $rolRequerido)
{
    $resultado  = false;
    if ((int)$_SESSION['rol'] == (int)$rolRequerido) {
        $resultado = true;
    }

    return $resultado;
}


//comprueba si el usuario existe;
function comprobarUsuario(string $correo)
{
    $resultado  = false;
    $correo = filtrado($correo);
    try {

        $controlador  = new ConectorBD();
        $consulta = "Select *  from Usuarios where pk_correo ='" . $correo . "' ";


        $rows  = $controlador->consultarBD($consulta);

        // si el array asociativo es mayor que cero, el usuario existe;
        if (!empty($rows->fetch())) {
            $resultado  = true;
        }

        // $controlador->cerrarBD();

    } catch (Exception $e) {
        $reusultado  = false;
    }

    return $resultado;
}
// filtra el correo co sanitize
function filtraCorreo(string $correo)
{
    return filter_var($correo, FILTER_SANITIZE_EMAIL);
}
