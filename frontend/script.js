// ============================================================================
// ⚙️ APP STATE & CONSTANTS
// ============================================================================
const supabaseUrl = 'https://gcfgosgkcxpjaxuxumsl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZmdvc2drY3hwamF4dXh1bXNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMzc1MDksImV4cCI6MjA4NzcxMzUwOX0.MCkWjf-9I3C8Vv-bxh-PWs3Rr8XSmn4R80tINvoVwT4';

// FIX: Renamed 'supabase' to 'supabaseClient' to prevent crashing with the CDN
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// Constants for UI Structure (Dropdowns & Home Page Cards)
const departments = ['BS&H', 'CSE', 'DS', 'EEE', 'MECH', 'ECE'];
const semesters = ['SEM-3', 'SEM-4', 'SEM-5', 'SEM-6', 'SEM-7'];

// App Content Container
const appContent = document.getElementById('app-content');

// Global variable to store the database data
let globalMaterialsData = [];
let searchIndex = [];

// ============================================================================
// 🚀 INITIALIZATION & DATA FETCHING
// ============================================================================
window.onload = async () => {
    initTheme(); 
    await fetchGlobalMaterials(); // Load DB before rendering
    goHome();
};

async function fetchGlobalMaterials() {
    try {
        // Fetch all rows from Supabase 'materials' table
        const { data, error } = await supabaseClient
            .from('materials')
            .select('*');

        if (error) throw error;

        // FIX: Ensure data is an array before mapping
        const safeData = data || [];

        // Map Supabase columns (id, file_url) to match your UI's expected format
        globalMaterialsData = safeData.map(item => ({
            ...item,
            _id: item.id,
            link: item.file_url 
        }));
        
        buildSearchIndex();
    } catch (error) {
        console.error("Failed to fetch database:", error);
    }
}

// ============================================================================
// 🌙 DARK MODE TOGGLE LOGIC
// ============================================================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeBtnIcon = document.querySelector('#theme-btn i');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtnIcon.classList.replace('fa-moon', 'fa-sun');
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    const themeBtnIcon = document.querySelector('#theme-btn i');
    if (isDark) {
        localStorage.setItem('theme', 'dark');
        themeBtnIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        themeBtnIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

// ============================================================================
// 🔍 DYNAMIC SEARCH ENGINE
// ============================================================================
function buildSearchIndex() {
    searchIndex = [];
    
    // Extract unique subjects across the entire database to build search suggestions
    const uniqueEntries = new Set();

    globalMaterialsData.forEach(mat => {
        const contextStr = mat.department === 'BS&H' ? 'BS&H' : `${mat.department} - ${mat.semester}`;
        const uniqueKey = `${contextStr} - ${mat.subject}`;
        
        if (!uniqueEntries.has(uniqueKey)) {
            uniqueEntries.add(uniqueKey);
            searchIndex.push({ name: mat.subject, context: contextStr });
        }
    });
}

function handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    if (query.trim() === '') return goHome();

    const results = searchIndex.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.context.toLowerCase().includes(query)
    );

    document.getElementById('about-section').style.display = 'none';

    let html = `
        <div class="view-header">
            <div class="header-left">
                <button class="back-btn" onclick="clearSearchAndGoHome()"><i class="fas fa-arrow-left"></i> Back</button>
                <h2>Search Results for "${query}"</h2>
            </div>
        </div>
        <div class="grid-container">
    `;

    if (results.length === 0) {
        html += `<p style="color: var(--text-light); width: 100%;">No matches found in database.</p>`;
    } else {
        results.forEach((res, index) => {
            html += `
                <div class="card" style="animation-delay: ${index * 0.05}s" onclick="openSearchResult('${res.context}', '${res.name}')">
                    <div class="icon-placeholder"><i class="fas fa-search"></i></div>
                    <h3>${res.name}</h3>
                    <p style="font-size: 0.8rem; color: var(--color-2); margin-top: -0.5rem;">${res.context}</p>
                </div>
            `;
        });
    }
    html += `</div>`;
    appContent.innerHTML = html;
}

function clearSearchAndGoHome() {
    document.getElementById('search-input').value = '';
    goHome();
}

function openSearchResult(context, name) {
    document.getElementById('search-input').value = ''; 
    renderMaterials(context, name); 
}

// ============================================================================
// 🖥️ DYNAMIC VIEW RENDERING (Navigation)
// ============================================================================
function goHome() {
    document.getElementById('main-search').style.display = 'flex';
    document.getElementById('about-section').style.display = 'block'; 
    let html = `<div class="grid-container">`;
    
    departments.forEach((dept, index) => {
        html += `
            <div class="card" style="animation-delay: ${index * 0.1}s" onclick="openDepartment('${dept}')">
                <div class="icon-placeholder"><i class="fas fa-graduation-cap"></i></div>
                <h3>${dept}</h3>
            </div>
        `;
    });
    html += `</div>`;
    appContent.innerHTML = html;
}

function openDepartment(dept) {
    document.getElementById('about-section').style.display = 'none'; 
    if (dept === 'BS&H') renderSubjects(dept, 'ALL');
    else renderSemesters(dept);
}

function renderSemesters(dept) {
    let html = `
        <div class="view-header">
            <div class="header-left">
                <button class="back-btn" onclick="goHome()"><i class="fas fa-arrow-left"></i> Back</button>
                <h2>${dept} - Select Semester</h2>
            </div>
        </div>
        <div class="grid-container">
    `;
    semesters.forEach((sem, index) => {
        html += `
            <div class="card" style="animation-delay: ${index * 0.1}s" onclick="renderSubjects('${dept}', '${sem}')">
                <div class="icon-placeholder"><i class="fas fa-layer-group"></i></div>
                <h3>${sem}</h3>
            </div>
        `;
    });
    html += `</div>`;
    appContent.innerHTML = html;
}

function renderSubjects(dept, sem) {
    const title = sem === 'ALL' ? `${dept}` : `${dept} - ${sem}`;
    const backAction = sem === 'ALL' ? `goHome()` : `renderSemesters('${dept}')`;
    const contextStr = sem === 'ALL' ? dept : `${dept} - ${sem}`;
    
    // Filter database for materials that belong to this exact Department and Semester
    const relevantMaterials = globalMaterialsData.filter(m => m.department === dept && m.semester === sem);
    
    // Extract unique subjects from those materials
    const uniqueSubjects = [...new Set(relevantMaterials.map(m => m.subject))];

    let html = `
        <div class="view-header">
            <div class="header-left">
                <button class="back-btn" onclick="${backAction}"><i class="fas fa-arrow-left"></i> Back</button>
                <h2>${title}</h2>
            </div>
        </div>
    `;

    if (uniqueSubjects.length === 0) {
        html += `<p style="color: var(--text-light);">No subjects uploaded for this semester yet.</p>`;
    } else {
        html += `<div class="grid-container">`;
        uniqueSubjects.forEach((sub, index) => {
            html += `
                <div class="card" style="animation-delay: ${index * 0.1}s" onclick="renderMaterials('${contextStr}', '${sub}')">
                    <div class="icon-placeholder"><i class="fas fa-book"></i></div>
                    <h3>${sub}</h3>
                </div>
            `;
        });
        html += `</div>`;
    }

    appContent.innerHTML = html;
}

function renderMaterials(context, subjectName) {
    const parts = context.split(' - ');
    const dept = parts[0];
    const sem = parts.length > 1 ? parts[1] : 'ALL';
    const backAction = `renderSubjects('${dept}', '${sem}')`;

    // Fetch all files mapped to this specific subject
    const filesForSubject = globalMaterialsData.filter(m => 
        m.department === dept && m.semester === sem && m.subject === subjectName
    );

    let html = `
        <div class="view-header">
            <div class="header-left">
                <button class="back-btn" onclick="${backAction}"><i class="fas fa-arrow-left"></i> Back</button>
                <h2>${context} > ${subjectName}</h2>
            </div>
        </div>
        <div class="material-list">
    `;

    if (filesForSubject.length === 0) {
        html += `<p>No files available yet.</p>`;
    } else {
        filesForSubject.forEach((file, index) => {
            html += `
                <div class="material-item" style="animation-delay: ${index * 0.1}s">
                    <h4>${file.title}</h4>
                    <div class="material-actions">
                        <a href="${file.link}" target="_blank" class="btn btn-view"><i class="fas fa-eye"></i> View</a>
                        <a href="${file.link}" download class="btn btn-download"><i class="fas fa-download"></i> Download</a>
                    </div>
                </div>
            `;
        });
    }

    html += `</div>`;
    appContent.innerHTML = html;
}

// ============================================================================
// 🛡️ FULL-STACK ADMIN DASHBOARD LOGIC (WITH SUPABASE)
// ============================================================================
let currentEditingId = null; 

async function openAdminPanel() {
    document.getElementById('about-section').style.display = 'none';
    document.getElementById('main-search').style.display = 'none'; 
    
    await fetchGlobalMaterials();

    let html = `
        <div class="view-header">
            <div class="header-left">
                <h2>BCET Study Portal - Admin Dashboard</h2>
            </div>
            <button class="logout-btn" onclick="goHome()">Logout</button>
        </div>
        
        <div class="admin-dashboard">
            <div>
                <h3 id="form-title">Add / Modify Material</h3>
                <form id="admin-form" class="admin-form" onsubmit="handleAdminSubmit(event)">
                    <div class="form-group">
                        <label>Department</label>
                        <select id="admin-dept" required>
                            <option value="" disabled selected>Select Department</option>
                            ${departments.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Semester</label>
                        <select id="admin-sem" required>
                            <option value="" disabled selected>Select Semester</option>
                            <option value="ALL">N/A (For BS&H)</option>
                            ${semesters.map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Subject (Case Sensitive)</label>
                        <input type="text" id="admin-sub" placeholder="e.g. OPERATING SYSTEM" required>
                    </div>
                    <div class="form-group">
                        <label>File Title</label>
                        <input type="text" id="admin-title" placeholder="e.g. Unit 1 Notes" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Upload PDF File</label>
                        <input type="file" id="admin-file" accept="application/pdf" required>
                        <small id="current-file-link" style="display:none; margin-top: 5px;"></small>
                    </div>

                    <button type="submit" class="btn-submit" id="submit-btn">Save Material</button>
                    <button type="button" class="btn-submit" style="background:#6c757d; margin-top:5px; display:none;" id="cancel-edit-btn" onclick="cancelEdit()">Cancel Edit</button>
                </form>
            </div>

            <div>
                <h3>Manage Existing Files</h3>
                <div class="admin-table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Subject</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="admin-table-body">
                            </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    appContent.innerHTML = html;
    renderAdminTable();
}

function renderAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '';
    
    if (globalMaterialsData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">No files found in database.</td></tr>';
        return;
    }

    const sortedData = [...globalMaterialsData].sort((a, b) => a.subject.localeCompare(b.subject));

    sortedData.forEach(mat => {
        tbody.innerHTML += `
            <tr>
                <td>${mat.title}</td>
                <td><small style="color:var(--text-light)">${mat.department} ${mat.semester==='ALL'?'':mat.semester}</small><br>${mat.subject}</td>
                <td class="action-btns">
                    <button type="button" class="btn-edit" onclick="editMaterial('${mat._id}', '${mat.department}', '${mat.semester}', '${mat.subject}', '${mat.title}', '${mat.link}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button type="button" class="btn-delete" onclick="deleteMaterial('${mat._id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `;
    });
}

async function handleAdminSubmit(event) {
    event.preventDefault();
    
    const department = document.getElementById('admin-dept').value;
    const semester = document.getElementById('admin-sem').value;
    const subject = document.getElementById('admin-sub').value.trim().toUpperCase();
    const title = document.getElementById('admin-title').value.trim();
    
    const fileInput = document.getElementById('admin-file');
    const file = fileInput.files.length > 0 ? fileInput.files[0] : null;

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Uploading to Cloud...';
    submitBtn.disabled = true;

    try {
        let file_url = null;

        // 1. Upload new file to Supabase Storage if one was selected
        if (file) {
            const fileExt = file.name.split('.').pop();
            const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            
            const { error: uploadError } = await supabaseClient.storage
                .from('study-materials')
                .upload(uniqueFileName, file);

            if (uploadError) throw uploadError;

            // Get the live public URL
            const { data: publicUrlData } = supabaseClient.storage
                .from('study-materials')
                .getPublicUrl(uniqueFileName);
                
            file_url = publicUrlData.publicUrl;
        }

        // 2. Prepare text data for Database
        const payload = { department, semester, subject, title };
        if (file_url) payload.file_url = file_url;

        // 3. Save to Supabase Database (Update or Insert)
        if (currentEditingId) {
            const { error: dbError } = await supabaseClient
                .from('materials')
                .update(payload)
                .eq('id', currentEditingId);
                
            if (dbError) throw dbError;
        } else {
            if (!file_url) throw new Error("A file is required for new uploads.");
            
            const { error: dbError } = await supabaseClient
                .from('materials')
                .insert([payload]);
                
            if (dbError) throw dbError;
        }

        alert('Material saved successfully!');
        cancelEdit(); 
        await fetchGlobalMaterials(); 
        renderAdminTable(); 
        
    } catch (error) {
        console.error("Database Error:", error);
        alert(error.message || "Error connecting to database.");
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

function editMaterial(id, dept, sem, sub, title, link) {
    currentEditingId = id;
    document.getElementById('admin-dept').value = dept;
    document.getElementById('admin-sem').value = sem;
    document.getElementById('admin-sub').value = sub;
    document.getElementById('admin-title').value = title;
    
    // When editing, we don't force them to upload a new file
    document.getElementById('admin-file').required = false;
    document.getElementById('current-file-link').style.display = 'block';
    document.getElementById('current-file-link').innerHTML = `Current: <a href="${link}" target="_blank" style="color:var(--color-4)">View PDF</a> (Upload new to replace)`;
    
    document.getElementById('submit-btn').textContent = "Update Material";
    document.getElementById('cancel-edit-btn').style.display = 'block';
}

function cancelEdit() {
    currentEditingId = null;
    document.getElementById('admin-form').reset();
    document.getElementById('admin-file').required = true;
    document.getElementById('current-file-link').style.display = 'none';
    document.getElementById('submit-btn').textContent = "Save Material";
    document.getElementById('cancel-edit-btn').style.display = 'none';
}

async function deleteMaterial(id) {
    if(!confirm("Are you sure you want to delete this file permanently?")) return;
    try {
        // 1. Delete the file from the Storage bucket first
        const material = globalMaterialsData.find(m => m._id === id);
        if (material && material.link) {
            const urlParts = material.link.split('/');
            const fileName = urlParts[urlParts.length - 1];
            await supabaseClient.storage.from('study-materials').remove([fileName]);
        }

        // 2. Delete the row from the Database
        const { error } = await supabaseClient
            .from('materials')
            .delete()
            .eq('id', id);
            
        if (error) throw error;

        await fetchGlobalMaterials(); 
        renderAdminTable(); 
    } catch (error) {
        console.error("Delete Error:", error);
        alert("Failed to delete material.");
    }
}