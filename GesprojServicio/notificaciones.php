<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;



function enviarInvitacionUsuario($direccion)
{

  
    $subject = "Invitación a Gesproj";
    $message = 'Mensaje de prueba';


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
