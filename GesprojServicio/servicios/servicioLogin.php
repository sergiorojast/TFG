<?php





if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    //llamadas a las funciones

    login();
    registro();
    gestionRegistroInvitacion();
}

/**
 * Funcion encargada de comprobar los datos para hacer login
 * 
 * @return 0->Usuario,1->usuario no encontrado,2->contraseña no coincide.
 */
function login()
{

    //login
    if (isset($_POST['accion']) && $_POST['accion'] === 'login') {

        if (isset($_POST['correo']) && isset($_POST['contrasenia'])) {
            $_SESSION['usuario'] = consultarUsuario(filtrado($_POST['correo']));

            if ($_SESSION['usuario']->getCorreo() != null) {


                if (password_verify(filtrado($_POST['contrasenia']), $_SESSION['usuario']->getContrasenia())) {

                    $_SESSION['correo'] = $_SESSION['usuario']->getCorreo();
                    //$_SESSION['nombre'] = $_SESSION['usuario']->getNombre();
                    //$_SESSION['apellidos'] = $_SESSION['usuario']->getApellidos();
                    // $_SESSION['contrasenia'] = $_SESSION['usuario']->getContrasenia();
                    $_SESSION['rol'] = $_SESSION['usuario']->getRol();

                    echo json_encode($_SESSION);

                    // var_dump($_SESSION['usuario']);
                } else {
                    echo 2; // contraseña no coinciden
                }
            } else {
                echo 1; //correo no existe en la base de datos
            }
        }
        // var_dump($_POST);
        $_POST = null;

        unset($_POST);
    }
}

/**
 * Funcion encargada de recoger todos los datos, validarlos y crear un nuevo usuario en la base de datos.
 * @return =  -1; //correo no valido
 * @return = -2 // error en la consulta, usuario en la bd.
 * @return = 1; // Usuario insertado con exito
 * @return = -3 // Usuario ya existe

 */
function registro()
{
    $usuario = null;
    //variable encargada de controlar si la imagen se sube al servidor.
    $subidaImagen = false;
    if (isset($_POST['accion']) && $_POST['accion'] === 'registro') {


        if (isset($_POST['rCorreo']) && isset($_POST['rNombre']) && isset($_POST['rApellidos']) && isset($_POST['rContrasenia'])) {
            $usuario = new Usuario();


            //Si la imagen no corresponde o no cumple los filtrados, se le asignara una imagen por defecto.
            if (count($_FILES) === 1 || $_FILES['rImagen']['name'] != '') {
                if (explode('/', $_FILES['rImagen']['type'])[1] == "png" || explode('/', $_FILES['rImagen']['type'])[1] == "jpeg" || explode('/', $_FILES['rImagen']['type'])[1] == "jpg" || explode('/', $_FILES['rImagen']['type'])[1] == "svg") {


                    if ($_FILES['rImagen']['size'] <= 1000000) {

                        $nombreImagen = hash('md5', $_FILES['rImagen']['tmp_name']) . rand(0, 10000) . "." . explode('/', $_FILES['rImagen']['type'])[1];
                        //echo $nombreImagen;
                        $usuario->setImagen($nombreImagen);
                        $subidaImagen = true;
                    } else {
                        $usuario->setImagen('default.png');
                    }
                } else {
                    $usuario->setImagen('default.png');
                }
            } else {
                $usuario->setImagen('default.png');
            }





            $controlador = new ConectorBD();

            $correo = filtraCorreo($_POST['rCorreo']);
            $nombre = filtrado($_POST['rNombre']);
            $apellidos =  filtrado($_POST['rApellidos']);
            $contrasenia = password_hash($_POST['rContrasenia'], PASSWORD_BCRYPT);
            $rol  = 0;
            //var_dump($_FILES);
            $usuario->setCorreo($correo);
            $usuario->setNombre($nombre);
            $usuario->setApellidos($apellidos);
            $usuario->setContrasenia($contrasenia);
            $usuario->setRol($rol);

            if (!comprobarUsuario($correo)) {



                //procesamos los datos 
                if (filter_var($correo, FILTER_VALIDATE_EMAIL)) {

                    $consulta =  "INSERT INTO Usuarios(pk_correo,nombre,apellidos,imagen,contrasenia,rol)" .
                        " VALUES('" . $usuario->getCorreo() . "','"
                        . $usuario->getNombre() . "','"
                        . $usuario->getApellidos() . "', '" . $usuario->getImagen() . "','"
                        . $usuario->getContrasenia() . "',"
                        . $usuario->getRol() . ")";


                    if ($controlador->actualizarBD($consulta)) {
                        if ($subidaImagen) {
                            move_uploaded_file($_FILES['rImagen']['tmp_name'], 'imagenes/' . $nombreImagen);
                        }
                        echo 1;
                    } else {
                        echo -2; //error en la consulta
                    }
                } else {
                    echo -1; //error en el correo

                }
            } else {
                echo -3; //usuario ya existe
            }
        }
    }
}


/**
 * Funcion auxiliar que nos devuelve un objeto Usuario por medio de la consulta
 * en la base de datos de un correo.
 * @deprecated consultarUsuario();
 */
function consultarUsuario($correo): Usuario
{
    unset($usuario);
    $correo = filtraCorreo($correo);
    $controlador  = new ConectorBD();
    $consulta = "Select *  from Usuarios where pk_correo ='" . $correo . "'";
    $rows  = $controlador->consultarBD($consulta);
    $usuario =  new Usuario();
    while ($row =  $rows->fetch()) {
        // var_dump($row);
        $usuario->constructorArray($row);
    }
    // $controlador->cerrarBD();

    return $usuario;
}

/**
 * Funcion encargada de gestionar las invitaciones del registro
 * @return 1; todo ok;
 * @return -1; el usuario no tiene un invitación o esta caducada.
 * @return -2; invitacion caducada;
 */
function gestionRegistroInvitacion()
{
    if (isset($_POST['accion']) && $_POST['accion'] === 'registroInvitacion') {

        if (isset($_POST['correo'])) {
            //hacemos un filtrado del correo.
            $correo = filtraCorreo($_POST['correo']);


            $consulta = "SELECT * FROM Registros WHERE pk_correoInvitacion = '$correo'";
            $controlador =  new ConectorBD();

            $filas = $controlador->consultarBD($consulta);
            if (count($filas) == 1) {

                while ($fila = $filas->fetch()) {
                    $fechaActual = new DateTime();
                    $fechaEnvioNotificacion = new DateTime($fila['fechaEnvioNotificacion']);
                    $fechaCaducidadInvitacion = new DateTime($fila['fechaCaducidadInvitacion']);
                    if ($fechaActual >= $fechaCaducidadInvitacion) {
                        echo "-2";// invitacion caducada
                    } else {
                        echo "1";//todo ok
                    }
                }
            } else {
                echo -1; // el usuario no tiene invitacion o a caducado.
            }
        }
    }
}
