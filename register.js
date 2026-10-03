// =============================================
// HYBRIDHIRE AI - Register Page Functionality (Final Fix)
// =============================================

document.addEventListener('DOMContentLoaded', function() {


    const storedRole = (localStorage.getItem('userRole') || '').toLowerCase();
    const storedToken = localStorage.getItem('jwtToken');

    if (storedToken && storedRole) {
        if (storedRole === 'recruiter') {
            window.location.href = 'dashboard.html';
            return;
        } else if (storedRole === 'student' || storedRole === 'candidate') {
            window.location.href = 'student.html';
            return;
        }
    }

    // ----- 2. DYNAMIC ROLE SELECTION & TOGGLE -----
    const roleButtons = document.querySelectorAll('.role-btn');

    let selectedRole = 'candidate';

    if (roleButtons.length > 0) {

        roleButtons.forEach(btn => {
            if (btn.classList.contains('active') || btn.classList.contains('text-primary')) {
                const attrRole = btn.getAttribute('data-role');
                if (attrRole) selectedRole = attrRole;
            }

            btn.addEventListener('click', function(e) {
                e.preventDefault();


                roleButtons.forEach(b => {
                    b.classList.remove('active', 'text-primary', 'bg-surface-container-lowest', 'shadow-sm', 'border', 'border-outline-variant/10');
                    b.classList.add('text-on-surface-variant');
                });


                this.classList.remove('text-on-surface-variant');
                this.classList.add('active', 'text-primary', 'bg-surface-container-lowest', 'shadow-sm', 'border', 'border-outline-variant/10');


                const dataRole = this.getAttribute('data-role');
                if (dataRole) {
                    selectedRole = dataRole.toLowerCase();
                }

                console.log("👉 Role Selected:", selectedRole);
            });
        });
    }

    // ----- 3. PASSWORD STRENGTH REAL-TIME HINT -----
    const passwordInput = document.getElementById('password');
    const hint = document.querySelector('.mt-2.font-body-sm.text-on-surface-variant');

    if (passwordInput && hint) {
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

    // ----- 4. FORM SUBMISSION & BACKEND INTEGRATION -----
    const form = document.getElementById('registerForm');
    const API_BASE_URL = 'http://localhost:8080';

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const password = document.getElementById('password')?.value.trim() || '';
            const terms = document.getElementById('terms')?.checked || false;


            const finalRoleForBackend = (selectedRole === 'candidate') ? 'student' : selectedRole;


            let errors = [];
            if (!name) errors.push('Full Name is required');
            if (!email) errors.push('Work Email is required');
            else if (!isValidEmail(email)) errors.push('Please enter a valid email address');
            if (!password) errors.push('Password is required');
            else if (password.length < 8) errors.push('Password must be at least 8 characters long');
            if (!terms) errors.push('You must agree to the Terms of Service and Privacy Policy');

            if (errors.length > 0) {
                alert('Please fix the following:\n\n• ' + errors.join('\n• '));
                return;
            }

            const userPayload = {
                name: name,
                email: email,
                password: password,
                role: finalRoleForBackend
            };

            console.log("🚀 Submitting Registration Payload:", userPayload);

            try {

                const registerResponse = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userPayload)
                });

                if (registerResponse.ok) {

                    const loginPayload = { email: email, password: password };
                    const loginResponse = await fetch(`${API_BASE_URL}/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(loginPayload)
                    });

                    if (loginResponse.ok) {
                        const token = await loginResponse.text();


                        localStorage.setItem('jwtToken', token);
                        localStorage.setItem('userRole', finalRoleForBackend);
                        localStorage.setItem('userName', name);
                        localStorage.setItem('userEmail', email);

                        alert(`✅ Account created successfully!\n\nWelcome, ${name}!`);


                        if (finalRoleForBackend === 'recruiter') {
                            window.location.href = 'dashboard.html';
                        } else {
                            window.location.href = 'student.html';
                        }
                    } else {
                        alert('Registration successful! Please log in with your credentials.');
                        window.location.href = 'login.html';
                    }
                } else {
                    const errText = await registerResponse.text();
                    alert('❌ Registration failed: ' + (errText || 'Email might already be registered.'));
                }
            } catch (error) {
                console.error('API Error:', error);
                alert('⚠️ Server Connection Error! Ensure your Spring Boot backend is running on http://localhost:8080.');
            }
        });
    }


    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    console.log('✅ HybridHire AI Register module initialized successfully.');
});