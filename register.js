// =============================================
// HYBRIDHIRE AI - Register Page Functionality
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ----- CHECK IF ALREADY LOGGED IN -----
    const role = localStorage.getItem('userRole');
    if (role) {
        if (role === 'recruiter') {
            window.location.href = 'dashboard.html';
        } else if (role === 'student') {
            window.location.href = 'student.html';
        }
    }
    
    // ----- ROLE SELECTION -----
    const roleButtons = document.querySelectorAll('.role-btn');
    
    if (roleButtons.length > 0) {
        roleButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                roleButtons.forEach(function(b) {
                    b.classList.remove('text-primary', 'bg-surface-container-lowest', 'shadow-sm', 'border', 'border-outline-variant/10');
                    b.classList.add('text-on-surface-variant');
                });
                this.classList.remove('text-on-surface-variant');
                this.classList.add('text-primary', 'bg-surface-container-lowest', 'shadow-sm', 'border', 'border-outline-variant/10');
            });
        });
    }
    
    // ----- PASSWORD STRENGTH -----
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        const hint = document.querySelector('.mt-2.font-body-sm.text-on-surface-variant.text-\\[13px\\]');
        if (hint) {
            passwordInput.addEventListener('input', function() {
                const val = this.value;
                if (val.length === 0) {
                    hint.textContent = 'Must be at least 8 characters long.';
                    hint.style.color = '';
                } else if (val.length < 8) {
                    hint.textContent = '⚠️ ' + val.length + '/8 characters - too short';
                    hint.style.color = '#dc2626';
                } else {
                    hint.textContent = '✅ ' + val.length + '/8 characters - strong';
                    hint.style.color = '#16a34a';
                }
            });
        }
    }
    
    // ----- FORM SUBMISSION -----
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const password = document.getElementById('password')?.value.trim() || '';
            const terms = document.getElementById('terms')?.checked || false;
            
            // Get selected role
            let selectedRole = 'recruiter';
            const activeBtn = document.querySelector('.role-btn.text-primary');
            if (activeBtn) {
                selectedRole = activeBtn.getAttribute('data-role') || 'recruiter';
            }
            
            // Validation
            let errors = [];
            
            if (!name) errors.push('Full Name is required');
            if (!email) errors.push('Work Email is required');
            else if (!isValidEmail(email)) errors.push('Please enter a valid email address');
            if (!password) errors.push('Password is required');
            else if (password.length < 8) errors.push('Password must be at least 8 characters long');
            if (!terms) errors.push('You must agree to the Terms of Service and Privacy Policy');
            
            if (errors.length > 0) {
                alert('Please fix the following errors:\n\n• ' + errors.join('\n• '));
                return;
            }
            
            // Save user data
            localStorage.setItem('userRole', selectedRole);
            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            
            console.log('✅ Registration Successful!');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Role:', selectedRole);
            
            alert('✅ Account created successfully!\n\nWelcome, ' + name + '!');
            
            // Redirect based on role
            if (selectedRole === 'recruiter') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'student.html';
            }
        });
    }
    
    // ----- HELPER: Email Validation -----
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    console.log('✅ HybridHire AI Register page loaded successfully!');
});