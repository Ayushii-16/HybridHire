// =============================================
// HYBRIDHIRE AI - Analytics Dashboard
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    // ----- REAL DATA: FETCH & UPDATE STATS -----
        const API_BASE_URL = 'http://localhost:8080';
        const token = localStorage.getItem('jwtToken');
        let analyticsData = { total: 0, shortlisted: 0, rejected: 0, pending: 0, avgAts: 0, avgAi: 0, successRate: 0 };


       async function loadAnalytics() {
           try {

               const response = await fetch(`${API_BASE_URL}/api/recruiter/candidates`, {
                   headers: {
                       'Authorization': 'Bearer ' + token
                   }
               });

               if (!response.ok) {
                   throw new Error('Failed to fetch candidates');
               }

              const candidates = await response.json();

              console.log("Candidates from backend:", candidates);

              window.allCandidates = candidates;
              updateTrendChart(candidates);

               // =========================
               // BASIC COUNTS
               // =========================

               const total = candidates.length;

               const shortlisted = candidates.filter(
                   c => c.status === 'Shortlisted'
               ).length;

               const rejected = candidates.filter(
                   c => c.status === 'Rejected'
               ).length;

               const pending = candidates.filter(
                   c =>
                       c.status === 'In Review' ||
                       c.status === 'New Match'
               ).length;

               // =========================
               // AVERAGE SCORES
               // =========================

               const avgAts = total > 0
                   ? Math.round(
                       candidates.reduce(
                           (sum, c) => sum + Number(c.atsScore || 0),
                           0
                       ) / total
                   )
                   : 0;

               const avgAi = total > 0
                   ? Math.round(
                       candidates.reduce(
                           (sum, c) => sum + Number(c.semanticScore || 0),
                           0
                       ) / total
                   )
                   : 0;

               // =========================
               // SHORTLIST RATE
               // =========================

               const successRate = total > 0
                   ? Math.round((shortlisted / total) * 100)
                   : 0;

               // =========================
               // SAVE DATA
               // =========================

               analyticsData = {
                   total,
                   shortlisted,
                   rejected,
                   pending,
                   avgAts,
                   avgAi,
                   successRate
               };


               // =========================
               // UPDATE HTML
               // =========================

               document.getElementById('totalResumes').textContent =
                   total.toLocaleString();

               document.getElementById('shortlisted').textContent =
                   shortlisted.toLocaleString();

               document.getElementById('rejected').textContent =
                   rejected.toLocaleString();

               document.getElementById('pending').textContent =
                   pending.toLocaleString();


               // =========================
               // SUCCESS RATE
               // =========================

               document.getElementById('successRate').textContent =
                   successRate + '%';

               const successBar =
                   document.getElementById('successBar');

               if (successBar) {
                   successBar.style.width =
                       successRate + '%';
               }


               // =========================
               // AI SCORE
               // =========================

               document.getElementById('aiScore').textContent =
                   avgAi + '%';

               const aiScoreBar =
                   document.getElementById('aiScoreBar');

             if (aiScoreBar) {
                 aiScoreBar.style.width = avgAi + '%';
             }
             updateDepartmentBreakdown(candidates);
             updateSkills(candidates);

             } catch (error) {

                 console.error('Analytics load error:', error);

             }
       }

        loadAnalytics();

        function updateDepartmentBreakdown(candidates) {

            const container =
                document.getElementById('departmentList');

            if (!container) return;

            container.innerHTML = '';

            const departments = {};

            candidates.forEach(candidate => {

                const department =
                    candidate.department ||
                    candidate.jobRole ||
                    candidate.jobTitle ||
                    'Other';

                departments[department] =
                    (departments[department] || 0) + 1;
            });


            const total = candidates.length;


            Object.entries(departments)
                .sort((a, b) => b[1] - a[1])
                .forEach(([department, count]) => {

                    const percentage =
                        Math.round((count / total) * 100);


                    container.innerHTML += `
                        <div class="flex items-center gap-4">

                            <div class="w-32 font-medium text-sm
                                        text-on-surface-variant truncate">
                                ${department}
                            </div>

                            <div class="flex-1 bg-surface-variant
                                        rounded-full h-2">

                                <div class="bg-secondary h-2 rounded-full"
                                     style="width:${percentage}%">
                                </div>

                            </div>

                            <div class="w-12 text-right text-sm font-semibold">
                                ${percentage}%
                            </div>

                        </div>
                    `;
                });
        }


    // ----- UPLOAD RESUMES BUTTON -----
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            alert('📤 Upload Resumes dialog opened.\n\nSupported formats: PDF, DOCX, TXT');
        });
    }

    function updateSkills(candidates) {

        const container =
            document.getElementById('skillsCloud');

        if (!container) return;

        container.innerHTML = '';

        const skillCount = {};


        candidates.forEach(candidate => {

            if (!candidate.skills) return;

            let skills = [];

            if (Array.isArray(candidate.skills)) {
                skills = candidate.skills;
            }
            else if (typeof candidate.skills === 'string') {
                skills = candidate.skills.split(',');
            }


            skills.forEach(skill => {

                skill = skill.trim();

                if (!skill) return;

                skillCount[skill] =
                    (skillCount[skill] || 0) + 1;
            });
        });


        const topSkills =
            Object.entries(skillCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);


        topSkills.forEach(([skill, count]) => {

            container.innerHTML += `
                <span class="px-4 py-2 rounded-full
                             bg-secondary/10 text-secondary
                             border border-secondary/20
                             font-medium">

                    ${skill} (${count})

                </span>
            `;
        });
    }
    
    // ----- DOWNLOAD REPORTS BUTTON -----
const analyticsBtn = document.getElementById("downloadBtn");

if (analyticsBtn) {

    analyticsBtn.addEventListener("click", function () {

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("HybridHire AI",20,20);

        doc.setFontSize(16);
        doc.text("Recruitment Analytics Report",20,32);

        doc.setFontSize(12);
        doc.text("Generated On: " + new Date().toLocaleDateString(),20,45);

        doc.line(20,50,190,50);

        doc.setFontSize(15);
        doc.text("Overview",20,65);

       doc.setFontSize(11);
               doc.text("Total Resumes : " + analyticsData.total,25,78);
               doc.text("Shortlisted Candidates : " + analyticsData.shortlisted,25,88);
               doc.text("Rejected Candidates : " + analyticsData.rejected,25,98);
               doc.text("Pending Reviews : " + analyticsData.pending,25,108);

               doc.setFontSize(15);
               doc.text("Performance Metrics",20,128);

               doc.setFontSize(11);
               doc.text("Hiring Success Rate : " + analyticsData.successRate + "%",25,140);
               doc.text("Average AI Match Score : " + analyticsData.avgAi + "%",25,150);
               doc.text("Average ATS Score : " + analyticsData.avgAts + "%",25,160);

        doc.setFontSize(15);
        doc.text("AI Insights",20,190);

        doc.setFontSize(11);
        doc.text("• Backend Developer roles show highest demand.",25,202);
        doc.text("• Java & Spring Boot are top matching skills.",25,212);
        doc.text("• Resume quality improved by 18% this month.",25,222);
        doc.text("• AI recommends reviewing 156 pending resumes.",25,232);

        doc.setFontSize(10);
        doc.text("Generated by HybridHire AI Analytics Dashboard",20,285);

        doc.save("Recruitment_Analytics_Report.pdf");

    });

}
// ----- LOGOUT -----
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function (e) {

        e.preventDefault();

        if (confirm("Are you sure you want to logout?")) {

            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userName");


            alert("✅ Logged out successfully!");
            window.location.href = "login.html";

        }

    });

}
    
    // ----- SEARCH INPUT -----
const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keypress", function(e) {

        if (e.key === "Enter") {

            const query = this.value.trim().toLowerCase();

            if (query === "") return;

            if (query.includes("resume")) {
                alert("📄 Analytics Found\n\n• Total Resumes : 12,450\n• Resume Growth : +12%");
            }
            else if (query.includes("short")) {
                alert("✅ Shortlisted Candidates\n\n842 Candidates\nGrowth : +5%");
            }
            else if (query.includes("reject")) {
                alert("❌ Rejected Candidates\n\n1,230 Candidates\nTrend : -2%");
            }
            else if (query.includes("pending")) {
                alert("⏳ Pending Reviews\n\n156 Resumes Awaiting Review");
            }
            else if (query.includes("hiring")) {
                alert("📈 Hiring Success Rate\n\n78% Overall Hiring Efficiency");
            }
            else {
                alert("🔍 No matching analytics found.");
            }

        }

    });

}
    
function updateTrendChart(candidates, period = 'Last 6 Months') {

    const chart = document.getElementById('trendChart');
    if (!chart) return;

    const now = new Date();

    let cutoff = new Date();

    if (period === 'Last 6 Months') {
        cutoff.setMonth(now.getMonth() - 6);
    }
    else if (period === 'Last 1 Year') {
        cutoff.setFullYear(now.getFullYear() - 1);
    }
    const monthlyData = {};

    candidates.forEach(candidate => {

        if (!candidate.uploadDate) return;

        const date = new Date(candidate.uploadDate);

        if (date < cutoff) return;

        const key =
            date.getFullYear() + '-' +
            String(date.getMonth() + 1).padStart(2, '0');

        const month =
            date.toLocaleString('en-US', {
                month: 'short'
            });

        monthlyData[key] = {
            month: month,
            count: (monthlyData[key]?.count || 0) + 1
        };
    });

    const data = Object.values(monthlyData);

    if (data.length === 0) {
        chart.innerHTML = `
            <div class="flex items-center justify-center h-full">
                No resume data available for this period
            </div>
        `;
        return;
    }

    const width = 700;
    const height = 300;
    const padding = 50;

    const maxValue =
        Math.max(...data.map(item => item.count), 5);

    const points = data.map((item, index) => {

        const x = padding +
            index *
            ((width - padding * 2) /
            Math.max(data.length - 1, 1));

        const y =
            height -
            padding -
            (item.count / maxValue) *
            (height - padding * 2);

        return {
            month: item.month,
            count: item.count,
            x,
            y
        };
    });

    const linePoints =
        points.map(p => `${p.x},${p.y}`).join(' ');

    chart.innerHTML = `
        <svg
            viewBox="0 0 ${width} ${height}"
            class="w-full h-full"
        >

            <!-- Grid -->
            <line x1="${padding}" y1="${height - padding}"
                  x2="${width - padding}" y2="${height - padding}"
                  stroke="currentColor" opacity="0.15"/>

            <line x1="${padding}" y1="${height / 2}"
                  x2="${width - padding}" y2="${height / 2}"
                  stroke="currentColor" opacity="0.08"/>

            <line x1="${padding}" y1="${padding}"
                  x2="${width - padding}" y2="${padding}"
                  stroke="currentColor" opacity="0.08"/>

            <!-- Y Axis -->
            <text x="15"
                  y="${height - padding + 5}"
                  class="fill-on-surface-variant"
                  font-size="12">
                0
            </text>

            <text x="15"
                  y="${height / 2 + 5}"
                  class="fill-on-surface-variant"
                  font-size="12">
                ${Math.ceil(maxValue / 2)}
            </text>

            <text x="15"
                  y="${padding + 5}"
                  class="fill-on-surface-variant"
                  font-size="12">
                ${maxValue}
            </text>

            <!-- Line -->
            <polyline
                points="${linePoints}"
                fill="none"
                stroke="currentColor"
                class="text-secondary"
                stroke-width="3"
            />

            <!-- Points + Labels -->
            ${points.map(p => `
                <circle
                    cx="${p.x}"
                    cy="${p.y}"
                    r="5"
                    fill="currentColor"
                    class="text-secondary"
                />

                <text
                    x="${p.x}"
                    y="${p.y - 12}"
                    text-anchor="middle"
                    class="fill-secondary"
                    font-size="13"
                    font-weight="600"
                >
                    ${p.count}
                </text>

                <text
                    x="${p.x}"
                    y="${height - 15}"
                    text-anchor="middle"
                    class="fill-on-surface-variant"
                    font-size="12"
                >
                    ${p.month}
                </text>
            `).join('')}

        </svg>
    `;
}
   const trendSelect = document.getElementById('trendSelect');

   if (trendSelect) {

       trendSelect.addEventListener('change', function () {

           updateTrendChart(
               window.allCandidates || [],
               this.value
           );

       });
   }

   });