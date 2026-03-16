# 🏗️ Architecture Overview

The **Drone Logistics & Route Optimization System** is built with a focus on high-performance algorithms and a secure, responsive management interface.

## 🗃️ Folder Structure Explanation

### 📂 `algorithms/`
Contains the core DSA logic. Modularized into `graph.cpp` (data structure), `dijkstra.cpp` (optimization logic), and `drone_assignment.cpp` (the main system bridge).

### 📂 `backend/`
- **`controllers/`**: Logic for handling API requests (Auth, Drones, Assignments).
- **`routes/`**: Endpoint definitions for external access.
- **`models/`**: Mongoose schemas for MongoDB data persistency.
- **`middlewares/`**: JWT validation and global error handling.
- **`config/`**: System-wide configuration (Database, App settings).

### 📂 `frontend/`
- **`src/pages/`**: High-level React views (Dashboard, Marketplace).
- **`src/components/`**: Reusable Atomic UI units (Navbar, Sidebar).
- **`src/services/`**: API communication layer (Axios instances).
- **`src/context/`**: Global state management (Auth, Cart, Notifications).

### 📂 `database/`
- **`seeds/`**: Initial data scripts to populate the system with drones and hubs.
- **`config/`**: Exported DB schemas and configuration backups.

### 📂 `docs/`
System flowcharts, sequence diagrams, and API documentation.

## 🛠️ Tech Stack Sync
- **Engine**: C++17
- **Fullstack**: MERN (MongoDB, Express, React, Node)
- **Styling**: Tailwind CSS (Premium Dark Theme)
