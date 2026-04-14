<?php
$host = 'localhost';
$user = 'root';
$pass = 'root';
$db   = 'bcfexa';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create user_tbl
$sql = "CREATE TABLE IF NOT EXISTS `user_tbl` (
  `userID` int(5) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;";

if ($conn->query($sql) === TRUE) {
    echo "Table user_tbl created successfully\n";
} else {
    echo "Error creating table: " . $conn->error . "\n";
}

// Insert users
$users = [
    [3, 'admin', 'admin123)'],
    [4, 'Micaela', 'Micaela2025'],
    [5, 'Patricia', 'Patricia2025'],
    [1, 'admin', 'admin'] // Adicional
];

foreach ($users as $u) {
    $id = $u[0];
    $uname = $u[1];
    $upass = $u[2];
    $sql = "INSERT IGNORE INTO `user_tbl` (`userID`, `username`, `password`) VALUES ($id, '$uname', '$upass')";
    if ($conn->query($sql) === TRUE) {
        echo "User $uname inserted/ignored\n";
    } else {
        echo "Error inserting user $uname: " . $conn->error . "\n";
    }
}

$conn->close();
?>
