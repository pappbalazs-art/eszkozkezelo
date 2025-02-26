<?php

require(__DIR__ . "/../RestServer/RestServer.php");
require(__DIR__ . "/../RestServer/Utils/EmailClient.php");

/* Import all the controllers. */
require("Controllers/MessageController.php");

$server = new RestServer\RestServer("debug");
$server->addClass("MessageController");
$server->handle();
