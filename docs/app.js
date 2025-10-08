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

// Company information data
const companyInfo = {
    'pension-fund': {
        title: 'Pension Fund Data Usage Information',
        dataUsage: 'We use your balance information to calculate and optimize your pension contributions and retirement planning. This data helps us provide personalized retirement strategies and ensure optimal fund allocation.',
        accessDetails: 'Access is limited to balance information only. We do not see individual transaction details. Data is accessed once per month for regular pension calculations and projections.',
        security: 'All data is encrypted using industry-standard protocols. We maintain SOC 2 Type II certification and conduct regular security audits. Your data is stored in secure EU-based data centers.',
        contact: 'Data Protection Officer: dpo@pensionfund.com\nPhone: +1 (555) 123-4567\nCompliance Office: compliance@pensionfund.com'
    },
    'health-insurance': {
        title: 'Health Insurance Data Usage Information',
        dataUsage: 'Your personal information is used to process insurance claims, verify coverage eligibility, and provide personalized healthcare recommendations. We analyze patterns to improve our service quality.',
        accessDetails: 'We access basic personal information and insurance-related transaction history. Medical records are handled separately with additional security measures.',
        security: 'HIPAA-compliant data handling with end-to-end encryption. Regular third-party security audits and strict access controls are maintained.',
        contact: 'Privacy Office: privacy@healthinsurance.com\nPhone: +1 (555) 987-6543\nCustomer Support: support@healthinsurance.com'
    }
};

// Function to show company information
function showCompanyInfo(button) {
    const companyId = button.getAttribute('data-company');
    const info = companyInfo[companyId];
    const dialog = document.getElementById('companyInfoDialog');
    
    document.getElementById('companyInfoTitle').textContent = info.title;
    document.getElementById('dataUsagePolicy').textContent = info.dataUsage;
    document.getElementById('accessDetails').textContent = info.accessDetails;
    document.getElementById('securityMeasures').textContent = info.security;
    document.getElementById('contactInfo').textContent = info.contact;
    
    dialog.classList.add('show');
}

// Function to close company info dialog
function closeCompanyInfo() {
    document.getElementById('companyInfoDialog').classList.remove('show');
}

// Close dialogs when clicking outside
document.querySelectorAll('.dialog').forEach(dialog => {
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.classList.remove('show');
            if (dialog === document.getElementById('confirmationDialog')) {
                currentPermissionId = null;
            }
        }
    });
});
