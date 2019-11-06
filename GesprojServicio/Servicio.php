<?php



include("./includes/ConectorBD.php");
include("./includes/Usuario.php");
include("./function.php");




session_start();     

/**
 * Datos relacionados con el login, inicio de sesion y login como tal.
 * se devuelve tambien el usuario añadiendolo a la variable $_SESSION['usuario'].
 */
require_once('servicios/servicioLogin.php');
/**
 * Gestionamos las sesiones, consultas y borrado de las mismas.
 */
require_once('servicios/servicioSesiones.php');
/**
 * Gestion de todos  los datos exclusivos de usuarios;
 */
require_once('servicios/servicioUsuario.php');
