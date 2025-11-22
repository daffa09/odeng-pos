<!-- portfolio -->
<!-- slug: odeng-pos -->
<!-- title: Odeng POS System -->
<!-- description: Point of Sale system built with Laravel 10 featuring product management, order processing, and customer tracking -->
<!-- image: https://raw.githubusercontent.com/angkosal/laravel-pos/master/screenshots/pos.png -->
<!-- tags: laravel, pos-system, php, mysql, tailwind, vite, point-of-sale -->

<p align="center">
    <h1 align="center">POS System Using Laravel</h1>
</p>

A comprehensive Point of Sale (POS) system built with Laravel 10, designed for retail businesses to manage products, process orders, and track customers efficiently. Features a modern interface with real-time inventory management and detailed reporting capabilities.

## 📋 Overview

This POS (Point of Sale) system provides a complete solution for retail stores, restaurants, and small businesses to manage their daily operations. Built with Laravel 10 and modern frontend tools, it offers an intuitive interface for quick order processing, inventory management, and customer relationship management.

## ✨ Features

### Order Management
- **Quick POS Interface**: Fast product selection and checkout
- **Real-time Cart**: Dynamic cart with quantity adjustments
- **Multiple Payment Methods**: Cash, card, and digital payments
- **Order History**: Complete transaction records
- **Receipt Printing**: Generate printable receipts

### Product Management
- **Product CRUD**: Complete product lifecycle management
- **Categories**: Organize products by categories
- **Inventory Tracking**: Real-time stock level monitoring
- **Barcode Support**: Quick product lookup
- **Product Images**: Visual product identification
- **Price Management**: Flexible pricing options

### Customer Management
- **Customer Database**: Maintain customer information
- **Purchase History**: Track customer transactions
- **Loyalty Points** (if implemented): Reward regular customers
- **Customer Search**: Quick customer lookup

### Reporting & Analytics
- **Sales Reports**: Daily, weekly, monthly sales summaries
- **Product Performance**: Best-selling products
- **Revenue Analytics**: Income tracking and trends
- **Inventory Reports**: Stock levels and movements

### User Management
- **Role-based Access**: Admin and cashier roles
- **User Authentication**: Secure login system
- **Activity Logs**: Track user actions
- **Multi-user Support**: Multiple cashiers simultaneously

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Laravel 10** | Backend framework |
| **PHP 8.1+** | Server-side language |
| **MySQL** | Database management |
| **Tailwind CSS** | Modern styling framework |
| **Alpine.js** | Lightweight JavaScript framework |
| **Vite** | Asset bundling and HMR |
| **Livewire** (if used) | Dynamic interfaces |

## 📁 Project Structure

```
odeng-pos/
├── app/
│   ├── Http/Controllers/      # Request handlers
│   ├── Models/                # Eloquent models
│   └── Services/              # Business logic
├── database/
│   ├── migrations/            # Database schema
│   └── seeders/              # Sample data
├── resources/
│   ├── views/                # Blade templates
│   ├── js/                   # JavaScript files
│   └── css/                  # Stylesheets
├── public/                   # Public assets
├── routes/
│   └── web.php              # Application routes
└── storage/                  # Uploaded files
```

## 🚀 Getting Started

### System Requirements

For detailed system requirements, check [Laravel 10 Server Requirements](https://laravel.com/docs/10.x/deployment#server-requirements):

- PHP >= 8.1
- MySQL >= 5.7
- Composer
- Node.js & NPM
- Web server (Apache/Nginx)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/angkosal/laravel-pos.git YourDirectoryName
   ```
   
   Replace `YourDirectoryName` with your preferred folder name.

2. **Navigate to Project Directory**
   ```bash
   cd YourDirectoryName
   ```

3. **Install PHP Dependencies**
   
   Laravel uses [Composer](https://getcomposer.org/) for dependency management:
   ```bash
   composer install
   ```

4. **Environment Configuration**
   
   Rename or copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Then:
   - Generate application key:
     ```bash
     php artisan key:generate
     ```
   
   - Set database credentials in `.env`:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=your_database_name
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     ```
   
   - Set your `APP_URL`:
     ```env
     APP_URL=http://localhost:8000
     ```

5. **Database Setup**
   
   Run migrations to create database tables:
   ```bash
   php artisan migrate
   ```
   
   Seed the database with initial data and admin user:
   ```bash
   php artisan db:seed
   ```
   
   **Default Admin Credentials:**
   - Email: `admin@gmail.com`
   - Password: `admin123`

6. **Install Node Dependencies**
   ```bash
   npm install
   ```
   
   Build assets:
   -  For development:
     ```bash
     npm run dev
     ```
   
   - For production:
     ```bash
     npm run build
     ```

7. **Create Storage Link**
   
   Link public storage for file uploads:
   ```bash
   php artisan storage:link
   ```

8. **Run the Application**
   ```bash
   php artisan serve
   ```
   
   Or use Laravel Homestead/Valet for local development.

9. **Access the System**
   
   Open your browser and visit:
   ```
   http://localhost:8000
   ```
   
   Login with admin credentials:
   - Email: `admin@gmail.com`
   - Password: `admin123`

## 💻 Usage Guide

### Login
1. Navigate to the application URL
2. Enter admin credentials
3. Access the dashboard

### Processing Orders (POS Interface)
1. Click "New Order" or "POS" menu
2. Select products by searching or browsing
3. Add items to cart
4. Adjust quantities if needed
5. Select customer (optional)
6. Choose payment method
7. Complete transaction
8. Print receipt

### Managing Products
1. Go to "Products" menu
2. Click "Add Product" for new items
3. Enter product details:
   - Name
   - SKU/Barcode
   - Category
   - Price
   - Stock quantity
   - Image
4. Save product

### Managing Customers
1. Navigate to "Customers"
2. Add new customer with details
3. View customer purchase history
4. Edit customer information

### Viewing Reports
1. Access "Reports" dashboard
2. Select report type
3. Choose date range
4. Generate and export reports

## 📸 Screenshots

### Product List
![Product list](https://raw.githubusercontent.com/angkosal/laravel-pos/master/screenshots/products_list.png)

Comprehensive product management interface with search, filter, and bulk actions.

### POS Interface (Create Order)
![Create order](https://raw.githubusercontent.com/angkosal/laravel-pos/master/screenshots/pos.png)

Quick and intuitive point-of-sale interface for fast checkout.

### Order List
![Order list](https://raw.githubusercontent.com/angkosal/laravel-pos/master/screenshots/order_list.png)

Complete order history with status tracking and search capabilities.

### Customer List
![Customer list](https://raw.githubusercontent.com/angkosal/laravel-pos/master/screenshots/customer_list.png)

Customer database management with purchase history.

## 🗄️ Database Schema

### Key Tables

**products**
- id, name, sku, category_id
- price, cost, stock
- image, description
- created_at, updated_at

**orders**
- id, order_number, customer_id
- total_amount, payment_method
- status, created_at

**order_items**
- id, order_id, product_id
- quantity, price, subtotal

**customers**
- id, name, email, phone
- address, created_at

## 🔒 Security Features

- Authentication and authorization
- CSRF protection
- SQL injection prevention
- XSS protection
- Password hashing (BCrypt)
- Secure session management

## 🐛 Troubleshooting

**Installation Issues**
- Ensure PHP version >= 8.1
- Check Composer is installed
- Verify database credentials

**Assets Not Loading**
- Run `npm run build`
- Clear cache: `php artisan cache:clear`
- Check file permissions

**Database Errors**
- Verify `.env` database settings
- Ensure database exists
- Check user permissions

## 🚀 Deployment

### Production Deployment

1. **Optimize Application**
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   npm run build
   ```

2. **Set Environment**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

3. **Configure Web Server**
   - Point document root to `public/` folder
   - Enable mod_rewrite (Apache)
   - Configure PHP-FPM (Nginx)

## 📚 Resources

- [Laravel Documentation](https://laravel.com/docs/10.x)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is open source. Please check the repository for license details.

## 🙏 Acknowledgments

Special thanks to all contributors and the Laravel community for making this project possible.

## 💡 Support

If you find this project helpful, consider supporting the development!

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/angkosal)

---

**Built with Laravel** 🛒💳  
A Complete Point of Sale Solution for Modern Businesses!
