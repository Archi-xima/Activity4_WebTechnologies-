# Mulungushi University — School of Engineering and Technology
## Department of Computer Science
### ICT251: Web Technologies — Activity 4: REST API & Postman Verification Evidence

**Student Name:** Achizima Marvelous Mpashi  
**Student ID:** 202511543  
**Program:** Bachelor of Science in Data Science  
**Theme:** Question 13 — Science Fair Projects (`projects`)  
**Base URL:** `http://localhost:3000/api/projects`  
**Date of Verification:** 18/10/2026, 8:32:47 pm

---

## Executive Summary
This document provides empirical evidence for the execution of all five required RESTful endpoints (GET all, GET one, POST, PUT, DELETE) conforming to the specification outlined in *ICT251 Activity 4*. All requests returned valid JSON with compliant HTTP status codes (200 OK, 201 Created).

---

### Endpoint 1: GET /api/projects — List all records

- **HTTP Method:** `GET`
- **Request URL:** `http://localhost:3001/api/projects`
- **HTTP Status:** `200`

#### Request Payload:
```json
"(None)"
```

#### Response Body (JSON):
```json
{
  "success": true,
  "count": 12,
  "sample_first_record": {
    "id": 12,
    "project_title": "Soil Nutrient Prediction via Portable NIR Spectroscopy and Gradient Boosting",
    "student_name": "Taonga Mulenga",
    "category": "AgriTech & Chemometrics",
    "score": 86,
    "booth_number": 112,
    "status": "Under Review",
    "abstract_text": "XGBoost regression on near-infrared reflectance spectral bands to estimate soil nitrogen, phosphorus, and potassium levels in under 30 seconds.",
    "created_at": "2026-10-18 20:27:35",
    "updated_at": "2026-10-18 20:27:35"
  }
}
```

---

### Endpoint 2: GET /api/projects/:id — Get one record

- **HTTP Method:** `GET`
- **Request URL:** `http://localhost:3001/api/projects/1`
- **HTTP Status:** `200`

#### Request Payload:
```json
"(None)"
```

#### Response Body (JSON):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "project_title": "Deep Learning for Early Crop Disease Detection via UAV Imagery",
    "student_name": "Achizima Marvelous Mpashi",
    "category": "Computer Vision & Agriculture",
    "score": 98.5,
    "booth_number": 101,
    "status": "Awarded 1st Place",
    "abstract_text": "A custom convolutional neural network (CNN) trained on high-resolution multispectral drone imagery to detect early blight in maize and wheat fields with 96.7% accuracy.",
    "created_at": "2026-10-18 20:27:35",
    "updated_at": "2026-10-18 20:27:35"
  }
}
```

---

### Endpoint 3: POST /api/projects — Create a record

- **HTTP Method:** `POST`
- **Request URL:** `http://localhost:3001/api/projects`
- **HTTP Status:** `201`

#### Request Payload:
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

#### Response Body (JSON):
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

### Endpoint 4: PUT /api/projects/:id — Update a record

- **HTTP Method:** `PUT`
- **Request URL:** `http://localhost:3001/api/projects/13`
- **HTTP Status:** `200`

#### Request Payload:
```json
{
  "project_title": "Edge AI Wildlife Poaching Interception (Field Validated)",
  "student_name": "Achizima Marvelous Mpashi",
  "category": "Computer Vision & Agriculture",
  "score": 99.8,
  "booth_number": 120,
  "status": "Awarded 1st Place",
  "abstract_text": "Solar-powered acoustic and thermal sensors field-tested in South Luangwa National Park, achieving 99.1% gunshot acoustic detection accuracy."
}
```

#### Response Body (JSON):
```json
{
  "success": true,
  "message": "Project with ID 13 updated successfully.",
  "data": {
    "id": 13,
    "project_title": "Edge AI Wildlife Poaching Interception (Field Validated)",
    "student_name": "Achizima Marvelous Mpashi",
    "category": "Computer Vision & Agriculture",
    "score": 99.8,
    "booth_number": 120,
    "status": "Awarded 1st Place",
    "abstract_text": "Solar-powered acoustic and thermal sensors field-tested in South Luangwa National Park, achieving 99.1% gunshot acoustic detection accuracy.",
    "created_at": "2026-10-18 20:32:47",
    "updated_at": "2026-10-18 18:32:47"
  }
}
```

---

### Endpoint 5: DELETE /api/projects/:id — Delete a record

- **HTTP Method:** `DELETE`
- **Request URL:** `http://localhost:3001/api/projects/13`
- **HTTP Status:** `200`

#### Request Payload:
```json
"(None)"
```

#### Response Body (JSON):
```json
{
  "success": true,
  "message": "Project with ID 13 (\"Edge AI Wildlife Poaching Interception (Field Validated)\") was successfully deleted.",
  "deletedRecord": {
    "id": 13,
    "project_title": "Edge AI Wildlife Poaching Interception (Field Validated)",
    "student_name": "Achizima Marvelous Mpashi",
    "category": "Computer Vision & Agriculture",
    "score": 99.8,
    "booth_number": 120,
    "status": "Awarded 1st Place",
    "abstract_text": "Solar-powered acoustic and thermal sensors field-tested in South Luangwa National Park, achieving 99.1% gunshot acoustic detection accuracy.",
    "created_at": "2026-10-18 20:32:47",
    "updated_at": "2026-10-18 18:32:47"
  }
}
```

---
