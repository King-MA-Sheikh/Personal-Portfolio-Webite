<?php
// connection.php - Database Connection File

class Database {
    private $host = "localhost";
    private $username = "root";
    private $password = "";
    private $database = "portfolio_db";
    private $connection;
    
    public function __construct() {
        try {
            $this->connection = new PDO(
                "mysql:host={$this->host};dbname={$this->database}", 
                $this->username, 
                $this->password
            );
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            die("Connection failed: " . $e->getMessage());
        }
    }
    
    public function getConnection() {
        return $this->connection;
    }
    
    public function closeConnection() {
        $this->connection = null;
    }
}

// Create global database instance
$database = new Database();
$conn = $database->getConnection();

// Function to sanitize input data
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Function to handle contact form submissions
function save_contact_message($name, $email, $subject, $message) {
    global $conn;
    
    try {
        $sql = "INSERT INTO contact_messages (name, email, subject, message, created_at) 
                VALUES (:name, :email, :subject, :message, NOW())";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':subject', $subject);
        $stmt->bindParam(':message', $message);
        
        return $stmt->execute();
    } catch(PDOException $e) {
        error_log("Error saving contact message: " . $e->getMessage());
        return false;
    }
}

// Function to get all contact messages (for admin)
function get_contact_messages() {
    global $conn;
    
    try {
        $sql = "SELECT * FROM contact_messages ORDER BY created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        
        return $stmt->fetchAll();
    } catch(PDOException $e) {
        error_log("Error fetching contact messages: " . $e->getMessage());
        return [];
    }
}

// Function to save visitor statistics
function track_visitor($ip_address, $user_agent, $page_visited) {
    global $conn;
    
    try {
        $sql = "INSERT INTO visitor_stats (ip_address, user_agent, page_visited, visit_time) 
                VALUES (:ip_address, :user_agent, :page_visited, NOW())";
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':ip_address', $ip_address);
        $stmt->bindParam(':user_agent', $user_agent);
        $stmt->bindParam(':page_visited', $page_visited);
        
        $stmt->execute();
    } catch(PDOException $e) {
        error_log("Error tracking visitor: " . $e->getMessage());
    }
}

// Function to get visitor count
function get_visitor_count() {
    global $conn;
    
    try {
        $sql = "SELECT COUNT(DISTINCT ip_address) as unique_visitors FROM visitor_stats";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        
        $result = $stmt->fetch();
        return $result['unique_visitors'];
    } catch(PDOException $e) {
        error_log("Error getting visitor count: " . $e->getMessage());
        return 0;
    }
}
?>