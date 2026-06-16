/* ═══════════════════════════════════════════════════════
   PACTPAN — Nav Auth Swap
   Loaded as <script type="module" src="js/nav-auth.js">
   on every public page. Swaps "Register Now" ↔ "My Dashboard"
   based on Firebase auth state.
   ═══════════════════════════════════════════════════════ */

import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ── PASTE YOUR FIREBASE CONFIG HERE ──────────────────────
      Same values as js/firebase.js and js/data.js             */
const PACTPAN_CONFIG = {
    apiKey: "AIzaSyDRb0Ne7gsaFhbI2v0KEssqnyVo820tM8k",
    authDomain: "pactpan-palaver.firebaseapp.com",
    projectId: "pactpan-palaver",
    storageBucket: "pactpan-palaver.firebasestorage.app",
    messagingSenderId: "544615347893",
    appId: "1:544615347893:web:219ed4ebf6dc9fd2b0b0fc",
};

const app = getApps().length ? getApps()[0] : initializeApp(PACTPAN_CONFIG);
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
    /* Nav CTA (desktop) */
    const cta = document.querySelector('.nav-cta-btn');
    /* Mobile drawer CTA */
    const mob = document.querySelector('.mobile-drawer .btn-gold');

    if (!cta) return; /* nav not injected yet — shouldn't happen but guard anyway */

    if (user) {
        cta.textContent = 'My Dashboard';
        cta.href = 'dashboard.html';
        if (mob) { mob.textContent = 'My Dashboard'; mob.href = 'dashboard.html'; }
    } else {
        cta.textContent = 'Register Now';
        cta.href = 'register.html';
        if (mob) { mob.textContent = 'Register Now'; mob.href = 'register.html'; }
    }
});