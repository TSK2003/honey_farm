# Kamala Honey Farm — Production Ecommerce Platform

Official D2C Ecommerce Application for **Kamala Honey Farm**, Tirunelveli, Tamil Nadu, India.

---

## 🍯 Brand Information

- **Business Name**: Kamala Honey Farm
- **Brand**: KAMALA
- **Tagline**: NATURAL HONEY FARM
- **Location**: Tirunelveli, Tamil Nadu, India
- **Phone / WhatsApp**: +91 7708510872
- **Instagram**: [https://www.instagram.com/kamala_honey_farm_tirunelveli](https://www.instagram.com/kamala_honey_farm_tirunelveli)

---

## 🚀 Technology Stack

- **Frontend**: React, JavaScript (ES6+), HTML5, Plain CSS3 (Design Tokens, HSL colors, Inter typography)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3 (`better-sqlite3` with WAL mode & foreign keys enabled)
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **Build Tool**: Vite

---

## 🔐 Admin Credentials

To access the real ecommerce management panel:

- **Admin Login URL**: `/admin/login`
- **Email**: `admin@kamalahoney.com`
- **Password**: `KamalaAdmin@2026`

---

## 🛠️ How to Run Locally

### Prerequisites
- Node.js (v18+)

### 1. Install & Build Client
```bash
cd client
npm install
npm run build
```

### 2. Install & Start Server
```bash
cd server
npm install
node server.js
```

The application will be running live on:
- **Unified Express Production Build**: `http://localhost:5000`
- **Frontend Vite Dev Server**: `http://localhost:5173` (with proxy to port 5000)

---

## ✨ Features & Capabilities

### Customer Storefront
1. **Homepage**: Exact 14-section hierarchy:
   - Compact Header with logo, navigation links, search, wishlist & cart
   - Hero section featuring premium honey jar photography, tagline & CTAs
   - Trust/USP Strip (Naturally Sourced, Farm Direct, Quality Focused, Tirunelveli Origin)
   - Featured Honey Products grid
   - Honey Product Collections
   - Why Choose Kamala story
   - Honey Harvesting Story ("From Our Farm to Your Home")
   - 4-Step Beekeeping Process (Beekeeping, Harvesting, Processing, Packaging)
   - Honey Visual Showcase (Grid of honeycomb, bees, dripping honey)
   - Best Sellers with badges
   - Real Customer Reviews
   - Instagram Journey feed link
   - Final CTA section
   - Compact Footer
2. **Shop Page**: Category filtering, Weight variant filtering, Sorting (Price low/high, Name, Newest), Search bar, Responsive 4-col/2-col product grid.
3. **Product Detail Page**: Multi-image thumbnail gallery, variant selection (250g, 500g, 1kg), stock status, quantity selector, Add to Cart, Buy Now, Description/Ingredients/Storage tabs, Related products.
4. **Cart & Checkout**: Real-time quantity adjustments, Coupon code validation against database, Subtotal + Free shipping calculation, Cash on Delivery (COD) checkout, Address collection.
5. **Customer Account & Orders**: Registration/Login, Order History tracking (`KHF-2026-XXXXX` format), Wishlist saving.

### Admin Management Panel (`/admin`)
1. **Real Dashboard**: Live SQLite statistics for Total Revenue, Total Orders, Pending Orders, Low Stock Alerts, Active Products + Recent Orders & Best Sellers tables.
2. **Product Management**: Full CRUD — Add/Edit product names, categories, weight variants, SKUs, pricing, stock, images, and flags (Featured, Best Seller). Duplicate & Delete options.
3. **Inventory Control**: Real-time stock level monitoring, low stock thresholds, and inline manual stock adjustment.
4. **Order Management**: Filter by status (Pending, Confirmed, Processing, Packed, Shipped, Delivered, Cancelled), Search by Order ID/Customer Name/Phone, Order status updates (automatically adjusts stock level in SQLite transactions upon order placement or cancellation).
5. **Category Management**: Create, edit, delete, and reorder honey categories.
6. **Customer Management**: View registered customers, total spending, order history, and contact profiles.
7. **Coupons Management**: Create percentage or fixed discount promo codes with minimum order limits and expiration dates.
8. **Review Moderation**: Approve or hide customer product reviews before public display.
9. **Reports & Analytics**: Sales revenue report, best-selling product analysis, inventory health alerts.
10. **Business & Ecommerce Settings**: Edit brand phone number, address, Instagram link, shipping charges, free shipping threshold, and store status.

---

## 🗄️ Database Architecture (SQLite)

Contains 21 relational tables with foreign keys and index optimizations:
- `admins`, `customers`, `categories`, `products`, `product_variants`, `product_images`, `orders`, `order_items`, `addresses`, `wishlists`, `wishlist_items`, `reviews`, `coupons`, `coupon_usage`, `banners`, `gallery`, `farm_content`, `website_content`, `contact_messages`, `settings`, `stock_movements`.

---

## 🎨 Visual Quality & Brand Promise

- **100% Honey-Themed Visuals**: Every image used across the site depicts honey jars, honeycomb, bees, beekeeping, or natural honey harvesting.
- **Sharp Modern UI**: Strict 5px-8px border radius system for clean, business-grade usability.
- **Fast Performance**: Instant page loading with lightweight vanilla CSS and zero heavy third-party UI framework bloat.
