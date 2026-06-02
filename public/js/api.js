const BoothAPI = (() => {

    let csrfReady = false;

    async function initCsrf() {
        if (csrfReady) return;
        await fetch('/sanctum/csrf-cookie', {
            method: 'GET',
            credentials: 'same-origin',
        });
        csrfReady = true;
    }

    function getXsrfToken() {
        const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
    }

    async function getFirebaseToken() {
        if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
            return await firebase.auth().currentUser.getIdToken();
        }
        return sessionStorage.getItem('firebaseToken') || 'dev-token';
    }

    async function buildHeaders(extra = {}) {
        const headers = {
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getXsrfToken(),
            ...extra,
        };
        const token = await getFirebaseToken();
        if (token) headers['Authorization'] = 'Bearer ' + token;
        return headers;
    }

    async function post(url, body = {}) {
        await initCsrf();
        const res = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: await buildHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `HTTP ${res.status}`);
        }
        return res.json();
    }

    async function get(url) {
        const res = await fetch(url, {
            credentials: 'same-origin',
            headers: await buildHeaders(),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
    }

    async function del(url) {
        await initCsrf();
        const res = await fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: await buildHeaders(),
        });
        return res.ok;
    }

    async function startSession(frameType, source = 'photobooth') {
        sessionStorage.setItem('boothFrameType', frameType);
        sessionStorage.setItem('boothSource',    source);
        return { token: null };
    }

    async function uploadPhotos(photos) {
        sessionStorage.setItem('boothPhotos', JSON.stringify(photos));
        return { stored: photos.length };
    }

    async function getSession()    { return null; }
    async function deleteSession() { return true; }

    async function saveStrip({ imageBase64, frameType, addDate = false, addTime = false }) {
        const data = await post('/strip/save', {
            image_base64: imageBase64,
            frame_type:   frameType,
            add_date:     addDate,
            add_time:     addTime,
        });
        sessionStorage.setItem('boothStripId', data.strip_id);
        return data;
    }

    async function getStrip(id) {
        const stripId = id || sessionStorage.getItem('boothStripId');
        if (!stripId) throw new Error('No strip id');
        return get(`/strip/${stripId}`);
    }

    function downloadStrip(downloadUrl) {
        if (!downloadUrl) throw new Error('No download URL');
        window.open(downloadUrl, '_blank');
    }

    async function deleteStrip(id) {
        return del(`/strip/${id}`);
    }

    async function getGallery({ page = 1, frame = '' } = {}) {
        const params = new URLSearchParams({ page });
        if (frame) params.set('frame', frame);
        return get(`/gallery-data?${params}`);
    }

    async function getMyStrips({ page = 1 } = {}) {
        return get(`/my-strips?page=${page}`);
    }

    function setFirebaseToken(token) {
        if (token) sessionStorage.setItem('firebaseToken', token);
        else sessionStorage.removeItem('firebaseToken');
    }

    function isLoggedIn() {
        return !!sessionStorage.getItem('firebaseToken');
    }

    function logout() {
        sessionStorage.removeItem('firebaseToken');
    }

    return {
        startSession,
        uploadPhotos,
        getSession,
        deleteSession,
        saveStrip,
        getStrip,
        downloadStrip,
        deleteStrip,
        getGallery,
        getMyStrips,
        setFirebaseToken,
        isLoggedIn,
        logout,
    };

})();