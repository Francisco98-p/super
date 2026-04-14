<?php
$host = 'localhost';
$user = 'root';
$pass = 'root';
$db   = 'bcfexa';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM user_tbl";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "Username: " . $row["username"] . " | Password: " . $row["password"] . "\n";
    }
} else {
    echo "No users found in user_tbl or table does not exist.\n";
    
    // Check if the table exists
    $result = $conn->query("SHOW TABLES LIKE 'user_tbl'");
    if ($result->num_rows == 0) {
        echo "Table 'user_tbl' DOES NOT exist.\n";
    }
}

$conn->close();
?>
