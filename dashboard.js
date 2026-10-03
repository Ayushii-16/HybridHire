// =============================================
// HYBRIDHIRE AI - Dashboard
// =============================================

document.addEventListener("DOMContentLoaded", () => {

    const dashboardStatusFilter = document.getElementById("dashboardStatusFilter");
    if (dashboardStatusFilter) {
        dashboardStatusFilter.addEventListener("change", applyDashboardStatusFilter);
    }

    // ==========================
    // Role Check
    // ==========================

    const role = localStorage.getItem("userRole");

    if (!role) {
        window.location.replace("login.html");
        return;
    }

    if (role !== "recruiter") {
        window.location.replace("student.html");
        return;
    }

    console.log("Recruiter Dashboard Loaded");


    // ==========================
    // API Configuration
    // ==========================

    const API_BASE_URL = "http://localhost:8080";
    const token = localStorage.getItem("jwtToken");

    let dashboardCandidates = [];

    // ==========================
    // Helper Functions
    // ==========================

    function authHeaders() {
        return {
            "Authorization": "Bearer " + token
        };
    }

    function scoreToPercent(score) {

        if (score === null || score === undefined || isNaN(score)) {
            return 0;
        }
        let value = Number(score);
        if (value > 0 && value <= 1) {
            value = value * 100;
        }

        return Math.round(value);
    }

    function isToday(dateValue) {

        if (!dateValue) {
            return false;
        }

        const date = new Date(dateValue);

        if (isNaN(date.getTime())) {
            return false;
        }

        const today = new Date();

        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }

    // ==========================
    // Load Dashboard Data
    // ==========================

    async function loadDashboardData() {

        try {

            const response = await fetch(
                `${API_BASE_URL}/api/recruiter/candidates`,
                {
                    headers: authHeaders()
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch candidates");
            }

            const candidates = await response.json();

            dashboardCandidates = Array.isArray(candidates)
                ? candidates
                : [];

            // ==========================
            // Total Candidates
            // ==========================

            const totalCandidates = dashboardCandidates.length;

            // ==========================
            // Active Jobs
            // ==========================

            const activeJobs = new Set(
                dashboardCandidates
                    .map(c => c.jobDescription)
                    .filter(Boolean)
            ).size;

            // ==========================
            // Resumes Processed Today
            // ==========================

            const resumesToday = dashboardCandidates.filter(
                c => isToday(c.uploadDate)
            ).length;

            // ==========================
            // Average AI Match Score
            // ==========================

            const aiScores = dashboardCandidates
                .map(c => scoreToPercent(c.semanticScore))
                .filter(score => !isNaN(score));

            const avgAiMatch = aiScores.length > 0
                ? Math.round(
                    aiScores.reduce((sum, score) => sum + score, 0)
                    / aiScores.length
                )
                : 0;

            // ==========================
            // Update Dashboard Cards
            // ==========================

            const totalCandidatesEl =
                document.getElementById("totalCandidates");

            const activeJobsEl =
                document.getElementById("activeJobs");

            const resumesTodayEl =
                document.getElementById("resumesToday");

            const aiMatchScoreEl =
                document.getElementById("aiMatchScore");

            const aiScoreBar =
                document.getElementById("aiScoreBar");

            if (totalCandidatesEl) {
                totalCandidatesEl.textContent =
                    totalCandidates.toLocaleString();
            }

            if (activeJobsEl) {
                activeJobsEl.textContent =
                    activeJobs.toLocaleString();
            }

            if (resumesTodayEl) {
                resumesTodayEl.textContent =
                    resumesToday.toLocaleString();
            }

            if (aiMatchScoreEl) {
                aiMatchScoreEl.textContent =
                    avgAiMatch + "%";
            }

            if (aiScoreBar) {
                aiScoreBar.style.width =
                    avgAiMatch + "%";
            }

            // ==========================
            // Candidate Trend
            // ==========================

            updateCandidateTrend();

            // ==========================
            // Top Candidates
            // ==========================

            renderTopCandidates(
                [...dashboardCandidates]
                    .sort(
                        (a, b) =>
                            scoreToPercent(b.semanticScore) -
                            scoreToPercent(a.semanticScore)
                    )
                    .slice(0, 4)
            );

            // ==========================
            // Weekly Screening Trends
            // ==========================

            renderWeeklyScreeningTrends(
                dashboardCandidates
            );

        }

        catch (error) {

            console.error(
                "Dashboard load error:",
                error
            );

        }

    }

    // ==========================
    // Candidate Trend
    // ==========================

    function updateCandidateTrend() {

        const trendElement =
            document.getElementById("candidateTrend");

        if (!trendElement) {
            return;
        }

        const now = new Date();

        const currentWeekStart = new Date(now);
        currentWeekStart.setDate(
            now.getDate() - 6
        );
        currentWeekStart.setHours(0, 0, 0, 0);

        const previousWeekStart = new Date(
            currentWeekStart
        );

        previousWeekStart.setDate(
            currentWeekStart.getDate() - 7
        );

        const currentWeekCount =
            dashboardCandidates.filter(c => {

                const date = new Date(c.uploadDate);

                return (
                    !isNaN(date) &&
                    date >= currentWeekStart &&
                    date <= now
                );

            }).length;

        const previousWeekCount =
            dashboardCandidates.filter(c => {

                const date = new Date(c.uploadDate);

                const previousWeekEnd =
                    new Date(currentWeekStart);

                previousWeekEnd.setMilliseconds(-1);

                return (
                    !isNaN(date) &&
                    date >= previousWeekStart &&
                    date <= previousWeekEnd
                );

            }).length;

        if (previousWeekCount === 0) {

            trendElement.textContent =
                currentWeekCount > 0
                    ? "+100%"
                    : "0%";

            return;
        }

        const percentageChange =
            Math.round(
                (
                    (currentWeekCount - previousWeekCount)
                    / previousWeekCount
                ) * 100
            );

        trendElement.textContent =
            (percentageChange >= 0 ? "+" : "") +
            percentageChange +
            "%";

    }

    // ==========================
    // Top Candidates
    // ==========================

    function renderTopCandidates(candidates) {

        const tbody =
            document.getElementById(
                "candidateTableBody"
            );

        if (!tbody) {
            return;
        }

        if (
            !candidates ||
            candidates.length === 0
        ) {

            tbody.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="p-4 text-center text-gray-400"
                    >
                        No candidates yet.
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML =
            candidates.map(c => {

                const initials =
                    (c.fileName || "NA")
                        .substring(0, 2)
                        .toUpperCase();


                const ats =
                    scoreToPercent(c.atsScore);

                const ai =
                    scoreToPercent(c.semanticScore);


                let statusColor =
                    "bg-blue-100 text-blue-800";


                if (c.status === "Shortlisted") {

                    statusColor =
                        "bg-green-100 text-green-800";

                }
                else if (c.status === "In Review") {

                    statusColor =
                        "bg-amber-100 text-amber-800";

                }
                else if (c.status === "Rejected") {

                    statusColor =
                        "bg-red-100 text-red-800";

                }


                return `
                    <tr
                        class="hover:bg-surface-container-lowest transition-colors"
                    >



                        <td class="p-4">

                            <div class="flex items-center gap-3">

                                <div
                                    class="w-8 h-8 rounded-full
                                    bg-surface-variant text-primary
                                    flex items-center justify-center
                                    font-bold text-xs"
                                >
                                    ${initials}
                                </div>

                                <span class="font-medium">
                                    ${c.fileName || "Unknown"}
                                </span>

                            </div>

                        </td>

                        <td class="p-4 text-on-surface-variant">
                            ${
                                (c.jobDescription || "")
                                    .substring(0, 25)
                            }...
                        </td>


                        <td class="p-4 text-center">
                            ${ats}
                        </td>


                        <td class="p-4">

                            <div
                                class="flex items-center
                                justify-center gap-2"
                            >

                                <span class="font-semibold">
                                    ${ai}%
                                </span>

                            </div>

                        </td>

                        <td class="p-4">

                            <span
                                class="
                                    inline-flex
                                    items-center
                                    px-2.5
                                    py-0.5
                                    rounded-full
                                    text-xs
                                    font-medium
                                    ${statusColor}
                                "
                            >
                                ${c.status || "In Review"}
                            </span>

                        </td>

                        <td class="p-4 text-right">

                            <button
                                class="
                                    text-on-surface-variant
                                    hover:text-primary
                                    transition-colors
                                    view-btn
                                "
                                data-id="${c.id || ""}"
                            >

                                <span
                                    class="
                                        material-symbols-outlined
                                        text-[20px]
                                    "
                                >
                                    visibility
                                </span>

                            </button>

                        </td>

                    </tr>
                `;

            }).join("");

    }

      function applyDashboardStatusFilter() {
          const filter =
              document.getElementById("dashboardStatusFilter")?.value || "";

          let filteredCandidates = [...dashboardCandidates];

          if (filter === "Shortlisted") {
              filteredCandidates = dashboardCandidates.filter(
                  c => c.status === "Shortlisted"
              );
          }
          else if (filter === "Rejected") {
              filteredCandidates = dashboardCandidates.filter(
                  c => c.status === "Rejected"
              );
          }
          else if (filter === "Pending") {
              filteredCandidates = dashboardCandidates.filter(
                  c =>
                      c.status !== "Shortlisted" &&
                      c.status !== "Rejected"
              );
          }

          filteredCandidates.sort(
              (a, b) =>
                  scoreToPercent(b.semanticScore) -
                  scoreToPercent(a.semanticScore)
          );

          renderTopCandidates(filteredCandidates.slice(0, 4));
      }

    // ==========================
    // Weekly Screening Trends
    // ==========================

    function renderWeeklyScreeningTrends(candidates) {

        const dayLabels = [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"
        ];


        const counts = {
            Mon: 0,
            Tue: 0,
            Wed: 0,
            Thu: 0,
            Fri: 0,
            Sat: 0,
            Sun: 0
        };


        candidates.forEach(c => {

            if (!c.uploadDate) {
                return;
            }

            const date =
                new Date(c.uploadDate);

            if (isNaN(date.getTime())) {
                return;
            }

            const dayIndex =
                (date.getDay() + 6) % 7;

            const day =
                dayLabels[dayIndex];

            counts[day]++;

        });


        const maxCount =
            Math.max(
                ...Object.values(counts),
                1
            );


        const barMap = {

            Mon: "monBar",
            Tue: "tueBar",
            Wed: "wedBar",
            Thu: "thuBar",
            Fri: "friBar",
            Sat: "satBar",
            Sun: "sunBar"

        };


        dayLabels.forEach(day => {

            const bar =
                document.getElementById(
                    barMap[day]
                );

            if (!bar) {
                return;
            }


            const value =
                counts[day];


            const height =
                value === 0
                    ? 0
                    : Math.max(
                        (value / maxCount) * 160,
                        8
                    );


            bar.style.height =
                height + "px";


            bar.setAttribute(
                "data-value",
                value
            );

            bar.setAttribute(
                "title",
                `${day}: ${value} resumes`
            );

        });

    }

    // ==========================
    // Search
    // ==========================

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const value =
                    this.value
                        .toLowerCase();


                const rows =
                    document.querySelectorAll(
                        "#candidateTableBody tr"
                    );

                rows.forEach(row => {

                    const text =
                        row.innerText
                            .toLowerCase();


                    row.style.display =
                        text.includes(value)
                            ? ""
                            : "none";

                });

            }
        );

    }

    // ==========================
    // View Candidate
    // ==========================

    document.addEventListener(
        "click",
        function (e) {

            const button =
                e.target.closest(
                    ".view-btn"
                );

            if (!button) {
                return;
            }


            const row =
                button.closest("tr");


            if (!row) {
                return;
            }
            const nameElement =
                row.querySelector(
                    ".font-medium"
                );


            const name =
                nameElement
                    ? nameElement.textContent
                    : "Candidate";


            alert(
                "Viewing Profile : " +
                name
            );

        }
    );

    // ==========================
    // Upload Button
    // ==========================

    const upload =
        document.getElementById(
            "uploadResumesBtn"
        );

    if (upload) {

        upload.addEventListener(
            "click",
            () => {

                window.location.href =
                    "upload.html";

            }
        );

    }

    // ==========================
    // Export Report
    // ==========================

    const exportBtn =
        document.getElementById(
            "exportBtn"
        );


    if (exportBtn) {

        exportBtn.addEventListener(
            "click",
            () => {

                const total =
                    dashboardCandidates.length;


                const avgAi =
                    total > 0
                        ? Math.round(
                            dashboardCandidates
                                .reduce(
                                    (sum, c) =>
                                        sum +
                                        scoreToPercent(
                                            c.semanticScore
                                        ),
                                    0
                                ) / total
                        )
                        : 0;


                const activeJobs =
                    new Set(
                        dashboardCandidates
                            .map(
                                c =>
                                    c.jobDescription
                            )
                            .filter(Boolean)
                    ).size;


                const topCandidates =
                    [...dashboardCandidates]
                        .sort(
                            (a, b) =>
                                scoreToPercent(
                                    b.semanticScore
                                ) -
                                scoreToPercent(
                                    a.semanticScore
                                )
                        )
                        .slice(0, 5);


                const shortlisted =
                    dashboardCandidates.filter(
                        c => c.status === "Shortlisted"
                    );

                const rejected =
                    dashboardCandidates.filter(
                        c => c.status === "Rejected"
                    );

                const pending =
                    dashboardCandidates.filter(
                        c =>
                            c.status !== "Shortlisted" &&
                            c.status !== "Rejected"
                    );

                const rows =
                    topCandidates.map(c => `

                        <tr>

                            <td>
                                ${c.fileName || "Unknown"}
                            </td>

                            <td>
                                ${(c.jobDescription || "").substring(0, 30)}...
                            </td>

                            <td>
                                ${scoreToPercent(c.atsScore)}
                            </td>

                            <td>
                                ${scoreToPercent(c.semanticScore)}%
                            </td>

                            <td>
                                ${c.status || "New Match"}
                            </td>

                        </tr>

                    `).join("");


                const report = `

                    <div
                        style="
                            padding:40px;
                            font-family:Arial;
                        "
                    >

                        <h1
                            style="
                                color:#2563eb;
                            "
                        >
                            HybridHire AI
                        </h1>

                        <h2>
                            Recruitment Dashboard Report
                        </h2>

                        <hr>

                        <h3>
                            Overview
                        </h3>

                        <p>
                            <strong>
                                Total Candidates:
                            </strong>
                            ${total}
                        </p>

                        <p>
                            <strong>
                                Active Jobs:
                            </strong>
                            ${activeJobs}
                        </p>

                        <p>
                            <strong>
                                Resumes Processed:
                            </strong>
                            ${total}
                        </p>

                        <p>
                            <strong>
                                Average AI Match:
                            </strong>
                            ${avgAi}%
                        </p>

                        <br>

                        <h3>
                            Top Candidates
                        </h3>

                        <table
                            border="1"
                            cellspacing="0"
                            cellpadding="8"
                            width="100%"
                        >

                            <tr>

                              <th>Name</th>
                              <th>Job Description</th>
                              <th>ATS</th>
                              <th>AI Match</th>
                              <th>Status</th>

                            </tr>

                            ${
                                rows ||
                                `
                                <tr>
                                    <td colspan="4">
                                        No candidates yet.
                                    </td>
                                </tr>
                                `
                            }

                        </table>

                        <br>
                      <h3>Shortlisted Candidates</h3>

                      ${
                          shortlisted.length > 0
                              ? shortlisted
                                  .map(c => `<p>• ${c.fileName || "Unknown"}</p>`)
                                  .join("")
                              : "<p>None</p>"
                      }

                      <h3>Rejected Candidates</h3>

                      ${
                          rejected.length > 0
                              ? rejected
                                  .map(c => `<p>• ${c.fileName || "Unknown"}</p>`)
                                  .join("")
                              : "<p>None</p>"
                      }

                      <h3>Pending Candidates</h3>

                      ${
                          pending.length > 0
                              ? pending
                                  .map(c => `<p>• ${c.fileName || "Unknown"}</p>`)
                                  .join("")
                              : "<p>None</p>"
                      }

                      <br>
                        <p>
                            Generated by HybridHire AI
                        </p>

                    </div>

                `;


                if (
                    typeof html2pdf !==
                    "undefined"
                ) {

                    html2pdf()
                        .from(report)
                        .save(
                            "HybridHire_Report.pdf"
                        );

                }
                else {

                    alert(
                        "PDF library not loaded."
                    );

                }

            }
        );

    }

    // ==========================
    // Logout
    // ==========================

    const logout =
        document.getElementById(
            "logoutBtn"
        );


    if (logout) {

        logout.addEventListener(
            "click",
            function (e) {

                e.preventDefault();


                if (confirm("Logout?")) {

                    localStorage.clear();

                    window.location.replace(
                        "login.html"
                    );

                }

            }
        );

    }

    loadDashboardData();

});