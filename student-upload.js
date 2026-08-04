// ============================================
// HybridHire AI - Student Upload Resume (Fixed)
// student-upload.js
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    // ----- 1. CHECK ROLE & TOKEN (Security Check) -----
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('jwtToken');

    if (!token || role !== 'student') {
        window.location.href = 'login.html';
        return;
    } else if (role === 'recruiter') {
        window.location.href = 'dashboard.html';
        return;
    }

    // ----- 2. DOM ELEMENTS (Matching student-upload.html IDs) -----
    const fileInput = document.getElementById("resumeInput");
    const fileList = document.getElementById("fileList");
    const fileCount = document.getElementById("fileCount");
    const totalFiles = document.getElementById("totalFiles");
    const readyFiles = document.getElementById("readyFiles");
    const rejectedFiles = document.getElementById("rejectedFiles");
    const uploadBtn = document.getElementById("uploadBtn");

    let selectedFile = null;

    // ----- 3. FILE SELECTION -----
    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                selectedFile = e.target.files[0];
                showFile(selectedFile);
            }
        });
    }

    function showFile(file) {
        if (!fileList) return;

        fileList.innerHTML = `
            <div class="file-item flex justify-between items-center p-4 rounded-lg border bg-white">
                <div>
                    <div class="font-medium text-gray-800">${file.name}</div>
                    <div class="text-sm text-gray-500">${(file.size / 1024).toFixed(1)} KB</div>
                </div>
                <span class="text-green-600 font-semibold text-sm">Ready</span>
            </div>
        `;

        if (fileCount) fileCount.innerText = "1 Files";
        if (totalFiles) totalFiles.innerText = "1";
        if (readyFiles) readyFiles.innerText = "1";
        if (rejectedFiles) rejectedFiles.innerText = "0";
    }

    // ----- 4. UPLOAD TO BACKEND (/form API) -----
    if (uploadBtn) {
        uploadBtn.addEventListener("click", async () => {
            if (!selectedFile) {
                alert("Please select a resume first.");
                return;
            }

            uploadBtn.innerHTML = "Uploading... ⏳";
            uploadBtn.disabled = true;

            const formData = new FormData();
            const reader = new FileReader();
            reader.onload = function(e) {
                sessionStorage.setItem('resumeFileData', e.target.result);
                sessionStorage.setItem('resumeFileName', selectedFile.name);
            };
            reader.readAsDataURL(selectedFile);
            formData.append("file", selectedFile);

            try {
                const response = await fetch('http://localhost:8080/form', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwtToken')
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();

                    const analysisData = {
                        candidateName: localStorage.getItem('userName') || "Candidate",
                        atsScore: Math.round(data.atsScore),
                        aiMatchScore: Math.round(data.semanticScore),
                        industryReadiness: Math.round((data.atsScore + data.semanticScore) / 2),
                        missingKeywords: data.missingKeywords || [],
                        suggestions: [...(data.vocabularySuggestions || []), ...(data.actionableTips || [])],
                        strengths: []
                    };

                    localStorage.setItem('resumeAnalysisResult', JSON.stringify(analysisData));

                    alert('✅ Resume Uploaded & Parsed Successfully!');
                    window.location.href = 'resume.html';
                } else if (response.status === 401 || response.status === 403) {
                    alert('❌ Session expired! Please login again.');
                    window.location.href = 'login.html';
                } else {
                    alert('❌ Failed to upload resume. Server returned status: ' + response.status);
                }

            } catch (error) {
                console.error("API Error:", error);
                alert('⚠️ Server error! Make sure your Spring Boot backend is running on port 8080.');
            } finally {
                uploadBtn.innerHTML = "Upload & Analyze";
                uploadBtn.disabled = false;
            }
        });
    }

    console.log('✅ Student Upload JS loaded successfully!');
});