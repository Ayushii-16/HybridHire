// =============================================
// HYBRIDHIRE AI - Student Profile
// =============================================

document.addEventListener("DOMContentLoaded", function () {

    loadProfile();
    loadProfileScores();

    const viewScoreBtn =
        document.getElementById("viewScoreBtn");

    if (viewScoreBtn) {

        viewScoreBtn.addEventListener("click", function () {

            const savedAnalysis =
                JSON.parse(
                    localStorage.getItem("resumeAnalysisResult") || "{}"
                );

            const atsScore =
                Math.round(savedAnalysis.atsScore || 0);

            const aiMatchScore =
                Math.round(savedAnalysis.aiMatchScore || 0);

            const jobReadiness =
                Math.round(
                    (atsScore + aiMatchScore) / 2
                );

            alert(
                `🧠 AI Career Score: ${jobReadiness}/100\n\n` +
                `Breakdown:\n` +
                `• ATS Score: ${atsScore}%\n` +
                `• AI Match: ${aiMatchScore}%\n` +
                `• Job Readiness: ${jobReadiness}%`
            );
        });
    }



    const editProfileBtn =
        document.getElementById("editProfileBtn");

    if (editProfileBtn) {

        editProfileBtn.addEventListener("click", function () {

            alert("✏️ Profile editing is coming soon.");

        });
    }
    const editProfileBtn2 =
        document.getElementById("editProfileBtn2");

    if (editProfileBtn2) {

        editProfileBtn2.addEventListener("click", function () {

            alert("✏️ Profile editing is coming soon.");

        });
    }


    // =============================================
    // DOWNLOAD CAREER REPORT
    // =============================================

    const downloadReportBtn =
        document.getElementById("downloadReportBtn");

    if (downloadReportBtn) {

        downloadReportBtn.addEventListener(
            "click",
            function () {

                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                const savedAnalysis =
                    JSON.parse(
                        localStorage.getItem(
                            "resumeAnalysisResult"
                        ) || "{}"
                    );

                const userName =
                    document.getElementById(
                        "profileName"
                    )?.textContent || "Student";

                const userEmail =
                    document.getElementById(
                        "profileEmail"
                    )?.textContent || "Not available";


                const atsScore =
                    Math.round(
                        savedAnalysis.atsScore || 0
                    );

                const aiMatchScore =
                    Math.round(
                        savedAnalysis.aiMatchScore || 0
                    );

                const jobReadiness =
                    Math.round(
                        (atsScore + aiMatchScore) / 2
                    );

                const profileCompletion =
                    document.getElementById(
                        "profilePercent"
                    )?.textContent || "85%";

                doc.setFontSize(20);

                doc.text(
                    "HybridHire AI Career Report",
                    20,
                    20
                );

                doc.setFontSize(14);

                doc.text(
                    "Student Profile",
                    20,
                    40
                );

                doc.setFontSize(11);

                doc.text(
                    `Name: ${userName}`,
                    20,
                    50
                );

                doc.text(
                    `Email: ${userEmail}`,
                    20,
                    58
                );

                doc.setFontSize(14);

                doc.text(
                    "Performance Summary",
                    20,
                    80
                );

                doc.setFontSize(11);

                doc.text(
                    `ATS Score: ${atsScore}%`,
                    25,
                    90
                );

                doc.text(
                    `AI Match Score: ${aiMatchScore}%`,
                    25,
                    98
                );

                doc.text(
                    `Job Readiness: ${jobReadiness}%`,
                    25,
                    106
                );

                doc.text(
                    `Profile Completion: ${profileCompletion}`,
                    25,
                    114
                );


                doc.setFontSize(14);

                doc.text(
                    "AI Recommendations",
                    20,
                    135
                );

                doc.setFontSize(11);

                const recommendations = [
                    ...(savedAnalysis.vocabularySuggestions || []),
                    ...(savedAnalysis.actionableTips || [])
                ];


                if (recommendations.length === 0) {

                    doc.text(
                        "No recommendations available.",
                        25,
                        145
                    );

                } else {

                    let y = 145;

                    recommendations
                        .slice(0, 6)
                        .forEach(function (recommendation) {

                            const lines =
                                doc.splitTextToSize(
                                    `• ${recommendation}`,
                                    165
                                );

                            doc.text(
                                lines,
                                25,
                                y
                            );

                            y +=
                                lines.length * 6 + 3;
                        });
                }


                doc.setFontSize(10);

                doc.text(
                    "Generated by HybridHire AI",
                    20,
                    285
                );
                doc.save(
                    `${userName.replace(/\s+/g, "_")}_Career_Report.pdf`
                );

            }
        );
    }


    // =============================================
    // SIGN OUT
    // =============================================

    const signOutBtn =
        document.getElementById("signOutBtn");

    if (signOutBtn) {

        signOutBtn.addEventListener(
            "click",
            function (e) {

                e.preventDefault();

                if (
                    confirm(
                        "Are you sure you want to sign out?"
                    )
                ) {

                    localStorage.removeItem("jwtToken");
                    localStorage.removeItem("userRole");
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("userName");

                    localStorage.removeItem(
                        "resumeAnalysisResult"
                    );

                    window.location.href =
                        "login.html";
                }
            }
        );
    }


    console.log(
        "✅ HybridHire AI Student Profile loaded successfully!"
    );

});

async function loadProfile() {

    const token =
        localStorage.getItem("jwtToken");

    if (!token) {

        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/profile",
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            }
        );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

            localStorage.removeItem("jwtToken");

            window.location.href =
                "login.html";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Failed to load profile"
            );
        }


        const data =
            await response.json();

        console.log(
            "Profile Data:",
            data
        );


        const profileName =
            document.getElementById(
                "profileName"
            );

        const profileEmail =
            document.getElementById(
                "profileEmail"
            );


        if (profileName) {

            profileName.textContent =
                data.name || "Student";
        }


        if (profileEmail) {

            profileEmail.textContent =
                data.email || "Not available";
        }

    } catch (error) {

        console.error(
            "Profile API Error:",
            error
        );
    }
}

function loadProfileScores() {

    const savedAnalysis =
        JSON.parse(
            localStorage.getItem(
                "resumeAnalysisResult"
            ) || "{}"
        );


    const atsScore =
        Math.round(
            savedAnalysis.atsScore || 0
        );

    const aiMatchScore =
        Math.round(
            savedAnalysis.aiMatchScore || 0
        );

    const jobReadiness =
        Math.round(
            (atsScore + aiMatchScore) / 2
        );

    const profilePercentElement =
        document.getElementById(
            "profilePercent"
        );

    const profileBar =
        document.getElementById(
            "profileBar"
        );


    if (profilePercentElement) {

        profilePercentElement.textContent =
            "85%";
    }


    if (profileBar) {

        profileBar.style.width =
            "85%";
    }


    // =============================================
    // ATS SCORE
    // =============================================

    const atsElement =
        document.getElementById(
            "atsScore"
        );

    if (atsElement) {

        atsElement.textContent =
            `${atsScore}%`;
    }


    // =============================================
    // AI MATCH SCORE
    // =============================================

    const aiMatchElement =
        document.getElementById(
            "aiMatchScore"
        );

    if (aiMatchElement) {

        aiMatchElement.textContent =
            `${aiMatchScore}%`;
    }

    const jobReadinessElement =
        document.getElementById(
            "jobReadiness"
        );

    if (jobReadinessElement) {

        jobReadinessElement.textContent =
            `${jobReadiness}%`;
    }


    return {
        atsScore,
        aiMatchScore,
        jobReadiness
    };
}