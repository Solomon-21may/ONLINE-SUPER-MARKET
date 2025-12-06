# Online Supermarket System

A full-stack web application for managing an online supermarket system with PostgreSQL database backend.

## Features

- **Supplier Management**: Add, view, and delete suppliers
- **Department Management**: Manage supermarket departments
- **Employee Management**: Employee records with department assignment
- **Customer Management**: Customer registration and management
- **Product Management**: Product catalog with inventory tracking
- **Promotion Management**: Create and manage promotional campaigns
- **Sales Management**: Process sales transactions with itemized receipts
- **Admin Management**: System administrator accounts

## Technology Stack

### Frontend
- HTML5
- CSS3 (with responsive design)
- Vanilla JavaScript (ES6+)

### Backend
- Python 3.x
- Flask (REST API framework)
- PostgreSQL (Relational database)
- psycopg2 (PostgreSQL adapter)

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

### Step 1: Database Setup

1. Install PostgreSQL and create a database:
```bash
sudo -u postgres psql
CREATE DATABASE supermarket_db;
CREATE USER supermarket_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE supermarket_db TO supermarket_user;
\q