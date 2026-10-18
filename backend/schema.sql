-- ====================================================================
-- Mulungushi University - School of Engineering and Technology
-- Department of Computer Science
-- ICT251: Web Technologies - Activity 4
-- Student: Achizima Marvelous Mpashi (Student No: 202511543)
-- Program: Data Science
-- Theme: Question 13 — Science Fair Projects (table: projects, resource: projects)
-- ====================================================================

-- Drop table if exists for clean re-initialization
DROP TABLE IF EXISTS projects;

-- Create single-table schema with primary key, 6 domain attributes, and audit timestamps
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_title VARCHAR(200) NOT NULL,
    student_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    score DECIMAL(4, 1) NOT NULL,
    booth_number INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Under Review',
    abstract_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====================================================================
-- Populate Initial Dataset: 12 High-Quality Academic Sample Records
-- (Exceeds requirement of at least 10 records)
-- ====================================================================

INSERT INTO projects (project_title, student_name, category, score, booth_number, status, abstract_text) VALUES
(
    'Deep Learning for Early Crop Disease Detection via UAV Imagery',
    'Achizima Marvelous Mpashi',
    'Computer Vision & Agriculture',
    98.5,
    101,
    'Awarded 1st Place',
    'A custom convolutional neural network (CNN) trained on high-resolution multispectral drone imagery to detect early blight in maize and wheat fields with 96.7% accuracy.'
),
(
    'Real-Time Fraud Detection Using Graph Neural Networks',
    'Kavita Patel',
    'Financial Machine Learning',
    95.0,
    102,
    'Awarded 2nd Place',
    'Implements heterogeneous graph attention networks to identify complex money laundering topologies across distributed transaction ledgers in sub-10ms latency.'
),
(
    'Automated Dialectal Speech Recognition for Zambian Indigenous Languages',
    'Chileshe Musonda',
    'Natural Language Processing',
    93.5,
    103,
    'Awarded 3rd Place',
    'Fine-tuning wav2vec 2.0 on low-resource Bantu language corpora, achieving state-of-the-art phonetic error rates in Bemba and Nyanja audio streams.'
),
(
    'Predictive Epidemiological Modeling of Malaria Outbreaks Using Satellite Climate Vectors',
    'Grace Mwape',
    'Data Science & Public Health',
    92.0,
    104,
    'Finalist',
    'A spatiotemporal LSTM recurrent network combining precipitation, NDVI, and regional temperature data to forecast provincial malaria spikes 6 weeks in advance.'
),
(
    'Self-Balancing Autonomous Delivery Rover with LiDAR SLAM',
    'David Banda',
    'Robotics & Embedded Systems',
    89.5,
    105,
    'Finalist',
    'Two-wheeled inverted pendulum robot equipped with ROS2, 2D LiDAR, and sensor fusion for navigating crowded campus walkways without GPS dependencies.'
),
(
    'Decentralized Microgrid Energy Balancing via Multi-Agent Reinforcement Learning',
    'Tendai Moyo',
    'CleanTech & Energy Systems',
    91.0,
    106,
    'Finalist',
    'Peer-to-peer solar energy arbitrage model utilizing deep Q-networks to balance localized battery storage and reduce grid reliance in rural communities.'
),
(
    'Zero-Knowledge Proof Authentication Framework for Healthcare Electronic Records',
    'Blessing Zulu',
    'Cybersecurity & Cryptography',
    94.0,
    107,
    'Finalist',
    'Privacy-preserving zk-SNARK protocol allowing clinical institutions to verify patient insurance entitlements without exposing sensitive medical diagnostics.'
),
(
    'Low-Cost IoT Water Contamination Sentinel with Edge Inference',
    'Faith Phiri',
    'IoT & Environmental Sensing',
    88.0,
    108,
    'Under Review',
    'Microcontroller-based spectroradiometric sensor cluster providing real-time turbidity, heavy metal, and microbial contamination telemetry for rural boreholes.'
),
(
    'Multi-Modal LLM Assistant for Remote Veterinary Diagnostics',
    'Samuel Lungu',
    'Artificial Intelligence',
    90.5,
    109,
    'Finalist',
    'Combines visual lesion segmentation with few-shot clinical prompting to assist livestock farmers in diagnosing common cattle dermatological ailments.'
),
(
    'Optimizing Traffic Congestion in Lusaka Urban Corridors Using Deep RL',
    'Mutale Chisanga',
    'Urban Analytics & AI',
    87.5,
    110,
    'Under Review',
    'SUMO micro-simulation powered by PPO (Proximal Policy Optimization) to adjust dynamic traffic signal phases along the Great East Road arterial network.'
),
(
    'Automated Diabetic Retinopathy Grading from Fundus Photography',
    'Natasha Tembo',
    'Bioinformatics & Medicine',
    94.5,
    111,
    'Awarded 3rd Place',
    'EfficientNet-B5 architecture fine-tuned on Kaggle Diabetic Retinopathy dataset, providing explainable Grad-CAM heatmaps for clinician validation.'
),
(
    'Soil Nutrient Prediction via Portable NIR Spectroscopy and Gradient Boosting',
    'Taonga Mulenga',
    'AgriTech & Chemometrics',
    86.0,
    112,
    'Under Review',
    'XGBoost regression on near-infrared reflectance spectral bands to estimate soil nitrogen, phosphorus, and potassium levels in under 30 seconds.'
);
