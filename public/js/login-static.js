const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const googleButton = document.getElementById('google-login-btn');

function showLoginError(message) {
    if (!loginError) return;
    loginError.textContent = message;
    loginError.style.display = message ? 'block' : 'none';
}

async function setAuthToken(token) {
    if (window.BoothAPI?.setFirebaseToken) {
        BoothAPI.setFirebaseToken(token);
    } else {
        sessionStorage.setItem('firebaseToken', token);
    }
}

function setupPasswordToggles() {
    document.querySelectorAll('.password-toggle').forEach((toggle) => {
        const group = toggle.closest('.password-input-group');
        const input = group?.querySelector('input');
        if (!input) return;

        toggle.addEventListener('click', () => {
            const isVisible = input.type === 'text';
            input.type = isVisible ? 'password' : 'text';
            toggle.textContent = isVisible ? '🙉' : '🙈';
            toggle.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
        });
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        showLoginError('');

        const email = loginForm.email.value.trim();
        const password = loginForm.password.value;

        if (!email || !password) {
            showLoginError('Email and password are required.');
            return;
        }

        try {
            const auth = firebase.auth();
            // Respect "Remember Me" checkbox: session vs local persistence
            const remember = document.getElementById('remember')?.checked;
            try {
                await auth.setPersistence(remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION);
            } catch (e) {
                // ignore persistence errors and continue
            }

            const credentials = await auth.signInWithEmailAndPassword(email, password);
            const token = await credentials.user.getIdToken();
            await setAuthToken(token);
            // store displayName for navbar label preference
            if (credentials.user?.displayName) sessionStorage.setItem('firebaseUserName', credentials.user.displayName);
            window.location.href = '/';
        } catch (error) {
            const friendlyError = getFirebaseLoginError(error);
            showLoginError(friendlyError);
        }
    });
}

function getFirebaseLoginError(error) {
    const code = error?.code || '';
    const message = error?.message || '';
    const friendlyMessages = {
        'auth/invalid-login-credentials': 'Your email or password is incorrect.',
        'auth/invalid-credential':        'Your email or password is incorrect.',
        'auth/wrong-password':            'Your email or password is incorrect.',
        'auth/user-not-found':            'Your email or password is incorrect.',
        'auth/invalid-email':             'Please enter a valid email address.',
        'auth/user-disabled':             'This account has been disabled. Please contact support.',
        'auth/too-many-requests':         'Too many failed login attempts. Please try again later.',
        'auth/network-request-failed':    'Network error. Please check your connection and try again.',
        'auth/operation-not-allowed':     'Login is currently unavailable. Please try again later.',
        'auth/account-exists-with-different-credential': 'An account already exists with this email but uses a different sign-in method.',
    };
    
    const friendly = friendlyMessages[code];
    if (friendly) return friendly;
    
    // Log unknown errors for debugging
    if (code) console.error('Firebase login error:', code, message);
    
    return 'Login failed. Please try again.';
}

if (googleButton) {
    googleButton.addEventListener('click', async () => {
        showLoginError('');
        try {
            const auth = firebase.auth();
            // For popup sign-in, also set persistence according to Remember Me
            const remember = document.getElementById('remember')?.checked;
            try {
                await auth.setPersistence(remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION);
            } catch (e) {}

            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);
            const token = await result.user.getIdToken();
            await setAuthToken(token);
            if (result.user?.displayName) sessionStorage.setItem('firebaseUserName', result.user.displayName);
            window.location.href = '/';
        } catch (error) {
            showLoginError(getFirebaseLoginError(error));
        }
    });
}

setupPasswordToggles();
