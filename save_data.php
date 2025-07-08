<?php
// Connect to MySQL
$host = 'localhost';
$db = 'your_database_name';
$user = 'your_username';
$pass = 'your_password';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
  echo "No data received.";
  exit;
}

// Create table if not exists
$conn->query("CREATE TABLE IF NOT EXISTS saved_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  textarea_id INT,
  content TEXT
)");

// Save each textarea data
foreach ($data as $entry) {
  $id = $entry['id'];
  $text = $conn->real_escape_string($entry['text']);
  $conn->query("INSERT INTO saved_data (textarea_id, content) VALUES ($id, '$text')");
}

echo "Data saved successfully.";
?>
