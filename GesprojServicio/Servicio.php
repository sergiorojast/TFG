<?php



include_once("./includes/ConectorBD.php");
include_once("./includes/Usuario.php");

require_once "includes/phpMailer/src/Exception.php";
require_once "includes/phpMailer/src/PHPMailer.php";
require_once "includes/phpMailer/src/SMTP.php";



session_start();

include_once("./function.php");


include_once("./notificaciones.php");



//modificamos la zona horaria
date_default_timezone_set('Europe/Madrid');


/**
 * Datos relacionados con el login, inicio de sesion y login como tal.
 * se devuelve tambien el usuario añadiendolo a la variable $_SESSION['usuario'].
 * @method login();
 * @method registro();
 * @method consultarUsuario();
 */
require_once('servicios/servicioLogin.php');
/**
 * Gestionamos las sesiones, consultas y borrado de las mismas.
 * @method consultarSession();
 * @method eliminarSession();
 */
require_once('servicios/servicioSesiones.php');
/**
 * Gestiona todo lo relacionado con las alertas de la plataforma
 */

require_once('servicios/servicioAlertas.php');
/**
 * Gestion de todos  los datos exclusivos de usuarios;
 * @method datosIniciales();
 * @method devolverUsuarios();
 * @method visualizarDatos();
 * @method editarUsuario();
 * @method borrarUsuario();
 * @method devolverCorreoFechaUsuarios();
 * @method devolverRoles();
 * @method devolverAdministradores();
 */
require_once('servicios/servicioUsuario.php');
/**
 * Gestion de todos los datos relacionados con proyectos;
 * @method 
 */
require_once('servicios/servicioProyectos.php');

/**
 * Gestiona todo lo relacionado con las tareas.
 */
require_once('servicios/servicioTareas.php');
/**
 * Gestiona todo lo relacionado con las Anotaciones.
 */
require_once('servicios/servicioAnotaciones.php');



//limpio la variable POST
unset($_POST);
$_POST = null;
$_POST = [];
