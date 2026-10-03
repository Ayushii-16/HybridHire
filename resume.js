// =============================================
// HYBRIDHIRE AI - Resume Analysis (Dynamic)
// =============================================

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. FETCH & RENDER DYNAMIC DATA
    // ==========================================

const storedData = localStorage.getItem('resumeAnalysisResult');

let analysisData = storedData
    ? JSON.parse(storedData)
    : {
        candidateName: "Candidate",
        atsScore: 0,
        aiMatchScore: 0,
        industryReadiness: 0,
        missingKeywords: [],
        suggestions: [],
        strengths: []
    };

    function updateUI(data) {
         const profileName = document.getElementById('profileName');

            if (profileName) {
                profileName.innerText = data.candidateName || 'Candidate';
            }
        const atsScoreEl = document.getElementById('atsScore');
        const aiMatchScoreEl = document.getElementById('aiMatchScore');
        const industryReadinessEl = document.getElementById('industryReadiness');

        if(atsScoreEl) atsScoreEl.innerText = data.atsScore + '%';
        if(aiMatchScoreEl) aiMatchScoreEl.innerHTML = data.aiMatchScore + '<span class="text-headline-sm">%</span>';
        const aiMatchBar = document.getElementById('aiMatchBar');

        if (aiMatchBar) {
            aiMatchBar.style.width = data.aiMatchScore + '%';
        }
        if(industryReadinessEl) industryReadinessEl.innerText = data.industryReadiness + '%';

      const atsCircle = document.querySelector('#atsScore')
          ?.closest('.relative')
          ?.querySelector('.progress-ring__circle');

      if (atsCircle) {
          const circumference = 251.2;

          atsCircle.style.strokeDasharray = circumference;

          atsCircle.style.strokeDashoffset =
              circumference - (data.atsScore / 100) * circumference;
      }

        const readinessCircle = document.getElementById('industryReadiness')
            ?.closest('.relative')
            ?.querySelector('.progress-ring__circle');

        if (readinessCircle) {
            const circumference = 251.2;

            readinessCircle.style.strokeDasharray = circumference;

            readinessCircle.style.strokeDashoffset =
                circumference - (data.industryReadiness / 100) * circumference;
        }

        const keywordsContainer =
            document.getElementById('missingKeywordsContainer');
        if (keywordsContainer && data.missingKeywords) {
            keywordsContainer.innerHTML = ''; // Clear old static tags
            data.missingKeywords.forEach(keyword => {
                const span = document.createElement('span');
                span.className = 'px-3 py-1 bg-warning-amber/10 text-warning-amber text-xs font-semibold rounded-full border border-warning-amber/20 keyword-tag cursor-pointer';
                span.innerHTML = '+ ' + keyword;
                keywordsContainer.appendChild(span);
            });
        }

      const suggestionsContainer =
          document.getElementById('suggestionsContainer');
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

    updateUI(analysisData);

    const fileData = sessionStorage.getItem('resumeFileData');
        const resumeDocEl = document.getElementById('resumeDocument');
        if (fileData && resumeDocEl) {
            resumeDocEl.style.padding = '0';
            resumeDocEl.innerHTML = `<iframe src="${fileData}#toolbar=0" style="width:100%; height:580px; border:none; display:block;"></iframe>`;
        }


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

    const reanalyzeBtn = document.getElementById('reanalyzeBtn');
    if (reanalyzeBtn) {
        reanalyzeBtn.addEventListener('click', function() {
            alert('🔄 Re-analyzing resume with latest AI models...\n\nThis may take a few moments.');
        });
    }

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

    const analyzeResumeBtn = document.getElementById("analyzeResumeBtn");
    if(analyzeResumeBtn){
        analyzeResumeBtn.addEventListener("click", function(){
            window.location.href = "student-upload.html";
        });
    }
});


