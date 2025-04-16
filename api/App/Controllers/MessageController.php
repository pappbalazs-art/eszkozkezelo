<?php

use RestServer\RestException;
use RestServer\Utils\EmailClient;

class MessageController
{
    /**
     * @url POST /message
     * @noAuth
     */
    public function send()
    {
        if (!$_POST) {
            throw new RestException(400, "The given parameters are missing!");
        }

        if (array_diff(["email", "subject", "message"], array_keys($_POST))) {
            throw new RestException(400, "There are some parameters that are missing!");
        }

        $message = '
            <!DOCTYPE html>
            <html lang="hu">
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <meta name="color-scheme" content="only">
                    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
                    <style media="all" type="text/css">
                        body {
                            font-family: Inter, Helvetica, sans-serif;
                            -webkit-font-smoothing: antialiased;
                            font-size: 16px;
                            line-height: 1.3;
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%;
                            background-color: #f4f5f6;
                            margin: 0;
                            padding: 0;
                            width: 100%;
                        }

                        .body, .darkmode, .darkmode div {
                            background-image: linear-gradient(#f4f5f6, #f4f5f6) !important;
                        }

                        .darkmode p, .darkmode span, .darkmode li {
                            -webkit-text-fill-color: #000000 !important;
                        }
                    </style>
                </head>
                <body>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f5f6;">
                        <tr>
                            <td style="padding: 30px;">
                                ' . $_POST["message"] . '
                            </td>
                        </tr>
                    </table>
                </body>
            </html>
        ';

        $emailClient = new EmailClient();

        $emailClient->setSenderName("Magyar Elemér");
        $emailClient->setSenderEmail("magyar.elemer@uni-eszterhazy.hu");
        $emailClient->setReceiverEmail($_POST["email"]);
        $emailClient->setSubject($_POST["subject"]);
        $emailClient->setMessage($message);

        if ($emailClient->send()) {
            return [
                "message" => "The email was sent successfully!"
            ];
        }

        throw new RestException(500, "There were some error at sending the email!");
    }
}