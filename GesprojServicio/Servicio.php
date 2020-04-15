<?php



include "./includes/ConectorBD.php";
include ("./includes/Usuario.php");

require "includes/phpMailer/src/Exception.php";
require "includes/phpMailer/src/PHPMailer.php";
require "includes/phpMailer/src/SMTP.php";



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
require 'servicios/servicioLogin.php';
/**
 * Gestionamos las sesiones, consultas y borrado de las mismas.
 * @method consultarSession();
 * @method eliminarSession();
 */
require 'servicios/servicioSesiones.php';
/**
 * Gestiona todo lo relacionado con las alertas de la plataforma
 */

require 'servicios/servicioAlertas.php';
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
require 'servicios/servicioUsuario.php';
/**
 * Gestion de todos los datos relacionados con proyectos;
 * @method 
 */
require 'servicios/servicioProyectos.php';

/**
 * Gestiona todo lo relacionado con las tareas.
 */
require 'servicios/servicioTareas.php';
/**
 * Gestiona todo lo relacionado con las Anotaciones.
 */
require 'servicios/servicioAnotaciones.php';



//limpio la variable POST
unset($_POST);
$_POST = null;
$_POST = [];
