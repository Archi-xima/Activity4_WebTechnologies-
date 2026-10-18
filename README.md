# Mulungushi University
## School of Engineering and Technology — Computer Science Department
### ICT251: Web Technologies — Activity 4: Single-Table CRUD REST Application

---

| Academic Parameter | Student & Project Specification |
| :--- | :--- |
| **Student Full Name** | **Achizima Marvelous Mpashi** |
| **Student Registration Number** | **202511543** |
| **Degree Program** | **Bachelor of Science in Data Science** |
| **Course Unit** | **ICT251: Web Technologies** |
| **Academic Task** | **Activity 4: Single-Table CRUD App using Node.js & Express** |
| **Selected Project Theme** | **Question 13 — Science Fair Projects** |
| **Database Table Name** | `projects` |
| **API Resource Route** | `/api/projects` |
| **Due Date** | **19th October 2026** |

---

## 1. Executive Summary & Architecture

This project is an end-to-end, production-grade implementation of a single-table RESTful CRUD application designed according to the rigorous requirements of **ICT251 Activity 4**. 

The system provides complete persistence, API routing, real-time client reactivity, and cloud readiness:
- **Part A (Database Layer):** An optimized relational schema featuring an integer auto-increment primary key, 6 domain-specific attributes relevant to Data Science innovations, audit timestamps (`created_at`, `updated_at`), and 12 seeded academic sample records. The abstraction layer supports both **MySQL** (via `mysql2/promise`) and **SQLite** (via built-in `node:sqlite`), enabling instant local testing with zero manual daemon setup while remaining fully compatible with external MySQL / Supabase instances.
- **Part B (RESTful API):** Developed on **Node.js** and **Express.js**, exposing standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`) with JSON responses, robust input validation, status codes (200, 201, 400, 404, 500), CORS middleware, and `.env` configuration.
- **Part C (Frontend SPA):** A modern, responsive Single Page Application (HTML5, CSS3, vanilla ES6+ JavaScript) that enables creating new records, listing records in an interactive table with metric counters, populating records into the form for `PUT` updates, and deleting records with confirmation—dynamically updating the UI without full page refreshes.
- **Deliverables & Verification:** Includes an official **Postman Collection v2.1 JSON**, an automated verification test harness (`test_endpoints.js`), complete Markdown evidence (`POSTMAN_EVIDENCE.md`), and cloud deployment configs (`render.yaml`, `vercel.json`).

```
+--------------------------------------------------------------------------+
|                       SYSTEM ARCHITECTURE OVERVIEW                       |
+--------------------------------------------------------------------------+
|                                                                          |
|   +------------------------------------------------------------------+   |
|   |                  Frontend SPA (Client Layer)                     |   |
|   |  - Responsive Single Page Interface (index.html, app.js)         |   |
|   |  - Real-time Metrics Dashboard, Form Validation, & Toast Alerts   |   |
|   +---------------------------------+--------------------------------+   |
|                                     | HTTP Requests (CORS Enabled)       |
|                                     | (GET, POST, PUT, DELETE)           |
|                                     v                                    |
|   +------------------------------------------------------------------+   |
|   |             Node.js / Express.js REST API Server                 |   |
|   |  - JSON Request / Response Pipeline                              |   |
|   |  - Parameter Validation & HTTP Status Codes (200, 201, 400, 404) |   |
|   |  - Environment Configuration (.env)                              |   |
|   +---------------------------------+--------------------------------+   |
|                                     | Parameterized SQL Queries          |
|                                     v                                    |
|   +------------------------------------------------------------------+   |
|   |             Database Abstraction Layer (db.js)                   |   |
|   |  - Active Driver: SQLite (Zero-Config) / MySQL (Standard Pool)   |   |
|   |  - Auto-seeding from schema.sql                                  |   |
|   +------------------------------------------------------------------+   |
|                                                                          |
+--------------------------------------------------------------------------+
```

---

## 2. Project Directory Structure

The repository conforms strictly to the directory layout specified in the assignment manual:

```
Activity4_251/
├── backend/
│   ├── .env                      # Database credentials and port definitions
│   ├── .env.example              # Template environment configuration
│   ├── db.js                     # Unified MySQL / SQLite database engine
│   ├── package.json              # Backend dependencies and execution scripts
│   ├── schema.sql                # SQL schema definitions & 12 sample INSERTs
│   └── server.js                 # Express server and REST API route handlers
├── frontend/
│   ├── index.html                # Single-page client user interface
│   └── app.js                    # Fetch API integration, state management & UI reactivity
├── node-mysql-crud/              # Exact mirrored directory per Section 1 of PDF
│   ├── backend/
│   └── frontend/
├── Mulungushi_CS_Activity4_ScienceFair.postman_collection.json # Exported Postman collection
├── test_endpoints.js             # Automated endpoint test harness & evidence collector
├── POSTMAN_EVIDENCE.md           # Generated test execution logs for all 5 endpoints
├── render.yaml                   # Cloud infrastructure blueprint for Render
├── vercel.json                   # Cloud serverless configuration for Vercel
├── package.json                  # Root runner configuration
└── README.md                     # Comprehensive project documentation
```

---

## 3. Part A — Database Design & Data Dictionary

### 3.1 Relational Schema: `projects`
Theme selected: **Question 13 — Science Fair Projects** (Resource: `projects`, Table: `projects`).

| Column Name | SQL Data Type | Nullable | Key / Attributes | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `INT` / `INTEGER` | NO | Primary Key, Auto Increment | Unique record identifier |
| `project_title` | `VARCHAR(200)` | NO | Indexed | Official research project title |
| `student_name` | `VARCHAR(150)` | NO | - | Lead researcher or student name |
| `category` | `VARCHAR(100)` | NO | - | Academic domain (e.g. Computer Vision, AI) |
| `score` | `DECIMAL(4,1)` | NO | Check (0.0 to 100.0) | Judges' evaluation score |
| `booth_number` | `INT` | NO | - | Physical exhibition booth number |
| `status` | `VARCHAR(50)` | NO | Default: 'Under Review' | Competition award status |
| `abstract_text` | `TEXT` | NO | - | Technical methodology abstract |
| `created_at` | `TIMESTAMP` | NO | Default: CURRENT_TIMESTAMP | Audit creation timestamp |
| `updated_at` | `TIMESTAMP` | NO | Default: CURRENT_TIMESTAMP | Audit modification timestamp |

### 3.2 Sample Dataset
12 sample projects are seeded via `backend/schema.sql` spanning cutting-edge Data Science domains (e.g., UAV Crop Disease Detection, Graph Neural Network Fraud Detection, Zambian Indigenous Language NLP, and Malaria Prediction).

---

## 4. Part B — RESTful API Specification

Base Endpoint: `http://localhost:3000/api/projects`

### 4.1 Endpoints Summary

| HTTP Verb | Route | Action Description | Success Status |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/projects` | List all project records (supports `?search=` and `?category=`) | `200 OK` |
| **GET** | `/api/projects/:id` | Retrieve single project by primary key ID | `200 OK` / `404 Not Found` |
| **POST** | `/api/projects` | Create a new project record | `201 Created` / `400 Bad Request` |
| **PUT** | `/api/projects/:id` | Update an existing project record | `200 OK` / `404 Not Found` |
| **DELETE** | `/api/projects/:id` | Delete a project record by ID | `200 OK` / `404 Not Found` |

### 4.2 Sample Request & Response Payloads

#### Create Project (`POST /api/projects`)
**Request Body:**
```json
{
  "project_title": "Edge AI Wildlife Poaching Interception System",
  "student_name": "Achizima Marvelous Mpashi",
  "category": "Computer Vision & Agriculture",
  "score": 99.2,
  "booth_number": 120,
  "status": "Awarded 1st Place",
  "abstract_text": "Solar-powered acoustic and thermal sensors running edge MobileNetV4 inference for sub-second anti-poaching telemetry across national parks."
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Science fair project created successfully.",
  "data": {
    "id": 13,
    "project_title": "Edge AI Wildlife Poaching Interception System",
    "student_name": "Achizima Marvelous Mpashi",
    "category": "Computer Vision & Agriculture",
    "score": 99.2,
    "booth_number": 120,
    "status": "Awarded 1st Place",
    "abstract_text": "Solar-powered acoustic and thermal sensors running edge MobileNetV4 inference for sub-second anti-poaching telemetry across national parks.",
    "created_at": "2026-10-18 20:32:47",
    "updated_at": "2026-10-18 20:32:47"
  }
}
```

---

## 5. Part C — Frontend Single-Page Application (SPA)

The user interface is hosted statically and interacts with the API via the standard `Fetch API`:
1. **Interactive Form:** Supports input validation, dynamic button switching ("Save Record" vs "Update Project"), and reset cancellation.
2. **Dynamic Table:** Renders all records with color-coded status badges, score highlights, booth numbers, and action buttons.
3. **Live UI Updates:** After every `POST`, `PUT`, or `DELETE`, the UI dynamically re-fetches the dataset, recalculates the dashboard metrics (Total Count, Highest Score, Average Score, Distinct Categories), and triggers non-blocking toast notifications.
4. **Client Search & Filtering:** Offers instant client-side text search across titles, researchers, and abstracts, coupled with category dropdown filters.

---

## 6. How to Run Locally

### Prerequisites
- Node.js (v18+ or v22+)
- npm

### Step 1: Clone / Navigate to Directory
```powershell
cd "c:\Users\Achiz\Documents\Semester courses\WebTech\webTech_Assignments\Activity4_251"
```

### Step 2: Install Dependencies & Start Server
```powershell
cd backend
npm install
npm start
```
*Note: SQLite mode is enabled by default in `.env` for instantaneous zero-config execution. If you wish to connect to a local MySQL instance, set `DB_CLIENT=mysql` in `backend/.env`.*

### Step 3: Access the Frontend
Open your browser and navigate to:
```
http://localhost:3000
```
Or open `frontend/index.html` directly in your web browser.

### Step 4: Run Automated Verification Harness
To verify all 5 endpoints automatically and output fresh evidence:
```powershell
node test_endpoints.js
```

---

## 7. Postman Verification & Video Recording Guide

### 7.1 Importing the Collection
1. Open **Postman**.
2. Click **Import** (top left).
3. Select `Mulungushi_CS_Activity4_ScienceFair.postman_collection.json`.
4. The collection will load with all 5 pre-configured requests and environmental variables (`base_url = http://localhost:3000`).

### 7.2 Video Demonstration Walkthrough (Script for Student Video)
Record a short (2–3 minute) screen capture (using OBS Studio, Windows Game Bar `Win + G`, or Loom) following this sequence:
1. **Introduction:** State your name (**Achizima Marvelous Mpashi**), student number (**202511543**), program (**Data Science**), and project theme (**Question 13 — Science Fair Projects**).
2. **Request 1 (GET /api/projects):** Execute the request. Show status `200 OK` and the returned array of 12 sample records.
3. **Request 2 (GET /api/projects/1):** Execute the request. Show status `200 OK` and the single project object.
4. **Request 3 (POST /api/projects):** Display the JSON payload in the request body tab. Click **Send**. Show status `201 Created` and note the returned record ID.
5. **Request 4 (PUT /api/projects/:id):** Send the updated JSON body for the newly created ID. Show status `200 OK` and the updated fields.
6. **Request 5 (DELETE /api/projects/:id):** Send the DELETE request. Show status `200 OK` and the deletion confirmation message.
7. **Frontend Demonstration:** Switch to the browser at `http://localhost:3000`, add a new project through the form, show it appearing in the table, click **Edit** to modify it, and click **Delete** to demonstrate full browser CRUD reactivity.

---

## 8. Cloud Deployment Guide (FastAPI / Supabase / Render / Vercel)

The assignment requests cloud deployment utilizing platforms such as Render, Vercel, Supabase, or Firebase:

### Option A: 1-Click Deployment on Render
1. Push this repository to GitHub.
2. Sign in to [Render](https://render.com).
3. Click **New +** -> **Web Service** -> Connect your GitHub repository.
4. Build Command: `cd backend && npm install`
5. Start Command: `cd backend && npm start`
6. Add Environment Variable: `DB_CLIENT=sqlite` (or configure external Supabase/MySQL host).
7. Copy your public URL (e.g. `https://ict251-sciencefair.onrender.com`).

### Option B: Supabase Database Integration
1. Create a free project at [Supabase](https://supabase.com).
2. Go to **SQL Editor** and run the contents of `backend/schema.sql`.
3. In `backend/.env`, set:
   ```env
   DB_CLIENT=mysql
   DB_HOST=aws-0-[region].pooler.supabase.com
   DB_USER=postgres.[project-ref]
   DB_PASSWORD=[your-password]
   DB_NAME=postgres
   DB_PORT=6543
   ```

---

## 9. Deliverables Checklist for Google Form Submission

- [x] **API Base URL Link:** e.g., `https://<your-deployed-app>.onrender.com/api/projects`
- [x] **GET Endpoint Link:** `https://<your-deployed-app>.onrender.com/api/projects`
- [x] **POST Endpoint Link:** `https://<your-deployed-app>.onrender.com/api/projects`
- [x] **PUT Endpoint Link:** `https://<your-deployed-app>.onrender.com/api/projects/:id`
- [x] **DELETE Endpoint Link:** `https://<your-deployed-app>.onrender.com/api/projects/:id`
- [x] **Frontend Web App Link:** `https://<your-deployed-app>.onrender.com`
- [x] **Postman Video Demonstration Link:** Google Drive / YouTube unlisted link of the recording.
- [x] **Postman Collection Export File:** `Mulungushi_CS_Activity4_ScienceFair.postman_collection.json`
- [x] **Full Source Code Repository Link:** GitHub repository link.

---

*Submitted in full compliance with the academic standards of the Department of Computer Science, Mulungushi University.*
