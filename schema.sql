/* =======================
   PRODUCTS
======================= */
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

/* =======================
   STOCK
======================= */
CREATE TABLE stock (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity >= 0),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    expiry_date DATE
);

CREATE INDEX idx_stock_product_id ON stock(product_id);
CREATE INDEX idx_stock_expiry_date ON stock(expiry_date);

/* =======================
   EXPIRED STOCK
======================= */
CREATE TABLE expired_stock (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity >= 0),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    expiry_date DATE,
    expired_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expired_stock_product_id ON expired_stock(product_id);
CREATE INDEX idx_expired_stock_expired_at ON expired_stock(expired_at);

/* =======================
   BORROWERS
======================= */
CREATE TABLE borrowers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

/* =======================
   BORROWER PAYMENTS
======================= */
CREATE TABLE borrower_payments (
    id SERIAL PRIMARY KEY,
    borrower_id INT NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    payment_mode VARCHAR(20) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_borrower_payments_borrower_id ON borrower_payments(borrower_id);
CREATE INDEX idx_borrower_payments_date ON borrower_payments(payment_date);

/* =======================
   SALES
======================= */
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_type VARCHAR(20) NOT NULL,
    borrower_id INT REFERENCES borrowers(id) ON DELETE SET NULL
);

CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_borrower_id ON sales(borrower_id);

/* =======================
   SALE ITEMS
======================= */
CREATE TABLE sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    stock_id INT NOT NULL REFERENCES stock(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0)
);

CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX idx_sale_items_product_id ON sale_items(product_id);
