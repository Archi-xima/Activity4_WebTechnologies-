/**
 * ====================================================================
 * Mulungushi University - Department of Computer Science
 * ICT251: Web Technologies - Activity 4
 * Single-Table CRUD REST Frontend Logic
 *
 * Student Name:   Achizima Marvelous Mpashi
 * Student Number: 202511543
 * Program:        Data Science
 * Theme:          Question 13 — Science Fair Projects
 * Client Module:  app.js
 * ====================================================================
 */

// Resilient Dual-Connection Architecture:
// Primary: Relative '/api/projects' when served from Express/Render, or localhost:3000
// Secondary Fallback: Live Cloud Deployment on Render
const CLOUD_API_FALLBACK = 'https://activity4-webtechnologies.onrender.com/api/projects';

let activeApiUrl = (() => {
    if (window.location.protocol === 'file:') {
        return CLOUD_API_FALLBACK;
    }
    if (window.location.port === '5500' || window.location.port === '5501' || window.location.port === '8080') {
        return 'http://localhost:3000/api/projects';
    }
    return '/api/projects';
})();

// State Management
let projectsState = [];
let isEditing = false;
let currentEditId = null;

// DOM Elements Cache
const projectForm = document.getElementById('project-form');
const projectIdInput = document.getElementById('project-id');
const projectTitleInput = document.getElementById('project_title');
const studentNameInput = document.getElementById('student_name');
const categorySelect = document.getElementById('category');
const scoreInput = document.getElementById('score');
const boothInput = document.getElementById('booth_number');
const statusSelect = document.getElementById('status');
const abstractInput = document.getElementById('abstract_text');

const formTitle = document.getElementById('form-title');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');
const editingIndicator = document.getElementById('editing-indicator');
const editingIdBadge = document.getElementById('editing-id-badge');

const tableBody = document.getElementById('projects-table-body');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const filterCategory = document.getElementById('filter-category');
const btnRefresh = document.getElementById('btn-refresh');

// Metric elements
const statTotal = document.getElementById('stat-total');
const statMaxScore = document.getElementById('stat-max-score');
const statAvgScore = document.getElementById('stat-avg-score');
const statCategories = document.getElementById('stat-categories');

// ====================================================================
// Lifecycle Initialization
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    populateCategoryFilter();
    setupEventListeners();
});

function setupEventListeners() {
    projectForm.addEventListener('submit', handleFormSubmit);
    btnCancel.addEventListener('click', resetForm);
    btnRefresh.addEventListener('click', () => {
        fetchProjects();
        showToast('Refreshing records from API...', 'info');
    });

    searchInput.addEventListener('input', renderTable);
    filterCategory.addEventListener('change', renderTable);
}

// ====================================================================
// API Calls: GET, POST, PUT, DELETE with Auto-Failover
// ====================================================================

/**
 * GET: Fetches all project records from the REST API with automatic cloud failover
 */
async function fetchProjects() {
    try {
        const response = await fetch(activeApiUrl);
        if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
        }
        const data = await response.json();
        projectsState = data.data || [];
        renderTable();
        updateMetrics();
        populateCategoryFilter();
    } catch (error) {
        console.warn(`[API] Could not connect to ${activeApiUrl}: ${error.message}`);
        
        // If primary connection failed and we haven't tried cloud fallback yet, switch dynamically
        if (activeApiUrl !== CLOUD_API_FALLBACK && !window.location.origin.includes('onrender.com')) {
            console.log(`[API Auto-Failover] Attempting connection to Live Cloud Backend: ${CLOUD_API_FALLBACK}...`);
            try {
                const fallbackRes = await fetch(CLOUD_API_FALLBACK);
                if (fallbackRes.ok) {
                    const fallbackData = await fallbackRes.json();
                    activeApiUrl = CLOUD_API_FALLBACK;
                    projectsState = fallbackData.data || [];
                    renderTable();
                    updateMetrics();
                    populateCategoryFilter();
                    showToast('Connected to Live Cloud Backend (Render)', 'info');
                    return;
                }
            } catch (fallbackErr) {
                console.error('[API Auto-Failover Failed]', fallbackErr);
            }
        }

        console.error('Fetch error:', error);
        showToast(`Failed to connect to API: ${error.message}. Is backend running on port 3000?`, 'error');
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; color: var(--danger); padding: 24px;">
                    <strong>API Connection Error:</strong> Unable to reach <code>${activeApiUrl}</code>.<br>
                    Please start the Node.js backend: <code>cd backend && npm start</code>
                </td>
            </tr>
        `;
    }
}

/**
 * POST / PUT: Handles submission for creating or updating a record
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    const payload = {
        project_title: projectTitleInput.value.trim(),
        student_name: studentNameInput.value.trim(),
        category: categorySelect.value.trim(),
        score: parseFloat(scoreInput.value),
        booth_number: parseInt(boothInput.value, 10),
        status: statusSelect.value.trim(),
        abstract_text: abstractInput.value.trim()
    };

    // Client-side validation checks
    if (!payload.project_title || !payload.student_name || !payload.category || isNaN(payload.score) || isNaN(payload.booth_number) || !payload.abstract_text) {
        showToast('Please fill out all required fields correctly.', 'error');
        return;
    }

    try {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span>Processing...</span>';

        if (isEditing && currentEditId) {
            // PUT request
            const response = await fetch(`${activeApiUrl}/${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}`);
            }

            showToast(`Project #${currentEditId} successfully updated!`, 'success');
            resetForm();
            await fetchProjects();
        } else {
            // POST request
            const response = await fetch(activeApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}`);
            }

            showToast(`New project created successfully with ID #${result.data.id}!`, 'success');
            resetForm();
            await fetchProjects();
        }
    } catch (error) {
        console.error('Submission error:', error);
        showToast(`Operation failed: ${error.message}`, 'error');
    } finally {
        btnSubmit.disabled = false;
        if (!isEditing) {
            btnSubmit.innerHTML = '<span>Save Record</span>';
        }
    }
}

/**
 * DELETE: Deletes an existing record by ID
 */
async function deleteProject(id, title) {
    const confirmation = confirm(`Are you sure you want to delete Project #${id} ("${title}")? This action cannot be undone.`);
    if (!confirmation) return;

    try {
        const response = await fetch(`${activeApiUrl}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        showToast(`Project #${id} deleted successfully.`, 'success');

        // If we were editing this deleted item, reset the form
        if (isEditing && currentEditId === id) {
            resetForm();
        }

        await fetchProjects();
    } catch (error) {
        console.error('Delete error:', error);
        showToast(`Failed to delete record: ${error.message}`, 'error');
    }
}

/**
 * Loads project details into form to initiate PUT edit workflow
 */
function startEditProject(id) {
    const project = projectsState.find(p => Number(p.id) === Number(id));
    if (!project) {
        showToast(`Project #${id} not found in current dataset.`, 'error');
        return;
    }

    isEditing = true;
    currentEditId = id;

    projectIdInput.value = project.id;
    projectTitleInput.value = project.project_title;
    studentNameInput.value = project.student_name;
    categorySelect.value = project.category;
    scoreInput.value = project.score;
    boothInput.value = project.booth_number;
    statusSelect.value = project.status;
    abstractInput.value = project.abstract_text;

    formTitle.innerHTML = '<span>&#9998;</span> Edit Project Record';
    editingIndicator.style.display = 'block';
    editingIdBadge.textContent = id;
    btnSubmit.innerHTML = '<span>Update Project</span>';
    btnCancel.style.display = 'inline-flex';

    // Smooth scroll to form on mobile viewports
    projectForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Resets form back to Create mode
 */
function resetForm() {
    isEditing = false;
    currentEditId = null;
    projectForm.reset();
    projectIdInput.value = '';

    formTitle.innerHTML = '<span>&#10010;</span> Add New Science Fair Project';
    editingIndicator.style.display = 'none';
    btnSubmit.innerHTML = '<span>Save Record</span>';
    btnCancel.style.display = 'none';
}

// ====================================================================
// UI Rendering & Metrics Calculation
// ====================================================================

function renderTable() {
    const searchTerm = (searchInput.value || '').toLowerCase().trim();
    const selectedCategory = filterCategory.value;

    const filtered = projectsState.filter(project => {
        const matchesSearch = !searchTerm ||
            (project.project_title && project.project_title.toLowerCase().includes(searchTerm)) ||
            (project.student_name && project.student_name.toLowerCase().includes(searchTerm)) ||
            (project.abstract_text && project.abstract_text.toLowerCase().includes(searchTerm));

        const matchesCat = !selectedCategory || project.category === selectedCategory;

        return matchesSearch && matchesCat;
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    tableBody.innerHTML = filtered.map(item => {
        const statusBadgeClass = getStatusBadgeClass(item.status);
        const scoreClass = item.score >= 90 ? 'score-high' : 'score-med';
        const escapedTitle = escapeHtml(item.project_title);
        const escapedStudent = escapeHtml(item.student_name);

        return `
            <tr>
                <td style="font-family: var(--font-mono); font-weight: 700; color: var(--text-muted);">#${item.id}</td>
                <td>
                    <div style="font-weight: 600; color: var(--text-main);">${escapedTitle}</div>
                    <div style="font-size: 0.76rem; color: var(--text-muted); max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${escapeHtml(item.abstract_text)}
                    </div>
                </td>
                <td>
                    <div style="font-weight: 500;">${escapedStudent}</div>
                </td>
                <td>
                    <span style="font-size: 0.8rem; background: var(--primary-light); color: var(--accent); padding: 3px 8px; border-radius: 6px; font-weight: 500;">
                        ${escapeHtml(item.category)}
                    </span>
                </td>
                <td>
                    <span class="score-pill ${scoreClass}">
                        ${Number(item.score).toFixed(1)}
                    </span>
                </td>
                <td style="font-family: var(--font-mono); font-weight: 600;">
                    B-${item.booth_number}
                </td>
                <td>
                    <span class="badge ${statusBadgeClass}">
                        ${escapeHtml(item.status)}
                    </span>
                </td>
                <td style="text-align: right; white-space: nowrap;">
                    <button class="btn btn-sm btn-edit" onclick="startEditProject(${item.id})">
                        &#9998; Edit
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteProject(${item.id}, '${escapedTitle.replace(/'/g, "\\'")}')">
                        &#128465; Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function updateMetrics() {
    statTotal.textContent = projectsState.length;

    if (projectsState.length === 0) {
        statMaxScore.textContent = '-';
        statAvgScore.textContent = '-';
        statCategories.textContent = '0';
        return;
    }

    const scores = projectsState.map(p => Number(p.score)).filter(s => !isNaN(s));
    const maxScore = Math.max(...scores);
    const avgScore = scores.reduce((sum, val) => sum + val, 0) / scores.length;
    const uniqueCats = new Set(projectsState.map(p => p.category));

    statMaxScore.textContent = maxScore.toFixed(1);
    statAvgScore.textContent = avgScore.toFixed(1);
    statCategories.textContent = uniqueCats.size;
}

function populateCategoryFilter() {
    const currentVal = filterCategory.value;
    const categories = Array.from(new Set(projectsState.map(p => p.category))).sort();

    let html = '<option value="">All Categories</option>';
    categories.forEach(cat => {
        const isSelected = cat === currentVal ? 'selected' : '';
        html += `<option value="${escapeHtml(cat)}" ${isSelected}>${escapeHtml(cat)}</option>`;
    });
    filterCategory.innerHTML = html;
}

function getStatusBadgeClass(status) {
    if (!status) return 'badge-review';
    if (status.includes('1st') || status.includes('2nd') || status.includes('3rd') || status.includes('Awarded')) {
        return 'badge-award';
    }
    if (status.includes('Finalist')) {
        return 'badge-finalist';
    }
    return 'badge-review';
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${escapeHtml(message)}</span>
        <button style="background:none; border:none; color:white; font-size:1.1rem; cursor:pointer; margin-left:12px;" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
