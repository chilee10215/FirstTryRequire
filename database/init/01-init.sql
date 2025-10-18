-- Database initialization script for FirstTryRequire project
-- This script will be executed when the MySQL container starts for the first time

USE firsttry_db;

-- Create a sample table (you can modify this based on your needs)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT INTO users (username, email, password_hash) VALUES 
('admin', 'admin@firsttry.com', 'hashedpassword123'),
('testuser', 'test@firsttry.com', 'hashedpassword456')
ON DUPLICATE KEY UPDATE username=username;

-- Create other tables as needed for your application
-- Example: Products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample products
INSERT INTO products (name, description, price) VALUES 
('Sample Product 1', 'This is a sample product description', 29.99),
('Sample Product 2', 'Another sample product description', 49.99)
ON DUPLICATE KEY UPDATE name=name;
