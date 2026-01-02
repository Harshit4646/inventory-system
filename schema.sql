CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  expiry_date DATE NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE expired_stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stock_id INT,
  product_id INT,
  price DECIMAL(10,2),
  quantity INT,
  expiry_date DATE,
  moved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total_amount DECIMAL(10,2),
  sale_type ENUM('cash','online','borrow') NOT NULL,
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  editable_until DATE
);

CREATE TABLE sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT,
  stock_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (sale_id) REFERENCES sales(id)
);

CREATE TABLE borrowers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE,
  total_due DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE borrower_ledger (
  id INT AUTO_INCREMENT PRIMARY KEY,
  borrower_id INT,
  sale_id INT,
  amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  borrower_id INT,
  amount DECIMAL(10,2),
  mode ENUM('cash','online'),
  paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
