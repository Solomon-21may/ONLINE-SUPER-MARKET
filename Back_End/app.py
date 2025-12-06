from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database configuration
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        database=os.getenv('DB_NAME', 'supermarket_db'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', 'password'),
        port=os.getenv('DB_PORT', '5432')
    )
    return conn

# Helper function to hash passwords (in production, use bcrypt)
def hash_password(password):
    # This is a simple hash for demonstration. Use bcrypt in production.
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()

# API Routes

# Suppliers API
@app.route('/api/suppliers', methods=['GET', 'POST'])
def suppliers():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute('SELECT * FROM suppliers ORDER BY supplier_id')
        suppliers = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(suppliers)
    
    elif request.method == 'POST':
        data = request.get_json()
        
        # Hash password before storing
        if 'password' in data:
            data['password'] = hash_password(data['password'])
        
        try:
            cursor.execute("""
                INSERT INTO suppliers (supplier_id, supplier_name, contact_person, address, phone_number, email, password)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                data['supplier_id'],
                data['supplier_name'],
                data['contact_person'],
                data['address'],
                data['phone_number'],
                data['email'],
                data['password']
            ))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Supplier created successfully'}), 201
        except Exception as e:
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 400

@app.route('/api/suppliers/<int:id>', methods=['DELETE'])
def delete_supplier(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('DELETE FROM suppliers WHERE supplier_id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Supplier deleted successfully'})
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 400

# Departments API
@app.route('/api/departments', methods=['GET', 'POST'])
def departments():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute('SELECT * FROM departments ORDER BY department_id')
        departments = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(departments)
    
    elif request.method == 'POST':
        data = request.get_json()
        
        try:
            cursor.execute("""
                INSERT INTO departments (department_id, department_name, location)
                VALUES (%s, %s, %s)
            """, (
                data['department_id'],
                data['department_name'],
                data['location']
            ))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Department created successfully'}), 201
        except Exception as e:
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 400

@app.route('/api/departments/<int:id>', methods=['DELETE'])
def delete_department(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('DELETE FROM departments WHERE department_id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Department deleted successfully'})
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 400

# Employees API
@app.route('/api/employees', methods=['GET', 'POST'])
def employees():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute('SELECT * FROM employees ORDER BY employee_id')
        employees = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(employees)
    
    elif request.method == 'POST':
        data = request.get_json()
        
        # Hash password before storing
        if 'password' in data:
            data['password'] = hash_password(data['password'])
        
        try:
            cursor.execute("""
                INSERT INTO employees (employee_id, first_name, last_name, department_id, username, password, email, phone_number, hire_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data['employee_id'],
                data['first_name'],
                data['last_name'],
                data['department_id'],
                data['username'],
                data['password'],
                data['email'],
                data['phone_number'],
                data['hire_date']
            ))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Employee created successfully'}), 201
        except Exception as e:
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 400

@app.route('/api/employees/<int:id>', methods=['DELETE'])
def delete_employee(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('DELETE FROM employees WHERE employee_id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Employee deleted successfully'})
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 400

# Customers API
@app.route('/api/customers', methods=['GET', 'POST'])
def customers():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute('SELECT * FROM customers ORDER BY customer_id')
        customers = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(customers)
    
    elif request.method == 'POST':
        data = request.get_json()
        
        # Hash password before storing
        if 'password' in data:
            data['password'] = hash_password(data['password'])
        
        try:
            cursor.execute("""
                INSERT INTO customers (customer_id, first_name, last_name, username, password, email, address)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                data['customer_id'],
                data['first_name'],
                data['last_name'],
                data['username'],
                data['password'],
                data['email'],
                data['address']
            ))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Customer created successfully'}), 201
        except Exception as e:
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 400

@app.route('/api/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('DELETE FROM customers WHERE customer_id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Customer deleted successfully'})
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 400

# Products API
@app.route('/api/products', methods=['GET', 'POST'])
def products():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute('SELECT * FROM products ORDER BY product_id')
        products = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(products)
    
    elif request.method == 'POST':
        data = request.get_json()
        
        try:
            cursor.execute("""
                INSERT INTO products (product_id, product_name, description, price, quantity_available, supplier_id)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                data['product_id'],
                data['product_name'],
                data['description'],
                data['price'],
                data['quantity_available'],
                data['supplier_id']
            ))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Product created successfully'}), 201
        except Exception as e:
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 400

@app.route('/api/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('DELETE FROM products WHERE product_id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Product deleted successfully'})
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 400

# Promotions API
@app.route('/api/promotions', methods=['GET', 'POST'])
def promotions():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute('SELECT * FROM promotions ORDER BY promotion_id')
        promotions = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(promotions)
    
    elif request.method == 'POST':
        data = request.get_json()
        
        try:
            cursor.execute("""
                INSERT INTO promotions (promotion_id, promotion_name, description, start_date, end_date, discount_percentage)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                data['promotion_id'],
                data['promotion_name'],
                data['description'],
                data['start_date'],
                data['end_date'],
                data['discount_percentage']
            ))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Promotion created successfully'}), 201
        except Exception as e:
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 400

@app.route('/api/promotions/<int:id>', methods=['DELETE'])
def delete_promotion(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('DELETE FROM promotions WHERE promotion_id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Promotion deleted successfully'})
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 400

# Sales API
@app.route('/api/sales', methods=['GET', 'POST'])
def sales():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute("""
            SELECT s.*, 
                   json_agg(
                       json_build_object(
                           'sale_item_id', si.sale_item_id,
                           'product_id', si.product_id,
                           'quantity', si.quantity,
                           'unit_price', si.unit_price,
                           'subtotal', si.subtotal
                       )
                   ) as sale_items
            FROM sales s
            LEFT JOIN sale_items si ON s.sale_id = si.sale_id
            GROUP BY s.sale_id
            ORDER BY s.sale_id
        """)
        sales = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(sales)
    
    elif request.method == 'POST':
        data = request.get_json()
        
        try:
            cursor.execute("""
                INSERT INTO sales (sale_id, customer_id, employee_id, sale_date, total_amount)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                data['sale_id'],
                data['customer_id'],
                data['employee_id'],
                data['sale_date'],
                0.00  # Initial total amount
            ))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Sale created successfully'}), 201
        except Exception as e:
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 400

@app.route('/api/sales/<int:id>', methods=['DELETE'])
def delete_sale(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('DELETE FROM sales WHERE sale_id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Sale deleted successfully'})
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 400

# Sale Items API
@app.route('/api/sale-items', methods=['POST'])
def sale_items():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'POST':
        data = request.get_json()
        
        try:
            # Calculate subtotal
            subtotal = data['quantity'] * data['unit_price']
            
            cursor.execute("""
                INSERT INTO sale_items (sale_item_id, sale_id, product_id, quantity, unit_price, subtotal)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                data['sale_item_id'],
                data['sale_id'],
                data['product_id'],
                data['quantity'],
                data['unit_price'],
                subtotal
            ))
            
            # Update sale total amount
            cursor.execute("""
                UPDATE sales 
                SET total_amount = total_amount + %s
                WHERE sale_id = %s
            """, (subtotal, data['sale_id']))
            
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Sale item added successfully'}), 201
        except Exception as e:
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 400

# Admins API
@app.route('/api/admins', methods=['GET', 'POST'])
def admins():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    if request.method == 'GET':
        cursor.execute('SELECT * FROM admins ORDER BY admin_id')
        admins = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(admins)
    
    elif request.method == 'POST':
        data = request.get_json()
        
        # Hash password before storing
        if 'password' in data:
            data['password'] = hash_password(data['password'])
        
        try:
            cursor.execute("""
                INSERT INTO admins (admin_id, username, password, email, employee_id)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                data['admin_id'],
                data['username'],
                data['password'],
                data['email'],
                data['employee_id']
            ))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Admin created successfully'}), 201
        except Exception as error:
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 400

@app.route('/api/admins/<int:id>', methods=['DELETE'])
def delete_admin(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('DELETE FROM admins WHERE admin_id = %s', (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Admin deleted successfully'})
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 400

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)