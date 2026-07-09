document.addEventListener("DOMContentLoaded", () => {
    // DOM Targets Configuration
    const searchInput = document.getElementById("searchInput");
    const filterSkill = document.getElementById("filterSkill");
    const filterExperience = document.getElementById("filterExperience");
    const filterAtsScore = document.getElementById("filterAtsScore");
    const filterAiMatch = document.getElementById("filterAiMatch");
    const filterStatus = document.getElementById("filterStatus");
    const clearFiltersBtn = document.getElementById("clearFiltersBtn");
    const tableRows = document.querySelectorAll("#candidateTableBody tr");

    // Initialize Event Listeners
    const filterElements = [searchInput, filterSkill, filterExperience, filterAtsScore, filterAiMatch, filterStatus];
    filterElements.forEach(element => {
        if(element) element.addEventListener("input", filterCandidates);
    });

    if(clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
            filterElements.forEach(el => { if(el) el.value = ""; });
            filterCandidates();
        });
    }

    // Interactive Action Buttons Trigger
    document.querySelectorAll(".action-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const action = e.currentTarget.getAttribute("data-action");
            const row = e.currentTarget.closest("tr");
            const name = row.querySelector(".font-label-md")?.textContent || "Candidate";
            alert(`${action.toUpperCase()} action requested for ${name}.`);
        });
    });

    // Core Filtering Engine Logic
    function filterCandidates() {
        const query = searchInput?.value.toLowerCase() || "";
        const skill = filterSkill?.value || "";
        const exp = filterExperience?.value || "";
        const ats = filterAtsScore?.value || "";
        const ai = filterAiMatch?.value || "";
        const status = filterStatus?.value || "";

        tableRows.forEach(row => {
            const name = row.querySelector(".font-label-md")?.textContent.toLowerCase() || "";
            const role = row.querySelector(".font-body-sm")?.textContent.toLowerCase() || "";
            const skills = Array.from(row.querySelectorAll("td:nth-child(2) span")).map(s => s.textContent);
            const expText = row.querySelector("td:nth-child(3)")?.textContent || "";
            const atsText = row.querySelector("td:nth-child(4)")?.textContent || "";
            const aiText = row.querySelector("td:nth-child(5) .font-label-md")?.textContent || "";
            const statusText = row.querySelector(".status-badge")?.textContent || "";

            // Evaluate Matrix
            const matchesSearch = name.includes(query) || role.includes(query);
            const matchesSkill = !skill || skills.includes(skill);
            const matchesExp = !exp || expText.includes(exp.split(" ")[0]);
            const matchesStatus = !status || statusText === status;
            
            let matchesAts = true;
            if (ats) {
                const score = parseInt(atsText);
                matchesAts = ats.includes(">") ? score > 80 : score < 80;
            }

            let matchesAi = true;
            if (ai) {
                const aiScore = parseInt(aiText);
                matchesAi = ai === "Excellent Match" ? aiScore >= 90 : aiScore < 90;
            }

            if (matchesSearch && matchesSkill && matchesExp && matchesAts && matchesAi && matchesStatus) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }
});