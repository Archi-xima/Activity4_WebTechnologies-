/**
 * ====================================================================
 * Mulungushi University - Department of Computer Science
 * ICT251: Web Technologies - Activity 4
 * Student: Achizima Marvelous Mpashi (202511543)
 * Database Abstraction Layer (db.js)
 * Supports MySQL (via mysql2/promise) and SQLite (via node:sqlite)
 * ====================================================================
 */

require('dotenv').config();
const path = require('path');
const fs = require('fs');

let dbDriver = (process.env.DB_CLIENT || 'sqlite').toLowerCase();
let mysqlPool = null;
let sqliteDb = null;

/**
 * Initializes the database connection and ensures tables are seeded.
 */
async function initDb() {
    if (dbDriver === 'mysql') {
        try {
            const mysql = require('mysql2/promise');
            mysqlPool = mysql.createPool({
                host: process.env.DB_HOST || '127.0.0.1',
                port: Number(process.env.DB_PORT) || 3306,
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'campus_crud',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });

            // Test connection
            const connection = await mysqlPool.getConnection();
            console.log(`[Database] Connected successfully to MySQL database "${process.env.DB_NAME}" at ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
            connection.release();
            return;
        } catch (err) {
            console.warn(`[Database Warning] MySQL connection failed: ${err.message}`);
            console.warn(`[Database Fallback] Switching dynamically to SQLite mode so the system remains 100% operational.`);
            dbDriver = 'sqlite';
        }
    }

    // SQLite mode (built-in node:sqlite, zero additional dependencies required)
    const { DatabaseSync } = require('node:sqlite');
    const dbPath = path.resolve(__dirname, process.env.SQLITE_DB_PATH || './science_fair.sqlite');
    const dbExists = fs.existsSync(dbPath);
    sqliteDb = new DatabaseSync(dbPath);
    console.log(`[Database] Initialized SQLite database engine at: ${dbPath}`);

    // Ensure schema and sample records exist
    ensureSqliteSchema(sqliteDb, dbExists);
}

/**
 * Seeds SQLite with the initial schema and dataset if not already present.
 */
function ensureSqliteSchema(db, previouslyExisted) {
    // Check if table exists
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='projects'").all();
    if (tableCheck.length === 0) {
        console.log('[Database] Table "projects" not detected. Seeding schema from schema.sql...');
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_title TEXT NOT NULL,
                student_name TEXT NOT NULL,
                category TEXT NOT NULL,
                score REAL NOT NULL,
                booth_number INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'Under Review',
                abstract_text TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now', 'localtime')),
                updated_at TEXT DEFAULT (datetime('now', 'localtime'))
            );
        `;
        db.exec(createTableSql);

        // Populate sample records
        const sampleProjects = [
            [
                'Deep Learning for Early Crop Disease Detection via UAV Imagery',
                'Achizima Marvelous Mpashi',
                'Computer Vision & Agriculture',
                98.5,
                101,
                'Awarded 1st Place',
                'A custom convolutional neural network (CNN) trained on high-resolution multispectral drone imagery to detect early blight in maize and wheat fields with 96.7% accuracy.'
            ],
            [
                'Real-Time Fraud Detection Using Graph Neural Networks',
                'Kavita Patel',
                'Financial Machine Learning',
                95.0,
                102,
                'Awarded 2nd Place',
                'Implements heterogeneous graph attention networks to identify complex money laundering topologies across distributed transaction ledgers in sub-10ms latency.'
            ],
            [
                'Automated Dialectal Speech Recognition for Zambian Indigenous Languages',
                'Chileshe Musonda',
                'Natural Language Processing',
                93.5,
                103,
                'Awarded 3rd Place',
                'Fine-tuning wav2vec 2.0 on low-resource Bantu language corpora, achieving state-of-the-art phonetic error rates in Bemba and Nyanja audio streams.'
            ],
            [
                'Predictive Epidemiological Modeling of Malaria Outbreaks Using Satellite Climate Vectors',
                'Grace Mwape',
                'Data Science & Public Health',
                92.0,
                104,
                'Finalist',
                'A spatiotemporal LSTM recurrent network combining precipitation, NDVI, and regional temperature data to forecast provincial malaria spikes 6 weeks in advance.'
            ],
            [
                'Self-Balancing Autonomous Delivery Rover with LiDAR SLAM',
                'David Banda',
                'Robotics & Embedded Systems',
                89.5,
                105,
                'Finalist',
                'Two-wheeled inverted pendulum robot equipped with ROS2, 2D LiDAR, and sensor fusion for navigating crowded campus walkways without GPS dependencies.'
            ],
            [
                'Decentralized Microgrid Energy Balancing via Multi-Agent Reinforcement Learning',
                'Tendai Moyo',
                'CleanTech & Energy Systems',
                91.0,
                106,
                'Finalist',
                'Peer-to-peer solar energy arbitrage model utilizing deep Q-networks to balance localized battery storage and reduce grid reliance in rural communities.'
            ],
            [
                'Zero-Knowledge Proof Authentication Framework for Healthcare Electronic Records',
                'Blessing Zulu',
                'Cybersecurity & Cryptography',
                94.0,
                107,
                'Finalist',
                'Privacy-preserving zk-SNARK protocol allowing clinical institutions to verify patient insurance entitlements without exposing sensitive medical diagnostics.'
            ],
            [
                'Low-Cost IoT Water Contamination Sentinel with Edge Inference',
                'Faith Phiri',
                'IoT & Environmental Sensing',
                88.0,
                108,
                'Under Review',
                'Microcontroller-based spectroradiometric sensor cluster providing real-time turbidity, heavy metal, and microbial contamination telemetry for rural boreholes.'
            ],
            [
                'Multi-Modal LLM Assistant for Remote Veterinary Diagnostics',
                'Samuel Lungu',
                'Artificial Intelligence',
                90.5,
                109,
                'Finalist',
                'Combines visual lesion segmentation with few-shot clinical prompting to assist livestock farmers in diagnosing common cattle dermatological ailments.'
            ],
            [
                'Optimizing Traffic Congestion in Lusaka Urban Corridors Using Deep RL',
                'Mutale Chisanga',
                'Urban Analytics & AI',
                87.5,
                110,
                'Under Review',
                'SUMO micro-simulation powered by PPO (Proximal Policy Optimization) to adjust dynamic traffic signal phases along the Great East Road arterial network.'
            ],
            [
                'Automated Diabetic Retinopathy Grading from Fundus Photography',
                'Natasha Tembo',
                'Bioinformatics & Medicine',
                94.5,
                111,
                'Awarded 3rd Place',
                'EfficientNet-B5 architecture fine-tuned on Kaggle Diabetic Retinopathy dataset, providing explainable Grad-CAM heatmaps for clinician validation.'
            ],
            [
                'Soil Nutrient Prediction via Portable NIR Spectroscopy and Gradient Boosting',
                'Taonga Mulenga',
                'AgriTech & Chemometrics',
                86.0,
                112,
                'Under Review',
                'XGBoost regression on near-infrared reflectance spectral bands to estimate soil nitrogen, phosphorus, and potassium levels in under 30 seconds.'
            ]
        ];

        const insertStmt = db.prepare(`
            INSERT INTO projects (project_title, student_name, category, score, booth_number, status, abstract_text)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        for (const record of sampleProjects) {
            insertStmt.run(...record);
        }

        console.log(`[Database] Successfully seeded ${sampleProjects.length} academic sample records into SQLite.`);
    }
}

/**
 * Executes a parameterized SQL query with unified return syntax matching mysql2/promise.
 * Returns [results, metadata] where:
 * - For SELECT queries: results is an Array of row objects.
 * - For INSERT queries: results contains { insertId, affectedRows }.
 * - For UPDATE/DELETE: results contains { affectedRows }.
 *
 * @param {string} sql - SQL string with '?' placeholders
 * @param {Array} params - Array of parameter values
 */
async function query(sql, params = []) {
    if (dbDriver === 'mysql' && mysqlPool) {
        return await mysqlPool.execute(sql, params);
    }

    // SQLite engine execution
    if (!sqliteDb) {
        throw new Error('Database connection is not initialized. Call initDb() first.');
    }

    const trimmed = sql.trim();
    const command = trimmed.split(/\s+/)[0].toUpperCase();

    if (command === 'SELECT') {
        const stmt = sqliteDb.prepare(sql);
        const rows = stmt.all(...params);
        return [rows, null];
    } else {
        const stmt = sqliteDb.prepare(sql);
        const result = stmt.run(...params);
        return [
            {
                insertId: Number(result.lastInsertRowid),
                affectedRows: Number(result.changes)
            },
            null
        ];
    }
}

/**
 * Returns current database metadata.
 */
function getDbInfo() {
    return {
        driver: dbDriver,
        status: 'Connected',
        timestamp: new Date().toISOString()
    };
}

module.exports = {
    initDb,
    query,
    getDbInfo
};
