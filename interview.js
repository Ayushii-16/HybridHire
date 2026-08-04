// =============================================
// HYBRIDHIRE AI - Interview Preparation (Dynamic)
// =============================================

document.addEventListener('DOMContentLoaded', function() {

    const API_BASE_URL = 'http://localhost:8080';
    const token = localStorage.getItem('jwtToken');

    // ----- UPGRADE TO PRO -----
    const upgradeBtn = document.getElementById('upgradeBtn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            alert('⭐ Upgrade to Pro\n\nFeatures:\n• Unlimited Mock Interviews\n• Detailed Performance Analytics\n• Personalized Question Bank\n• Resume Review by Experts');
        });
    }

    // ----- START MOCK INTERVIEW (REAL AI) -----
    let currentSessionId = null;
    let currentQuestions = [];

    const startMockBtn = document.getElementById('startMockBtn');
    if (startMockBtn) {
        startMockBtn.addEventListener("click", async function() {

            const resumeText = prompt("Paste your resume text:");
            if (!resumeText) return;

            const jobDescription = prompt("Paste the job description:");
            if (!jobDescription) return;

            this.disabled = true;
            this.innerText = "Generating AI Questions...";

            try {
                const response = await fetch(`${API_BASE_URL}/api/interview/questions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ resumeText, jobDescription })
                });

                if (!response.ok) {
                    throw new Error('Failed to generate questions: ' + response.status);
                }

                const data = await response.json();
                currentSessionId = data.sessionId;
                currentQuestions = data.questions || [];

                this.innerText = "Start Mock Interview";
                this.disabled = false;

                showInterviewModal(currentQuestions);

            } catch (error) {
                console.error("Interview API Error:", error);
                alert('⚠️ Failed to start interview. Check backend connection.');
                this.disabled = false;
                this.innerText = "Start Mock Interview";
            }
        });
    }

    // ----- SHOW QUESTIONS MODAL & COLLECT ANSWERS -----
    function showInterviewModal(questions) {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px;';

        let questionsHtml = '';
        questions.forEach((q, i) => {
            questionsHtml += `
                <div style="margin-bottom:20px;">
                    <p style="font-weight:600; margin-bottom:4px;">Q${i + 1}. ${q.question}</p>
                    <p style="font-size:12px; color:#666; margin-bottom:8px;">Hint: ${q.hint}</p>
                    <textarea id="answer-${i}" rows="3" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:6px;" placeholder="Your answer..."></textarea>
                </div>
            `;
        });

        overlay.innerHTML = `
            <div style="background:white; max-width:600px; width:100%; max-height:85vh; overflow-y:auto; border-radius:12px; padding:24px;">
                <h2 style="font-size:20px; font-weight:700; margin-bottom:16px;">Mock Interview Questions</h2>
                ${questionsHtml}
                <button id="submitAnswersBtn" style="width:100%; background:#3b82f6; color:white; padding:12px; border-radius:8px; font-weight:600; border:none; cursor:pointer;">
                    Submit Answers
                </button>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('submitAnswersBtn').addEventListener('click', async function() {
            let combinedAnswers = '';
            questions.forEach((q, i) => {
                const ans = document.getElementById(`answer-${i}`).value.trim();
                combinedAnswers += `Q${i + 1}: ${q.question}\nAnswer: ${ans}\n\n`;
            });

            this.disabled = true;
            this.innerText = "Evaluating...";

            try {
                const response = await fetch(`${API_BASE_URL}/api/interview/interview-result`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        sessionId: currentSessionId,
                        studentAnswers: combinedAnswers
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to evaluate: ' + response.status);
                }

                const feedback = await response.text();
                overlay.remove();
                showFeedbackModal(feedback);

            } catch (error) {
                console.error("Evaluation Error:", error);
                alert('⚠️ Failed to evaluate answers.');
                this.disabled = false;
                this.innerText = "Submit Answers";
            }
        });
    }

    // ----- SHOW FEEDBACK -----
    function showFeedbackModal(feedback) {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px;';

        overlay.innerHTML = `
            <div style="background:white; max-width:600px; width:100%; max-height:85vh; overflow-y:auto; border-radius:12px; padding:24px;">
                <h2 style="font-size:20px; font-weight:700; margin-bottom:16px;">AI Feedback</h2>
                <pre style="white-space:pre-wrap; font-family:inherit; font-size:14px; line-height:1.6;">${feedback}</pre>
                <button id="closeFeedbackBtn" style="width:100%; background:#3b82f6; color:white; padding:12px; border-radius:8px; font-weight:600; border:none; cursor:pointer; margin-top:16px;">
                    Close
                </button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.getElementById('closeFeedbackBtn').addEventListener('click', () => overlay.remove());
    }

    // ----- PRACTICE BUTTONS -----
    const practiceBtns = document.querySelectorAll('.practice-btn');
    practiceBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const question = row.querySelector('td:first-child')?.textContent?.trim() || 'Question';
            alert('📝 Practice Mode\n\nQuestion: ' + question + '\n\nType your answer below...');
        });
    });

    // ----- PREVIOUS ATTEMPTS -----
    const previousAttempts = document.querySelectorAll('.previous-attempt');
    previousAttempts.forEach(function(attempt) {
        attempt.addEventListener('click', function() {
            const title = this.querySelector('.font-body-sm')?.textContent || 'Attempt';
            alert('📊 Reviewing: ' + title + '\n\nDetailed feedback and breakdown will be shown.');
        });
    });

    // ----- SEARCH QUESTIONS -----
    const questionSearch = document.getElementById("questionSearch");
    if (questionSearch) {
        questionSearch.addEventListener("input", function() {
            const value = this.value.toLowerCase();
            document.querySelectorAll("tbody tr").forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(value) ? "" : "none";
            });
        });
    }

    // ----- TASK CHECKBOXES -----
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    taskCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const label = this.closest('label').querySelector('.task-label');
            if (this.checked) {
                label.classList.add('line-through', 'text-on-surface-variant');
                label.classList.remove('text-on-surface');
            } else {
                label.classList.remove('line-through', 'text-on-surface-variant');
                label.classList.add('text-on-surface');
            }
        });
    });

    // ----- RECOMMENDED COURSE CLICK -----
    const recommendedCourse = document.getElementById('recommendedCourse');
    if (recommendedCourse) {
        recommendedCourse.addEventListener('click', function() {
            alert('📚 Course: Mastering System Design for Frontend\n\nEnroll now to improve your system design skills!');
        });
    }

    // ----- SEARCH INPUT (Top Bar) -----
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            const value = this.value.toLowerCase();
            if (value.includes("dsa")) {
                window.scrollTo({ top: document.querySelector(".previous-attempt").offsetTop, behavior: "smooth" });
            } else if (value.includes("mock")) {
                document.getElementById("startMockBtn").style.background = "#16a34a";
            } else if (value.includes("resume")) {
                window.location.href = "resume.html";
            } else if (value.includes("roadmap")) {
                window.location.href = "roadmap.html";
            } else {
                document.getElementById("startMockBtn").style.background = "";
            }
        });
    }
});