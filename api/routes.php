<?php
// routes.php

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


function getPong() {
    return "Pong!";
}

function getActivitiesOption() {
    global $pdo;

    try {
        // Use query method to fetch all results
        $stmt = $pdo->query("SELECT Name FROM Activities");

        // Check if the query was successful
        if ($stmt) {
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Check if results are found
            if ($results) {
                http_response_code(200);  // OK
                return [
                    'success' => true,
                    'data' => $results
                ];
            } else {
                http_response_code(404);  // Not Found
                return [
                    'success' => false,
                    'message' => 'No activities found'
                ];
            }
        } else {
            // In case the query failed
            http_response_code(500);  // Internal Server Error
            return [
                'success' => false,
                'message' => 'Failed to execute the query'
            ];
        }
    } catch (Exception $e) {
        // Log the error details for debugging
        error_log($e->getMessage());
        error_log($e->getTraceAsString());

        // Handle general exceptions
        http_response_code(500);  // Internal Server Error
        return [
            'success' => false,
            'message' => 'An error occurred. Please try again later.'
        ];
    }
}


function getUnitOptions() {
    global $pdo;

    try {
        // Use query method to fetch all results
        $stmt = $pdo->query("SELECT CONCAT(UIC, ' - ', Name) AS Unit FROM UnitTable");

        // Check if the query was successful
        if ($stmt) {
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Check if results are found
            if ($results) {
                http_response_code(200);  // OK
                return [
                    'success' => true,
                    'data' => $results
                ];
            } else {
                http_response_code(404);  // Not Found
                return [
                    'success' => false,
                    'message' => 'No units found'
                ];
            }
        } else {
            // In case the query failed
            http_response_code(500);  // Internal Server Error
            return [
                'success' => false,
                'message' => 'Failed to execute the query'
            ];
        }
    } catch (Exception $e) {
        // Log the error details for debugging
        error_log($e->getMessage());
        error_log($e->getTraceAsString());

        // Handle general exceptions
        http_response_code(500);  // Internal Server Error
        return [
            'success' => false,
            'message' => 'An error occurred. Please try again later.'
        ];
    }
}

function getOnGoingActivity() {
    global $pdo;

    try {
        // Use query method to fetch all results
        $stmt = $pdo->query("SELECT u.SN, u.NAME, u.EMAIL, ut.Name AS UnitName, a.Name AS ActivityName FROM ActivityRegister ar JOIN User u ON ar.SN = u.SN JOIN UnitTable ut ON u.UnitTableID = ut.id JOIN Activities a ON ar.Activity = a.id WHERE DATE(ar.DatetimeStamp) = CURDATE()");

        // Check if the query was successful
        if ($stmt) {
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Check if results are found
            if ($results) {
                http_response_code(200);  // OK
                return [
                    'success' => true,
                    'data' => $results
                ];
            } else {
                http_response_code(404);  // Not Found
                return [
                    'success' => false,
                    'message' => 'No On Going Activity found'
                ];
            }
        } else {
            // In case the query failed
            http_response_code(500);  // Internal Server Error
            return [
                'success' => false,
                'message' => 'Failed to execute the query'
            ];
        }
    } catch (Exception $e) {
        // Log the error details for debugging
        error_log($e->getMessage());
        error_log($e->getTraceAsString());

        // Handle general exceptions
        http_response_code(500);  // Internal Server Error
        return [
            'success' => false,
            'message' => 'An error occurred. Please try again later.'
        ];
    }
}

function getOnGoingActivityType($data) {
    global $pdo;

    // Ensure we get the 'activityName' from the request data
    $activityName = isset($data['activityName']) ? $data['activityName'] : null;

    // Check if the activity name is provided
    if (!$activityName) {
        http_response_code(400);  // Bad Request
        return [
            'success' => false,
            'message' => 'Activity name is required'
        ];
    }

    try {
        // Prepare the query to fetch activity types based on the provided activity name
        $stmt = $pdo->prepare("
            SELECT ActivityType
            FROM ActivityDetails
            WHERE RefActivity = (
                SELECT id
                FROM Activities
                WHERE Name = ?
            )
        ");

        // Execute the query, binding the activityName to the ? placeholder
        $stmt->execute([$activityName]);

        // Fetch the results
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Check if results are found
        if ($results) {
            http_response_code(200);  // OK
            return [
                'success' => true,
                'data' => $results
            ];
        } else {
            // If no matching activities were found
            http_response_code(404);  // Not Found
            return [
                'success' => false,
                'message' => 'No activity types found for the given activity name'
            ];
        }
    } catch (Exception $e) {
        // Log the error details for debugging
        error_log($e->getMessage());
        error_log($e->getTraceAsString());

        // Handle general exceptions
        http_response_code(500);  // Internal Server Error
        return [
            'success' => false,
            'message' => 'An error occurred. Please try again later.'
        ];
    }
}

function registerActivity($data) {
    global $pdo;

    // Validate the incoming data
    if (empty($data['activity']) || empty($data['rows'])) {
        http_response_code(400);  // Bad Request
        return [
            'success' => false,
            'message' => 'Activity and rows data are required.'
        ];
    }

    // Check if each row contains the necessary fields
    foreach ($data['rows'] as $row) {
        if (empty($row['sn']) || empty($row['name']) || empty($row['email']) || empty($row['unit'])) {
            http_response_code(400);  // Bad Request
            return [
                'success' => false,
                'message' => 'Each row must contain sn, name, email, and unit.'
            ];
        }
    }

    try {
        // Start a transaction to ensure data integrity
        $pdo->beginTransaction();

        // Check if the activity already exists and retrieve its ID
        $stmt = $pdo->prepare("SELECT id FROM Activities WHERE Name = :activity_name");
        $stmt->execute(['activity_name' => $data['activity']]);
        $activity = $stmt->fetch();

        if (!$activity) {
            // If the activity does not exist, return an error
            http_response_code(400);  // Bad Request
            return [
                'success' => false,
                'message' => 'The specified activity does not exist.'
            ];
        }

        $activityId = $activity['id'];  // Get the ID of the existing activity

        // Prepare the statement to insert participant data
        $stmt = $pdo->prepare("INSERT INTO User (SN, NAME, EMAIL, UnitTableID)
                               SELECT :sn, :name, :email, id
                               FROM UnitTable
                               WHERE UIC = :unit
                               AND NOT EXISTS (SELECT 1 FROM User WHERE SN = :sn)");

        // Now insert into ActivityRegister for the same user
        $stmtActivityRegister = $pdo->prepare("INSERT INTO ActivityRegister (SN, Activity, DatetimeStamp)
        VALUES (:sn, :activity_id, NOW())");

        // Insert each participant's data
        foreach ($data['rows'] as $row) {
            $stmt->execute([
                'sn' => $row['sn'],
                'name' => $row['name'],
                'email' => $row['email'],
                'unit' => $row['unit']
            ]);

            $stmtActivityRegister->execute([
                'sn' => $row['sn'],
                'activity_id' => $activityId
            ]);
        }

        // Commit the transaction
        $pdo->commit();

        http_response_code(200);  // OK
        return [
            'success' => true,
            'message' => 'Activity and participants registered successfully.'
        ];
    } catch (Exception $e) {
        // Roll back the transaction in case of an error
        $pdo->rollBack();

        // Log the error details
        error_log($e->getMessage());
        error_log($e->getTraceAsString());

        // Return an internal server error response
        http_response_code(500);  // Internal Server Error
        return [
            'success' => false,
            'message' => 'An error occurred while registering the activity. Please try again later.'
        ];
    }
}

