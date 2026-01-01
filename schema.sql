-- Inventory Management System Database

CREATE DATABASE IF NOT EXISTS inventory_system;
USE inventory_system;

-- Stock Table
CREATE TABLE IF NOT EXISTS stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  expiry DATE NOT NULL
);

-- Sales Table
CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_date DATE DEFAULT CURRENT_DATE,
  payment_type ENUM('cash','online','borrow') NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

-- Sales Items Table (for each item in sale)
CREATE TABLE IF NOT EXISTS sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  stock_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (stock_id) REFERENCES stock(id) ON DELETE CASCADE
);

-- Borrowers Table
CREATE TABLE IF NOT EXISTS borrowers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  balance DECIMAL(10,2) NOT NULL
);

-- Payments Table (borrower payments)
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  borrower_name VARCHAR(255) NOT NULL,
  cash DECIMAL(10,2) DEFAULT 0,
  online DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  payment_date DATE DEFAULT CURRENT_DATE
);

-- Expired Items Table
CREATE TABLE IF NOT EXISTS expired (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  qty INT NOT NULL,
  expiry DATE NOT NULL
);
