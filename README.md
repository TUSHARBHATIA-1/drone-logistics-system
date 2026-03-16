# Drone Logistics & Route Optimization System

An autonomous drone fleet management platform with real-time route optimization using a C++ Dijkstra engine.

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18+
- **MongoDB**: Local or Atlas connection
- **C++ Compiler**: `g++` (MinGW for Windows)

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env file:
# PORT=5000
# MONGO_URI=your_mongo_connection_string
# JWT_SECRET=your_secret
npm run dev
```

### 3. Algorithm Compilation
Ensure the route optimizer binary is compiled for your OS:
```bash
g++ algorithms/main.cpp -o algorithms/route_optimizer
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Key Features
- **Route Optimization**: C++ engine executes Dijkstra heuristics to find the shortest delivery paths.
- **Drone Marketplace**: Buy, rent, and repair drones with instant fleet synchronization.
- **Emergency Protocol**: Automated safety override detecting low battery or malfunctions.
- **Mission Center**: Launch and track real-time delivery assignments.
- **System Alerts**: Polling-based notification system for critical hardware events.

## 📁 Project Structure

```bash
├── algorithms/       # C++ Dijkstra engine (Modular: graph, dijkstra, assignment)
├── backend/          # Express.js API (Controllers, Routes, Models, Config)
├── frontend/         # React Application (Pages, Components, Services, Hooks)
├── database/         # MongoDB initialization and seed data
└── docs/             # Architectural diagrams and technical specs
```

- **`algorithms/`**: High-performance DSA layer for pathfinding and safety calculations.
- **`backend/`**: Scalable core handling business logic, user auth, and sub-process execution.
- **`frontend/`**: Modern, glassmorphic UI for fleet monitoring and logistics operations.
- **`database/`**: Centralized place for schema definitions and initial data population.
- **`docs/`**: Technical documentation and system flow guides.

## 🧪 Testing Integration
1. **Register** a new company account.
2. **Go to Marketplace** to buy your first drone.
3. **Go to Assignments** to launch a new mission (provide Node IDs 0-5).
4. **Go to Dashboard** and click "Simulate E-Landing" to test the C++ safety engine.
