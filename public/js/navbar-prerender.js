// ── navbar-prerender.js ──────────────────────────────────────────────────────
// Loaded in <head> (blocking, no defer/async) so it runs while the page is
// still being parsed. The button doesn't exist yet at this point, so we hook
// DOMContentLoaded — which fires right when the HTML finishes parsing, long
// before the Firebase scripts at the bottom of the page even start loading.
// This means the button shows the correct text on the very first paint,
// eliminating the "Login → username" flash on every page navigation.
// ----------------------------------------------------------------------------
(function () {
    const name = sessionStorage.getItem('firebaseUserName')
              || (sessionStorage.getItem('firebaseToken') ? 'My Account' : null);

    if (!name) return; // Not logged in — keep the default "Login" from HTML.

    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('nav-login-btn')
                 || document.querySelector('#navbar .nav-right .login-btn')
                 || document.querySelector('.login-btn');
        if (!btn) return;

        btn.textContent = name;
        btn.title = 'Click to log out';
        // Remove the hardcoded onclick="/login" from the HTML so it doesn't
        // fire before auth-navbar.js attaches the real logout handler.
        btn.removeAttribute('onclick');
    }, { once: true });
})();