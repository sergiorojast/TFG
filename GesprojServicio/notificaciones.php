<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;



function enviarInvitacionUsuario($direccion)
{

    $urlRegistro = "http://www.iestrassierra.net/alumnado/curso1920/DAWS/daws1920a7/Gesproj/registro.html?";
    $urlRegistro .= base64_encode("correo=$direccion");
  
    $subject = "Invitación a Gesproj";
    $message = "     <style>
    .boton {
        
    }
            s</style>
       <img style='margin:auto;display: block;'
    src='http://www.iestrassierra.net/alumnado/curso1920/DAWS/daws1920a7/GesprojServicio/imagenes/logoColor.png'>

                <h4>Invitación al registro en la plataforma de gesproj.</h4>
                <p>Uno de los administradores a introducido esta dirección de correo electronico, si usted a sido informado,
                por favor cumplimente el siguiente formulario de registro
                </p>
                
                <a style='    display: inline-block;
                margin-bottom: 0;
                font-weight: 400;
                text-align: center;
                white-space: nowrap;
                vertical-align: middle;
                -ms-touch-action: manipulation;
                touch-action: manipulation;
                cursor: pointer;
                background-image: none;
                border: 1px solid transparent;
                padding: 6px 12px;
                font-size: 14px;
                line-height: 1.42857143;
                border-radius: 4px;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                color: #fff;
                background-color: #337ab7;
                border-color: #2e6da4;
                text-decoration:none;
                ' href='$urlRegistro'>Registrarse</a>
                

                <p><a style='text-decoration:none' href='www.rojastorres.es'> Atentamente el equipo de Gesproj</a></p>";



    // Creando una nueva instancia de PHPMailer
    $mail = new PHPMailer();


    // Indicando el uso de SMTP
    $mail->isSMTP();

    // Habilitando SMTP debugging
    // 0 = apagado (para producción)
    // 1 = mensajes del cliente
    // 2 = mensajes del cliente y servidor
    $mail->SMTPDebug = 0;
    $mail->CharSet = 'UTF-8';

    // Agregando compatibilidad con HTML
    $mail->Debugoutput = 'html';

    // Estableciendo el nombre del servidor de email
    $mail->Host = 'ssl0.ovh.net';

    // Estableciendo el puerto
    $mail->Port = 465;

    // Estableciendo el sistema de encriptación
    $mail->SMTPSecure = 'ssl';

    // Para utilizar la autenticación SMTP
    $mail->SMTPAuth = true;

    // Nombre de usuario para la autenticación SMTP - usar email completo para gmail
    $mail->Username = "notificaciones@rojastorres.es";

    // Password para la autenticación SMTP
    $mail->Password = "Notificaciones";

    // Estableciendo como quién se va a enviar el mail
    $mail->setFrom('notificaciones@rojastorres.es', 'Gesproj Notificaciones');


    // Estableciendo a quién se va a enviar el mail
    $mail->addAddress($direccion);

    // El asunto del mail
    $mail->Subject = $subject;

    // Estableciendo el mensaje a enviar
    $mail->MsgHTML($message);


    // Adjuntando una imagen
    //$mail->addAttachment('images/phpmailer_mini.png');

    // Enviando el mensaje y controlando los errores
    if (!$mail->send()) {
        echo -1;
    } else {
        echo 1;
    }
}
