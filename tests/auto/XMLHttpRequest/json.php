<?php
/* 
Required by responseType JSON test
*/

echo json_encode(array(
	'OK' => 1,
	'info' => "some JSON here"
));
exit;