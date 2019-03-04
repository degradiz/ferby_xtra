<?php header('Access-Control-Allow-Headers: X-Requested-With, origin, content-type'); ?>

<html lang="es">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css" nonce="">
        body,
        td,
        div,
        p,
        a,
        input {
            font-family: arial, sans-serif;
        }
    </style>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Recibo de puntos</title>
    <style type="text/css" nonce="">
        body,
        td {
            font-size: 13px
        }

        a:link,
        a:active {
            color: #1155CC;
            text-decoration: none
        }

        a:hover {
            text-decoration: underline;
            cursor: pointer
        }

        a:visited {
            color: ##6611CC
        }

        img {
            border: 0px
        }

        pre {
            white-space: pre;
            white-space: -moz-pre-wrap;
            white-space: -o-pre-wrap;
            white-space: pre-wrap;
            word-wrap: break-word;
            max-width: 800px;
            overflow: auto;
        }

        .logo {
            left: -7px;
            position: relative;
        }
    </style>
</head>

<body>
    <div class="bodycontainer">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tbody>
                <tr height="14px">
                    <td width="143">
                        <img src="http://ferby.stolz-engineering.com/img/ferbylogo.PNG" width="143" height="59" alt="Gmail" class="logo">
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <hr>
        <div class="maincontent">
                <p><b>Puntos Redimidos</b></p>
                <p><b><?php echo $_POST['business_name'] ?></b></p>
                <p><b><?php echo $_POST['place'] ?></b></p>
                  <table border="1px solid black">
                      <tr><td><b>Identidad Cliente:</b></td><td  align="right"><?php echo $_POST['receipt_username'] ?></td></tr>
                      <tr><td><b>Puntos Canjeados:<b> </td><td  align="right"><?php echo $_POST['receipt_gift_points'] ?></td></tr>
                      <tr><td><b>Fecha:<b> </td><td  align="right"><?php echo $_POST['receipt_date'] ?></td></tr>
                      <tr><td><b>Numero de Transaccion:<b> </td><td  align="right"><?php echo $_POST['receipt_points_id'] ?></td></tr>
                  </table>
                  <p><b>Firma Aqui</b></p>
                  <p>___________</p>
                  <br>
                  <p>Powered By Ferby</p>
        </div>
    </div>
    <script type="text/javascript" nonce="">// <![CDATA[
        document.body.onload = function () { document.body.offsetHeight; window.print() };
// ]]></script>
</body>

</html>