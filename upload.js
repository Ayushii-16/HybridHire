// =============================================
// HYBRIDHIRE AI - Bulk Resume Upload (API Integration)
// =============================================

document.addEventListener('DOMContentLoaded', function () {

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const fileStatusList = document.getElementById('fileStatusList');
    const searchInput = document.getElementById("searchInput");
    const recentUploadsList = document.getElementById("recentUploadsList");
    const viewHistoryBtn = document.getElementById("viewHistoryBtn");

    const fileCountEl = document.getElementById('fileCount');
    const successCountEl = document.getElementById('successCount');
    const failedCountEl = document.getElementById('failedCount');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const progressSection = document.getElementById('progressSection');

    let selectedFiles = [];
    let successCount = 0;
    let failedCount = 0;

    // ----- 1. AUTHENTICATION CHECK -----
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        alert("🔒 Unauthorized access! Please log in to continue.");
        window.location.href = 'login.html';
        return;
    }
 async function loadRecentUploads() {
     if (!recentUploadsList) return;

     try {
         const response = await fetch(
             "http://localhost:8080/api/recruiter/candidates",
             {
                 headers: {
                     "Authorization": "Bearer " + token
                 }
             }
         );

         if (!response.ok) {
             throw new Error("Failed to load upload history");
         }

         const candidates = await response.json();

         const recentUploads = [...candidates]
             .sort((a, b) =>
                 new Date(b.uploadDate) - new Date(a.uploadDate)
             )
             .slice(0, 5);

         if (recentUploads.length === 0) {
             recentUploadsList.innerHTML = `
                 <p class="text-sm text-on-surface-variant text-center py-6">
                     No uploads yet.
                 </p>
             `;
             return;
         }

         recentUploadsList.innerHTML = recentUploads.map(candidate => {

             const date = candidate.uploadDate
                 ? new Date(candidate.uploadDate).toLocaleDateString(
                     "en-IN",
                     {
                         day: "2-digit",
                         month: "short",
                         year: "numeric"
                     }
                 )
                 : "Unknown date";

             const score = Math.round(candidate.semanticScore || 0);

             return `
                 <div class="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-container-low">
                     <div class="flex items-center gap-3 min-w-0">
                         <div class="w-9 h-9 rounded-lg bg-error-container/30 text-error flex items-center justify-center shrink-0">
                             <span class="material-symbols-outlined text-[20px]">
                                 description
                             </span>
                         </div>

                         <div class="min-w-0">
                             <p class="font-label-md text-label-md text-on-surface truncate">
                                 ${candidate.fileName || "Unknown"}
                             </p>

                             <p class="font-body-sm text-body-sm text-on-surface-variant">
                                 ${date}
                             </p>
                         </div>
                     </div>

                     <div class="text-right shrink-0">
                         <p class="font-semibold text-secondary">
                             ${score}%
                         </p>
                         <p class="text-[10px] text-on-surface-variant">
                             AI Match
                         </p>
                     </div>
                 </div>
             `;
         }).join("");

     } catch (error) {
         console.error("Upload history error:", error);

         recentUploadsList.innerHTML = `
             <p class="text-sm text-red-500 text-center py-6">
                 Failed to load upload history.
             </p>
         `;
     }
 }
 loadRecentUploads();
 if (viewHistoryBtn) {
     viewHistoryBtn.addEventListener("click", () => {
         window.location.href = "candidates.html";
     });
 }


    // ----- 2. FILE SELECTION & DRAG-DROP -----
    if (browseBtn) {
        browseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', function () {
            handleFiles(Array.from(this.files));
            this.value = '';
        });
    }

    if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-secondary', 'bg-surface-container-low');
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-secondary', 'bg-surface-container-low');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-secondary', 'bg-surface-container-low');
            handleFiles(Array.from(e.dataTransfer.files));
        });
    }

    // ----- 3. FILE VALIDATION -----
    function handleFiles(files) {
        const maxSizeBytes = 5 * 1024 * 1024; // 5 MB Limit
        const allowedExtensions = ['pdf', 'docx', 'txt'];

        files.forEach(file => {
            const extension = file.name.split('.').pop().toLowerCase();

            if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                console.warn(`File "${file.name}" is already in the list.`);
                return;
            }
            if (!allowedExtensions.includes(extension)) {
                alert(`⚠️ Skipped: "${file.name}" is not supported. Please upload PDF, DOCX, or TXT.`);
                return;
            }
            if (file.size > maxSizeBytes) {
                alert(`⚠️ Skipped: "${file.name}" exceeds the 5MB size limit.`);
                return;
            }

            selectedFiles.push(file);
        });

        renderFileList();
    }

    // ----- 4. RENDER UI LIST -----
    function renderFileList() {
        if (fileCountEl) fileCountEl.textContent = selectedFiles.length;

        if (selectedFiles.length === 0) {
            fileStatusList.innerHTML = `
                <div class="p-6 text-center text-on-surface-variant font-body-md">
                    No files selected yet. Drag & drop resumes or click Browse.
                </div>`;
            return;
        }

        fileStatusList.innerHTML = selectedFiles.map((file, index) => {
            const isPdf = file.name.toLowerCase().endsWith('.pdf');
            const icon = isPdf ? 'picture_as_pdf' : 'description';
            const iconBg = isPdf ? 'bg-error-container/20 text-error' : 'bg-secondary-container/20 text-secondary';
            const formattedSize = (file.size / (1024 * 1024)).toFixed(2) + " MB";

            return `
            <div class="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors" id="file-item-${index}">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded ${iconBg} flex items-center justify-center">
                        <span class="material-symbols-outlined" data-icon="${icon}">${icon}</span>
                    </div>
                    <div>
                        <p class="font-label-md text-label-md text-on-surface truncate w-48 md:w-64">${file.name}</p>
                        <p class="font-body-sm text-body-sm text-on-surface-variant">${formattedSize}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <span class="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full font-label-md text-[10px] flex items-center gap-1 status-badge" id="status-${index}">
                        <span class="material-symbols-outlined text-[12px]" data-icon="hourglass_empty">hourglass_empty</span> Ready
                    </span>
                    <button type="button" class="text-error hover:opacity-80 p-1 remove-btn transition-opacity" data-index="${index}" title="Remove file">
                        <span class="material-symbols-outlined text-sm" data-icon="close">close</span>
                    </button>
                </div>
            </div>
        `}).join('');

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                selectedFiles.splice(idx, 1);
                renderFileList();
            });
        });
    }

    // ----- 5. REAL BACKEND API CALL (UPLOAD & ANALYZE) -----
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async function () {
            if (selectedFiles.length === 0) {
                alert('⚠️ Please select or drop at least one resume before analyzing.');
                return;
            }
            analyzeBtn.disabled = true;
            analyzeBtn.classList.add('opacity-50', 'cursor-not-allowed');

            document.querySelectorAll('.remove-btn').forEach(btn => btn.style.display = 'none');

            if (progressSection) progressSection.classList.remove('hidden');
            if (progressBar) progressBar.style.width = '40%';
            if (progressPercent) progressPercent.textContent = 'Uploading to Server...';

            const formData = new FormData();
            selectedFiles.forEach(file => formData.append('file', file));
            selectedFiles.forEach((_, idx) => {
                const badge = document.getElementById(`status-${idx}`);
                if (badge) {
                    badge.className = 'px-3 py-1 bg-secondary-container/10 text-secondary rounded-full font-label-md text-[10px] flex items-center gap-1 status-badge';
                    badge.innerHTML = `<span class="material-symbols-outlined text-[12px] animate-spin" data-icon="sync">sync</span> Processing...`;
                }
            });

            try {
               const jobDescription = document.getElementById('jobDescriptionInput')?.value.trim();
                               if (!jobDescription) {
                                   alert('⚠️ Please enter a job description before analyzing.');
                                   analyzeBtn.disabled = false;
                                   analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                                   document.querySelectorAll('.remove-btn').forEach(btn => btn.style.display = '');
                                   if (progressSection) progressSection.classList.add('hidden');
                                   return;
                               }

                               const response = await fetch(`http://localhost:8080/api/recruiter/bulk-upload?jobDescription=${encodeURIComponent(jobDescription)}`, {
                                   method: 'POST',
                                   headers: {
                                       'Authorization': `Bearer ${token}`
                                   },
                                   body: formData
                               });

                if (response.ok) {
                    selectedFiles.forEach((_, idx) => {
                        const badge = document.getElementById(`status-${idx}`);
                        if (badge) {
                            badge.className = 'px-3 py-1 bg-[#10B981]/10 text-[#059669] rounded-full font-label-md text-[10px] flex items-center gap-1 status-badge';
                            badge.innerHTML = `<span class="material-symbols-outlined text-[12px]" data-icon="check_circle">check_circle</span> Parsed Successfully`;
                        }
                    });

                    successCount += selectedFiles.length;
                    if (successCountEl) successCountEl.textContent = successCount;

                    if (progressBar) progressBar.style.width = '100%';
                    if (progressPercent) progressPercent.textContent = '100% Complete';

                    setTimeout(() => {
                        alert('🎉 Success! All resumes have been processed and saved successfully.');

                        selectedFiles = [];
                        renderFileList();

                        if (progressSection) progressSection.classList.add('hidden');

                        loadRecentUploads();
                    }, 500);

                } else if (response.status === 401 || response.status === 403) {
                    alert('🔒 Session expired or unauthorized! Please log in again.');
                    localStorage.removeItem('jwtToken');
                    window.location.href = 'login.html';
                } else {
                    throw new Error(`Server returned HTTP ${response.status}`);
                }
            } catch (error) {
                console.error('Upload Error:', error);
                alert('❌ Upload failed! Please ensure the backend is running and your token is valid.');

                failedCount += selectedFiles.length;
                if (failedCountEl) failedCountEl.textContent = failedCount;
                if (progressBar) progressBar.style.width = '0%';
                if (progressPercent) progressPercent.textContent = 'Upload Failed';
                  if (progressSection) progressSection.classList.add('hidden');
                selectedFiles.forEach((_, idx) => {
                    const badge = document.getElementById(`status-${idx}`);
                    if (badge) {
                        badge.className = 'px-3 py-1 bg-error-container/30 text-error rounded-full font-label-md text-[10px] flex items-center gap-1 status-badge';
                        badge.innerHTML = `<span class="material-symbols-outlined text-[12px]" data-icon="error">error</span> Failed`;
                    }
                });
            } finally {
                analyzeBtn.disabled = false;
                analyzeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        });
    }

    // ----- 6. SEARCH/FILTER RESUMES -----
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = this.value.toLowerCase();
            const resumeItems = document.querySelectorAll("#fileStatusList > div");

            resumeItems.forEach(item => {
                if (item.classList.contains('text-center')) return;

                const fileName = item.querySelector(".font-label-md")?.textContent.toLowerCase() || "";
                if (fileName.includes(query)) {
                    item.style.display = "flex";
                } else {
                    item.style.display = "none";
                }
            });
        });
    }
});