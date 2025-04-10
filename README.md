# ⚡ Power Insight Dashboard – Version 0.0

**Power Insight Dashboard** is a real-time power monitoring and analytics platform designed to visualize and analyze electrical parameters from multiple devices. It uses MQTT for live data ingestion, stores historical data in MongoDB, and displays dynamic graphs through a responsive React frontend.

---

## 🌟 Features

- 📡 **Real-Time Streaming**: Fetches data every 10 seconds from an MQTT broker and streams it to the frontend via WebSocket.
- **Store the live data**: Streaming live data are saved to MongoDB once every 10 seconds and can be used to render and analyze historical data
- 📊 **Live Graphs** for:
  - **Voltage** (v1, v2, v3)
  - **Current** (a1, a2, a3)
  - **Frequency**
  - **Power Factor**
- 🔋 **Energy Consumption** and 🌿 **GHG Emissions**:
  - Minute-wise difference calculations **(YET TO BE DONE)**
  - Time-based aggregation (Minute, Hour, Day, Month, Year) **(YET TO BE DONE)**
- ⏱️ **Historical Data Persistence**: Data remains accessible even after page refreshes.
- 🎯 **Per-Device Filtering**: Select specific devices to view their parameters.
- 📅 **Time-Based Backend Filtering**: Filter historical energy and GHG data by date and hour. **(FOR NOW, ONLY LIVE DATA RENDERING)**

---

## 🛠 Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | React.js            |
| Backend   | Spring Boot         |
| Database  | MongoDB             |
| Protocols | MQTT, WebSocket     |

---

## 📂 Project Structure (High-Level)
Power_Insight_Dashboard/  
 - dashboard/    **(Frontend React components)**  
 - demo/         **(Backend SpringBoot components)**  
 - screenshots/  
 - progress.txt  

 ---

## 🛠️ Setup Instructions

### Download and Extract the Project

- Download the ZIP file of this repository.
- Extract it to your preferred location.

### Start MongoDB

- Ensure MongoDB is installed and the service is running **before** starting the backend.

### Run the Spring Boot Backend

- Open Eclipse or your preferred Java IDE.
- Import the `demo` folder as a Maven project.
- Run `DemoApplication.java` to start the backend server.
- Backend will auto-create the necessary MongoDB collections on first run.

### Start the React Frontend

- Open a terminal and navigate to the frontend directory:

  ```bash
  cd dashboard
  ```
- Install project dependencies:
  ```
  npm install
  ```
- Start the development server:
  ```
  npm run dev  
  ```
  This will launch the frontend at port 5173 (localhost).  

- **Note - If in case any dependencies are missing, which causes components not to render in frontend, just use**
  ```
  npm install <dependency_name>
  ```
  
  

  





