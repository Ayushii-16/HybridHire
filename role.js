// =============================================
// HYBRIDHIRE AI - Role Selection Functionality
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Check if already logged in
    const role = localStorage.getItem('userRole');
    if (role) {
        if (role === 'recruiter') {
            window.location.href = 'dashboard.html';
        } else if (role === 'student') {
            window.location.href = 'student.html';
        }
    }
    
    let currentRole = null;

    window.selectRole = function(role) {
        currentRole = role;

        // Reset UI
        document.getElementById('card-student').classList.remove('selected');
        document.getElementById('card-recruiter').classList.remove('selected');
        
        const allCards = document.querySelectorAll('.role-card .absolute');
        allCards.forEach(function(el) {
            el.classList.remove('bg-ai-blue');
            el.classList.add('group-hover:from-ai-blue/50', 'group-hover:to-ai-blue');
        });

        const selectedCard = document.getElementById('card-' + role);
        selectedCard.classList.add('selected');
        
        const selectedBorder = selectedCard.querySelector('.absolute');
        selectedBorder.classList.remove('group-hover:from-ai-blue/50', 'group-hover:to-ai-blue');
        selectedBorder.classList.add('bg-ai-blue');

        const continueBtn = document.getElementById('btn-continue');
        continueBtn.disabled = false;
        continueBtn.classList.remove('bg-surface-tint', 'opacity-50', 'cursor-not-allowed');
        continueBtn.classList.add('bg-ai-blue', 'hover:bg-secondary', 'shadow-md', 'active:scale-95');
        
        console.log('✅ Role selected:', role);
    };

    const continueBtn = document.getElementById('btn-continue');
    
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            if (currentRole) {
                // Save role in localStorage
                localStorage.setItem('userRole', currentRole);
                
                console.log('🚀 Navigating with role:', currentRole);
                
                // Redirect based on role
                if (currentRole === 'recruiter') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'student.html';
                }
            } else {
                alert('⚠️ Please select a role first!');
            }
        });
    }

    console.log('✅ HybridHire AI Role Selection page loaded successfully!');
});