<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>GesProj - Login</title>
</head>

<body>  
    <?php
    require "php/controladores/ControladorLogin.php";

    ?>

    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) ?>" method="POST">

        <div class="contenedorLoginCorreo">
            <p>
                <label for="Lcorreo">Dirección de correo</label>
                <input id="Lcorreo" name="Lcorreo" type="email" required>
            </p>
        </div>
        <div class="contenedorLogonPassword">
            <p>
                <label for="Lcontrasenia">Contraseña</label>
                <input id="Lcontrasenia" name="Lcontrasenia" type="password" required>
            </p>
        </div>
        <input type="submit" name="Lenviar" >

    </form>

</body>

</html>