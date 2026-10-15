<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json; charset=utf-8');

require 'vendor/autoload.php';

try {

    /*
     * ============================================================
     * RECEBER DADOS DO FORMULÁRIO
     * ============================================================
     */

    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        throw new Exception('Dados do formulário inválidos.');
    }

    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $message = trim($input['message'] ?? '');

    /*
     * ============================================================
     * VALIDAÇÃO
     * ============================================================
     */

    if ($name === '') {
        throw new Exception('O nome é obrigatório.');
    }

    if ($email === '') {
        throw new Exception('O e-mail é obrigatório.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('O e-mail informado é inválido.');
    }

    if ($message === '') {
        throw new Exception('A mensagem é obrigatória.');
    }

    /*
     * ============================================================
     * CONFIGURAÇÃO DO PHPMailer
     * ============================================================
     */

    $mail = new PHPMailer(true);

    $mail->isSMTP();

    $mail->Host = 'smtp.gmail.com';

    $mail->SMTPAuth = true;

    $mail->Username = 'tudosobreape@gmail.com';

    /*
     * COLOQUE AQUI A SENHA DE APP DO GMAIL
     */
    $mail->Password = 'frmsrkdxwfvpdfpp';

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;

    $mail->Port = 465;

    $mail->CharSet = 'UTF-8';

    /*
     * ============================================================
     * REMETENTE
     * ============================================================
     */

    $mail->setFrom(
        'tudosobreape@gmail.com',
        'TSA Imóveis'
    );

    /*
     * ============================================================
     * DESTINATÁRIO
     * ============================================================
     */

    $mail->addAddress(
        'tudosobreape@gmail.com',
        'TSA Imóveis'
    );

    /*
     * ============================================================
     * RESPONDER DIRETAMENTE PARA O CLIENTE
     * ============================================================
     */

    $mail->addReplyTo(
        $email,
        $name
    );

    /*
     * ============================================================
     * DATA E HORA
     * ============================================================
     */

    $dateTime = new DateTime(
        'now',
        new DateTimeZone('America/Sao_Paulo')
    );

    $formattedDate = $dateTime->format('d/m/Y');
    $formattedTime = $dateTime->format('H:i');

    /*
     * ============================================================
     * PROTEÇÃO CONTRA HTML
     * ============================================================
     */

    $safeName = htmlspecialchars(
        $name,
        ENT_QUOTES,
        'UTF-8'
    );

    $safeEmail = htmlspecialchars(
        $email,
        ENT_QUOTES,
        'UTF-8'
    );

    $safeMessage = nl2br(
        htmlspecialchars(
            $message,
            ENT_QUOTES,
            'UTF-8'
        )
    );

    $encodedEmail = urlencode($email);

    /*
     * ============================================================
     * ASSUNTO
     * ============================================================
     */

    $mail->Subject = 'Novo contato pelo site - ' . $name;

    /*
     * ============================================================
     * TEMPLATE HTML
     * ============================================================
     */

    $mail->isHTML(true);

    $mail->Body = '
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Novo contato - TSA Imóveis</title>
</head>

<body
    style="
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
        color: #333333;
    "
>

    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="
            background-color: #f4f6f8;
            padding: 30px 15px;
        "
    >

        <tr>

            <td align="center">

                <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                        max-width: 650px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        overflow: hidden;
                        border: 1px solid #e5e7eb;
                    "
                >

                    <!-- CABEÇALHO -->

                    <tr>

                        <td
                            align="center"
                            style="
                                padding: 28px 30px;
                                background-color: #ffffff;
                                border-bottom: 1px solid #eeeeee;
                            "
                        >

                            <img
                                src="https://tudosobreap.com.br/static/media/logo_tsa.065f0e6987b69aca20e9.png"
                                alt="TSA Imóveis"
                                style="
                                    display: block;
                                    max-width: 180px;
                                    width: auto;
                                    height: auto;
                                    border: 0;
                                "
                            >

                        </td>

                    </tr>


                    <!-- TÍTULO -->

                    <tr>

                        <td
                            style="
                                padding: 32px 35px 15px 35px;
                            "
                        >

                            <div
                                style="
                                    font-size: 24px;
                                    font-weight: 600;
                                    color: #222222;
                                    margin-bottom: 8px;
                                "
                            >
                                Novo contato pelo site
                            </div>

                            <div
                                style="
                                    font-size: 14px;
                                    color: #777777;
                                "
                            >
                                Uma nova mensagem foi enviada
                                através do formulário de contato.
                            </div>

                        </td>

                    </tr>


                    <!-- DADOS DO CLIENTE -->

                    <tr>

                        <td
                            style="
                                padding: 15px 35px 5px 35px;
                            "
                        >

                            <div
                                style="
                                    font-size: 12px;
                                    color: #888888;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                    margin-bottom: 6px;
                                "
                            >
                                Nome
                            </div>

                            <div
                                style="
                                    font-size: 16px;
                                    color: #222222;
                                    font-weight: 500;
                                    margin-bottom: 22px;
                                "
                            >
                                ' . $safeName . '
                            </div>


                            <div
                                style="
                                    font-size: 12px;
                                    color: #888888;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                    margin-bottom: 6px;
                                "
                            >
                                E-mail
                            </div>

                            <div
                                style="
                                    font-size: 16px;
                                    color: #222222;
                                    margin-bottom: 22px;
                                "
                            >
                                <a
                                    href="mailto:' . $safeEmail . '"
                                    style="
                                        color: #2563eb;
                                        text-decoration: none;
                                    "
                                >
                                    ' . $safeEmail . '
                                </a>
                            </div>

                        </td>

                    </tr>


                    <!-- MENSAGEM -->

                    <tr>

                        <td
                            style="
                                padding: 5px 35px 25px 35px;
                            "
                        >

                            <div
                                style="
                                    font-size: 12px;
                                    color: #888888;
                                    text-transform: uppercase;
                                    letter-spacing: 0.5px;
                                    margin-bottom: 8px;
                                "
                            >
                                Mensagem
                            </div>

                            <div
                                style="
                                    background-color: #f8fafc;
                                    border: 1px solid #e5e7eb;
                                    border-radius: 8px;
                                    padding: 18px;
                                    font-size: 15px;
                                    line-height: 1.6;
                                    color: #444444;
                                "
                            >
                                ' . $safeMessage . '
                            </div>

                        </td>

                    </tr>


                    <!-- DATA -->

                    <tr>

                        <td
                            style="
                                padding: 0 35px 25px 35px;
                            "
                        >

                            <div
                                style="
                                    font-size: 13px;
                                    color: #888888;
                                "
                            >
                                Recebido em
                            </div>

                            <div
                                style="
                                    font-size: 14px;
                                    color: #555555;
                                    margin-top: 4px;
                                "
                            >
                                ' . $formattedDate . ' às ' . $formattedTime . '
                            </div>

                        </td>

                    </tr>


                    <!-- BOTÃO -->

                    <tr>

                        <td
                            align="center"
                            style="
                                padding: 5px 35px 35px 35px;
                            "
                        >

                            <a
                                href="mailto:' . $safeEmail . '?subject=Re:%20Seu%20contato%20com%20a%20TSA%20Imóveis"
                                style="
                                    display: inline-block;
                                    background-color: #222222;
                                    color: #ffffff;
                                    text-decoration: none;
                                    font-size: 14px;
                                    font-weight: 600;
                                    padding: 13px 25px;
                                    border-radius: 6px;
                                "
                            >
                                Responder ao cliente
                            </a>

                        </td>

                    </tr>


                    <!-- RODAPÉ -->

                    <tr>

                        <td
                            align="center"
                            style="
                                padding: 22px 30px;
                                background-color: #f8fafc;
                                border-top: 1px solid #eeeeee;
                            "
                        >

                            <div
                                style="
                                    font-size: 13px;
                                    color: #555555;
                                    margin-bottom: 5px;
                                "
                            >
                                TSA Imóveis
                            </div>

                            <div
                                style="
                                    font-size: 11px;
                                    color: #999999;
                                "
                            >
                                Mensagem enviada através do site
                                tudosobreap.com.br
                            </div>

                        </td>

                    </tr>

                </table>

            </td>

        </tr>

    </table>

</body>

</html>
';

    /*
     * ============================================================
     * VERSÃO TEXTO
     * ============================================================
     */

    $mail->AltBody =
        "NOVO CONTATO PELO SITE TSA IMÓVEIS\n\n" .
        "Nome: " . $name . "\n" .
        "E-mail: " . $email . "\n\n" .
        "Mensagem:\n" .
        $message . "\n\n" .
        "Recebido em: " . $formattedDate .
        " às " . $formattedTime;

    /*
     * ============================================================
     * ENVIAR
     * ============================================================
     */

    $mail->send();

    echo json_encode([
        'success' => true,
        'message' => 'E-mail enviado com sucesso.'
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Erro ao enviar o e-mail.',
        'error' => $e->getMessage()
    ]);
}