// Sidebar toggle logic
const sidebar = document.getElementById('sidebar');
const burgerMenu = document.getElementById('burgerMenu');
const closeSidebar = document.getElementById('closeSidebar');

burgerMenu.addEventListener('click', () => {
    sidebar.classList.add('open');
    document.querySelector('.main-content').classList.add('sidebar-open');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('open');
    document.querySelector('.main-content').classList.remove('sidebar-open');
});

// Navigation logic
const navLinks = sidebar.querySelectorAll('a');
const sections = document.querySelectorAll('.dashboard-section');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href').substring(1);
        sections.forEach(section => {
            section.style.display = section.id === target ? 'block' : 'none';
        });
        sidebar.classList.remove('open');
        document.querySelector('.main-content').classList.remove('sidebar-open');
    });
});

// Show only dashboard by default
sections.forEach(section => {
    section.style.display = section.id === 'dashboard' ? 'block' : 'none';
});

// Permissions Management
let currentPermissionId = null;
const dialog = document.getElementById('confirmationDialog');

function togglePermission(id) {
    currentPermissionId = id;
    const permissionItem = document.querySelector(`[data-id="${id}"]`);
    const isRevoked = permissionItem.classList.contains('revoked');
    
    if (isRevoked) {
        // If already revoked, grant access immediately
        grantPermission(id);
    } else {
        // If active, show confirmation dialog before revoking
        showDialog(`Are you sure you want to revoke this permission?`);
    }
}

function showDialog(message) {
    document.getElementById('dialogMessage').textContent = message;
    dialog.classList.add('show');
}

function confirmAction(confirmed) {
    dialog.classList.remove('show');
    
    if (confirmed && currentPermissionId) {
        revokePermission(currentPermissionId);
    }
    
    currentPermissionId = null;
}

function revokePermission(id) {
    const permissionItem = document.querySelector(`[data-id="${id}"]`);
    const button = permissionItem.querySelector('.revoke-btn');
    
    permissionItem.classList.add('revoked');
    button.textContent = 'Grant Access';
    button.classList.add('grant');
}

function grantPermission(id) {
    const permissionItem = document.querySelector(`[data-id="${id}"]`);
    const button = permissionItem.querySelector('.revoke-btn');
    
    permissionItem.classList.remove('revoked');
    button.textContent = 'Revoke';
    button.classList.remove('grant');
}

// Close dialog when clicking outside
dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
        dialog.classList.remove('show');
        currentPermissionId = null;
    }
});
