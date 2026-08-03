// =============================================
// HYBRIDHIRE AI - Student Dashboard (Backend Connected)
// =============================================

document.addEventListener('DOMContentLoaded', function() {

    // ----- 1. CHECK ROLE & TOKEN (Security Check) -----
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('jwtToken');

    if (!role || !token) {
        window.location.href = 'login.html';
        return;
    }
    else if (role === 'recruiter') {
        window.location.href = 'dashboard.html';
        return;
    }

    // ----- 2. SHOW DYNAMIC USER NAME -----
    const userName = localStorage.getItem('userName') || 'Student';
    const firstName = userName.split(' ')[0]; // Extracting just the first name

    // Find the H2 tag that says "Welcome back, Alex!" and replace it
    const welcomeHeading = document.querySelector('h2.text-primary');
    if (welcomeHeading && welcomeHeading.textContent.includes('Welcome')) {
        welcomeHeading.textContent = `Welcome back, ${firstName}!`;
    }

    // ----- MOBILE MENU TOGGLE -----
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            alert('📱 Mobile menu toggled (sidebar would slide in)');
        });
    }

    // ----- ANALYZE RESUME -----
    const analyzeResumeBtn = document.getElementById('analyzeResumeBtn');
    if (analyzeResumeBtn) {
        analyzeResumeBtn.addEventListener('click', function() {
            // Redirect to upload page first so they can submit JSON to your backend
            window.location.href = 'student-upload.html';
        });
    }

    // ----- 3. CALL AI MOCK INTERVIEW API -----
    const chatAiBtn = document.getElementById('chatAiBtn');
    if (chatAiBtn) {
        chatAiBtn.addEventListener('click', async function() {

            chatAiBtn.textContent = "⏳ Generating...";
            chatAiBtn.disabled = true;

            try {
                // Backend API call
                const response = await fetch('http://localhost:8080/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                    },
                    body: JSON.stringify({
                        prompt: "Generate 5 Java mock interview questions for a fresher."
                    })
                });

                if (response.ok) {
                    const data = await response.text();
                    console.log("🤖 AI Response:", data);
                    alert("✅ AI Generated Questions!\n\nCheck browser console (F12) to see the output.");
                } else if (response.status === 401 || response.status === 403) {
                    alert('❌ Session expired! Please login again.');
                    window.location.href = 'login.html';
                } else {
                    alert('❌ Failed to generate from AI.');
                }
            } catch (error) {
                console.error("API Error:", error);
                alert("⚠️ Server error! Make sure your Spring Boot backend is running.");
            } finally {
                chatAiBtn.innerHTML = '<span class="material-symbols-outlined text-sm">chat</span> Chat with AI';
                chatAiBtn.disabled = false;
            }
        });
    }

    // ----- LOGOUT -----
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                window.location.href = 'login.html';
            }
        });
    }

    console.log('✅ HybridHire AI Student Dashboard loaded successfully!');
});