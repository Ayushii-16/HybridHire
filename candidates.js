     const API_BASE_URL = 'http://localhost:8080';
const token = localStorage.getItem('jwtToken');
const candidateRowsContainer = document.getElementById('candidateRowsContainer');

async function loadCandidates() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/recruiter/candidates`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!response.ok) throw new Error('Failed to load candidates');
        const candidates = await response.json();
        renderCandidates(candidates);
    } catch (error) {
        console.error('Error loading candidates:', error);
        candidateRowsContainer.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-gray-400">Failed to load candidates.</td></tr>`;
    }
}

function renderCandidates(candidates) {
    if (!candidates || candidates.length === 0) {
        candidateRowsContainer.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-gray-400">No candidates yet.</td></tr>`;
        return;
    }
    candidateRowsContainer.innerHTML = candidates.map(c => {
        const initials = (c.fileName || 'NA').substring(0, 2).toUpperCase();
        const atsScore = Math.round(c.atsScore);
        const aiMatch = Math.round(c.semanticScore);
        let statusClass = 'bg-blue-50 text-blue-700';
        if (c.status === 'Shortlisted') statusClass = 'bg-green-50 text-green-700';
        else if (c.status === 'In Review') statusClass = 'bg-amber-50 text-amber-700';
        else if (c.status === 'Rejected') statusClass = 'bg-red-50 text-red-700';
        let aiColor = 'text-blue-600';
        if (aiMatch < 50) aiColor = 'text-red-600';
        else if (aiMatch < 75) aiColor = 'text-amber-600';
        return `
            <tr class="hover:bg-gray-50/50 transition-colors" data-id="${c.id}">
                <td class="py-4 pl-2"><input type="checkbox" class="row-checkbox rounded border-gray-300 text-blue-600 focus:ring-blue-500"/></td>
                <td class="py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">${initials}</div>
                        <span class="font-semibold text-gray-900 candidate-name">${c.fileName || 'Unknown'}</span>
                    </div>
                </td>
                <td class="py-4 text-gray-500 job-title">${(c.jobDescription || '').substring(0, 30)}...</td>
                <td class="py-4 text-gray-600 exp-level">-</td>
                <td class="py-4 text-gray-700 font-semibold ats-score">${atsScore}</td>
                <td class="py-4">
                    <div class="flex items-center gap-2">
                        <span class="${aiColor} font-semibold w-8 ai-match-val">${aiMatch}%</span>
                        <div class="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full ${aiColor.replace('text-', 'bg-')} rounded-full" style="width: ${aiMatch}%"></div>
                        </div>
                    </div>
                </td>
                <td class="py-4">
                    <span class="px-2.5 py-1 rounded-lg ${statusClass} text-xs font-bold status-tag">${c.status}</span>
                </td>
                <td class="py-4 text-center">
                    <button class="text-gray-400 hover:text-gray-600 view-btn" data-id="${c.id}">
                    </button>
                    <button
                        class="reject-btn px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-bold"
                        data-id="${c.id}">
                        Reject
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

loadCandidates();
        document.addEventListener("DOMContentLoaded", () => {
            const searchInput = document.getElementById("mainSearchInput");
            const skillFilter = document.getElementById("skillFilter");
            const expFilter = document.getElementById("expFilter");
            const atsFilter = document.getElementById("atsFilter");
            const aiFilter = document.getElementById("aiFilter");
            const statusFilter = document.getElementById("statusFilter");
            const clearAllBtn = document.getElementById("clearAllBtn");

            const filterToggleBtn = document.getElementById("filterToggleBtn");
            const batchShortlistBtn = document.getElementById("batchShortlistBtn");
            const filterStrip = document.getElementById("filterStrip");
            const headerCheckbox = document.getElementById("headerCheckbox");

                        // ----- REAL SCREENING TRENDS DATA -----
            async function loadScreeningTrends() {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/recruiter/candidates`, {
                        headers: { 'Authorization': 'Bearer ' + token }
                    });
                    if (!response.ok) return;
                    const candidates = await response.json();

                    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

                    candidates.forEach(c => {
                        if (!c.uploadDate) return;
                        const d = new Date(c.uploadDate);
                        const dayName = dayLabels[(d.getDay() + 6) % 7];
                        counts[dayName]++;
                    });

                    const maxCount = Math.max(...Object.values(counts), 1);

                    document.querySelectorAll('.chart-bar').forEach(bar => {
                        const day = bar.getAttribute('data-day');
                        const value = counts[day] || 0;
                        const heightPx = Math.max((value / maxCount) * 160, 4);
                        const y = 200 - heightPx;

                        bar.setAttribute('height', heightPx);
                        bar.setAttribute('y', y);
                        bar.setAttribute('data-value', value);
                    });

                } catch (error) {
                    console.error('Screening trends error:', error);
                }
            }

            loadScreeningTrends();

            const bars = document.querySelectorAll(".chart-bar");
            const tooltip = document.getElementById("chartTooltip");
            if (bars && tooltip) {
                bars.forEach(bar => {
                    bar.addEventListener("mousemove", (e) => {
                        const day = bar.getAttribute("data-day");
                        const val = bar.getAttribute("data-value");
                        tooltip.innerHTML = `<strong>${day}</strong>: ${val} Resumes`;
                        tooltip.style.opacity = "1";
                        tooltip.style.left = `${e.offsetX + 15}px`;
                        tooltip.style.top = `${e.offsetY - 25}px`;
                    });
                    bar.addEventListener("mouseleave", () => {
                        tooltip.style.opacity = "0";
                    });
                });
            }

      // 2. Real-Time Smart Multi-Filter System
      function runFilteringEngine() {

          const query = searchInput?.value.toLowerCase() || "";
          const selectedAts = atsFilter?.value || "";
          const selectedAi = aiFilter?.value || "";
          const selectedStatus = statusFilter?.value || "";

          const rows = document.querySelectorAll(
              "#candidateRowsContainer tr"
          );

          rows.forEach(row => {

              const name =
                  row.querySelector(".candidate-name")
                      ?.textContent.toLowerCase() || "";

              const title =
                  row.querySelector(".job-title")
                      ?.textContent.toLowerCase() || "";

              const ats =
                  parseFloat(
                      row.querySelector(".ats-score")?.textContent
                  ) || 0;

              const ai =
                  parseFloat(
                      row.querySelector(".ai-match-val")?.textContent
                  ) || 0;

              const status =
                  row.querySelector(".status-tag")
                      ?.textContent.trim() || "";

              const matchSearch =
                  name.includes(query) ||
                  title.includes(query);

              let matchAts = true;
              let matchAi = true;
              let matchStatus = true;

              if (selectedAts === "80+") {
                  matchAts = ats >= 80;
              } else if (selectedAts === "60-79") {
                  matchAts = ats >= 60 && ats < 80;
              } else if (selectedAts === "40-59") {
                  matchAts = ats >= 40 && ats < 60;
              } else if (selectedAts === "Below 40") {
                  matchAts = ats < 40;
              }

              if (selectedAi === "80+") {
                  matchAi = ai >= 80;
              } else if (selectedAi === "60-79") {
                  matchAi = ai >= 60 && ai < 80;
              } else if (selectedAi === "40-59") {
                  matchAi = ai >= 40 && ai < 60;
              } else if (selectedAi === "Below 40") {
                  matchAi = ai < 40;
              }
              if (selectedStatus) {
                  matchStatus = status === selectedStatus;
              }

              row.style.display =
                  matchSearch &&
                  matchAts &&
                  matchAi &&
                  matchStatus
                      ? ""
                      : "none";
          });
      }

      [atsFilter, aiFilter, statusFilter].forEach(filter => {

          if (filter) {
              filter.addEventListener("change", runFilteringEngine);
          }

      });

      if (searchInput) {
          searchInput.addEventListener("input", runFilteringEngine);
      }

      if (clearAllBtn) {

          clearAllBtn.addEventListener("click", () => {

              searchInput.value = "";
              atsFilter.value = "";
              aiFilter.value = "";
              statusFilter.value = "";

              runFilteringEngine();

          });

      }

            if(headerCheckbox) {
                headerCheckbox.addEventListener("change", () => {
                    const visibleCheckboxes = document.querySelectorAll("#candidateRowsContainer tr:not([style*='display: none']) .row-checkbox");
                    visibleCheckboxes.forEach(cb => {
                        cb.checked = headerCheckbox.checked;
                    });
                });
            }

            // 4. Batch Shortlist Action
            if (batchShortlistBtn) {
                batchShortlistBtn.addEventListener("click", async (e) => {
                    e.preventDefault();

                    const selectedRows = [
                        ...document.querySelectorAll("#candidateRowsContainer tr")
                    ].filter(row => {
                        const cb = row.querySelector(".row-checkbox");
                        return row.style.display !== "none" && cb?.checked;
                    });

                    if (selectedRows.length === 0) {
                        alert("Please select at least one candidate.");
                        return;
                    }

                    let successCount = 0;

                    for (const row of selectedRows) {
                        const candidateId = row.dataset.id;

                        try {
                            const response = await fetch(
                                `${API_BASE_URL}/api/recruiter/candidates/${candidateId}/status?status=Shortlisted`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Authorization": "Bearer " + token
                                    }
                                }
                            );

                            if (!response.ok) {
                                throw new Error("Failed to update status");
                            }

                            const statusTag = row.querySelector(".status-tag");

                            statusTag.textContent = "Shortlisted";
                            statusTag.className =
                                "px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold status-tag";

                            row.querySelector(".row-checkbox").checked = false;

                            successCount++;

                        } catch (error) {
                            console.error(
                                `Failed to shortlist candidate ${candidateId}:`,
                                error
                            );
                        }
                    }

                    if (headerCheckbox) {
                        headerCheckbox.checked = false;
                    }

                    alert(`${successCount} candidate(s) shortlisted successfully!`);
                });
            }
            document.addEventListener("click", async function (e) {

                const btn = e.target.closest(".reject-btn");
                if (!btn) return;

                const candidateId = btn.dataset.id;

                try {
                    const response = await fetch(
                        `${API_BASE_URL}/api/recruiter/candidates/${candidateId}/status?status=Rejected`,
                        {
                            method: "POST",
                            headers: {
                                "Authorization": "Bearer " + token
                            }
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to reject candidate");
                    }

                    const row = btn.closest("tr");
                    const statusTag = row.querySelector(".status-tag");

                    statusTag.textContent = "Rejected";
                    statusTag.className =
                        "px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold status-tag";

                    alert("Candidate rejected successfully.");

                } catch (error) {
                    console.error(error);
                    alert("Failed to reject candidate.");
                }
            });
        });
