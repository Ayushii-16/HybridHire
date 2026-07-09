// =============================================
// HYBRIDHIRE AI - Career Roadmap
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ----- UPDATE PROGRESS -----
    const updateProgressBtn = document.getElementById('updateProgressBtn');
    if (updateProgressBtn) {
        updateProgressBtn.addEventListener('click', function() {
            alert('📈 Updating career progress...\n\nCurrent progress: 78%');
        });
    }
    
    // ----- CONTINUE LEARNING -----
    const continueLearningBtns = document.querySelectorAll('.continue-learning-btn');
    continueLearningBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            alert('📚 Opening learning resources for skill development...');
        });
    });
    
    // ----- PROJECT ITEMS -----
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const projectName = this.querySelector('span')?.textContent || 'Project';
            alert('📁 Viewing project: ' + projectName);
        });
    });
    
    // ----- SKILL TAGS -----
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(function(tag) {
        tag.addEventListener('click', function() {
            const skill = this.textContent.trim();
            alert('🔍 Searching resources for: ' + skill);
        });
    });
    
    // ----- TASK CHECKBOXES -----
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    const taskProgress = document.getElementById('taskProgress');
    
    function updateTaskProgress() {
        const checked = document.querySelectorAll('.task-checkbox:checked');
        const total = document.querySelectorAll('.task-checkbox').length;
        if (taskProgress) {
            taskProgress.textContent = checked.length + '/' + total + ' Done';
        }
    }
    
    taskCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            const label = taskItem.querySelector('span');
            
            if (this.checked) {
                label.classList.add('line-through');
                label.classList.remove('font-medium');
                label.classList.add('text-on-surface-variant');
                alert('✅ Task completed!');
            } else {
                label.classList.remove('line-through');
                label.classList.add('font-medium');
                label.classList.remove('text-on-surface-variant');
                alert('🔄 Task unmarked.');
            }
            
            updateTaskProgress();
        });
    });
    
    // Initial task progress update
    updateTaskProgress();
    
    // ----- SEARCH -----
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    alert('🔍 Searching roadmap for: "' + query + '"');
                }
            }
        });
    }
    
    console.log('✅ HybridHire AI Career Roadmap loaded successfully!');
});