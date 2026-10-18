/**
 * ====================================================================
 * Mulungushi University - School of Engineering and Technology
 * Department of Computer Science
 * ICT251: Web Technologies - Activity 4
 *
 * Student Name:   Achizima Marvelous Mpashi
 * Student Number: 202511543
 * Program:        Data Science
 * Theme:          Question 13 — Science Fair Projects (table: projects, resource: projects)
 * Server Module:  server.js
 * ====================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// ====================================================================
// Middleware Pipeline
// ====================================================================
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static assets from frontend directory if accessed directly
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ====================================================================
// Root & Diagnostic Endpoints
// ====================================================================
app.get('/', (req, res) => {
    // If request accepts HTML, try to serve frontend index.html; otherwise JSON
    if (req.accepts('html')) {
        return res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
    }
    res.json({
        institution: 'Mulungushi University',
        department: 'Computer Science Department',
        course: 'ICT251 Web Technologies - Activity 4',
        student: {
            name: 'Achizima Marvelous Mpashi',
            student_number: '202511543',
            program: 'Data Science'
        },
        resource: 'projects',
        endpoints: {
            list: 'GET /api/projects',
            getOne: 'GET /api/projects/:id',
            create: 'POST /api/projects',
            update: 'PUT /api/projects/:id',
            delete: 'DELETE /api/projects/:id'
        },
        database: db.getDbInfo()
    });
});

app.get('/api', (req, res) => {
    res.json({
        message: 'ICT251 Science Fair Projects REST API is operational.',
        version: '1.0.0',
        author: 'Achizima Marvelous Mpashi (202511543)',
        database: db.getDbInfo()
    });
});

// ====================================================================
// REST API Endpoints: /api/projects
// ====================================================================

/**
 * 1. GET /api/projects
 * List all science fair project records.
 * Supports optional query params: ?search=...&category=...
 */
app.get('/api/projects', async (req, res, next) => {
    try {
        const { search, category } = req.query;
        let sql = 'SELECT * FROM projects';
        const params = [];
        const conditions = [];

        if (category && category.trim() !== '') {
            conditions.push('category = ?');
            params.push(category.trim());
        }

        if (search && search.trim() !== '') {
            conditions.push('(project_title LIKE ? OR student_name LIKE ? OR abstract_text LIKE ?)');
            const wild = `%${search.trim()}%`;
            params.push(wild, wild, wild);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        sql += ' ORDER BY id DESC';

        const [rows] = await db.query(sql, params);
        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (err) {
        next(err);
    }
});

/**
 * 2. GET /api/projects/:id
 * Retrieve a single project by its primary key ID.
 */
app.get('/api/projects/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID. Must be a positive integer.'
            });
        }

        const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Project with ID ${id} not found.`
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (err) {
        next(err);
    }
});

/**
 * 3. POST /api/projects
 * Create a new science fair project entry.
 */
app.post('/api/projects', async (req, res, next) => {
    try {
        const {
            project_title,
            student_name,
            category,
            score,
            booth_number,
            status,
            abstract_text
        } = req.body;

        // Validation: Required fields
        if (!project_title || !project_title.trim()) {
            return res.status(400).json({ success: false, message: 'Field "project_title" is required.' });
        }
        if (!student_name || !student_name.trim()) {
            return res.status(400).json({ success: false, message: 'Field "student_name" is required.' });
        }
        if (!category || !category.trim()) {
            return res.status(400).json({ success: false, message: 'Field "category" is required.' });
        }
        if (score === undefined || score === null || isNaN(Number(score))) {
            return res.status(400).json({ success: false, message: 'Field "score" must be a valid number between 0 and 100.' });
        }
        if (booth_number === undefined || booth_number === null || isNaN(parseInt(booth_number, 10))) {
            return res.status(400).json({ success: false, message: 'Field "booth_number" must be a valid integer.' });
        }
        if (!abstract_text || !abstract_text.trim()) {
            return res.status(400).json({ success: false, message: 'Field "abstract_text" is required.' });
        }

        const cleanScore = Math.min(100, Math.max(0, parseFloat(score)));
        const cleanBooth = parseInt(booth_number, 10);
        const cleanStatus = (status && status.trim()) ? status.trim() : 'Under Review';

        const sql = `
            INSERT INTO projects (project_title, student_name, category, score, booth_number, status, abstract_text)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            project_title.trim(),
            student_name.trim(),
            category.trim(),
            cleanScore,
            cleanBooth,
            cleanStatus,
            abstract_text.trim()
        ];

        const [result] = await db.query(sql, params);
        const newId = result.insertId;

        // Fetch newly created record
        const [createdRows] = await db.query('SELECT * FROM projects WHERE id = ?', [newId]);

        res.status(201).json({
            success: true,
            message: 'Science fair project created successfully.',
            data: createdRows[0]
        });
    } catch (err) {
        next(err);
    }
});

/**
 * 4. PUT /api/projects/:id
 * Update an existing project record.
 */
app.put('/api/projects/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID. Must be a positive integer.'
            });
        }

        // Check if record exists
        const [existing] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot update: Project with ID ${id} was not found.`
            });
        }

        const current = existing[0];
        const {
            project_title,
            student_name,
            category,
            score,
            booth_number,
            status,
            abstract_text
        } = req.body;

        const updatedTitle = project_title !== undefined ? project_title.trim() : current.project_title;
        const updatedStudent = student_name !== undefined ? student_name.trim() : current.student_name;
        const updatedCategory = category !== undefined ? category.trim() : current.category;
        const updatedScore = score !== undefined ? parseFloat(score) : current.score;
        const updatedBooth = booth_number !== undefined ? parseInt(booth_number, 10) : current.booth_number;
        const updatedStatus = status !== undefined ? status.trim() : current.status;
        const updatedAbstract = abstract_text !== undefined ? abstract_text.trim() : current.abstract_text;

        const updateSql = `
            UPDATE projects
            SET project_title = ?, student_name = ?, category = ?, score = ?, booth_number = ?, status = ?, abstract_text = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        const params = [
            updatedTitle,
            updatedStudent,
            updatedCategory,
            updatedScore,
            updatedBooth,
            updatedStatus,
            updatedAbstract,
            id
        ];

        await db.query(updateSql, params);

        // Fetch updated record
        const [updatedRows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: `Project with ID ${id} updated successfully.`,
            data: updatedRows[0]
        });
    } catch (err) {
        next(err);
    }
});

/**
 * 5. DELETE /api/projects/:id
 * Remove a project record by its primary key ID.
 */
app.delete('/api/projects/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID. Must be a positive integer.'
            });
        }

        // Fetch target record prior to deletion to return confirmation details
        const [existing] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Cannot delete: Project with ID ${id} was not found.`
            });
        }

        const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);

        res.status(200).json({
            success: true,
            message: `Project with ID ${id} ("${existing[0].project_title}") was successfully deleted.`,
            deletedRecord: existing[0]
        });
    } catch (err) {
        next(err);
    }
});

// ====================================================================
// 404 & Global Error Handler (JSON Standard)
// ====================================================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.method} ${req.originalUrl} not found on this server.`
    });
});

app.use((err, req, res, next) => {
    console.error('[Unhandled Server Error]', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error occurred.',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message
    });
});

// ====================================================================
// Server Lifecycle Bootstrap
// ====================================================================
async function startServer() {
    try {
        await db.initDb();
        app.listen(PORT, () => {
            console.log('====================================================');
            console.log(`  Mulungushi University - ICT251 Activity 4 CRUD API`);
            console.log(`  Student: Achizima Marvelous Mpashi (202511543)`);
            console.log(`  Server running at: http://localhost:${PORT}`);
            console.log(`  API Base URL:       http://localhost:${PORT}/api/projects`);
            console.log('====================================================');
        });
    } catch (error) {
        console.error('Fatal failure starting server:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    startServer();
}

module.exports = app;
