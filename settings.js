// =============================================
// HYBRIDHIRE AI - Settings (HR/Recruiter)
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ----- SAVE CHANGES -----
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function() {
            const name = document.getElementById('fullName')?.value || 'Jane Doe';
            const email = document.getElementById('emailAddress')?.value || 'jane.doe@hybridhire.ai';
            alert('✅ Settings saved successfully!\n\nName: ' + name + '\nEmail: ' + email);
        });
    }
    
    // ----- UPLOAD AVATAR -----
    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    if (uploadAvatarBtn) {
        uploadAvatarBtn.addEventListener('click', function() {
            alert('📸 Opening file picker for avatar upload...\n\nSupported: JPG, PNG (Max 2MB)');
        });
    }
    
    // ----- AVATAR CLICK -----
    const avatarContainer = document.getElementById('avatarContainer');
    if (avatarContainer) {
        avatarContainer.addEventListener('click', function() {
            alert('📸 Clicked on avatar - Upload new image?');
        });
    }
    
    // ----- SENSITIVITY RANGE -----
    const sensitivityRange = document.getElementById('sensitivityRange');
    const sensitivityLabel = document.getElementById('sensitivityLabel');
    if (sensitivityRange && sensitivityLabel) {
        sensitivityRange.addEventListener('input', function() {
            const val = this.value;
            let label = '';
            if (val >= 80) label = 'High (' + val + '%)';
            else if (val >= 50) label = 'Medium (' + val + '%)';
            else label = 'Low (' + val + '%)';
            sensitivityLabel.textContent = label;
        });
    }
    
    // ----- WEIGHTING RANGE -----
    const weightingRange = document.getElementById('weightingRange');
    const weightingLabel = document.getElementById('weightingLabel');
    if (weightingRange && weightingLabel) {
        weightingRange.addEventListener('input', function() {
            const val = this.value;
            let label = '';
            if (val >= 70) label = 'Aggressive (' + val + '%)';
            else if (val >= 40) label = 'Moderate (' + val + '%)';
            else label = 'Conservative (' + val + '%)';
            weightingLabel.textContent = label;
        });
    }
    
    // ----- AI TOGGLE -----
    const aiToggle = document.getElementById('aiToggle');
    const aiToggleDot = document.getElementById('aiToggleDot');
    let aiEnabled = true;
    
    if (aiToggle && aiToggleDot) {
        aiToggle.addEventListener('click', function() {
            aiEnabled = !aiEnabled;
            if (aiEnabled) {
                this.classList.add('bg-secondary');
                this.classList.remove('bg-surface-variant');
                aiToggleDot.classList.add('translate-x-6');
                aiToggleDot.classList.remove('translate-x-0');
                alert('🧠 AI Screening Engine: ENABLED');
            } else {
                this.classList.remove('bg-secondary');
                this.classList.add('bg-surface-variant');
                aiToggleDot.classList.remove('translate-x-6');
                aiToggleDot.classList.add('translate-x-0');
                alert('🧠 AI Screening Engine: DISABLED');
            }
        });
    }
    
    // ----- SIGN OUT -----
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to sign out?')) {
                alert('👋 Signing out...');
                // window.location.href = 'login.html';
            }
        });
    }
    
    console.log('✅ HybridHire AI Settings loaded successfully!');
});