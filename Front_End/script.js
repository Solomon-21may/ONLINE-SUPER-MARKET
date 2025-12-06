// API Base URL - Change this to your backend URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper Functions
function showForm(formId) {
    document.getElementById(formId).style.display = 'block';
}

function hideForm(formId) {
    document.getElementById(formId).style.display = 'none';
}

function clearList(listId) {
    document.getElementById(listId).innerHTML = '';
}

function displayMessage(message, type = 'success') {
    // Remove any existing message
    const existingMsg = document.querySelector('.message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of container
    const container = document.querySelector('.container');
    const firstChild = container.firstChild;
    container.insertBefore(messageDiv, firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function showLoading(listId) {
    const listDiv = document.getElementById(listId);
    listDiv.innerHTML = '<div class="loading">Loading...</div>';
}

// API Functions
async function makeRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        displayMessage(`Error: ${error.message}`, 'error');
        throw error;
    }
}

// Supplier Functions
function showAddSupplierForm() {
    showForm('addSupplierForm');
    clearList('supplierList');
}

async function submitAddSupplier() {
    const supplierData = {
        supplier_id: parseInt(document.getElementById('supplierId').value),
        supplier_name: document.getElementById('supplierName').value,
        contact_person: document.getElementById('contactPerson').value,
        address: document.getElementById('supplierAddress').value,
        phone_number: document.getElementById('supplierPhone').value,
        email: document.getElementById('supplierEmail').value,
        password: document.getElementById('supplierPassword').value
    };

    if (!supplierData.supplier_id || !supplierData.supplier_name || !supplierData.contact_person) {
        displayMessage("Please fill all required supplier fields.", "error");
        return;
    }

    try {
        await makeRequest('suppliers', 'POST', supplierData);
        displayMessage("Supplier added successfully!");
        hideForm('addSupplierForm');
        viewAllSuppliers();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

async function viewAllSuppliers() {
    hideForm('addSupplierForm');
    showLoading('supplierList');
    
    try {
        const suppliers = await makeRequest('suppliers');
        displaySuppliers(suppliers);
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

function displaySuppliers(suppliers) {
    const supplierListDiv = document.getElementById('supplierList');
    clearList('supplierList');
    
    if (suppliers.length === 0) {
        supplierListDiv.innerHTML = "<div class='list-item'><p>No suppliers available.</p></div>";
        return;
    }
    
    suppliers.forEach(supplier => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('list-item');
        itemDiv.innerHTML = `
            <p><strong>ID:</strong> ${supplier.supplier_id}</p>
            <p><strong>Name:</strong> ${supplier.supplier_name}</p>
            <p><strong>Contact:</strong> ${supplier.contact_person}</p>
            <p><strong>Address:</strong> ${supplier.address}</p>
            <p><strong>Phone:</strong> ${supplier.phone_number}</p>
            <p><strong>Email:</strong> ${supplier.email}</p>
            <button class="delete-btn" onclick="deleteSupplier(${supplier.supplier_id})">Delete</button>
        `;
        supplierListDiv.appendChild(itemDiv);
    });
}

async function deleteSupplier(id) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
        await makeRequest(`suppliers/${id}`, 'DELETE');
        displayMessage("Supplier deleted successfully!");
        viewAllSuppliers();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

// Department Functions
function showAddDepartmentForm() {
    showForm('addDepartmentForm');
    clearList('departmentList');
}

async function submitAddDepartment() {
    const departmentData = {
        department_id: parseInt(document.getElementById('departmentId').value),
        department_name: document.getElementById('departmentName').value,
        location: document.getElementById('departmentLocation').value
    };

    if (!departmentData.department_id || !departmentData.department_name || !departmentData.location) {
        displayMessage("Please fill all department fields.", "error");
        return;
    }

    try {
        await makeRequest('departments', 'POST', departmentData);
        displayMessage("Department added successfully!");
        hideForm('addDepartmentForm');
        viewAllDepartments();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

async function viewAllDepartments() {
    hideForm('addDepartmentForm');
    showLoading('departmentList');
    
    try {
        const departments = await makeRequest('departments');
        displayDepartments(departments);
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

function displayDepartments(departments) {
    const departmentListDiv = document.getElementById('departmentList');
    clearList('departmentList');
    
    if (departments.length === 0) {
        departmentListDiv.innerHTML = "<div class='list-item'><p>No departments available.</p></div>";
        return;
    }
    
    departments.forEach(dept => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('list-item');
        itemDiv.innerHTML = `
            <p><strong>ID:</strong> ${dept.department_id}</p>
            <p><strong>Name:</strong> ${dept.department_name}</p>
            <p><strong>Location:</strong> ${dept.location}</p>
            <button class="delete-btn" onclick="deleteDepartment(${dept.department_id})">Delete</button>
        `;
        departmentListDiv.appendChild(itemDiv);
    });
}

async function deleteDepartment(id) {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    try {
        await makeRequest(`departments/${id}`, 'DELETE');
        displayMessage("Department deleted successfully!");
        viewAllDepartments();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

// Employee Functions
function showAddEmployeeForm() {
    showForm('addEmployeeForm');
    clearList('employeeList');
}

async function submitAddEmployee() {
    const employeeData = {
        employee_id: parseInt(document.getElementById('employeeId').value),
        first_name: document.getElementById('employeeFirstName').value,
        last_name: document.getElementById('employeeLastName').value,
        department_id: parseInt(document.getElementById('employeeDepartmentId').value),
        username: document.getElementById('employeeUsername').value,
        password: document.getElementById('employeePassword').value,
        email: document.getElementById('employeeEmail').value,
        phone_number: document.getElementById('employeePhoneNumber').value,
        hire_date: document.getElementById('employeeHireDate').value
    };

    if (!employeeData.employee_id || !employeeData.first_name || !employeeData.last_name) {
        displayMessage("Please fill all required employee fields.", "error");
        return;
    }

    try {
        await makeRequest('employees', 'POST', employeeData);
        displayMessage("Employee added successfully!");
        hideForm('addEmployeeForm');
        viewAllEmployees();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

async function viewAllEmployees() {
    hideForm('addEmployeeForm');
    showLoading('employeeList');
    
    try {
        const employees = await makeRequest('employees');
        displayEmployees(employees);
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

function displayEmployees(employees) {
    const employeeListDiv = document.getElementById('employeeList');
    clearList('employeeList');
    
    if (employees.length === 0) {
        employeeListDiv.innerHTML = "<div class='list-item'><p>No employees available.</p></div>";
        return;
    }
    
    employees.forEach(employee => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('list-item');
        itemDiv.innerHTML = `
            <p><strong>ID:</strong> ${employee.employee_id}</p>
            <p><strong>Name:</strong> ${employee.first_name} ${employee.last_name}</p>
            <p><strong>Department ID:</strong> ${employee.department_id}</p>
            <p><strong>Username:</strong> ${employee.username}</p>
            <p><strong>Email:</strong> ${employee.email}</p>
            <p><strong>Phone:</strong> ${employee.phone_number}</p>
            <p><strong>Hire Date:</strong> ${employee.hire_date}</p>
            <button class="delete-btn" onclick="deleteEmployee(${employee.employee_id})">Delete</button>
        `;
        employeeListDiv.appendChild(itemDiv);
    });
}

async function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
        await makeRequest(`employees/${id}`, 'DELETE');
        displayMessage("Employee deleted successfully!");
        viewAllEmployees();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

// Customer Functions
function showAddCustomerForm() {
    showForm('addCustomerForm');
    clearList('customerList');
}

async function submitAddCustomer() {
    const customerData = {
        customer_id: parseInt(document.getElementById('customerId').value),
        first_name: document.getElementById('customerFirstName').value,
        last_name: document.getElementById('customerLastName').value,
        username: document.getElementById('customerUsername').value,
        password: document.getElementById('customerPassword').value,
        email: document.getElementById('customerEmail').value,
        address: document.getElementById('customerAddress').value
    };

    if (!customerData.customer_id || !customerData.first_name || !customerData.last_name) {
        displayMessage("Please fill all required customer fields.", "error");
        return;
    }

    try {
        await makeRequest('customers', 'POST', customerData);
        displayMessage("Customer added successfully!");
        hideForm('addCustomerForm');
        viewAllCustomers();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

async function viewAllCustomers() {
    hideForm('addCustomerForm');
    showLoading('customerList');
    
    try {
        const customers = await makeRequest('customers');
        displayCustomers(customers);
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

function displayCustomers(customers) {
    const customerListDiv = document.getElementById('customerList');
    clearList('customerList');
    
    if (customers.length === 0) {
        customerListDiv.innerHTML = "<div class='list-item'><p>No customers available.</p></div>";
        return;
    }
    
    customers.forEach(customer => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('list-item');
        itemDiv.innerHTML = `
            <p><strong>ID:</strong> ${customer.customer_id}</p>
            <p><strong>Name:</strong> ${customer.first_name} ${customer.last_name}</p>
            <p><strong>Username:</strong> ${customer.username}</p>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Address:</strong> ${customer.address}</p>
            <button class="delete-btn" onclick="deleteCustomer(${customer.customer_id})">Delete</button>
        `;
        customerListDiv.appendChild(itemDiv);
    });
}

async function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
        await makeRequest(`customers/${id}`, 'DELETE');
        displayMessage("Customer deleted successfully!");
        viewAllCustomers();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

// Product Functions
function showAddProductForm() {
    showForm('addProductForm');
    clearList('productList');
}

async function submitAddProduct() {
    const productData = {
        product_id: parseInt(document.getElementById('productId').value),
        product_name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        quantity_available: parseInt(document.getElementById('productQuantity').value),
        supplier_id: parseInt(document.getElementById('productSupplierId').value)
    };

    if (!productData.product_id || !productData.product_name || isNaN(productData.price)) {
        displayMessage("Please fill all required product fields correctly.", "error");
        return;
    }

    try {
        await makeRequest('products', 'POST', productData);
        displayMessage("Product added successfully!");
        hideForm('addProductForm');
        viewAllProducts();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

async function viewAllProducts() {
    hideForm('addProductForm');
    showLoading('productList');
    
    try {
        const products = await makeRequest('products');
        displayProducts(products);
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

function displayProducts(products) {
    const productListDiv = document.getElementById('productList');
    clearList('productList');
    
    if (products.length === 0) {
        productListDiv.innerHTML = "<div class='list-item'><p>No products available.</p></div>";
        return;
    }
    
    products.forEach(product => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('list-item');
        itemDiv.innerHTML = `
            <p><strong>ID:</strong> ${product.product_id}</p>
            <p><strong>Name:</strong> ${product.product_name}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
            <p><strong>Quantity:</strong> ${product.quantity_available}</p>
            <p><strong>Supplier ID:</strong> ${product.supplier_id}</p>
            <button class="delete-btn" onclick="deleteProduct(${product.product_id})">Delete</button>
        `;
        productListDiv.appendChild(itemDiv);
    });
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        await makeRequest(`products/${id}`, 'DELETE');
        displayMessage("Product deleted successfully!");
        viewAllProducts();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

// Promotion Functions
function showAddPromotionForm() {
    showForm('addPromotionForm');
    clearList('promotionList');
}

async function submitAddPromotion() {
    const promotionData = {
        promotion_id: parseInt(document.getElementById('promotionId').value),
        promotion_name: document.getElementById('promotionName').value,
        description: document.getElementById('promotionDescription').value,
        start_date: document.getElementById('promotionStartDate').value,
        end_date: document.getElementById('promotionEndDate').value,
        discount_percentage: parseFloat(document.getElementById('promotionDiscountPercentage').value)
    };

    if (!promotionData.promotion_id || !promotionData.promotion_name || !promotionData.start_date) {
        displayMessage("Please fill all required promotion fields correctly.", "error");
        return;
    }

    try {
        await makeRequest('promotions', 'POST', promotionData);
        displayMessage("Promotion added successfully!");
        hideForm('addPromotionForm');
        viewAllPromotions();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

async function viewAllPromotions() {
    hideForm('addPromotionForm');
    showLoading('promotionList');
    
    try {
        const promotions = await makeRequest('promotions');
        displayPromotions(promotions);
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

function displayPromotions(promotions) {
    const promotionListDiv = document.getElementById('promotionList');
    clearList('promotionList');
    
    if (promotions.length === 0) {
        promotionListDiv.innerHTML = "<div class='list-item'><p>No promotions available.</p></div>";
        return;
    }
    
    promotions.forEach(promotion => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('list-item');
        itemDiv.innerHTML = `
            <p><strong>ID:</strong> ${promotion.promotion_id}</p>
            <p><strong>Name:</strong> ${promotion.promotion_name}</p>
            <p><strong>Description:</strong> ${promotion.description}</p>
            <p><strong>Start Date:</strong> ${promotion.start_date}</p>
            <p><strong>End Date:</strong> ${promotion.end_date}</p>
            <p><strong>Discount:</strong> ${promotion.discount_percentage}%</p>
            <button class="delete-btn" onclick="deletePromotion(${promotion.promotion_id})">Delete</button>
        `;
        promotionListDiv.appendChild(itemDiv);
    });
}

async function deletePromotion(id) {
    if (!confirm('Are you sure you want to delete this promotion?')) return;
    
    try {
        await makeRequest(`promotions/${id}`, 'DELETE');
        displayMessage("Promotion deleted successfully!");
        viewAllPromotions();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

// Sales Functions
let currentActiveSale = null;

function showAddSaleForm() {
    showForm('addSaleForm');
    hideForm('addSaleItemForm');
    clearList('saleList');
    currentActiveSale = null;
    
    document.getElementById('saleId').value = '';
    document.getElementById('saleCustomerId').value = '';
    document.getElementById('saleEmployeeId').value = '';
    document.getElementById('saleDate').value = '';
}

async function submitAddSale() {
    const saleData = {
        sale_id: parseInt(document.getElementById('saleId').value),
        customer_id: parseInt(document.getElementById('saleCustomerId').value),
        employee_id: document.getElementById('saleEmployeeId').value ? 
                     parseInt(document.getElementById('saleEmployeeId').value) : null,
        sale_date: document.getElementById('saleDate').value
    };

    if (!saleData.sale_id || !saleData.customer_id || !saleData.sale_date) {
        displayMessage("Please fill in Sale ID, Customer ID, and Sale Date.", "error");
        return;
    }

    try {
        await makeRequest('sales', 'POST', saleData);
        
        currentActiveSale = {
            sale_id: saleData.sale_id,
            customer_id: saleData.customer_id,
            employee_id: saleData.employee_id,
            sale_date: saleData.sale_date,
            total_amount: 0.0,
            sale_items: []
        };
        
        displayMessage("Sale initiated. Now add items!");
        hideForm('addSaleForm');
        showForm('addSaleItemForm');
        document.getElementById('currentSaleId').textContent = currentActiveSale.sale_id;
        
        document.getElementById('saleItemId').value = '';
        document.getElementById('saleItemProductId').value = '';
        document.getElementById('saleItemQuantity').value = '';
        document.getElementById('saleItemUnitPrice').value = '';
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

async function submitAddSaleItem() {
    if (!currentActiveSale) {
        displayMessage("Please initiate a sale first.", "error");
        return;
    }

    const saleItemData = {
        sale_item_id: parseInt(document.getElementById('saleItemId').value),
        sale_id: currentActiveSale.sale_id,
        product_id: parseInt(document.getElementById('saleItemProductId').value),
        quantity: parseInt(document.getElementById('saleItemQuantity').value),
        unit_price: parseFloat(document.getElementById('saleItemUnitPrice').value)
    };

    if (!saleItemData.sale_item_id || !saleItemData.product_id || isNaN(saleItemData.quantity) || 
        isNaN(saleItemData.unit_price) || saleItemData.quantity <= 0 || saleItemData.unit_price <= 0) {
        displayMessage("Please fill all sale item fields correctly and ensure quantity/price are positive.", "error");
        return;
    }

    try {
        await makeRequest('sale-items', 'POST', saleItemData);
        
        const subtotal = saleItemData.quantity * saleItemData.unit_price;
        saleItemData.subtotal = subtotal;
        
        currentActiveSale.sale_items.push(saleItemData);
        currentActiveSale.total_amount += subtotal;
        
        displayMessage(`Item added: ${saleItemData.quantity} x Product ID ${saleItemData.product_id}. Subtotal: $${subtotal.toFixed(2)}`);
        
        document.getElementById('saleItemId').value = '';
        document.getElementById('saleItemProductId').value = '';
        document.getElementById('saleItemQuantity').value = '';
        document.getElementById('saleItemUnitPrice').value = '';
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

function finishSale() {
    if (currentActiveSale && currentActiveSale.sale_items.length > 0) {
        displayMessage(`Sale ${currentActiveSale.sale_id} completed! Total Amount: $${currentActiveSale.total_amount.toFixed(2)}`);
        currentActiveSale = null;
        hideForm('addSaleItemForm');
        hideForm('addSaleForm');
        viewAllSales();
    } else if (currentActiveSale && currentActiveSale.sale_items.length === 0) {
        displayMessage("Sale initiated but no items were added. Sale cancelled.", "error");
        currentActiveSale = null;
        hideForm('addSaleItemForm');
        hideForm('addSaleForm');
        viewAllSales();
    } else {
        displayMessage("No active sale to finish.", "error");
    }
}

async function viewAllSales() {
    hideForm('addSaleForm');
    hideForm('addSaleItemForm');
    showLoading('saleList');
    
    try {
        const sales = await makeRequest('sales');
        displaySales(sales);
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

function displaySales(sales) {
    const saleListDiv = document.getElementById('saleList');
    clearList('saleList');
    
    if (sales.length === 0) {
        saleListDiv.innerHTML = "<div class='list-item'><p>No sales available.</p></div>";
        return;
    }
    
    sales.forEach(sale => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('list-item');
        let saleItemsHtml = '';
        
        if (sale.sale_items && sale.sale_items.length > 0) {
            saleItemsHtml = sale.sale_items.map(item => `
                <div style="margin-left: 20px; padding: 10px; background: #f8f9fa; margin-bottom: 5px; border-radius: 4px;">
                    <p><strong>Item ID:</strong> ${item.sale_item_id}</p>
                    <p><strong>Product ID:</strong> ${item.product_id}</p>
                    <p><strong>Quantity:</strong> ${item.quantity}</p>
                    <p><strong>Unit Price:</strong> $${item.unit_price.toFixed(2)}</p>
                    <p><strong>Subtotal:</strong> $${item.subtotal.toFixed(2)}</p>
                </div>
            `).join('');
        }

        itemDiv.innerHTML = `
            <p><strong>Sale ID:</strong> ${sale.sale_id}</p>
            <p><strong>Customer ID:</strong> ${sale.customer_id}</p>
            <p><strong>Employee ID:</strong> ${sale.employee_id !== null ? sale.employee_id : 'NULL'}</p>
            <p><strong>Sale Date:</strong> ${sale.sale_date}</p>
            <p><strong>Total Amount:</strong> $${sale.total_amount ? sale.total_amount.toFixed(2) : '0.00'}</p>
            <h4>Sale Items:</h4>
            ${sale.sale_items && sale.sale_items.length > 0 ? saleItemsHtml : '<p style="margin-left: 20px;">No items in this sale.</p>'}
            <button class="delete-btn" onclick="deleteSale(${sale.sale_id})">Delete</button>
        `;
        saleListDiv.appendChild(itemDiv);
    });
}

async function deleteSale(id) {
    if (!confirm('Are you sure you want to delete this sale?')) return;
    
    try {
        await makeRequest(`sales/${id}`, 'DELETE');
        displayMessage("Sale deleted successfully!");
        viewAllSales();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

// Admin Functions
function showAddAdminForm() {
    showForm('addAdminForm');
    clearList('adminList');
}

async function submitAddAdmin() {
    const adminData = {
        admin_id: parseInt(document.getElementById('adminId').value),
        username: document.getElementById('adminUsername').value,
        password: document.getElementById('adminPassword').value,
        email: document.getElementById('adminEmail').value,
        employee_id: document.getElementById('adminEmployeeId').value ? 
                    parseInt(document.getElementById('adminEmployeeId').value) : null
    };

    if (!adminData.admin_id || !adminData.username || !adminData.password || !adminData.email) {
        displayMessage("Please fill all admin fields correctly.", "error");
        return;
    }

    try {
        await makeRequest('admins', 'POST', adminData);
        displayMessage("Admin added successfully!");
        hideForm('addAdminForm');
        viewAllAdmins();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

async function viewAllAdmins() {
    hideForm('addAdminForm');
    showLoading('adminList');
    
    try {
        const admins = await makeRequest('admins');
        displayAdmins(admins);
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}

function displayAdmins(admins) {
    const adminListDiv = document.getElementById('adminList');
    clearList('adminList');
    
    if (admins.length === 0) {
        adminListDiv.innerHTML = "<div class='list-item'><p>No admins available.</p></div>";
        return;
    }
    
    admins.forEach(admin => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('list-item');
        itemDiv.innerHTML = `
            <p><strong>Admin ID:</strong> ${admin.admin_id}</p>
            <p><strong>Username:</strong> ${admin.username}</p>
            <p><strong>Email:</strong> ${admin.email}</p>
            <p><strong>Employee ID:</strong> ${admin.employee_id !== null ? admin.employee_id : 'NULL'}</p>
            <button class="delete-btn" onclick="deleteAdmin(${admin.admin_id})">Delete</button>
        `;
        adminListDiv.appendChild(itemDiv);
    });
}

async function deleteAdmin(id) {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    
    try {
        await makeRequest(`admins/${id}`, 'DELETE');
        displayMessage("Admin deleted successfully!");
        viewAllAdmins();
    } catch (error) {
        // Error is already displayed by makeRequest
    }
}