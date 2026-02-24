// --- App State & Data ---
const appContent = document.getElementById('app-content');

// 📝 EDIT HERE: Departments and Semesters
const departments = ['BS&H', 'CSE', 'DS', 'EEE', 'MECH', 'ECE'];
const semesters = ['SEM-3', 'SEM-4', 'SEM-5', 'SEM-6', 'SEM-7'];

// 📝 EDIT HERE: BS&H Department specific lists
const bshSubjectsList = ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5', 'Sub-6', 'Sub-7', 'Sub-8', 'Sub-9', 'Sub-10'];
const bshLabsList = ['Lab-1', 'Lab-2', 'Lab-3', 'Lab-4', 'Lab-5'];
const bshWorkshopsList = ['Workshop-1', 'Workshop-2', 'Workshop-3'];
const bshOtherCoursesList = ['Course-1', 'Course-2'];

// 📝 EDIT HERE: Lists for other branches (CSE, DS, etc.)
const theorySubjectsList = ['Sub-1', 'Sub-2', 'Sub-3', 'Sub-4', 'Sub-5'];
const labsList = ['Lab-1', 'Lab-2', 'Lab-3'];

// --- 🌙 Dark Mode Toggle Logic ---
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


// --- 🔍 Global Search Engine Logic ---
let searchIndex = [];

function buildSearchIndex() {
    searchIndex = [];
    bshSubjectsList.forEach(sub => searchIndex.push({ name: sub, context: 'BS&H' }));
    bshLabsList.forEach(lab => searchIndex.push({ name: lab, context: 'BS&H' }));
    bshWorkshopsList.forEach(ws => searchIndex.push({ name: ws, context: 'BS&H' }));
    bshOtherCoursesList.forEach(course => searchIndex.push({ name: course, context: 'BS&H' }));

    departments.filter(d => d !== 'BS&H').forEach(dept => {
        semesters.forEach(sem => {
            const contextStr = `${dept} - ${sem}`;
            theorySubjectsList.forEach(sub => searchIndex.push({ name: sub, context: contextStr }));
            labsList.forEach(lab => searchIndex.push({ name: lab, context: contextStr }));
        });
    });
}

function handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    
    if (query.trim() === '') {
        goHome();
        return;
    }

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
        html += `<p style="color: var(--text-light); width: 100%;">No matches found. Try searching for "Sub-1" or "Lab".</p>`;
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


// --- View Rendering Logic ---

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
    if (dept === 'BS&H') {
        renderSubjects(dept, null);
    } else {
        renderSemesters(dept);
    }
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
        bshSubjectsList.forEach((sub, i) => html += createSubjectCard(sub, title, i * 0.1));
        html += `</div>`;

        html += `<h3 class="section-title">Laboratories</h3><div class="grid-container">`;
        bshLabsList.forEach((lab, i) => html += createSubjectCard(lab, title, i * 0.1));
        html += `</div>`;

        html += `<h3 class="section-title">Workshops</h3><div class="grid-container">`;
        bshWorkshopsList.forEach((ws, i) => html += createSubjectCard(ws, title, i * 0.1));
        html += `</div>`;

        html += `<h3 class="section-title">Other Courses</h3><div class="grid-container">`;
        bshOtherCoursesList.forEach((course, i) => html += createSubjectCard(course, title, i * 0.1));
        html += `</div>`;
    } else {
        html += `<h3 class="section-title">Theory Subjects</h3><div class="grid-container">`;
        theorySubjectsList.forEach((sub, i) => html += createSubjectCard(sub, title, i * 0.1));
        html += `</div>`;

        html += `<h3 class="section-title">Laboratories</h3><div class="grid-container">`;
        labsList.forEach((lab, i) => html += createSubjectCard(lab, title, i * 0.1));
        html += `</div>`;
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

function renderMaterials(context, subjectName) {
    const parts = context.split(' - ');
    const dept = parts[0];
    const sem = parts[1] || null;
    const backAction = `renderSubjects('${dept}', ${sem ? `'${sem}'` : 'null'})`;

    let html = `
        <div class="view-header">
            <button class="back-btn" onclick="${backAction}"><i class="fas fa-arrow-left"></i> Back</button>
            <h2>${context} > ${subjectName}</h2>
        </div>
        
        <div class="material-list">
            <h3 class="section-title"><i class="fas fa-file-pdf"></i> PYQ Papers</h3>
            ${createMaterialRow('Previous Year Question Papers', 0.1)}
            
            <h3 class="section-title"><i class="fas fa-book-open"></i> Notes & Materials</h3>
            ${createMaterialRow('Unit - 1', 0.2)}
            ${createMaterialRow('Unit - 2', 0.3)}
            ${createMaterialRow('Unit - 3', 0.4)}
            ${createMaterialRow('Unit - 4', 0.5)}
            ${createMaterialRow('Unit - 5', 0.6)}
        </div>
    `;
    
    appContent.innerHTML = html;
}

function createMaterialRow(itemName, delay) {
    return `
        <div class="material-item" style="animation-delay: ${delay}s">
            <h4>${itemName}</h4>
            <div class="material-actions">
                <a href="#" target="_blank" class="btn btn-view"><i class="fas fa-eye"></i> View</a>
                <a href="#" download class="btn btn-download"><i class="fas fa-download"></i> Download</a>
            </div>
        </div>
    `;
}

// Initialize the app on load
window.onload = () => {
    initTheme(); // Checks if Dark Mode was saved
    buildSearchIndex();
    goHome();
};