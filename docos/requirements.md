Perfect 👍 I’ll create a **comprehensive requirements document** in **Markdown format** so you can use it directly for planning or hand-off. It will cover scope, functional/non-functional requirements, user management, order lifecycle, and admin features.

---

# 📄 Requirements Document – Kids’ Holiday Food & Beverage Ordering Website

## 1. Introduction

### 1.1 Purpose

The purpose of this website is to provide a simple, fun, and educational platform for kids to run a **holiday food & beverage project**, enabling neighbors and friends to browse menu items, place orders, and pick them up on the event day.

### 1.2 Business Goals

* Allow customers to view menu items with prices, ingredients, calories, and health benefits.
* Support **order creation, editing, and confirmation via QR code**.
* Ensure **inventory visibility** (real-time stock).
* Restrict users to **pre-created accounts** (managed by admin).
* Enforce **time-bound ordering** (cutoff date before event day).
* Provide kids with operational learning in e-commerce, customer service, and logistics.

---

## 2. Stakeholders

* **Kids (Operators)** – Manage menu, fulfill orders, scan QR codes at pickup.
* **Parents (Supervisors)** – Oversee platform setup, user creation, finances, and compliance.
* **Customers (Neighbors/Friends/Family)** – Place and manage orders before the cutoff date, pick up food & beverages on the event date.

---

## 3. Functional Requirements

### 3.1 User Management

* Admin creates user accounts with the following attributes:

  * First Name
  * Last Name
  * Street Name
  * Street Code (alphanumeric, e.g., `ST`)
  * House Number
  * Greeting Word (e.g., “Hi”, “Namaste”)
  * Active Status (Active/Inactive)
  * **User\_ID = FirstName\_StreetCode\_HouseNo**

    * Example: `Ravi_ST_12`

* Users cannot self-register.

* Login is via **User\_ID** (optionally with a PIN/password).

* On login, the system:

  * Fetches Greeting Word → shown as welcome message.
  * Checks Active Status → only active users can log in.

---

### 3.2 Menu Page

Each menu item must display:

* Name
* Image (optional but recommended)
* Price
* Quantity Available (real-time, decreases after each order)
* Ingredients
* Calories
* Health Benefits
* Quantity Selector (cannot exceed available stock)

Additional Features:

* Show “Sold Out” if stock = 0.
* Optional filters: Category (snacks, beverages, desserts), health benefit tags.

---

### 3.3 Orders

* Orders tied to **User\_ID** and **Event\_ID**.

* Order confirmation generates a **QR Code** with:

  * Order\_ID
  * User\_ID
  * Event\_ID

* Users can:

  * Place new orders if **today ≤ cutoff date**.
  * Edit existing orders if **today ≤ cutoff date** and order status = Pending/Confirmed.
  * View order history.

---

### 3.4 Events & Cutoff Dates

* Admin defines **Event Date** (e.g., 14th August).
* System auto-sets **Cutoff Date = Event Date – 1 day** (13th August).
* After cutoff date:

  * New orders **disabled**.
  * Order editing **disabled**.
  * Users see message: *“Ordering is closed for this event.”*
* After event date:

  * Users cannot create or edit orders.
  * Orders are archived for reference.

---

### 3.5 Pickup Process

* On Event Day:

  * Customer presents QR code.
  * Kids scan QR code using mobile/tablet.
  * System validates order + marks it as **Picked Up**.

---

### 3.6 Feedback

* After order confirmation or pickup, users can submit feedback:

  * Free text: *“What food or drink should we add next time?”*
* Feedback is stored and viewable by admin/kids.

---

### 3.7 Admin Features

* Manage Users (create, edit, deactivate).
* Manage Menu (add/edit/remove items, stock, nutrition info).
* Manage Events (create event, set date, cutoff date, archive old events).
* View Orders (pending, confirmed, picked up).
* Export Reports (orders, user activity, feedback).

---

## 4. Non-Functional Requirements

* **Ease of Use**: Kids must be able to manage stock and orders easily.
* **Performance**: Support \~50–100 orders/day without lag.
* **Mobile-first**: Both customers and operators should use phones.
* **Security**:

  * QR codes must be unique and non-guessable.
  * Users must only see their own orders.
* **Cost Efficiency**: Should be built using no-code/low-code or lightweight web solutions.

---

## 5. Constraints

* **Cash on Pickup only** (no online payments).
* **Local Use**: Restricted to community members with pre-created accounts.
* **Time-Bound**: Orders only valid until cutoff date; no late orders.

---

## 6. Success Criteria

* Customers can view and order food items easily before the cutoff.
* Stock is updated dynamically and prevents overselling.
* QR codes streamline pickup validation.
* Kids can manage users, menu, and orders with minimal technical help.
* Feedback collected helps plan future menus.

---

