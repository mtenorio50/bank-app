let account = null;

const routes = {
    '/login': { templateId: 'login' },
    '/dashboard': { templateId: 'dashboard' },
    '/credits': { templateId: 'credits' }
};

// Input sanitization function
function sanitizeInput(input) {
    // Convert to string first
    const str = String(input).trim();

    // Remove HTML tags and potentially dangerous characters
    return str
        .replace(/</g, '&lt;')      // Convert < to &lt;
        .replace(/>/g, '&gt;')      // Convert > to &gt;
        .replace(/"/g, '&quot;')    // Convert " to &quot;
        .replace(/'/g, '&#x27;')    // Convert ' to &#x27;
        .replace(/\//g, '&#x2F;')   // Convert / to &#x2F;
        .replace(/&/g, '&amp;');    // Convert & to &amp; (do this last)
}

// Sanitize an entire object
function sanitizeObject(obj) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
}

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
};

function navigate(path) {
    window.history.pushState({}, path, path);
    updateRoute();
};

function onLinkClick(event) {
    event.preventDefault();
    navigate(event.target.href);
};

// Password show/hide toggle function for LOGIN
function toggleLoginPassword() {
    const passwordInput = document.getElementById('loginPassword');
    const toggleBtn = document.getElementById('toggleLoginPasswordBtn');

    if (passwordInput.type === 'password') {
        // Show password
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈'; // Change to "hide" icon
    } else {
        // Hide password
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️'; // Change to "show" icon
    }
}

// Password show/hide toggle function for REGISTER
function toggleRegisterPassword() {
    const passwordInput = document.getElementById('registerPassword');
    const toggleBtn = document.getElementById('toggleRegisterPasswordBtn');

    if (passwordInput.type === 'password') {
        // Show password
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈'; // Change to "hide" icon
    } else {
        // Hide password
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁️'; // Change to "show" icon
    }
}

async function register() {
    const registerForm = document.getElementById('registerForm');
    const formData = new FormData(registerForm);
    const rawData = Object.fromEntries(formData);

    // SANITIZE the input data
    const data = sanitizeObject(rawData);
    console.log('Raw data:', rawData);      // See original input
    console.log('Sanitized data:', data);   // See cleaned input

    const jsonData = JSON.stringify(data);
    const result = await createAccount(jsonData);

    // Get the message display elements
    const errorElement = document.getElementById('registerError');
    const successElement = document.getElementById('registerSuccess');

    if (result.error) {
        // Hide success message first
        successElement.style.display = 'none';
        successElement.textContent = '';

        // Show error message in HTML (also sanitize error messages from server)
        errorElement.textContent = sanitizeInput(result.error);
        errorElement.style.display = 'block';
        return console.log('An error occurred:', result.error);
    }

    // Hide error message on success
    errorElement.style.display = 'none';
    errorElement.textContent = '';

    // Show success message
    successElement.textContent = '✅ Account created successfully!';
    successElement.style.display = 'block';

    // Clear the form after successful registration
    registerForm.reset();

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
        successElement.style.display = 'none';
        successElement.textContent = '';
    }, 5000);

    console.log('Account created!', result);
};

async function createAccount(account) {
    try {
        const response = await fetch('//localhost:5000/api/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: account
        });
        return await response.json();
    } catch (error) {
        return { error: error.message || 'Unknown error' };
    }
}

async function login() {
    const loginForm = document.getElementById('loginForm')
    const user = loginForm.user.value;
    const data = await getAccount(user);

    if (data.error) {
        return console.log('loginError', data.error);
    }

    account = data;
    navigate('/dashboard');
}

async function getAccount(user) {
    try {
        const response = await fetch('//localhost:5000/api/accounts/' + encodeURIComponent(user));
        return await response.json();
    } catch (error) {
        return { error: error.message || 'Unknown error' };
    }
}

window.onpopstate = () => updateRoute();
updateRoute();




