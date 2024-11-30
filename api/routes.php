<?php
// routes.php

// Return Pong!
function getPong() {
    return "Pong!";
}

/*
How to call:
    $data = [
        'username' => "some username",
        'password' => "some password"
    ];
    storeHashedPassword($data);

// function to store hashed password:
function storeHashedPassword($data) {
    global $pdo;

    // Validate input data
    if (!isset($data['username']) || !isset($data['password'])) {
        http_response_code(400);  // Bad Request
        return [
            'success' => false,
            'message' => 'Invalid credentials'
        ];
    }

    $inputUsername = $data['username'];
    $inputPassword = $data['password'];

    // Hash the password before storing it
    $hashedPassword = password_hash($inputPassword, PASSWORD_DEFAULT);

    try {
        // Prepare the query to insert the username and hashed password into the database
        $stmt = $pdo->prepare("INSERT INTO Supervisor (SN, password) VALUES (:username, :password)");

        // Bind parameters using PDO's bindParam or bindValue
        $stmt->bindParam(':username', $inputUsername, PDO::PARAM_STR);
        $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);

        // Execute the statement
        $stmt->execute();

        http_response_code(201);  // Created
        return [
            'success' => true,
            'message' => 'User registered successfully'
        ];
    } catch (Exception $e) {
        http_response_code(500);  // Internal Server Error
        return [
            'success' => false,
            'message' => 'An error occurred. Please try again later.'
        ];
    }
}
*/

// Login
function handleLogin($data) {
    global $pdo;

    // Validate input data
    if (!isset($data['username']) || !isset($data['password'])) {
        http_response_code(400);  // Bad Request
        return [
            'success' => false,
            'message' => 'Invalid credentials'
        ];
    }

    $inputUsername = $data['username'];
    $inputPassword = $data['password'];

    try {
        // Prepare the query to fetch the hashed password for the given username
        $stmt = $pdo->prepare("SELECT password FROM Supervisor WHERE SN = :username");

        // Bind the input username to the placeholder
        $stmt->bindParam(':username', $inputUsername, PDO::PARAM_STR);

        // Execute the query
        $stmt->execute();

        // Fetch the result
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Check if the user exists and the password is correct
        if ($user && password_verify($inputPassword, $user['password'])) {
            http_response_code(200);  // OK
            return [
                'success' => true,
                'message' => 'Login successful'
            ];
        }

        // If either the username or password is invalid
        http_response_code(401);  // Unauthorized
        return [
            'success' => false,
            'message' => 'Invalid credentials'
        ];
    } catch (Exception $e) {
        http_response_code(500);  // Internal Server Error
        return [
            'success' => false,
            'message' => 'An error occurred. Please try again later.'
        ];
    }
}


// Register a score endpoint - Dummy query to show how to do insert and return message "success"
function registerScore($data) {
    global $pdo;

    // Check if required data is present
    if (!isset($data['service_number'], $data['unit'], $data['activity_type'], $data['total_bullets'])) {
        http_response_code(400);  // Bad Request
        return ['status' => 'error', 'message' => 'Missing required data'];
    }

    // Prepare the SQL query with placeholders
    $sql = "INSERT INTO scores (service_number, unit, activity_type, total_bullets) VALUES (:service_number, :unit, :activity_type, :total_bullets)";
    $stmt = $pdo->prepare($sql);

    // Bind the parameters to the query
    $stmt->bindParam(':service_number', $data['service_number'], PDO::PARAM_STR);
    $stmt->bindParam(':unit', $data['unit'], PDO::PARAM_STR);
    $stmt->bindParam(':activity_type', $data['activity_type'], PDO::PARAM_STR);
    $stmt->bindParam(':total_bullets', $data['total_bullets'], PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        http_response_code(200);  // OK
        return ['status' => 'success'];
    } else {
        http_response_code(500);  // Internal Server Error
        return ['status' => 'error', 'message' => 'Failed to register score'];
    }
}


// Get all results endpoint - Dummy query to show how to return all results from the DB
function getResults() {
    global $pdo;

    // Use query method to fetch all results
    $stmt = $pdo->query("SELECT * FROM scores");

    if ($stmt) {
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        http_response_code(200);  // OK
        return $results;
    } else {
        http_response_code(500);  // Internal Server Error
        return ['status' => 'error', 'message' => 'Failed to fetch results'];
    }
}

// Fetch individual score endpoint - Dummy query to show how to return only specific column from the DB
function getScore($service_number) {
    global $pdo;

    // Prepare the query to fetch a single score by service_number
    $stmt = $pdo->prepare("SELECT * FROM scores WHERE service_number = :service_number");

    // Bind the service number parameter
    $stmt->bindParam(':service_number', $service_number, PDO::PARAM_STR);

    // Execute the query
    if ($stmt->execute()) {
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        http_response_code(200);  // OK
        return $result;
    } else {
        http_response_code(500);  // Internal Server Error
        return ['status' => 'error', 'message' => 'Failed to fetch score'];
    }
}
