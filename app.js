const routes = {
    '/login': { templateId: 'login' },
    '/dashboard': { templateId: 'dashboard' },
    '/credits': { templateId: 'credits' }
};

function updateRoute() {
    console.log('This is a test');
    const path = window.location.pathname;
    const route = routes[path];
    if (!route) {
        return navigate('/login');
    }

    // Check if navigating to dashboard and log message
    if (path === '/dashboard') {
        console.log('Dashboard is shown');
    } else if (path === '/login') {
        console.log('Login is shown');
    } else if (path === '/credits') {
        console.log('Credits is shown');
    } else {
        console.log('God is good');
    }

    const template = document.getElementById(route.templateId);
    const view = template.content.cloneNode(true);
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(view);
}

function navigate(path) {
    window.history.pushState({}, path, path);
    updateRoute();
};

function onLinkClick(event) {
    event.preventDefault();
    navigate(event.target.href);
};

window.onpopstate = () => updateRoute();
updateRoute();
