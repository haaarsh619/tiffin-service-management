Tiffin Service Management
Overview
The Tiffin Service Management API is a backend application built with NestJS and SQLite to manage a single-user tiffin service. It handles user management, menu creation, order placement, monthly payment tracking, and PDF invoice generation. The API is designed for simplicity, with automatic payment creation on order placement and Swagger documentation for easy testing.
Features

User Management: Create and retrieve user details (name, contact).
Menu Management: Add and view menu items with prices.
Order Management: Place orders with user ID, menu ID, and date; price is auto-fetched from the menu.
Payment Tracking: Automatically creates/updates monthly payments when orders are placed, with support for updating paid amounts and methods (e.g., Cash, UPI).
Invoice Generation: Generates PDF invoices with user details, total amount, paid amount, and due amount for a given month.
Swagger Documentation: Interactive API docs at /api for testing endpoints.


API Endpoints
All endpoints are documented via Swagger at http://localhost:3000/api. Key endpoints include:

Users:
POST /users: Create a user (e.g., { "name": "John Doe", "contact": "1234567890" }).
GET /users: List all users.


Menus:
POST /menu: Create a menu item (e.g., { "name": "Standard Meal", "price": 50 }).
GET /menu: List all menu items.


Orders:
POST /orders: Create an order (e.g., { "userId": 1, "menuId": 1, "date": "2025-05-01" }). Auto-creates/updates monthly payment.
GET /orders: List orders, filter by userId or date.


Payments:
POST /payments: Create a payment manually.
PATCH /payments/:id: Update payment (e.g., { "paidAmount": 200, "paymentMethod": "Cash" }).
GET /payments: List payments, filter by userId or month (e.g., ?userId=1&month=2025-05).


Invoices:
POST /invoices: Create an invoice manually.
GET /invoices/:userId/:month: Download a PDF invoice (e.g., /invoices/1/2025-05).


Dependencies

NestJS: Framework for building the API.
TypeORM: ORM for SQLite database.
pdfkit: Generates PDF invoices.
@nestjs/swagger: Auto-generates API documentation.
class-validator: Validates DTOs.
See package.json for full list.

Project Structure
tiffin-service-management/
└── backend/
    ├── src/
    │   ├── entities/          # TypeORM entities (User, Menu, Order, Payment, Invoice)
    │   ├── users/             # User module (controller, service, DTOs)
    │   ├── menu/              # Menu module
    │   ├── orders/            # Orders module
    │   ├── payments/          # Payments module
    │   ├── invoices/          # Invoices module
    │   ├── app.module.ts      # Root module
    │   ├── main.ts            # Entry point with Swagger setup
    │   └── .env               # Environment variables
    ├── tiffin_service.db      # SQLite database
    └── package.json


License
MIT License. See LICENSE for details.
