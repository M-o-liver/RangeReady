
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

        // Check if user exists and password matches
        if ($user && password_verify($password, $user['password'])) {
            return true;
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

if ($method == 'POST') {
    if ($request == '/api/login') {
        $data = json_decode(file_get_contents('php://input'), true);
        $response = handleLogin($data);
        echo json_encode($response);
    } elseif ($request == '/api/registerActivity') {
        $data = json_decode(file_get_contents('php://input'), true);
        $response = registerActivity($data);
        echo json_encode($response);
    }
} elseif ($method == 'GET') {
    if ($request == '/api/ping') {
        $response = getPong();
        echo json_encode($response);
    } elseif ($request == '/api/getActivitiesOptions') {
        $response = getActivitiesOption();
        echo json_encode($response);
    } elseif ($request == '/api/getUnitOptions') {
        $response = getUnitOptions();
        echo json_encode($response);
    } elseif ($request == '/api/getOnGoingActivity') {
        $response = getOnGoingActivity();
        echo json_encode($response);
    } elseif ($request == '/api/getOnGoingActivityType') {
        // Ensure activityName is set
        if (isset($_GET['activityName'])) {
            // Pass activityName as part of an associative array
            $data = ['activityName' => $_GET['activityName']];
            $response = getOnGoingActivityType($data);
            echo json_encode($response);
        } else {
            // Return an error if activityName is not provided
            echo json_encode([
                'success' => false,
                'message' => 'Activity name is required'
            ]);
        }
    }
}
