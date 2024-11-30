<?php
// routes.php

// Register a score endpoint
function registerScore($data) {
    global $conn;
    $sql = "INSERT INTO scores (service_number, unit, activity_type, total_bullets) VALUES (:service_number, :unit, :activity_type, :total_bullets)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':service_number' => $data['service_number'],
        ':unit' => $data['unit'],
        ':activity_type' => $data['activity_type'],
        ':total_bullets' => $data['total_bullets']
    ]);
    return ['status' => 'success'];
}

// Get all results endpoint
function getResults() {
    global $conn;
    $stmt = $conn->query("SELECT * FROM scores");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $results;
}

// Fetch individual score endpoint
function getScore($service_number) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM scores WHERE service_number = :service_number");
    $stmt->execute([':service_number' => $service_number]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result;
}
