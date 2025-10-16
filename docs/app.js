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
        showDialog(`Möchten Sie diese Berechtigung wirklich widerrufen?`);
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
    button.textContent = 'Zugriff gewähren';
    button.classList.add('grant');
}

function grantPermission(id) {
    const permissionItem = document.querySelector(`[data-id="${id}"]`);
    const button = permissionItem.querySelector('.revoke-btn');
    
    permissionItem.classList.remove('revoked');
    button.textContent = 'Widerrufen';
    button.classList.remove('grant');
}

// Company information data
const companyInfo = {
    'pension-fund': {
        title: 'Deutsche Rentenversicherung - Datennutzung',
        dataUsage: 'Wir verwenden Ihre Kontoinformationen zur Berechnung und Optimierung Ihrer Rentenbeiträge und Altersvorsorgeplanung. Diese Daten helfen uns, personalisierte Rentenstrategien zu entwickeln und eine optimale Fondsallokation sicherzustellen.',
        accessDetails: 'Der Zugriff ist auf Kontostands- und Beitragsinformationen beschränkt. Einzelne Transaktionsdetails werden nicht eingesehen. Die Daten werden einmal monatlich für regelmäßige Rentenberechnungen und Prognosen abgerufen.',
        security: 'Alle Daten werden nach deutschen Datenschutzstandards verschlüsselt. Wir sind nach ISO 27001 zertifiziert und führen regelmäßige Sicherheitsaudits durch. Ihre Daten werden ausschließlich in deutschen Rechenzentren gespeichert.',
        contact: 'Datenschutzbeauftragter: datenschutz@rentenversicherung.de\nTelefon: 0800 1000 4800\nCompliance-Büro: compliance@rentenversicherung.de',
        moreInfoUrl: 'https://www.deutsche-rentenversicherung.de/datenschutz'
    },
    'health-insurance': {
        title: 'Techniker Krankenkasse - Datennutzung',
        dataUsage: 'Ihre persönlichen Daten werden für die Bearbeitung von Versicherungsansprüchen, die Überprüfung der Versicherungsberechtigung und personalisierte Gesundheitsempfehlungen verwendet.',
        accessDetails: 'Wir greifen auf grundlegende persönliche Informationen und versicherungsbezogene Transaktionen zu. Medizinische Unterlagen werden separat mit zusätzlichen Sicherheitsmaßnahmen behandelt.',
        security: 'DSGVO-konformer Datenschutz mit Ende-zu-Ende-Verschlüsselung. Regelmäßige externe Sicherheitsaudits und strenge Zugriffskontrollen werden durchgeführt.',
        contact: 'Datenschutzabteilung: datenschutz@tk.de\nTelefon: 0800 285 85 85\nKundenservice: service@tk.de',
        moreInfoUrl: 'https://www.tk.de/datenschutz'
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
    
    const moreInfoLink = document.getElementById('moreInfoLink');
    moreInfoLink.href = info.moreInfoUrl;
    
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

// Permission modal logic
const permissionModal = document.getElementById('permissionModal');
const permissionModalList = document.getElementById('permissionModalList');
const permissionModalTitle = document.getElementById('permissionModalTitle');

function openPermissionModal(companyName, permissionItems) {
    // set title
    permissionModalTitle.textContent = companyName + ' — angeforderte Berechtigungen';
    // clear list
    permissionModalList.innerHTML = '';

    permissionItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'permission-item';

        const info = document.createElement('div');
        info.className = 'permission-info';
        info.innerHTML = `<span class="access-type"><i class="fas ${item.icon}"></i>${item.label}</span><span class="access-details">${item.since || ''}</span>`;

        const btn = document.createElement('button');
        btn.className = 'revoke-btn small';
        btn.textContent = 'Widerrufen';
        btn.addEventListener('click', () => {
            // show confirmation dialog
            currentPermissionId = item.id;
            showDialog(`Möchten Sie die Berechtigung "${item.label}" wirklich widerrufen?`);
        });

        li.appendChild(info);
        li.appendChild(btn);
        permissionModalList.appendChild(li);
    });

    permissionModal.classList.add('show');
}

function closePermissionModal() {
    permissionModal.classList.remove('show');
}

// Wire group headers to open modal with their permission items
document.querySelectorAll('.permission-group .group-header').forEach(header => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
        const group = header.closest('.permission-group');
        const companyName = group.querySelector('.company').textContent.trim();
        // collect permission items from inner .permission-list if present
        const items = [];
        group.querySelectorAll('.permission-list .permission-item').forEach((pi, idx) => {
            const label = pi.querySelector('.access-type').textContent.trim();
            const since = pi.querySelector('.access-details') ? pi.querySelector('.access-details').textContent.trim() : '';
            const iconEl = pi.querySelector('.access-type i');
            const icon = iconEl ? iconEl.classList[1] : 'fa-circle';
            items.push({ id: group.getAttribute('data-id') + '-' + idx, label, since, icon });
        });

        openPermissionModal(companyName, items);
    });
});
