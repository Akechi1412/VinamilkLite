<?php

require_once './config.php';
require_once VENDOR_PATH . 'autoload.php';

// Load environment variables
use Dotenv\Dotenv;

$dotenv = Dotenv::createMutable(__DIR__);
$dotenv->load();

header('Access-Control-Allow-Origin: ' . $_ENV['CLIENT_URL']);
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
header('Access-Control-Max-Age: 600');
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    header("HTTP/1.1 200 OK");
    die();
}

// Define app
use Core\App;

$app = new App(dirname(__DIR__));

if (SHOW_ERRORS) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

// Define request
use Core\Request;

$request = new Request();

// Define response
use Core\Response;

$response = new Response();

// Define router
use Core\Router;

$router = new Router($request->getUri(), $request->getMethod());

// Start session
session_start();

// Set timezone
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Require routes
require_once ROUTES_PATH . 'auth.route.php';
require_once ROUTES_PATH . 'user.route.php';

$router->dispatch();
