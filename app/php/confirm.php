<?php
header('Access-Control-Allow-Origin: *');

$field_name = $_POST['name'];
$field_email = $_POST['email'];
$field_message = $_POST['comments'];

$field_name = ucfirst($field_name);

$subject = 'WildHacks Application Received!';

$body_message = "Hey ".$field_name.",\n\n";
$body_message .= "Thanks for applying! Sometime in the next few weeks you'll receive a signup link for WildHacks. \n\n";
$body_message .= "We can't wait for November, and we hope you feel the same way!\n\nIn the meantime, please don't hesistate to reach out to us with any questions at team@wildhacks.org \n\n";
$body_message .="Best, \nYour WildHacks Team";

$headers = "From: Wildhacks Team <Team@wildhacks.org>\r\n";
$headers .= "Reply-To: Team@wildhacks.org\r\n";
$mail_status = mail($field_email, $subject, $body_message, $headers);