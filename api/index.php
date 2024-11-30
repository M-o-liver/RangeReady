<?php
require_once 'db.php';
require_once 'routes.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$request = $_SERVER['REQUEST_URI'];

switch ($method) {
    case 'POST':
        if ($request == '/api/register-score') {
            // Expecting JSON data from frontend
            $data = json_decode(file_get_contents('php://input'), true);
            $response = registerScore($data);
            echo json_encode($response);
        }
        break;

    case 'GET':
        if ($request == '/api/ping') {
            echo json_encode("PONG!");
        } elseif ($request == '/api/results') {
            $results = getResults();
            echo json_encode($results);
        } elseif (preg_match('/\/api\/score\/(.+)/', $request, $matches)) {
            $service_number = $matches[1];
            $result = getScore($service_number);
            echo json_encode($result);
        }
        break;
}
