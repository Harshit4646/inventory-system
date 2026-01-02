-- PRODUCTS MASTER
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- STOCK (same product, different price or expiry = different row)
CREATE TABLE stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  expiry_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- EXPIRED STOCK
CREATE TABLE expired_stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stock_id INT,
  product_id INT,
  price DECIMAL(10,2),
  quantity INT,
  expiry_date DATE,
  moved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SALES BILL (one bill per sale)
CREATE TABLE sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_amount DECIMAL(10,2) NOT NULL,
  sale_type ENUM('cash','online','borrow') NOT NULL,
  editable_until DATE NOT NULL
);

-- ITEMS INSIDE A SALE
CREATE TABLE sale_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sale_id INT NOT NULL,
  stock_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (sale_id) REFERENCES sales(id),
  FOREIGN KEY (stock_id) REFERENCES stock(id)
);

-- BORROWERS
CREATE TABLE borrowers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  total_due DECIMAL(10,2) NOT NULL DEFAULT 0
);

-- BORROW LEDGER (what borrower bought)
CREATE TABLE borrower_ledger (
  id INT AUTO_INCREMENT PRIMARY KEY,
  borrower_id INT NOT NULL,
  sale_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (borrower_id) REFERENCES borrowers(id),
  FOREIGN KEY (sale_id) REFERENCES sales(id)
);

-- PAYMENTS (borrower payments)
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  borrower_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  mode ENUM('cash','online') NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (borrower_id) REFERENCES borrowers(id)
);
