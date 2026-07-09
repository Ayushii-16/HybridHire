// =============================================
// HYBRIDHIRE AI - Login Page Functionality
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Check if already logged in (Auto-redirect)
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
        if (storedRole === 'recruiter') {
            window.location.href = 'dashboard.html';
            return;
        } else if (storedRole === 'student') {
            window.location.href = 'student.html';
            return;
        }
    }
    
    // ----- ROLE TOGGLE -----
    const btnRecruiter = document.getElementById('btn-recruiter');
    const btnStudent = document.getElementById('btn-student');

    function setActive(activeBtn, inactiveBtn) {
        activeBtn.classList.add('bg-surface-container-lowest', 'shadow-sm', 'text-on-surface');
        activeBtn.classList.remove('text-on-surface-variant');
        inactiveBtn.classList.remove('bg-surface-container-lowest', 'shadow-sm', 'text-on-surface');
        inactiveBtn.classList.add('text-on-surface-variant');
    }

    if (btnRecruiter && btnStudent) {
        btnRecruiter.addEventListener('click', function() {
            setActive(btnRecruiter, btnStudent);
        });
        btnStudent.addEventListener('click', function() {
            setActive(btnStudent, btnRecruiter);
        });
    }

    // ----- PASSWORD VISIBILITY TOGGLE -----
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');

    if (togglePassword && passwordInput && passwordIcon) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            passwordIcon.textContent = type === 'password' ? 'visibility_off' : 'visibility';
        });
    }

    // ----- FORM SUBMISSION -----
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email')?.value.trim() || '';
            const password = document.getElementById('password')?.value.trim() || '';
            
            let errors = [];
            
            if (!email) errors.push('Email is required');
            else if (!isValidEmail(email)) errors.push('Please enter a valid email address');
            if (!password) errors.push('Password is required');
            
            if (errors.length > 0) {
                alert('Please fix the following errors:\n\n• ' + errors.join('\n• '));
                return;
            }
            
            // Simulate login - Get selected role from toggle class status
            const isRecruiterActive = document.getElementById('btn-recruiter')?.classList.contains('bg-surface-container-lowest');
            const role = isRecruiterActive ? 'recruiter' : 'student';
            
            // Save role in localStorage
            localStorage.setItem('userRole', role);
            localStorage.setItem('userEmail', email);
            
            console.log('✅ Login Successful! Role:', role);
            
            // Redirect based on role
            if (role === 'recruiter') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'student.html';
            }
        });
    }

    // ----- HELPER FUNCTION: Email Regex Validation -----
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    console.log('✅ HybridHire AI Login page loaded successfully!');
});