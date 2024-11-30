<?php
require_once __DIR__ . '/vendor/autoload.php';
Dotenv\Dotenv::createImmutable(__DIR__)->load();

// Debugging to see if the values are loaded correctly
echo 'DB Host: ' . $_ENV['DB_HOST'] . '<br>';
echo 'DB Username: ' . $_ENV['DB_USERNAME'] . '<br>';
echo 'DB Password: ' . $_ENV['DB_PASSWORD'] . '<br>';
echo 'DB Database: ' . $_ENV['DB_DATABASE'] . '<br>';

// Database credentials from .env file
$dbHost = $_ENV['DB_HOST'];
$dbUsername = $_ENV['DB_USERNAME'];
$dbPassword = $_ENV['DB_PASSWORD'];
$dbName = $_ENV['DB_DATABASE'];

// Connect to MySQL using PDO
try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUsername, $dbPassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Connection successful!";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
