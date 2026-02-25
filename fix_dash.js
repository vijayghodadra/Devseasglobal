const fs = require('fs');

const file = 'public/admin-dashboard.html';
let html = fs.readFileSync(file, 'utf8');

html = html.replace(/<a onclick="alert\('Feature coming soon for API backend!'\)">/g, '<a href="admin-products.html">');
html = html.replace(/<button class="btn btn-primary"(.*?)onclick="alert\('Feature coming soon for API backend!'\)"/, '<button class="btn btn-primary"$1onclick="window.location.href=\'admin-products.html\'"');
html = html.replace(/<button class="btn btn-secondary"(.*?)onclick="alert\('Feature coming soon for API backend!'\)"/, '<button class="btn btn-secondary"$1onclick="window.location.href=\'admin-categories.html\'"');

// Fix specific sidebar links - wait, they are all the same "onclick". 
// Let's just do a more targeted replace for the sidebar links:
html = html.replace(/<a href="admin-products.html">\s*<span class="icon"><i class="fas fa-tags"><\/i><\/span> Categories\s*<\/a>/, '<a href="admin-categories.html">\n                <span class="icon"><i class="fas fa-tags"></i></span> Categories\n            </a>');

html = html.replace(/<a class="active">\s*<span class="icon"><i class="fas fa-chart-line"><\/i><\/span> Dashboard\s*<\/a>/, '<a href="admin-dashboard.html" class="active">\n                <span class="icon"><i class="fas fa-chart-line"></i></span> Dashboard\n            </a>');

html = html.replace(/<a>\s*<span class="icon"><i class="fas fa-envelope"><\/i><\/span> Inquiries\s*<\/a>/, '<a href="admin-dashboard.html">\n                <span class="icon"><i class="fas fa-envelope"></i></span> Inquiries\n            </a>');

fs.writeFileSync(file, html);

let productsHtml = html.replace('Admin — Dashboard', 'Admin — Products')
    .replace('<div class="topbar-title">Dashboard</div>', '<div class="topbar-title">Products Management</div>')
    .replace('<a href="admin-dashboard.html" class="active">', '<a href="admin-dashboard.html">')
    .replace('<a href="admin-products.html">', '<a href="admin-products.html" class="active">');

// Clear main content for products
productsHtml = productsHtml.replace(/<main class="page-content">[\s\S]*?<\/main>/, `<main class="page-content">
    <div class="card">
        <div class="card-header">
            <span><i class="fas fa-flask" style="color:#2dd4bf;margin-right:8px;"></i>All Products</span>
        </div>
        <div class="card-body">
            <p>Products management API backend is established, but the UI table is still being built.</p>
        </div>
    </div>
</main>`);
fs.writeFileSync('public/admin-products.html', productsHtml);

let catHtml = html.replace('Admin — Dashboard', 'Admin — Categories')
    .replace('<div class="topbar-title">Dashboard</div>', '<div class="topbar-title">Categories Management</div>')
    .replace('<a href="admin-dashboard.html" class="active">', '<a href="admin-dashboard.html">')
    .replace('<a href="admin-categories.html">', '<a href="admin-categories.html" class="active">');

catHtml = catHtml.replace(/<main class="page-content">[\s\S]*?<\/main>/, `<main class="page-content">
    <div class="card">
        <div class="card-header">
            <span><i class="fas fa-tags" style="color:#2dd4bf;margin-right:8px;"></i>All Categories</span>
        </div>
        <div class="card-body">
            <p>Categories management API backend is established, but the UI table is still being built.</p>
        </div>
    </div>
</main>`);
fs.writeFileSync('public/admin-categories.html', catHtml);
