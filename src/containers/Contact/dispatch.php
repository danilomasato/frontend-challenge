<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Carregar as dependências via Composer
require 'vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    // Configurações do Servidor SMTP
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com'; // Ex: smtp.gmail.com
    $mail->SMTPAuth   = true;
    $mail->Username   = 'seu-email@exemplo.com';
    $mail->Password   = 'sua-senha-ou-token';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Ou PHPMailer::ENCRYPTION_STARTTLS
    $mail->Port       = 465; // Ou 587

    // Destinatários
    $mail->setFrom('seu-email@exemplo.com', 'Seu Nome');
    $mail->addAddress('destino@exemplo.com', 'Nome do Destinatário');
    
    // Conteúdo
    $mail->isHTML(true);
    $mail->Subject = 'Assunto do E-mail';
    $mail->Body    = 'Este é o corpo do e-mail em <b>HTML</b>';
    $mail->AltBody = 'Este é o corpo em texto simples para clientes sem suporte a HTML';

    $mail->send();
    echo 'E-mail enviado com sucesso!';
} catch (Exception $e) {
    echo "Erro ao enviar o e-mail. Erro: {$mail->ErrorInfo}";
}
?>
