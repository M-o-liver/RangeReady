
<?php
require_once 'db.php';
require_once 'routes.php';

header('Content-Type: application/json');

// Function to validate basic authentication
function checkBasicAuth() {
    if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return false;
    }

    // Extract the 'Authorization' header
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];

    // The 'Authorization' header is in the form "Basic base64encoded(username:password)"
    if (preg_match('/^Basic (.+)$/i', $authHeader, $matches)) {
        // Decode the base64 string to get the username and password
        list($username, $password) = explode(':', base64_decode($matches[1]), 2);

        // Get DB connection
        global $pdo;

        // Query the database to find the user
        $stmt = $pdo->prepare("SELECT password FROM ApiCredential WHERE username = :username");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Check if the password matches (assuming the password is hashed)
            if (password_verify($password, $user['password'])) {
                return true;
            }
        }
    }

    return false;
}

// Authenticate before handling the request
if (!checkBasicAuth()) {
    // Return a 401 Unauthorized response
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

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