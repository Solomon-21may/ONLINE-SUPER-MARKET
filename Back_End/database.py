import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            database=os.getenv('DB_NAME', 'supermarket_db'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'password'),
            port=os.getenv('DB_PORT', '5432')
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def init_db():
    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        
        # Drop existing tables (for development only)
        cursor.execute("""
            DROP TABLE IF EXISTS sale_items CASCADE;
            DROP TABLE IF EXISTS sales CASCADE;
            DROP TABLE IF EXISTS admins CASCADE;
            DROP TABLE IF EXISTS products CASCADE;
            DROP TABLE IF EXISTS promotions CASCADE;
            DROP TABLE IF EXISTS customers CASCADE;
            DROP TABLE IF EXISTS employees CASCADE;
            DROP TABLE IF EXISTS departments CASCADE;
            DROP TABLE IF EXISTS suppliers CASCADE;
        """)
        
        # Create tables
        cursor.execute("""
            CREATE TABLE suppliers (
                supplier_id SERIAL PRIMARY KEY,
                supplier_name VARCHAR(100) NOT NULL,
                contact_person VARCHAR(100) NOT NULL,
                address VARCHAR(200) NOT NULL,
                phone_number VARCHAR(20) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(200) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        cursor.execute("""
            CREATE TABLE departments (
                department_id SERIAL PRIMARY KEY,
                department_name VARCHAR(100) NOT NULL,
                location VARCHAR(200) NOT NULL
            );
        """)
        
        cursor.execute("""
            CREATE TABLE employees (
                employee_id SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                department_id INTEGER NOT NULL REFERENCES departments(department_id),
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(200) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                phone_number VARCHAR(20) NOT NULL,
                hire_date DATE NOT NULL,
                skills TEXT
            );
        """)
        
        cursor.execute("""
            CREATE TABLE customers (
                customer_id SERIAL PRIMARY KEY,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(200) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                address VARCHAR(200) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        cursor.execute("""
            CREATE TABLE products (
                product_id SERIAL PRIMARY KEY,
                product_name VARCHAR(100) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                quantity_available INTEGER NOT NULL DEFAULT 0,
                supplier_id INTEGER NOT NULL REFERENCES suppliers(supplier_id)
            );
        """)
        
        cursor.execute("""
            CREATE TABLE promotions (
                promotion_id SERIAL PRIMARY KEY,
                promotion_name VARCHAR(100) NOT NULL,
                description TEXT,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                discount_percentage DECIMAL(5,2) NOT NULL
            );
        """)
        
        cursor.execute("""
            CREATE TABLE sales (
                sale_id SERIAL PRIMARY KEY,
                customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
                employee_id INTEGER REFERENCES employees(employee_id),
                sale_date DATE NOT NULL,
                total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00
            );
        """)
        
        cursor.execute("""
            CREATE TABLE sale_items (
                sale_item_id SERIAL PRIMARY KEY,
                sale_id INTEGER NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL REFERENCES products(product_id),
                quantity INTEGER NOT NULL,
                unit_price DECIMAL(10,2) NOT NULL,
                subtotal DECIMAL(12,2) NOT NULL
            );
        """)
        
        cursor.execute("""
            CREATE TABLE admins (
                admin_id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(200) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                employee_id INTEGER REFERENCES employees(employee_id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Insert sample data
        cursor.execute("""
            INSERT INTO departments (department_name, location) 
            VALUES ('Sales', 'Main Store Floor'),
                   ('Warehouse', 'Back Storage'),
                   ('Management', 'Office Building');
        """)
        
        cursor.execute("""
            INSERT INTO suppliers (supplier_name, contact_person, address, phone_number, email, password)
            VALUES ('Ethiopian Coffee Roasters', 'Abebe Kebede', 'Addis Ababa, Bole Road', '+251911234567', 'abebe.coffee@example.com', 'hashed_password'),
                   ('Fresh Produce Inc.', 'Sarah Johnson', '123 Market St, City', '+1234567890', 'fresh@example.com', 'hashed_password');
        """)
        
        cursor.execute("""
            INSERT INTO employees (first_name, last_name, department_id, username, password, email, phone_number, hire_date, skills)
            VALUES ('Samuel', 'Lemma', 1, 'samuel.l', 'hashed_password', 'samuel.lemma@example.com', '+251912345678', '2023-01-15', 'Sales, Customer Service'),
                   ('Maria', 'Gomez', 2, 'maria.g', 'hashed_password', 'maria.gomez@example.com', '+1234567890', '2023-03-20', 'Inventory Management');
        """)
        
        cursor.execute("""
            INSERT INTO customers (first_name, last_name, username, password, email, address)
            VALUES ('Sarah', 'Mohamed', 'sarah.m', 'hashed_password', 'sarah.m@example.com', 'Bole Atlas, Addis Ababa'),
                   ('John', 'Doe', 'john.d', 'hashed_password', 'john.doe@example.com', '123 Main St, City');
        """)
        
        cursor.execute("""
            INSERT INTO products (product_name, description, price, quantity_available, supplier_id)
            VALUES ('Ethiopian Yirgacheffe Coffee (250g)', 'Premium washed Arabica coffee beans.', 15.50, 200, 1),
                   ('Fresh Milk (1L)', 'Pasteurized fresh milk.', 2.99, 150, 2),
                   ('Whole Wheat Bread', 'Freshly baked whole wheat bread.', 1.99, 100, 2);
        """)
        
        cursor.execute("""
            INSERT INTO promotions (promotion_name, description, start_date, end_date, discount_percentage)
            VALUES ('Grand Opening Discount', '20% off all coffee products.', '2025-05-01', '2025-05-31', 20.00),
                   ('Weekend Special', '10% off all dairy products.', '2025-05-10', '2025-05-12', 10.00);
        """)
        
        cursor.execute("""
            INSERT INTO admins (username, password, email, employee_id)
            VALUES ('admin.main', 'admin_hash', 'admin@example.com', 1),
                   ('admin.warehouse', 'admin_hash', 'warehouse@example.com', 2);
        """)
        
        conn.commit()
        cursor.close()
        conn.close()
        print("Database initialized successfully!")
    else:
        print("Failed to connect to database")

if __name__ == '__main__':
    init_db()