<?php


if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    //llamadas a las funciones

    login();
    registro();
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
            $usuario = consultarUsuario(filtrado($_POST['correo']));

            if ($usuario->getCorreo() != null) {

                
                if (password_verify(filtrado($_POST['contrasenia']), $usuario->getContrasenia())) {

                    $_SESSION['correo'] = $usuario->getCorreo();
                    //$_SESSION['nombre'] = $usuario->getNombre();
                    //$_SESSION['apellidos'] = $usuario->getApellidos();
                    // $_SESSION['contrasenia'] = $usuario->getContrasenia();
                    $_SESSION['rol'] = $usuario->getRol();

                    echo json_encode($_SESSION);
                } else {
                    echo 2; // contraseña no coinciden
                }
            } else {
                echo 1; //correo no existe en la base de datos
            }
        }
        // var_dump($_POST);
        $_POST = null;
        $usuario = null;
        unset($_POST);
    }
}

/**
 * Funcion encargada de recoger todos los datos, validarlos y crear un nuevo usuario en la base de datos.
 * @return =  -1; //correo no valido
 * @return = -2 // error en la consulta, usuario en la bd.
 * @return = 1; // Usuario insertado con exito
 * @return = -3 // faltan datos
 * @return =  -4 // sin imagen
 * @return = -5 // tamaño indevido
 */
function registro()
{

    if (isset($_POST['accion']) && $_POST['accion'] === 'registro') {

        if (isset($_POST['rCorreo']) && isset($_POST['rNombre']) && isset($_POST['rApellidos']) && isset($_POST['rContrasenia'])) {

            var_dump($_FILES);
            if (count($_FILES) === 1) {

                if ($_FILES['rImagen']['size'] <= 1000000) {

                    $nombreImagen = hash('md5', $_FILES['rImagen']['tmp_name']) . rand(0, 10000) . "." . explode('/', $_FILES['rImagen']['type'])[1];
                    //echo $nombreImagen;



                    $controlador = new ConectorBD();

                    $correo = filter_var($_POST['rCorreo'], FILTER_SANITIZE_EMAIL);
                    $nombre = filtrado($_POST['rNombre']);
                    $apellidos =  filtrado($_POST['rApellidos']);
                    $contrasenia = password_hash($_POST['rContrasenia'], PASSWORD_BCRYPT);
                    $rol  = 0;
                    //var_dump($_FILES);



                    //procesamos los datos 
                    if (filter_var($correo, FILTER_VALIDATE_EMAIL)) {

                        $consulta =  "INSERT INTO Usuarios(pk_correo,nombre,apellidos,imagen,contrasenia,rol)" .
                            " VALUES('" . $correo . "','"
                            . $nombre . "','"
                            . $apellidos . "','"
                            . $nombreImagen . "','"
                            . $contrasenia . "',"
                            . $rol . ")";


                        if ($controlador->actualizarBD($consulta)) {
                            move_uploaded_file($_FILES['rImagen']['tmp_name'], 'imagenes/' . $nombreImagen);
                            echo 1;


                            header('Location: http://localhost/TFG/Gesproj/login.html');
                        } else {
                            echo -2;
                        }
                    } else {
                        echo -1; //error en el correo

                    }




                    $controlador->cerrarBD();
                } else {
                    echo -5; // tamaño de la imagen demasiado grande
                }
            } else {
                echo -4; // sin imagen.
            }
        } else {
            echo -3; // faltan datos.
        }
    }
}


/**
 * Funcion auxiliar que nos devuelve un objeto Usuario por medio de la consulta
 * en la base de datos de un correo.
 */
function consultarUsuario($correo): Usuario
{
    unset($usuario);
    $controlador  = new ConectorBD();
    $consulta = "Select *  from Usuarios where pk_correo ='" . $correo . "'";
    $rows  = $controlador->consultarBD($consulta);
    $usuario =  new Usuario();
    while ($row =  $rows->fetch()) {
        // var_dump($row);
        $usuario->constructorArray($row);
    }
    $controlador->cerrarBD();

    return $usuario;
}
