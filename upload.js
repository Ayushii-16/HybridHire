// =============================================
// HYBRIDHIRE AI - Bulk Resume Upload
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ----- DRAG & DROP ZONE -----
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    
    // Browse button click
    if (browseBtn) {
        browseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            fileInput.click();
        });
    }
    
    // Drop zone click
    if (dropZone) {
        dropZone.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const files = this.files;
            if (files.length > 0) {
                console.log('📁 Selected files:', files.length);
                alert('✅ ' + files.length + ' file(s) selected for upload!');
                
                // Update file count
                const fileCount = document.getElementById('fileCount');
                if (fileCount) {
                    fileCount.textContent = files.length;
                }
                
                // Simulate upload progress
                simulateUpload();
            }
        });
    }
    
    // Drag & Drop events
    if (dropZone) {
        dropZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('border-secondary', 'bg-surface-container-low');
        });
        
        dropZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('border-secondary', 'bg-surface-container-low');
        });
        
        dropZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('border-secondary', 'bg-surface-container-low');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                console.log('📁 Dropped files:', files.length);
                alert('✅ ' + files.length + ' file(s) dropped for upload!');
                
                // Update file count
                const fileCount = document.getElementById('fileCount');
                if (fileCount) {
                    fileCount.textContent = files.length;
                }
                
                // Simulate upload progress
                simulateUpload();
            }
        });
    }
    
    // ----- SIMULATE UPLOAD PROGRESS -----
    function simulateUpload() {
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        const timeRemaining = document.getElementById('timeRemaining');
        
        let progress = 0;
        const interval = setInterval(function() {
            progress += Math.floor(Math.random() * 5) + 1;
            if (progress > 100) {
                progress = 100;
                clearInterval(interval);
                progressPercent.textContent = '100% Complete';
                timeRemaining.textContent = '✅ Upload complete!';
                alert('🎉 All files uploaded and parsed successfully!');
            }
            
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            if (progressPercent) {
                progressPercent.textContent = progress + '% Complete';
            }
        }, 300);
    }
    
    // ----- ANALYZE ALL BUTTON -----
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            alert('🤖 AI Analysis started for all uploaded files!');
            
            // Update status badges
            const badges = document.querySelectorAll('.status-badge');
            badges.forEach(function(badge) {
                if (badge.textContent.includes('Queued')) {
                    badge.innerHTML = '<span class="material-symbols-outlined text-[12px] animate-spin" data-icon="sync">sync</span> Analyzing...';
                    badge.className = 'px-3 py-1 bg-secondary-container/10 text-secondary rounded-full font-label-md text-[10px] flex items-center gap-1 status-badge';
                }
            });
            
            // Simulate completion after 3 seconds
            setTimeout(function() {
                const badges2 = document.querySelectorAll('.status-badge');
                badges2.forEach(function(badge) {
                    if (badge.textContent.includes('Analyzing')) {
                        badge.innerHTML = '<span class="material-symbols-outlined text-[12px]" data-icon="check_circle">check_circle</span> Parsed Successfully';
                        badge.className = 'px-3 py-1 bg-[#10B981]/10 text-[#059669] rounded-full font-label-md text-[10px] flex items-center gap-1 status-badge';
                    }
                });
                
                // Update success count
                const successCount = document.getElementById('successCount');
                if (successCount) {
                    successCount.textContent = '10';
                }
                
                alert('✅ AI Analysis complete! All files parsed successfully.');
            }, 3000);
        });
    }
    
    // ----- POST NEW JOB BUTTON -----
    const postJobBtn = document.getElementById('postJobBtn');
    if (postJobBtn) {
        postJobBtn.addEventListener('click', function() {
            alert('📝 Opening Post New Job form...');
        });
    }
    
    // ----- VIEW HISTORY BUTTON -----
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', function() {
            alert('📋 Showing full upload history...');
        });
    }
    
    // ----- SEARCH INPUT -----
// ----- SEARCH RESUMES -----
const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", function () {

        const value = this.value.toLowerCase();

        // Har resume item
        const resumeItems = document.querySelectorAll("#fileStatusList > div");

        resumeItems.forEach(item => {

            const fileName = item.querySelector(".font-label-md").textContent.toLowerCase();

            if (fileName.includes(value)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }

        });

    });
} });