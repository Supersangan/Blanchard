<?
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';

$admin_email = $_POST['admin_email'];
$form_subject = $_POST['form_subject'];

$name = $_POST['name'];
$phone = $_POST['phone'];

$message .= "<table style=\"\">";
$message .= "<tr><td>Имя:</td><td>$name</td></tr>";
$message .= "<tr><td>Телефон:</td><td>$phone</td></tr>";
$message .= "</table>";

$mail = new PHPMailer(true);

try {
  $mail->setFrom($admin_email, 'Blanchard - заявка');
  $mail->addAddress($admin_email);
  $mail->Subject = $form_subject;
  $mail->msgHTML($message);
  $mail->send();

  echo 'Message has been sent';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>