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
