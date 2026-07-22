// =============================================
// HYBRIDHIRE AI - Login Page Functionality (Backend Connected)
// =============================================

document.addEventListener('DOMContentLoaded', function() {

    // Check if already logged in (Auto-redirect)
    const storedRole = localStorage.getItem('userRole');
    const storedToken = localStorage.getItem('jwtToken');
    if (storedRole && storedToken) {
        if (storedRole === 'recruiter') {
            window.location.href = 'dashboard.html';
            return;
        } else if (storedRole === 'student' || storedRole === 'candidate') {
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

    // ----- FORM SUBMISSION (Connected to Backend) -----
    const form = document.querySelector('form');
    const API_BASE_URL = 'http://localhost:8080';

    if (form) {
        form.addEventListener('submit', async function(e) {
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

            // Get selected role from toggle class status
            const isRecruiterActive = document.getElementById('btn-recruiter')?.classList.contains('bg-surface-container-lowest');
            const role = isRecruiterActive ? 'recruiter' : 'student';

            // Payload for Backend
            const loginPayload = {
                email: email,
                password: password
            };

            try {
                // Call Spring Boot Login API
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(loginPayload)
                });

                if (response.ok) {
                    // Successful login returns JWT Token as plain text
                    const token = await response.text();

                    // Save Token & Details in localStorage
                    localStorage.setItem('jwtToken', token);
                    localStorage.setItem('userRole', role);
                    localStorage.setItem('userEmail', email);

                    console.log('✅ Login Successful! JWT Token saved.');

                    // Redirect based on role
                    if (role === 'recruiter') {
                        window.location.href = 'dashboard.html';
                    } else {
                        window.location.href = 'student.html';
                    }
                } else if (response.status === 401 || response.status === 403) {
                    // Handle wrong password or email
                    alert('❌ Invalid Email or Password. Please try again.');
                } else {
                    alert('❌ Login failed. Something went wrong.');
                }
            } catch (error) {
                console.error('API Error:', error);
                alert('⚠️ Server error! Make sure your Spring Boot backend is running on port 8080.');
            }
        });
    }

    // ----- HELPER FUNCTION: Email Regex Validation -----
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    console.log('✅ HybridHire AI Login page loaded successfully!');
});