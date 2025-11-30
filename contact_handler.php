<?php
// contact_handler.php - Handle contact form submissions
header('Content-Type: application/json');
require_once 'database/connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get and sanitize form data
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $subject = trim($_POST['subject'] ?? '');
    $message = trim($_POST['message'] ?? '');
    
    // Validation
    $errors = [];
    
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($subject)) {
        $errors[] = "Subject is required";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required";
    }
    
    if (empty($errors)) {
        try {
            // Save to database
            $sql = "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$name, $email, $subject, $message]);
            
            $messageId = $conn->lastInsertId();
            
            // Send email notification (optional)
            $this->sendEmailNotification($name, $email, $subject, $message);
            
            echo json_encode([
                'success' => true,
                'message' => 'Thank you for your message! I will get back to you soon.',
                'message_id' => $messageId
            ]);
            
        } catch(PDOException $e) {
            error_log("Contact form error: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => 'Sorry, there was an error sending your message. Please try again.'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Please fix the following errors:',
            'errors' => $errors
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
}

function sendEmailNotification($name, $email, $subject, $message) {
    $to = "vaibhavtiwari005@gmail.com"; // Your email
    $email_subject = "New Portfolio Contact: " . $subject;
    $email_message = "
        New message from your portfolio website:
        
        Name: $name
        Email: $email
        Subject: $subject
        
        Message:
        $message
        
        ---
        This message was sent from your portfolio contact form.
    ";
    
    $headers = "From: portfolio@vaibhavtiwari.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Uncomment to enable email notifications
    // mail($to, $email_subject, $email_message, $headers);
}
?>