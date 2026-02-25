const appContent = document.getElementById('app-content');

// NOTE: Update this URL after deploying your backend to Render!
const API_URL = 'https://studymaterial-0cbq.onrender.com'; 

const departments = ['BS&H', 'CSE', 'DS', 'EEE', 'MECH', 'ECE'];
const semesters = ['SEM-3', 'SEM-4', 'SEM-5', 'SEM-6', 'SEM-7'];

let globalMaterialsData = [];
let searchIndex = [];

window.onload = async () => {
    initTheme(); 
    await fetchGlobalMaterials(); 
    goHome();
};

async function fetchGlobalMaterials() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            globalMaterialsData = await response.json();
            buildSearchIndex();
        }
    } catch (error) {
        console.error("Backend not reachable.", error);
    }
}

function initTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('#theme-btn i').classList.replace('fa-moon', 'fa-sun');
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    const themeBtnIcon = document.querySelector('#theme-btn i');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeBtnIcon.classList.replace(isDark ? 'fa-moon' : 'fa-sun', isDark ? 'fa-sun' : 'fa-moon');
}

function buildSearchIndex() {
    searchIndex = [];
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
    const results = searchIndex.filter(item => item.name.toLowerCase().includes(query) || item.context.toLowerCase().includes(query));
    document.getElementById('about-section').style.display = 'none';
    
    let html = `<div class="view-header"><div class="header-left"><button class="back-btn" onclick="clearSearchAndGoHome()"><i class="fas fa-arrow-left"></i> Back</button><h2>Search Results</h2></div></div><div class="grid-container">`;
    if (results.length === 0) html += `<p>No matches found.</p>`;
    else results.forEach((res, i) => html += `<div class="card" onclick="openSearchResult('${res.context}', '${res.name}')"><div class="icon-placeholder"><i class="fas fa-search"></i></div><h3>${res.name}</h3><p style="font-size:0.8rem;color:var(--color-2)">${res.context}</p></div>`);
    appContent.innerHTML = html + `</div>`;
}

function clearSearchAndGoHome() { document.getElementById('search-input').value = ''; goHome(); }
function openSearchResult(context, name) { document.getElementById('search-input').value = ''; renderMaterials(context, name); }

function goHome() {
    document.getElementById('main-search').style.display = 'flex';
    document.getElementById('about-section').style.display = 'block'; 
    let html = `<div class="grid-container">`;
    departments.forEach(dept => html += `<div class="card" onclick="openDepartment('${dept}')"><div class="icon-placeholder"><i class="fas fa-graduation-cap"></i></div><h3>${dept}</h3></div>`);
    appContent.innerHTML = html + `</div>`;
}

function openDepartment(dept) {
    document.getElementById('about-section').style.display = 'none'; 
    if (dept === 'BS&H') renderSubjects(dept, 'ALL'); else renderSemesters(dept);
}

function renderSemesters(dept) {
    let html = `<div class="view-header"><div class="header-left"><button class="back-btn" onclick="goHome()"><i class="fas fa-arrow-left"></i> Back</button><h2>${dept} Semesters</h2></div></div><div class="grid-container">`;
    semesters.forEach(sem => html += `<div class="card" onclick="renderSubjects('${dept}', '${sem}')"><div class="icon-placeholder"><i class="fas fa-layer-group"></i></div><h3>${sem}</h3></div>`);
    appContent.innerHTML = html + `</div>`;
}

function renderSubjects(dept, sem) {
    const title = sem === 'ALL' ? dept : `${dept} - ${sem}`;
    const backAction = sem === 'ALL' ? `goHome()` : `renderSemesters('${dept}')`;
    const contextStr = sem === 'ALL' ? dept : `${dept} - ${sem}`;
    const relevantMaterials = globalMaterialsData.filter(m => m.department === dept && m.semester === sem);
    const uniqueSubjects = [...new Set(relevantMaterials.map(m => m.subject))];

    let html = `<div class="view-header"><div class="header-left"><button class="back-btn" onclick="${backAction}"><i class="fas fa-arrow-left"></i> Back</button><h2>${title}</h2></div></div>`;
    if (uniqueSubjects.length === 0) html += `<p>No subjects uploaded yet.</p>`;
    else {
        html += `<div class="grid-container">`;
        uniqueSubjects.forEach(sub => html += `<div class="card" onclick="renderMaterials('${contextStr}', '${sub}')"><div class="icon-placeholder"><i class="fas fa-book"></i></div><h3>${sub}</h3></div>`);
        html += `</div>`;
    }
    appContent.innerHTML = html;
}

function renderMaterials(context, subjectName) {
    const parts = context.split(' - ');
    const dept = parts[0]; const sem = parts.length > 1 ? parts[1] : 'ALL';
    const backAction = `renderSubjects('${dept}', '${sem}')`;
    const filesForSubject = globalMaterialsData.filter(m => m.department === dept && m.semester === sem && m.subject === subjectName);

    let html = `<div class="view-header"><div class="header-left"><button class="back-btn" onclick="${backAction}"><i class="fas fa-arrow-left"></i> Back</button><h2>${context} > ${subjectName}</h2></div></div><div class="material-list">`;
    if (filesForSubject.length === 0) html += `<p>No files available yet.</p>`;
    else filesForSubject.forEach(file => html += `<div class="material-item"><h4>${file.title}</h4><div class="material-actions"><a href="${file.link}" target="_blank" class="btn btn-view"><i class="fas fa-eye"></i> View</a><a href="${file.link}" download class="btn btn-download"><i class="fas fa-download"></i> Download</a></div></div>`);
    appContent.innerHTML = html + `</div>`;
}

// ADMIN DASHBOARD
let currentEditingId = null; 

async function openAdminPanel() {
    document.getElementById('about-section').style.display = 'none';
    document.getElementById('main-search').style.display = 'none'; 
    await fetchGlobalMaterials();

    let html = `
        <div class="view-header"><div class="header-left"><h2>Admin Dashboard</h2></div><button class="logout-btn" onclick="goHome()">Logout</button></div>
        <div class="admin-dashboard">
            <div>
                <h3>Add / Modify Material</h3>
                <form id="admin-form" class="admin-form" onsubmit="handleAdminSubmit(event)">
                    <div class="form-group"><label>Department</label><select id="admin-dept" required><option value="" disabled selected>Select Department</option>${departments.map(d => `<option value="${d}">${d}</option>`).join('')}</select></div>
                    <div class="form-group"><label>Semester</label><select id="admin-sem" required><option value="" disabled selected>Select Semester</option><option value="ALL">N/A (For BS&H)</option>${semesters.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
                    <div class="form-group"><label>Subject</label><input type="text" id="admin-sub" required></div>
                    <div class="form-group"><label>File Title</label><input type="text" id="admin-title" required></div>
                    <div class="form-group"><label>Upload PDF File</label><input type="file" id="admin-file" accept="application/pdf, .doc, .docx" required><small id="current-file-link" style="display:none;"></small></div>
                    <button type="submit" class="btn-submit" id="submit-btn">Save Material</button>
                    <button type="button" class="btn-submit" style="background:#6c757d; display:none;" id="cancel-edit-btn" onclick="cancelEdit()">Cancel Edit</button>
                </form>
            </div>
            <div>
                <h3>Manage Existing Files</h3>
                <div class="admin-table-container"><table class="admin-table"><thead><tr><th>Title</th><th>Subject</th><th>Actions</th></tr></thead><tbody id="admin-table-body"></tbody></table></div>
            </div>
        </div>
    `;
    appContent.innerHTML = html;
    renderAdminTable();
}

function renderAdminTable() {
    const tbody = document.getElementById('admin-table-body');
    tbody.innerHTML = '';
    if (globalMaterialsData.length === 0) return tbody.innerHTML = '<tr><td colspan="3">No files found.</td></tr>';
    
    [...globalMaterialsData].sort((a, b) => a.subject.localeCompare(b.subject)).forEach(mat => {
        tbody.innerHTML += `<tr><td>${mat.title}</td><td><small>${mat.department} ${mat.semester==='ALL'?'':mat.semester}</small><br>${mat.subject}</td><td class="action-btns"><button type="button" class="btn-edit" onclick="editMaterial('${mat._id}', '${mat.department}', '${mat.semester}', '${mat.subject}', '${mat.title}', '${mat.link}')"><i class="fas fa-edit"></i></button><button type="button" class="btn-delete" onclick="deleteMaterial('${mat._id}')"><i class="fas fa-trash-alt"></i></button></td></tr>`;
    });
}

async function handleAdminSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('department', document.getElementById('admin-dept').value);
    formData.append('semester', document.getElementById('admin-sem').value);
    formData.append('subject', document.getElementById('admin-sub').value.trim());
    formData.append('title', document.getElementById('admin-title').value.trim());
    
    const fileInput = document.getElementById('admin-file');
    if (fileInput.files.length > 0) formData.append('file', fileInput.files[0]);

    document.getElementById('submit-btn').textContent = "Uploading..."; // UX feedback

    try {
        const response = await fetch(currentEditingId ? `${API_URL}/${currentEditingId}` : API_URL, {
            method: currentEditingId ? 'PUT' : 'POST',
            body: formData
        });

        if (response.ok) {
            cancelEdit(); await fetchGlobalMaterials(); renderAdminTable(); 
        } else alert('Failed to save material.');
    } catch (error) {
        alert("Error connecting to database.");
    }
}

function editMaterial(id, dept, sem, sub, title, link) {
    currentEditingId = id;
    document.getElementById('admin-dept').value = dept; document.getElementById('admin-sem').value = sem;
    document.getElementById('admin-sub').value = sub; document.getElementById('admin-title').value = title;
    
    document.getElementById('admin-file').required = false;
    document.getElementById('current-file-link').style.display = 'block';
    document.getElementById('current-file-link').innerHTML = `Current: <a href="${link}" target="_blank">View PDF</a>`;
    document.getElementById('submit-btn').textContent = "Update Material";
    document.getElementById('cancel-edit-btn').style.display = 'inline-block';
}

function cancelEdit() {
    currentEditingId = null; document.getElementById('admin-form').reset();
    document.getElementById('admin-file').required = true; document.getElementById('current-file-link').style.display = 'none';
    document.getElementById('submit-btn').textContent = "Save Material"; document.getElementById('cancel-edit-btn').style.display = 'none';
}

async function deleteMaterial(id) {
    if(!confirm("Delete this file permanently?")) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) { await fetchGlobalMaterials(); renderAdminTable(); }
    } catch (error) { console.error("Delete Error:", error); }
}