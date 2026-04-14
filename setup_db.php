<?php
$host = 'localhost';
$user = 'root';
$pass = 'root';
$db   = 'bcfexa';

$conn = new mysqli($host, $user, $pass);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS $db";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully\n";
} else {
    echo "Error creating database: " . $conn->error . "\n";
}

$conn->select_db($db);

// Import SQL file
$sqlFile = 'C:/Users/User/Desktop/Cursado 2025/tesis/bcfexa-main/DB/sql-final.sql';
if (!file_exists($sqlFile)) {
    die("SQL file not found at $sqlFile\n");
}

$sqlContent = file_get_contents($sqlFile);

// Split SQL content by semicolon (not perfect for all cases but should work for this script)
// However, a better way is to use mysqli::multi_query
if ($conn->multi_query($sqlContent)) {
    do {
        if ($result = $conn->store_result()) {
            $result->free();
        }
    } while ($conn->next_result());
    echo "Schema imported successfully\n";
} else {
    echo "Error importing schema: " . $conn->error . "\n";
}

$conn->close();
?>
