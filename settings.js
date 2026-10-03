// =============================================
// HYBRIDHIRE AI - Settings (HR/Recruiter) - Dynamic
// =============================================

document.addEventListener('DOMContentLoaded', function() {

    const API_BASE_URL = 'http://localhost:8080';
    const token = localStorage.getItem('jwtToken');

    const defaultSettings = {
        orgName: 'Acme Corp Global',
        industry: 'Technology',
        aiEnabled: true,
        sensitivity: 85,
        weighting: 60,
        requireMinExperience: true,
        strictDegree: false,
        extractLinkedIn: true,
        parseEducation: true,
        normalizeJobTitles: false,
        highMatchAlerts: true,
        dailyDigest: true,
        systemUpdates: false
    };

    let settings = JSON.parse(localStorage.getItem('recruiterSettings')) || defaultSettings;

    function applySettingsToUI() {
        document.getElementById('orgName').value = settings.orgName;
        document.getElementById('industrySelect').value = settings.industry;

        document.getElementById('sensitivityRange').value = settings.sensitivity;
        document.getElementById('weightingRange').value = settings.weighting;
        updateSensitivityLabel(settings.sensitivity);
        updateWeightingLabel(settings.weighting);

        setAiToggleUI(settings.aiEnabled);

        const atsCheckboxes = document.querySelectorAll('.ats-checkbox');
        if (atsCheckboxes[0]) atsCheckboxes[0].checked = settings.requireMinExperience;
        if (atsCheckboxes[1]) atsCheckboxes[1].checked = settings.strictDegree;

        const parsingCheckboxes = document.querySelectorAll('.parsing-checkbox');
        if (parsingCheckboxes[0]) parsingCheckboxes[0].checked = settings.extractLinkedIn;
        if (parsingCheckboxes[1]) parsingCheckboxes[1].checked = settings.parseEducation;
        if (parsingCheckboxes[2]) parsingCheckboxes[2].checked = settings.normalizeJobTitles;

        const alertCheckboxes = document.querySelectorAll('.alert-checkbox');
        if (alertCheckboxes[0]) alertCheckboxes[0].checked = settings.highMatchAlerts;
        if (alertCheckboxes[1]) alertCheckboxes[1].checked = settings.dailyDigest;
        if (alertCheckboxes[2]) alertCheckboxes[2].checked = settings.systemUpdates;
    }

    function updateSensitivityLabel(val) {
        let label = '';
        if (val >= 80) label = 'High (' + val + '%)';
        else if (val >= 50) label = 'Medium (' + val + '%)';
        else label = 'Low (' + val + '%)';
        document.getElementById('sensitivityLabel').textContent = label;
    }

    function updateWeightingLabel(val) {
        let label = '';
        if (val >= 70) label = 'Aggressive (' + val + '%)';
        else if (val >= 40) label = 'Moderate (' + val + '%)';
        else label = 'Conservative (' + val + '%)';
        document.getElementById('weightingLabel').textContent = label;
    }

    function setAiToggleUI(enabled) {
        const aiToggle = document.getElementById('aiToggle');
        const aiToggleDot = document.getElementById('aiToggleDot');
        if (!aiToggle || !aiToggleDot) return;
        if (enabled) {
            aiToggle.classList.add('bg-secondary');
            aiToggle.classList.remove('bg-surface-variant');
            aiToggleDot.classList.add('translate-x-6');
            aiToggleDot.classList.remove('translate-x-0');
        } else {
            aiToggle.classList.remove('bg-secondary');
            aiToggle.classList.add('bg-surface-variant');
            aiToggleDot.classList.remove('translate-x-6');
            aiToggleDot.classList.add('translate-x-0');
        }
    }

    applySettingsToUI();

    async function loadProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/hello`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            document.getElementById('fullName').value = localStorage.getItem('userName') || '';
            document.getElementById('emailAddress').value = localStorage.getItem('userEmail') || '';
        } catch (error) {
            console.error('Profile load error:', error);
        }
    }
    loadProfile();

    const saveChangesBtn = document.getElementById('saveChangesBtn');
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', async function() {

            const name = document.getElementById('fullName')?.value || '';

            try {
                const response = await fetch(`${API_BASE_URL}/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({ name: name })
                });
                if (response.ok) {
                    localStorage.setItem('userName', name);
                }
            } catch (error) {
                console.error('Profile save error:', error);
            }

            const atsCheckboxes = document.querySelectorAll('.ats-checkbox');
            const parsingCheckboxes = document.querySelectorAll('.parsing-checkbox');
            const alertCheckboxes = document.querySelectorAll('.alert-checkbox');

            settings = {
                orgName: document.getElementById('orgName').value,
                industry: document.getElementById('industrySelect').value,
                aiEnabled: settings.aiEnabled,
                sensitivity: parseInt(document.getElementById('sensitivityRange').value),
                weighting: parseInt(document.getElementById('weightingRange').value),
                requireMinExperience: atsCheckboxes[0]?.checked || false,
                strictDegree: atsCheckboxes[1]?.checked || false,
                extractLinkedIn: parsingCheckboxes[0]?.checked || false,
                parseEducation: parsingCheckboxes[1]?.checked || false,
                normalizeJobTitles: parsingCheckboxes[2]?.checked || false,
                highMatchAlerts: alertCheckboxes[0]?.checked || false,
                dailyDigest: alertCheckboxes[1]?.checked || false,
                systemUpdates: alertCheckboxes[2]?.checked || false
            };

            localStorage.setItem('recruiterSettings', JSON.stringify(settings));

            alert('✅ Settings saved successfully!');
        });
    }

    const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
    if (uploadAvatarBtn) {
        uploadAvatarBtn.addEventListener('click', function() {
            alert('📸 upload feature coming soon.');
        });
    }

    const sensitivityRange = document.getElementById('sensitivityRange');
    if (sensitivityRange) {
        sensitivityRange.addEventListener('input', function() {
            updateSensitivityLabel(this.value);
        });
    }

    const weightingRange = document.getElementById('weightingRange');
    if (weightingRange) {
        weightingRange.addEventListener('input', function() {
            updateWeightingLabel(this.value);
        });
    }

    const aiToggle = document.getElementById('aiToggle');
    if (aiToggle) {
        aiToggle.addEventListener('click', function() {
            settings.aiEnabled = !settings.aiEnabled;
            setAiToggleUI(settings.aiEnabled);
        });
    }
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to sign out?')) {
                localStorage.clear();
                window.location.href = 'login.html';
            }
        });
    }

    console.log('✅ HybridHire AI Settings loaded successfully!');
});