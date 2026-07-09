// =============================================
// HYBRIDHIRE AI - Interview Preparation
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ----- UPGRADE TO PRO -----
    const upgradeBtn = document.getElementById('upgradeBtn');
    if (upgradeBtn) {
        upgradeBtn.addEventListener('click', function() {
            alert('⭐ Upgrade to Pro\n\nFeatures:\n• Unlimited Mock Interviews\n• Detailed Performance Analytics\n• Personalized Question Bank\n• Resume Review by Experts');
        });
    }
    
    // ----- START MOCK INTERVIEW -----
  startMockBtn.addEventListener("click",function(){

    this.disabled=true;
    this.innerText="Generating AI Questions...";

    setTimeout(()=>{

        this.innerText="Interview Running...";

    },2000);

    setTimeout(()=>{

        let score=Math.floor(Math.random()*15)+85;

        alert("✅ Interview Completed!\n\nScore : "+score+"/100");

        document.querySelector(".readiness-score").innerText=score+"%";

        this.disabled=false;
        this.innerText="Start Mock Interview";

    },5000);

});
    
    // ----- PRACTICE BUTTONS -----
    const practiceBtns = document.querySelectorAll('.practice-btn');
    practiceBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const question = row.querySelector('td:first-child')?.textContent?.trim() || 'Question';
            alert('📝 Practice Mode\n\nQuestion: ' + question + '\n\nType your answer below...');
        });
    });
    
    // ----- PREVIOUS ATTEMPTS -----
    const previousAttempts = document.querySelectorAll('.previous-attempt');
    previousAttempts.forEach(function(attempt) {
        attempt.addEventListener('click', function() {
            const title = this.querySelector('.font-body-sm')?.textContent || 'Attempt';
            alert('📊 Reviewing: ' + title + '\n\nDetailed feedback and breakdown will be shown.');
        });
    });
    
    // ----- SEARCH QUESTIONS -----    const questionSearch = document.getElementById('questionSearch');
  const questionSearch = document.getElementById("questionSearch");

if(questionSearch){

    questionSearch.addEventListener("input",function(){

        const value=this.value.toLowerCase();

        document.querySelectorAll("tbody tr").forEach(row=>{

            const text=row.innerText.toLowerCase();

            row.style.display=text.includes(value)?"":"none";

        });

    });

}
    
    // ----- TASK CHECKBOXES -----
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    taskCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const label = this.closest('label').querySelector('.task-label');
            if (this.checked) {
                label.classList.add('line-through', 'text-on-surface-variant');
                label.classList.remove('text-on-surface');
                alert('✅ Task completed!');
            } else {
                label.classList.remove('line-through', 'text-on-surface-variant');
                label.classList.add('text-on-surface');
                alert('🔄 Task unmarked.');
            }
        });
    });
    
    // ----- RECOMMENDED COURSE CLICK -----
    const recommendedCourse = document.getElementById('recommendedCourse');
    if (recommendedCourse) {
        recommendedCourse.addEventListener('click', function() {
            alert('📚 Course: Mastering System Design for Frontend\n\nEnroll now to improve your system design skills!');
        });
    }
    
    // ----- SEARCH INPUT (Top Bar) -----
   const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", function(){

        const value = this.value.toLowerCase();

        if(value.includes("dsa")){
            window.scrollTo({
                top: document.querySelector(".previous-attempt").offsetTop,
                behavior:"smooth"
            });
        }

        else if(value.includes("mock")){
            document.getElementById("startMockBtn").style.background="#16a34a";
        }

        else if(value.includes("resume")){
            window.location.href="resume.html";
        }

        else if(value.includes("roadmap")){
            window.location.href="roadmap.html";
        }

        else{
            document.getElementById("startMockBtn").style.background="";
        }

    });

} });