// ============================================================================
// ⚙️ APP STATE & INITIAL DATA
// ============================================================================
const appContent = document.getElementById('app-content');

const departments = ['BS&H', 'CSE', 'DS', 'EEE', 'MECH', 'ECE'];
const semesters = ['SEM-3', 'SEM-4', 'SEM-5', 'SEM-6', 'SEM-7'];

// ============================================================================
// 📝 1. THE CURRICULUM DATABASE
// Edit your Subject & Lab names here. Change 'Sub-1' to your actual subjects.
// ============================================================================
const bshData = {
    subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5', 'Sub-6', 'Sub-7', 'Sub-8', 'Sub-9', 'Sub-10'],
    labs: ['Lab-1', 'Lab-2', 'Lab-3', 'Lab-4', 'Lab-5'],
    workshops: ['Workshop-1', 'Workshop-2', 'Workshop-3'],
    courses: ['Course-1', 'Course-2']
};

const defaultSemData = { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] };

// 2. All Other Departments (Organized by Department, then Semester)
// Just replace 'Sub-1' etc. with the actual subject names for that specific semester!
const curriculumData = {
    "CSE": {
        "SEM-3": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-4": { subjects: ['OPERATING SYSTEM', 'FLAT', 'DBMS', 'MEFA', 'PROBABILITY AND STATISTICS'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-5": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-6": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-7": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] }
    },
    "DS": {
        "SEM-3": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-4": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-5": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-6": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-7": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] }
    },
    "EEE": {
        "SEM-3": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-4": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-5": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-6": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-7": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] }
    },
    "MECH": {
        "SEM-3": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-4": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-5": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-6": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-7": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] }
    },
    "ECE": {
        "SEM-3": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-4": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-5": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-6": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] },
        "SEM-7": { subjects: ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'], labs: ['Lab-1', 'Lab-2', 'Lab-3'] }
    }
};

// ============================================================================
// 📝 2. THE FILE LINKS DATABASE
// Paste your PDF links here! The key must exactly match the Department, Semester, and Subject.
// ============================================================================
const fileLinks = {
    
    // Example 1: BS&H Subject 1
    "BS&H - Sub-1": {
        pyq: "#",
        unit1: "#", 
        unit2: "#",
        unit3: "#", 
        unit4: "#",
        unit5: "#"
    },

    // Example 2: CSE Sem 4 Subject 1
    "CSE - SEM-4 - OPERATING SYSTEM": {
        pyq: "#",
        unit1: "./assets/osu1.pdf",
        unit2: "./assets/OS unit 2 print.pdf",
        unit3: "./assets/OS unit 3 print.pdf",
        unit4: "./assets/UNIT IV OS .pdf",
        unit5: "./assets/UNIT V OS.pdf"
    }
    
    // Add more here as you gather files...
};


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
// 🔍 GLOBAL SEARCH ENGINE LOGIC
// ============================================================================
let searchIndex = [];

function buildSearchIndex() {
    searchIndex = [];
    
    // Index BS&H
    bshData.subjects.forEach(sub => searchIndex.push({ name: sub, context: 'BS&H' }));
    bshData.labs.forEach(lab => searchIndex.push({ name: lab, context: 'BS&H' }));
    bshData.workshops.forEach(ws => searchIndex.push({ name: ws, context: 'BS&H' }));
    bshData.courses.forEach(course => searchIndex.push({ name: course, context: 'BS&H' }));

    // Index all other departments dynamically
    departments.filter(d => d !== 'BS&H').forEach(dept => {
        semesters.forEach(sem => {
            const contextStr = `${dept} - ${sem}`;
            if(curriculumData[dept] && curriculumData[dept][sem]) {
                curriculumData[dept][sem].subjects.forEach(sub => searchIndex.push({ name: sub, context: contextStr }));
                curriculumData[dept][sem].labs.forEach(lab => searchIndex.push({ name: lab, context: contextStr }));
            }
        });
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
            <button class="back-btn" onclick="clearSearchAndGoHome()"><i class="fas fa-arrow-left"></i> Back</button>
            <h2>Search Results for "${query}"</h2>
        </div>
        <div class="grid-container">
    `;

    if (results.length === 0) {
        html += `<p style="color: var(--text-light); width: 100%;">No matches found.</p>`;
    } else {
        results.forEach((res, index) => {
            const delay = index * 0.05; 
            html += `
                <div class="card" style="animation-delay: ${delay}s" onclick="openSearchResult('${res.context}', '${res.name}')">
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
// 🖥️ VIEW RENDERING LOGIC (Navigation)
// ============================================================================
function goHome() {
    let html = `<div class="grid-container">`;
    departments.forEach((dept, index) => {
        const delay = index * 0.1; 
        html += `
            <div class="card" style="animation-delay: ${delay}s" onclick="openDepartment('${dept}')">
                <div class="icon-placeholder"><i class="fas fa-graduation-cap"></i></div>
                <h3>${dept}</h3>
            </div>
        `;
    });
    html += `</div>`;
    
    appContent.innerHTML = html;
    document.getElementById('about-section').style.display = 'block'; 
}

function openDepartment(dept) {
    document.getElementById('about-section').style.display = 'none'; 
    if (dept === 'BS&H') renderSubjects(dept, null);
    else renderSemesters(dept);
}

function renderSemesters(dept) {
    let html = `
        <div class="view-header">
            <button class="back-btn" onclick="goHome()"><i class="fas fa-arrow-left"></i> Back</button>
            <h2>${dept} - Select Semester</h2>
        </div>
        <div class="grid-container">
    `;
    semesters.forEach((sem, index) => {
        const delay = index * 0.1;
        html += `
            <div class="card" style="animation-delay: ${delay}s" onclick="renderSubjects('${dept}', '${sem}')">
                <div class="icon-placeholder"><i class="fas fa-layer-group"></i></div>
                <h3>${sem}</h3>
            </div>
        `;
    });
    html += `</div>`;
    appContent.innerHTML = html;
}

function renderSubjects(dept, sem) {
    const title = sem ? `${dept} - ${sem}` : `${dept}`;
    const backAction = sem ? `renderSemesters('${dept}')` : `goHome()`;
    
    let html = `
        <div class="view-header">
            <button class="back-btn" onclick="${backAction}"><i class="fas fa-arrow-left"></i> Back</button>
            <h2>${title}</h2>
        </div>
    `;

    if (dept === 'BS&H') {
        html += `<h3 class="section-title">Theory Subjects</h3><div class="grid-container">`;
        bshData.subjects.forEach((sub, i) => html += createSubjectCard(sub, title, i * 0.1));
        html += `</div>`;

        html += `<h3 class="section-title">Laboratories</h3><div class="grid-container">`;
        bshData.labs.forEach((lab, i) => html += createSubjectCard(lab, title, i * 0.1));
        html += `</div>`;

        html += `<h3 class="section-title">Workshops</h3><div class="grid-container">`;
        bshData.workshops.forEach((ws, i) => html += createSubjectCard(ws, title, i * 0.1));
        html += `</div>`;

        html += `<h3 class="section-title">Other Courses</h3><div class="grid-container">`;
        bshData.courses.forEach((course, i) => html += createSubjectCard(course, title, i * 0.1));
        html += `</div>`;
    } else {
        const currentData = curriculumData[dept][sem];
        if(currentData) {
            html += `<h3 class="section-title">Theory Subjects</h3><div class="grid-container">`;
            currentData.subjects.forEach((sub, i) => html += createSubjectCard(sub, title, i * 0.1));
            html += `</div>`;

            html += `<h3 class="section-title">Laboratories</h3><div class="grid-container">`;
            currentData.labs.forEach((lab, i) => html += createSubjectCard(lab, title, i * 0.1));
            html += `</div>`;
        }
    }

    appContent.innerHTML = html;
}

function createSubjectCard(name, context, delay) {
    return `
        <div class="card" style="animation-delay: ${delay}s" onclick="renderMaterials('${context}', '${name}')">
            <h3>${name}</h3>
        </div>
    `;
}

// ============================================================================
// 📚 MATERIAL RENDERER (Connects to File Links Database)
// ============================================================================
function renderMaterials(context, subjectName) {
    const parts = context.split(' - ');
    const dept = parts[0];
    const sem = parts[1] || null;
    const backAction = `renderSubjects('${dept}', ${sem ? `'${sem}'` : 'null'})`;

    // Look up the links for this specific subject
    const lookupKey = `${context} - ${subjectName}`;
    const links = fileLinks[lookupKey] || {
        pyq: '#', unit1: '#', unit2: '#', unit3: '#', unit4: '#', unit5: '#'
    };

    let html = `
        <div class="view-header">
            <button class="back-btn" onclick="${backAction}"><i class="fas fa-arrow-left"></i> Back</button>
            <h2>${context} > ${subjectName}</h2>
        </div>
        
        <div class="material-list">
            <h3 class="section-title"><i class="fas fa-file-pdf"></i> PYQ Papers</h3>
            ${createMaterialRow('Previous Year Question Papers', links.pyq, 0.1)}
            
            <h3 class="section-title"><i class="fas fa-book-open"></i> Notes & Materials</h3>
            ${createMaterialRow('Unit - 1', links.unit1, 0.2)}
            ${createMaterialRow('Unit - 2', links.unit2, 0.3)}
            ${createMaterialRow('Unit - 3', links.unit3, 0.4)}
            ${createMaterialRow('Unit - 4', links.unit4, 0.5)}
            ${createMaterialRow('Unit - 5', links.unit5, 0.6)}
        </div>
    `;
    
    appContent.innerHTML = html;
}

function createMaterialRow(itemName, fileLink, delay) {
    return `
        <div class="material-item" style="animation-delay: ${delay}s">
            <h4>${itemName}</h4>
            <div class="material-actions">
                <a href="${fileLink}" target="_blank" class="btn btn-view"><i class="fas fa-eye"></i> View</a>
                <a href="${fileLink}" download class="btn btn-download"><i class="fas fa-download"></i> Download</a>
            </div>
        </div>
    `;
}

// ============================================================================
// 🚀 INITIALIZATION
// ============================================================================
window.onload = () => {
    initTheme(); 
    buildSearchIndex();
    goHome();
};