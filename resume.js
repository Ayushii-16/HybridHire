// =============================================
// HYBRIDHIRE AI - Resume Analysis (Dynamic)
// =============================================

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. FETCH & RENDER DYNAMIC DATA
    // ==========================================

    // Ye data upload page se localStorage me aayega.
    // Agar nahi hai, toh hum fallback mock data use karenge testing ke liye.
    const storedData = localStorage.getItem('resumeAnalysisResult');

    let analysisData = storedData ? JSON.parse(storedData) : {
        candidateName: "Alex Morgan", // Replace with dynamic name later
        atsScore: 85,
        aiMatchScore: 92,
        industryReadiness: 88,
        missingKeywords: ["Kubernetes", "GraphQL", "Webpack", "System Design"],
        suggestions: [
            "Quantify achievements in your latest role (e.g., 'Led team of 5').",
            "Move Education section to bottom for senior roles.",
            "Add a brief summary highlighting your micro-frontends experience."
        ],
        strengths: ["Strong React & Vue.js knowledge", "Good CI/CD implementation"]
    };

    // Render Data to UI
    function updateUI(data) {
        // Update Scores
        const atsScoreEl = document.getElementById('atsScore');
        const aiMatchScoreEl = document.getElementById('aiMatchScore');
        const industryReadinessEl = document.getElementById('industryReadiness');

        if(atsScoreEl) atsScoreEl.innerText = data.atsScore + '%';
        if(aiMatchScoreEl) aiMatchScoreEl.innerHTML = data.aiMatchScore + '<span class="text-headline-sm">%</span>';
        if(industryReadinessEl) industryReadinessEl.innerText = data.industryReadiness + '%';

        // Update Missing Keywords (Finding the container via DOM traversal or class)
        // Note: HTML me id="missingKeywordsContainer" add karna better hoga, abhi querySelector use kar rahe hain
        const keywordsContainer = document.querySelector('.flex.flex-wrap.gap-2');
        if (keywordsContainer && data.missingKeywords) {
            keywordsContainer.innerHTML = ''; // Clear old static tags
            data.missingKeywords.forEach(keyword => {
                const span = document.createElement('span');
                span.className = 'px-3 py-1 bg-warning-amber/10 text-warning-amber text-xs font-semibold rounded-full border border-warning-amber/20 keyword-tag cursor-pointer';
                span.innerHTML = '+ ' + keyword;
                keywordsContainer.appendChild(span);
            });
        }

        // Update Suggestions
        const suggestionsContainer = document.querySelector('ul.space-y-3');
        if (suggestionsContainer && data.suggestions) {
            suggestionsContainer.innerHTML = ''; // Clear old static suggestions
            data.suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.className = 'flex items-start gap-3 suggestion-item cursor-pointer';
                li.innerHTML = `
                    <span class="material-symbols-outlined text-[18px] text-ai-blue mt-0.5">check_circle</span>
                    <span class="text-sm text-on-surface">${suggestion}</span>
                `;
                suggestionsContainer.appendChild(li);
            });
        }
    }

    // Call the function to update UI on page load
    updateUI(analysisData);


    // ==========================================
    // 2. EXPORT REPORT (DYNAMIC)
    // ==========================================
    const exportBtn = document.getElementById("exportBtn");
    if (exportBtn) {
        exportBtn.addEventListener("click", function () {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text("HybridHire AI Resume Analysis Report", 20, 20);

            doc.setFontSize(12);
            doc.text(`Candidate: ${analysisData.candidateName}`, 20, 40);
            doc.text(`ATS Score: ${analysisData.atsScore}%`, 20, 50);
            doc.text(`AI Match Score: ${analysisData.aiMatchScore}%`, 20, 60);
            doc.text(`Industry Readiness: ${analysisData.industryReadiness}%`, 20, 70);

            doc.text("Strengths:", 20, 90);
            let yPos = 100;
            analysisData.strengths.forEach(strength => {
                doc.text(`- ${strength}`, 30, yPos);
                yPos += 10;
            });

            yPos += 10;
            doc.text("Suggestions to Improve:", 20, yPos);
            yPos += 10;
            analysisData.suggestions.forEach(suggestion => {
                // Split long text for PDF
                const splitText = doc.splitTextToSize(`- ${suggestion}`, 160);
                doc.text(splitText, 30, yPos);
                yPos += (10 * splitText.length);
            });

            doc.save(`${analysisData.candidateName}_Analysis_Report.pdf`);
        });
    }

    // ==========================================
    // 3. EVENT LISTENERS & UI INTERACTIONS
    // ==========================================

    // ----- RE-ANALYZE -----
    const reanalyzeBtn = document.getElementById('reanalyzeBtn');
    if (reanalyzeBtn) {
        reanalyzeBtn.addEventListener('click', function() {
            alert('🔄 Re-analyzing resume with latest AI models...\n\nThis may take a few moments.');
        });
    }

    // ----- DOWNLOAD IMPROVED RESUME -----
    const downloadBtn = document.getElementById("downloadBtn");
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.text("Improved Resume (AI Optimized)", 20, 20);
            doc.setFontSize(16);
            doc.text(analysisData.candidateName, 20, 35);

            doc.setFontSize(11);
            doc.text("Contact information placeholder", 20, 45);

            doc.setFontSize(13);
            doc.text("AI Recommended Skills:", 20, 65);
            doc.setFontSize(11);

            // Combine old skills with missing keywords
            let y = 75;
            analysisData.missingKeywords.forEach(skill => {
                doc.text(`• ${skill} (Added by AI)`, 30, y);
                y += 8;
            });

            doc.setFontSize(10);
            doc.text("Generated by HybridHire AI - ATS Optimized Resume", 20, 285);
            doc.save("Improved_Resume.pdf");
        });
    }

    // ----- ZOOM BUTTONS -----
    const zoomBtns = document.querySelectorAll('.zoom-btn');
    const resumeDocument = document.getElementById('resumeDocument');
    let zoomLevel = 1;

    zoomBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const action = this.dataset.zoom;
            if (action === 'in') {
                zoomLevel = Math.min(zoomLevel + 0.1, 2);
            } else {
                zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
            }
            if (resumeDocument) {
                resumeDocument.style.transform = 'scale(' + zoomLevel + ')';
                resumeDocument.style.transformOrigin = 'top left';
            }
        });
    });

    // ----- KEYWORD TAGS CLICK (Event Delegation used for dynamically created elements) -----
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('keyword-tag')) {
            const keyword = e.target.textContent.trim().replace('+ ', '');
            alert('🔍 Adding keyword to your profile: ' + keyword);
        }

        if (e.target && e.target.closest('.suggestion-item')) {
            const text = e.target.closest('.suggestion-item').querySelector('.text-sm')?.textContent || 'Suggestion';
            alert('💡 Applying suggestion:\n\n' + text);
        }
    });

    // Analyze Resume Button (Navigation)
    const analyzeResumeBtn = document.getElementById("analyzeResumeBtn");
    if(analyzeResumeBtn){
        analyzeResumeBtn.addEventListener("click", function(){
            window.location.href = "student-upload.html";
        });
    }
});


