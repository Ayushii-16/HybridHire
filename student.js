// =============================================
// HYBRIDHIRE AI - Student Dashboard
// =============================================

document.addEventListener("DOMContentLoaded", async function () {

    // -----------------------------------------
    // 1. CHECK LOGIN
    // -----------------------------------------

    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("jwtToken");

    if (!role || !token) {
        window.location.href = "login.html";
        return;
    }

    if (role === "recruiter") {
        window.location.href = "dashboard.html";
        return;
    }

    // -----------------------------------------
    // 2. GET USER NAME
    // -----------------------------------------

    const userName = localStorage.getItem("userName") || "Student";
    const firstName = userName.split(" ")[0];

    const welcomeHeading =
        document.getElementById("welcomeHeading");

    if (welcomeHeading) {
        welcomeHeading.textContent =
            `Welcome back, ${firstName}!`;
    }

    await loadDashboardData();

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", function () {
            alert("Mobile menu coming soon.");
        });
    }


    // -----------------------------------------
    // 5. ANALYZE RESUME
    // -----------------------------------------

    const analyzeResumeBtn =
        document.getElementById("analyzeResumeBtn");

    if (analyzeResumeBtn) {
        analyzeResumeBtn.addEventListener("click", function () {
            window.location.href = "student-upload.html";
        });
    }


    // -----------------------------------------
    // 6. COMPLETE PROFILE
    // -----------------------------------------

    const completeProfileBtn =
        document.getElementById("completeProfileBtn");

    if (completeProfileBtn) {
        completeProfileBtn.addEventListener("click", function () {
            window.location.href = "profile.html";
        });
    }


    // -----------------------------------------
    // 7. LOGOUT
    // -----------------------------------------

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function (e) {

            e.preventDefault();

            if (confirm("Are you sure you want to logout?")) {

                localStorage.removeItem("jwtToken");
                localStorage.removeItem("userRole");
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userName");

                window.location.href = "login.html";
            }
        });
    }

});


// =============================================
// LOAD DASHBOARD DATA FROM BACKEND
// =============================================

async function loadDashboardData() {

    try {

        const token =
            localStorage.getItem("jwtToken");

        const response = await fetch(
            "http://localhost:8080/student/dashboard",
            {
                method: "GET",

                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json"
                }
            }
        );


        // -------------------------------------
        // SESSION EXPIRED
        // -------------------------------------

        if (response.status === 401 ||
            response.status === 403) {

            alert("Session expired. Please login again.");

            localStorage.removeItem("jwtToken");

            window.location.href = "login.html";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Failed to load dashboard data"
            );
        }

        const data = await response.json();

        console.log("Dashboard Data:", data);


        // -------------------------------------
        // UPDATE PROFILE
        // -------------------------------------

        updateProfile(data);


        // -------------------------------------
        // UPDATE RESUME
        // -------------------------------------

        updateResume(data);


        // -------------------------------------
        // UPDATE SKILLS
        // -------------------------------------

        const storedData = localStorage.getItem("resumeAnalysisResult");
        const analysis = storedData ? JSON.parse(storedData) : null;

        if (analysis?.missingKeywords?.length) {

            const skillGapData = analysis.missingKeywords.map(keyword => ({
                name: keyword,
                percentage: 0,
                status: "Missing"
            }));

            updateSkills(skillGapData);

        } else {
            updateSkills(data.skills);
        }


    } catch (error) {

        console.error(
            "Dashboard API Error:",
            error
        );

        alert(
            "Unable to load dashboard data. Make sure the backend is running."
        );
    }
}

function updateProfile(data) {

    const percentage =
        data.profileCompletion ?? 0;

    const profilePercent =
        document.getElementById("profilePercent");

    const profileBar =
        document.getElementById("profileBar");

    const profileMessage =
        document.getElementById("profileMessage");


    if (profilePercent) {
        profilePercent.textContent =
            `${percentage}%`;
    }


    if (profileBar) {
        profileBar.style.width =
            `${percentage}%`;
    }


    if (profileMessage) {

        if (percentage === 100) {

            profileMessage.textContent =
                "Your profile is complete.";

        } else {

            profileMessage.textContent =
                `Your profile is ${percentage}% complete. Complete it to improve your profile visibility.`;
        }
    }
}

// =============================================
// RESUME / ATS
// =============================================

function updateResume(data) {

    const storedData = localStorage.getItem("resumeAnalysisResult");
    const analysis = storedData ? JSON.parse(storedData) : null;

    const atsScore =
        analysis?.atsScore ?? data.atsScore ?? 0;

    const aiMatch =
        analysis?.aiMatchScore ?? data.globalAiMatch ?? 0;

    const atsScoreElement =
        document.getElementById("atsScore");

    if (atsScoreElement) {
        atsScoreElement.textContent = atsScore;
    }

    const aiMatchElement =
        document.getElementById("globalAiMatch");

    if (aiMatchElement) {
        aiMatchElement.textContent = `${aiMatch}%`;
    }

    const matchMessage =
        document.getElementById("matchMessage");

    if (matchMessage) {

        if (aiMatch >= 80) {
            matchMessage.textContent =
                "Your resume has a strong match for target roles.";

        } else if (aiMatch >= 60) {
            matchMessage.textContent =
                "Your resume has a moderate match. Some improvements are recommended.";

        } else {
            matchMessage.textContent =
                "Your resume needs improvement for better role matching.";
        }
    }

    const atsGauge =
        document.getElementById("atsGauge");

    if (atsGauge) {
        atsGauge.style.background =
            `conic-gradient(#3b82f6 ${atsScore}%, #dbe7fb 0%)`;
    }
}


// =============================================
// SKILL GAP
// =============================================

function updateSkills(skills) {

    const container =
        document.getElementById("skillsContainer");

    if (!container) return;


    container.innerHTML = "";


    if (!skills || skills.length === 0) {

        container.innerHTML = `
            <p class="font-body-sm text-body-sm text-on-surface-variant">
                No skill analysis available yet.
            </p>
        `;

        return;
    }


    skills.forEach(skill => {

        const skillName =
            skill.name || "Unknown Skill";

        const percentage =
            skill.percentage ?? 0;

        const status =
            skill.status || "Required";

        let statusColor =
            "text-error-red";

        let barColor =
            "bg-error-red";


        if (percentage >= 80) {

            statusColor =
                "text-success-green";

            barColor =
                "bg-success-green";

        } else if (percentage >= 50) {

            statusColor =
                "text-warning-amber";

            barColor =
                "bg-warning-amber";
        }


        const skillHTML = `

            <div>

                <div class="flex justify-between mb-1">

                    <span class="font-body-sm text-body-sm text-on-surface">
                        ${skillName}
                    </span>

                    <span class="font-label-md text-label-md ${statusColor}">
                        ${status}
                    </span>

                </div>

                <div class="match-score-track w-full">

                    <div
                        class="match-score-fill ${barColor} shadow-none"
                        style="width: ${percentage}%;">
                    </div>

                </div>

            </div>

        `;

        container.insertAdjacentHTML(
            "beforeend",
            skillHTML
        );
    });
}