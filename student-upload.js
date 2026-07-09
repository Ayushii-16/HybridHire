// ============================================
// HybridHire AI - Student Upload Resume
// student-upload.js
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const uploadArea = document.getElementById("uploadArea");
    const fileInput = document.getElementById("resumeFile");
    const browseBtn = document.getElementById("browseBtn");

    const fileName = document.getElementById("fileName");
    const uploadBtn = document.getElementById("uploadBtn");

    const progressBox = document.getElementById("progressBox");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    const statusBox = document.getElementById("statusBox");

    let selectedFile = null;

    // Browse Button
    browseBtn.addEventListener("click", () => {
        fileInput.click();
    });

    // File Selection
    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            selectedFile = fileInput.files[0];
            showFile(selectedFile);
        }
    });

    // Drag Events
    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("dragging");
    });

    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("dragging");
    });

    uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();

        uploadArea.classList.remove("dragging");

        if (e.dataTransfer.files.length > 0) {
            selectedFile = e.dataTransfer.files[0];
            fileInput.files = e.dataTransfer.files;
            showFile(selectedFile);
        }
    });

    // Upload
    uploadBtn.addEventListener("click", () => {

        if (!selectedFile) {
            alert("Please select a resume first.");
            return;
        }

        progressBox.style.display = "block";
        statusBox.style.display = "none";

        let progress = 0;

        const timer = setInterval(() => {

            progress += 5;

            progressBar.style.width = progress + "%";
            progressText.innerHTML = progress + "%";

            if (progress >= 100) {

                clearInterval(timer);

                progressText.innerHTML = "Completed";

                statusBox.style.display = "block";

                statusBox.innerHTML = `
                    <h3>✅ Resume Uploaded Successfully</h3>

                    <p><strong>${selectedFile.name}</strong></p>

                    <br>

                    <p>ATS Score : <strong>91%</strong></p>

                    <p>Skills Detected :</p>

                    <ul>
                        <li>✔ Java</li>
                        <li>✔ Spring Boot</li>
                        <li>✔ MySQL</li>
                        <li>✔ React</li>
                        <li>✔ Git</li>
                    </ul>

                    <br>

                    <button onclick="location.reload()">
                        Upload Another Resume
                    </button>
                `;
            }

        }, 120);

    });

    function showFile(file) {

        fileName.innerHTML = `
            📄 ${file.name}
            <br>
            <small>${(file.size/1024).toFixed(1)} KB</small>
        `;
    }

});