// =============================================
// HYBRIDHIRE AI - Login JS (Fully Fixed)
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // ----- 1. DOM ELEMENTS -----
    const btnRecruiter = document.getElementById('btn-recruiter');
    const btnStudent = document.getElementById('btn-student');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');
    const form = document.querySelector('form');

    let selectedRole = 'recruiter';

    const activeClasses = ['bg-surface-container-lowest', 'shadow-sm', 'text-on-surface'];
    const inactiveClasses = ['text-on-surface-variant'];

    // ----- 2. ROLE TOGGLE FUNCTION -----
    function switchRole(roleToSelect) {
        selectedRole = roleToSelect;

        if (roleToSelect === 'student') {
            btnStudent.classList.add(...activeClasses);
            btnStudent.classList.remove(...inactiveClasses);

            btnRecruiter.classList.remove(...activeClasses);
            btnRecruiter.classList.add(...inactiveClasses);
        } else {
            btnRecruiter.classList.add(...activeClasses);
            btnRecruiter.classList.remove(...inactiveClasses);

            btnStudent.classList.remove(...activeClasses);
            btnStudent.classList.add(...inactiveClasses);
        }

        console.log("Selected Role set to:", selectedRole);
    }

    if (btnRecruiter && btnStudent) {
        btnRecruiter.addEventListener('click', (e) => {
            e.preventDefault();
            switchRole('recruiter');
        });

        btnStudent.addEventListener('click', (e) => {
            e.preventDefault();
            switchRole('student');
        });
    }

    // ----- 3. PASSWORD VISIBILITY TOGGLE -----
    if (togglePassword && passwordInput && passwordIcon) {
        togglePassword.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            passwordIcon.textContent = isPassword ? 'visibility' : 'visibility_off';
        });
    }

    // ----- 4. FORM SUBMISSION & BACKEND LOGIN -----
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email')?.value.trim();
            const password = document.getElementById('password')?.value.trim();

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            localStorage.clear();

            try {
                const response = await fetch('http://localhost:8080/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, password: password })
                });

                if (response.ok) {
                    let token = "";
                    const contentType = response.headers.get("content-type");

                    if (contentType && contentType.includes("application/json")) {
                        const data = await response.json();
                        token = data.token || data.jwtToken || data.jwt || data.accessToken || data;
                    } else {
                        token = await response.text();
                    }

                    token = String(token).replace(/^"(.*)"$/, '$1').trim();

                    if (!token) {
                        alert("❌ Token missing in backend response.");
                        return;
                    }
                    localStorage.setItem('jwtToken', token);
                    localStorage.setItem('userRole', selectedRole);
                    localStorage.setItem('userEmail', email);

                    console.log("✅ Token successfully saved in localStorage!");

                    if (selectedRole === 'candidate') {
                        window.location.href = 'student.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }

                } else if (response.status === 401 || response.status === 403) {
                    alert("❌ Invalid Email or Password. Please try again.");
                } else {
                    alert("❌ Login failed! Server Status: " + response.status);
                }

            } catch (error) {
                console.error("Login Error:", error);
                alert("⚠️ Server connection error! Make sure Spring Boot is running on port 8080.");
            }
        });
    }

    console.log("✅ Login JS Loaded & Bound to HTML!");
});