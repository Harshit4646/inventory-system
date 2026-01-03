-- Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Stock
CREATE TABLE stock (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    expiry_date DATE
);

-- Expired stock
CREATE TABLE expired_stock (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    expiry_date DATE,
    expired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Borrowers
CREATE TABLE borrowers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Borrower payments
CREATE TABLE borrower_payments (
    id SERIAL PRIMARY KEY,
    borrower_id INT REFERENCES borrowers(id),
    amount NUMERIC(10,2) NOT NULL,
    payment_mode VARCHAR(20) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE
);

-- Sales
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    sale_date DATE DEFAULT CURRENT_DATE,
    total_amount NUMERIC(10,2) NOT NULL,
    payment_type VARCHAR(20) NOT NULL,
    borrower_id INT REFERENCES borrowers(id)
);

-- Sale items
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INT REFERENCES sales(id) ON DELETE CASCADE,
    stock_id INT REFERENCES stock(id),
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL
);
