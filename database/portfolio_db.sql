-- portfolio_db.sql - Updated Schema

CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- Table for contact form messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for visitor statistics
CREATE TABLE IF NOT EXISTS visitor_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    page_visited VARCHAR(255),
    visit_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for testing
INSERT INTO contact_messages (name, email, subject, message, created_at) VALUES
('John Smith', 'john.smith@example.com', 'Job Opportunity', 'Hello Vaibhav, I am impressed with your portfolio and would like to discuss a potential job opportunity.', NOW() - INTERVAL 2 DAY),
('Sarah Johnson', 'sarah.j@techcompany.com', 'Collaboration Proposal', 'Hi Vaibhav, I saw your projects and would love to collaborate on a web development project.', NOW() - INTERVAL 1 DAY),
('Mike Wilson', 'mike.wilson@startup.com', 'Freelance Work', 'Looking for a skilled developer for our startup project. Are you available?', NOW() - INTERVAL 5 HOUR);