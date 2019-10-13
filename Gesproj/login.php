<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>GesProj - Login</title>
</head>

<body>

    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) ?>">

        <div class="contenedorLoginCorreo">
            <p>
                <label for="Lcorreo">Dirección de correo</label>
                <input id="Lcorreo" name="Lcorreo" type="email" require>
            </p>
        </div>
        <div class="contenedorLogonPassword">
            <p>
                <label for="Lcontasenia">Contraseña</label>
                <input id="Lcontasenia" name="Lcontasenia" type="password" require>
            </p>
        </div>

    </form>

</body>

</html>