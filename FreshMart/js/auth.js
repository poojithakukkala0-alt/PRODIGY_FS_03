window.addEventListener('DOMContentLoaded', () => {
    syncProfilePanelData();
});

function handleAuthLogin(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('login-email').value;
    const customUser = JSON.parse(localStorage.getItem('freshmart_user_profile'));
    
    // Fallback names if no register file array matches
    const finalName = (customUser && customUser.email === emailInput) ? customUser.name : "Premium Portfolio Client";
    
    const sessionData = {
        name: finalName,
        email: emailInput,
        loggedIn: true
    };

    localStorage.setItem('freshmart_user_session', JSON.stringify(sessionData));
    alert(`🎉 Sign-In Success! Welcome back, ${finalName}.`);
    
    // Instantly refresh the current view layout state without leaving the page
    syncProfilePanelData();
}

function handleAuthRegister(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('reg-name').value;
    const emailInput = document.getElementById('reg-email').value;

    const userProfileObject = {
        name: nameInput,
        email: emailInput
    };

    localStorage.setItem('freshmart_user_profile', JSON.stringify(userProfileObject));
    alert('✨ Account created! Please log in inside your account dashboard panel.');
    window.location.href = 'profile.html';
}

function syncProfilePanelData() {
    const loggedInView = document.getElementById('logged-in-state');
    const loggedOutView = document.getElementById('logged-out-state');
    const panelTitle = document.getElementById('panel-title');
    
    const displayNameNode = document.getElementById('profile-display-name');
    const displayEmailNode = document.getElementById('profile-display-email');
    
    // Graceful safe verification check block exit
    if (!loggedInView || !loggedOutView) return;

    const activeSession = JSON.parse(localStorage.getItem('freshmart_user_session'));

    if (activeSession && activeSession.loggedIn) {
        // If logged in, show account parameters data panel
        if (displayNameNode) displayNameNode.innerText = activeSession.name;
        if (displayEmailNode) displayEmailNode.innerText = activeSession.email;
        
        loggedInView.style.display = "block";
        loggedOutView.style.display = "none";
        if (panelTitle) panelTitle.innerText = "Your Account Settings";
    } else {
        // Dynamic Swap: Hide info data blocks and show form control fields immediately
        loggedInView.style.display = "none";
        loggedOutView.style.display = "block";
        if (panelTitle) panelTitle.innerText = "Account Portal Login";
    }
}

function executeLogout() {
    localStorage.removeItem('freshmart_user_session');
    alert('Secure session keys tracking token cleared successfully.');
    
    // Trigger visual state updates inside the active page view row grid cards loop
    syncProfilePanelData();
}
