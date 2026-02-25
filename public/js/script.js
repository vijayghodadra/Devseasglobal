document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Theme Toggle Logic ---
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const ICON_DARK = '<i class="fas fa-moon"></i>';
    const ICON_LIGHT = '<i class="fas fa-sun"></i>';

    // Apply saved preference immediately
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        if (themeToggle) themeToggle.innerHTML = ICON_DARK;
    } else {
        if (themeToggle) themeToggle.innerHTML = ICON_LIGHT;
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            themeToggle.innerHTML = isLight ? ICON_DARK : ICON_LIGHT;
        });
    }
});

// Mobile Dropdown Toggle (Global function called by onclick)
function toggleDropdown(e, link) {
    if (window.innerWidth <= 992) {
        const parent = link.parentElement;
        const dropdown = parent.querySelector('.dropdown-menu');

        // Only prevent navigation and show dropdown if a dropdown menu exists
        if (dropdown) {
            e.preventDefault();
            parent.classList.toggle('active');

            // Close other dropdowns
            document.querySelectorAll('.nav-item').forEach(item => {
                if (item !== parent) item.classList.remove('active');
            });
        }
    }
}
