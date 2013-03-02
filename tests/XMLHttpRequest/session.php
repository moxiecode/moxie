<?php

session_start();

if (!$chunking = is_numeric($_REQUEST["offset"]) && is_numeric($_REQUEST["total"])) {
	die(json_encode(array('OK' => 0)));
}

if ($_REQUEST["offset"] == 0) {
	$_SESSION['fileName'] = $_REQUEST["name"];
} else if ($_SESSION['fileName'] != $_REQUEST["name"]) {
	die(json_encode(array('OK' => 0)));
}

die(json_encode(array('OK' => 1)));