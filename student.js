// =============================================
// HYBRIDHIRE AI - Student Dashboard
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ----- CHECK ROLE (Redirect if recruiter) -----
    const role = localStorage.getItem('userRole');
    if (!role) {
        window.location.href = 'login.html';
    } else if (role === 'candidate') {
        window.location.href = 'student.html';
    }
    
    // ----- MOBILE MENU TOGGLE -----
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            alert('📱 Mobile menu toggled (sidebar would slide in)');
        });
    }
    
    // ----- COMPLETE PROFILE -----
    const completeProfileBtn = document.getElementById('completeProfileBtn');
    if (completeProfileBtn) {
        completeProfileBtn.addEventListener('click', function() {
            alert('📝 Opening profile completion wizard...');
        });
    }
    
    // ----- ANALYZE RESUME -----
    const analyzeResumeBtn = document.getElementById('analyzeResumeBtn');
    if (analyzeResumeBtn) {
        analyzeResumeBtn.addEventListener('click', function() {
            window.location.href = 'resume.html';
        });
    }
    
    // ----- CHAT WITH AI -----
    const chatAiBtn = document.getElementById('chatAiBtn');
    if (chatAiBtn) {
        chatAiBtn.addEventListener('click', function() {
            alert('💬 Opening AI Assistant chat...');
        });
    }
    
    // ----- VIEW ALL JOBS -----
    const viewAllJobs = document.getElementById('viewAllJobs');
    if (viewAllJobs) {
        viewAllJobs.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'jobs.html';
        });
    }
    
    // ----- MORE APPLICATIONS -----
    const moreAppsBtn = document.getElementById('moreAppsBtn');
    if (moreAppsBtn) {
        moreAppsBtn.addEventListener('click', function() {
            window.location.href = 'applications.html';
        });
    }
    
    // ----- JOB ROW CLICK -----
    const jobRows = document.querySelectorAll('.job-row');
    jobRows.forEach(function(row) {
        row.addEventListener('click', function() {
            const roleText = this.querySelector('td:first-child')?.textContent?.trim() || 'Job';
            alert('🔍 Viewing job: ' + roleText);
        });
    });
    
    // ----- APPLICATION ROW CLICK -----
    const appRows = document.querySelectorAll('.app-row');
    appRows.forEach(function(row) {
        row.addEventListener('click', function() {
            const company = this.querySelector('.font-body-md')?.textContent || 'Company';
            alert('📋 Viewing application: ' + company);
        });
    });
    
    // ----- COURSE CARD CLICK -----
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(function(card) {
        card.addEventListener('click', function() {
            const title = this.querySelector('h4')?.textContent || 'Course';
            alert('📚 Viewing course: ' + title);
        });
    });
    
    // ----- SKILL INFO BUTTON -----
    const skillInfoBtn = document.getElementById('skillInfoBtn');
    if (skillInfoBtn) {
        skillInfoBtn.addEventListener('click', function() {
            alert('ℹ️ Skill Gap Analysis:\n\n• React: ✓ Possessed\n• Node.js: ⚡ Developing (60%)\n• System Design: ❌ Required Gap');
        });
    }
    
    // ----- LOGOUT -----
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userRole');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                window.location.href = 'login.html';
            }
        });
    }
    
    console.log('✅ HybridHire AI Student Dashboard loaded successfully!');
});