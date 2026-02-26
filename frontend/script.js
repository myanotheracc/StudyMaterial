// ==========================================
// 1. SUPABASE CONNECTION (PASTE YOUR KEYS HERE)
// ==========================================
const supabaseUrl = 'https://iztuarghbjvypxicmfvl.supabase.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6dHVhcmdoYmp2eXB4aWNtZnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMDU5NTUsImV4cCI6MjA4NzY4MTk1NX0.SGiEk9JZTOGg5AkHsVKz8HgqyxA776_NCoMzqb6PxY8';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ==========================================
// 2. STATE & CONFIGURATION
// ==========================================
const appContent = document.getElementById('app-content');
const departments = ['BS&H', 'CSE', 'DS', 'EEE', 'MECH', 'ECE'];
const semesters = ['SEM-1', 'SEM-2', 'SEM-3', 'SEM-4', 'SEM-5', 'SEM-6', 'SEM-7', 'SEM-8'];
let isAdmin = false; 

// ==========================================
// 3. NAVIGATION LISTENERS
// ==========================================
document.getElementById('nav-home').addEventListener('click', () => {
    isAdmin = false;
    renderStudentView();
});

document.getElementById('nav-login').addEventListener('click', () => {
    const password = prompt("Enter Admin Password:");
    if (password === 'madhu') {
        isAdmin = true;
        renderAdminView();
    } else {
        alert('Incorrect Password');
    }
});

// ==========================================
// 4. RENDER VIEWS (UI)
// ==========================================
function renderStudentView() {
    appContent.innerHTML = `
        <div class="row mb-4 justify-content-center">
            <div class="col-md-4 mb-2">
                <select id="filter-dept" class="form-select shadow-sm">
                    <option value="">Select Department</option>
                    ${departments.map(d => `<option value="${d}">${d}</option>`).join('')}
                </select>
            </div>
            <div class="col-md-4 mb-2">
                <select id="filter-sem" class="form-select shadow-sm">
                    <option value="">Select Semester</option>
                    ${semesters.map(s => `<option value="${s}">${s}</option>`).join('')}
                </select>
            </div>
            <div class="col-md-2 mb-2 d-grid">
                <button id="search-btn" class="btn btn-primary shadow-sm">Search</button>
            </div>
        </div>
        <div id="results" class="row mt-4">
            <p class="text-center text-muted mt-5">Select a department and semester to find study materials.</p>
        </div>
    `;

    document.getElementById('search-btn').addEventListener('click', () => fetchMaterials(false));
}

function renderAdminView() {
    appContent.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-bold text-primary">Admin Dashboard</h3>
        </div>
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card p-4 shadow border-0">
                    <h5 class="mb-3 text-secondary">Upload Material</h5>
                    <form id="uploadForm">
                        <select id="department" class="form-select mb-3" required>
                            <option value="">Select Department</option>
                            ${departments.map(d => `<option value="${d}">${d}</option>`).join('')}
                        </select>
                        <select id="semester" class="form-select mb-3" required>
                            <option value="">Select Semester</option>
                            ${semesters.map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                        <input type="text" id="subject" class="form-control mb-3" placeholder="Subject Name (e.g. OS)" required>
                        <input type="text" id="title" class="form-control mb-3" placeholder="File Title (e.g. Unit 1 Notes)" required>
                        <input type="file" id="fileInput" class="form-control mb-4" accept="application/pdf" required>
                        <button type="submit" class="btn btn-success w-100 fw-bold shadow-sm">Save Material</button>
                    </form>
                </div>
            </div>
            
            <div class="col-md-8">
                <div class="card shadow border-0">
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover table-striped align-middle mb-0">
                                <thead class="table-dark">
                                    <tr>
                                        <th class="ps-4">Title</th>
                                        <th>Subject</th>
                                        <th>Dept / Sem</th>
                                        <th class="text-end pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="materialsTableBody">
                                    <tr><td colspan="4" class="text-center py-4 text-muted">Loading files from database...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('uploadForm').addEventListener('submit', uploadMaterial);
    fetchMaterials(true); // Automatically load all files into the admin table
}

// ==========================================
// 5. DATABASE OPERATIONS (SUPABASE)
// ==========================================
async function fetchMaterials(isAdminTable = false) {
    try {
        let query = supabase.from('materials').select('*').order('created_at', { ascending: false });

        if (!isAdminTable) {
            const dept = document.getElementById('filter-dept').value;
            const sem = document.getElementById('filter-sem').value;
            
            if (!dept || !sem) {
                alert('Please select both Department and Semester');
                return;
            }
            // Filter by exactly what the student searched for
            query = query.eq('department', dept).eq('semester', sem);
        }

        const { data: materials, error } = await query;
        if (error) throw error;

        if (isAdminTable) {
            displayAdminTable(materials);
        } else {
            displayStudentResults(materials);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load materials.");
    }
}

async function uploadMaterial(e) {
    e.preventDefault();

    const department = document.getElementById('department').value;
    const semester = document.getElementById('semester').value;
    const subject = document.getElementById('subject').value.toUpperCase();
    const title = document.getElementById('title').value;
    
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) return alert("Please select a file");

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Uploading... Please wait.';
    submitBtn.disabled = true;

    try {
        // 1. Create a safe, unique file name
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // 2. Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('study-materials')
            .upload(uniqueFileName, file);

        if (uploadError) throw uploadError;

        // 3. Get the public URL for the newly uploaded file
        const { data: publicUrlData } = supabase.storage
            .from('study-materials')
            .getPublicUrl(uniqueFileName);
            
        const file_url = publicUrlData.publicUrl;

        // 4. Save the text metadata to the Supabase Database
        const { error: dbError } = await supabase
            .from('materials')
            .insert([{ department, semester, subject, title, file_url }]);

        if (dbError) throw dbError;

        alert("Material saved successfully!");
        e.target.reset();
        fetchMaterials(true); // Refresh admin table

    } catch (err) {
        console.error("Upload error:", err);
        alert("Failed to save material. See console for details.");
    } finally {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
    }
}

window.deleteMaterial = async function(id, fileUrl) {
    if (!confirm('Are you sure you want to delete this file permanently?')) return;

    try {
        // 1. Extract filename from URL so we can delete it from Storage
        const urlParts = fileUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];

        // 2. Delete from Supabase Storage
        const { error: storageError } = await supabase.storage
            .from('study-materials')
            .remove([fileName]);

        if (storageError) throw storageError;

        // 3. Delete from Supabase Database
        const { error: dbError } = await supabase
            .from('materials')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        fetchMaterials(true); // Refresh admin table
    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete file.");
    }
};

// ==========================================
// 6. DISPLAY DATA ON SCREEN
// ==========================================
function displayStudentResults(materials) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (materials.length === 0) {
        resultsDiv.innerHTML = `
            <div class="col-12 text-center mt-4">
                <h5 class="text-muted">No materials found for this selection.</h5>
            </div>`;
        return;
    }

    materials.forEach(mat => {
        resultsDiv.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm border-0 bg-white">
                    <div class="card-body text-center pt-4">
                        <h5 class="card-title fw-bold text-primary mb-1">${mat.subject}</h5>
                        <p class="card-text text-dark mb-3">${mat.title}</p>
                        <span class="badge bg-light text-dark border shadow-sm">${mat.department}</span>
                        <span class="badge bg-light text-dark border shadow-sm">${mat.semester}</span>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-4 text-center">
                         <a href="${mat.file_url}" target="_blank" class="btn btn-outline-primary px-4 rounded-pill">View PDF</a>
                    </div>
                </div>
            </div>
        `;
    });
}

function displayAdminTable(materials) {
    const tbody = document.getElementById('materialsTableBody');
    if(!tbody) return;

    tbody.innerHTML = '';

    if (materials.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No files uploaded yet.</td></tr>';
        return;
    }

    materials.forEach(mat => {
        tbody.innerHTML += `
            <tr>
                <td class="ps-4 fw-medium">${mat.title}</td>
                <td class="text-primary fw-bold">${mat.subject}</td>
                <td><span class="badge bg-secondary">${mat.department}</span> <span class="badge bg-info text-dark">${mat.semester}</span></td>
                <td class="text-end pe-4">
                    <a href="${mat.file_url}" target="_blank" class="btn btn-sm btn-outline-primary me-1">View</a>
                    <button class="btn btn-sm btn-danger shadow-sm" onclick="deleteMaterial('${mat.id}', '${mat.file_url}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

// ==========================================
// START APP
// ==========================================
renderStudentView(); // Show student view on load