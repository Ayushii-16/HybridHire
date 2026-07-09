// =============================================
// HYBRIDHIRE AI - Job Recommendations
// =============================================

document.addEventListener('DOMContentLoaded', function () {

    // ----- UPGRADE TO PRO -----
    const upgradeBtn = document.getElementById('upgradeBtn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function () {
            alert('⭐ Upgrade to Pro\n\nFeatures:\n• Unlimited Job Applications\n• Priority Support\n• Advanced AI Matching\n• Resume Review by Experts');
        });
    }

    // ----- LOGOUT -----
  const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener("click",function(e){

e.preventDefault();

localStorage.clear();

window.location.href="login.html";

});

}
    // ----- MOBILE MENU -----
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            alert('📱 Mobile menu toggled');
        });
    }

    // ----- SEARCH -----
const searchInput=document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("input",function(){

const value=this.value.toLowerCase();

document.querySelectorAll(".job-card").forEach(card=>{

card.style.display=card.innerText.toLowerCase().includes(value)
?"block":"none";

});

});

}

    // ----- APPLY FILTERS -----
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function () {
            const role = document.getElementById('filterRole')?.value || '';
            const location = document.getElementById('filterLocation')?.value || '';
            alert('📊 Filters Applied:\n\nRole: ' + role + '\nLocation: ' + location);
        });
    }

   
    // Apply Now
// ----- APPLY NOW -----
document.querySelectorAll(".apply-btn").forEach(function(btn){

    btn.onclick = function(e){

        e.preventDefault();

        alert("✅ Application Submitted Successfully!");

        this.textContent = "Applied ✓";
        this.disabled = true;
        this.style.backgroundColor = "#16a34a";
        this.style.color = "#ffffff";
        this.style.cursor = "not-allowed";

    };

});
    // View Details
// ----- VIEW DETAILS -----
document.querySelectorAll(".view-details-btn").forEach(btn => {

    btn.addEventListener("click", function () {

        const card = this.closest(".job-card");

        const title = card.querySelector("h3").textContent.trim();

        const company = card.querySelector(".text-secondary").textContent.trim();

        // Required Skills
        let skills = [];
        card.querySelectorAll(".mb-4 .px-2").forEach(skill => {
            skills.push(skill.textContent.trim());
        });

        // AI Insight
        const insight = card.querySelector(".bg-surface-blue p").textContent.trim();

        alert(
            "📄 JOB DETAILS\n\n" +
            "💼 Position : " + title +
            "\n🏢 Company : " + company +
            "\n\n🛠 Required Skills:\n• " + skills.join("\n• ") +
            "\n\n🤖 AI Insight:\n" + insight +
            "\n\n📌 Status : Open for Applications"
        );

    });

});

    // Save Job
document.querySelectorAll(".save-btn").forEach(btn => {
    btn.addEventListener("click", function () {

        const icon = this.querySelector(".material-symbols-outlined");

        if(icon.textContent==="bookmark_border"){
            icon.textContent="bookmark";
            alert("⭐ Job Saved");
        }else{
            icon.textContent="bookmark_border";
            alert("❌ Removed from Saved Jobs");
        }

    });
});

    // Compare
    const compareBtns = document.querySelectorAll('.compare-btn');
    compareBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const card = this.closest('.job-card');
            const title = card.querySelector('h3')?.textContent || 'Job';
            alert('🔄 Comparing: ' + title + ' with other jobs');
        });
    });

    // ----- SORT SELECT -----
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            alert('📊 Sorting by: ' + this.value);
        });
    }

    // ----- STATUS ITEMS -----
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach(function (item) {
        item.addEventListener('click', function () {
            const status = this.dataset.status || 'status';
            alert('📊 Filtering by: ' + status);
        });
    });

    // ----- SAVED JOBS -----
    const savedJobsBtn = document.getElementById('savedJobsBtn');
    if (savedJobsBtn) {
        savedJobsBtn.addEventListener('click', function () {
            alert('📋 Showing all saved jobs (8 jobs)');
        });
    }

    // ----- COURSE LINKS -----
    const courseLinks = document.querySelectorAll('.course-link');
    courseLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const title = this.querySelector('h4')?.textContent || 'Course';
            alert('📚 Viewing course: ' + title);
        });
    });

    // ----- VIEW LEARNING PATHS -----
    const viewLearningPaths = document.getElementById('viewLearningPaths');
    if (viewLearningPaths) {
        viewLearningPaths.addEventListener('click', function () {
            alert('📚 Viewing all learning paths...');
        });
    }

    console.log('✅ HybridHire AI Job Recommendations loaded successfully!');
});