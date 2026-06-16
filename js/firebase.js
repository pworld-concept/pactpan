/* ═══════════════════════════════════════════════════
   PACTPAN — Firebase Configuration
   ───────────────────────────────────────────────────
   Replace the config object below with your own keys
   from Firebase Console → Project Settings → Web App
   ═══════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════
   PACTPAN — Firebase Configuration
   ─────────────────────────────────────────────────────────────
   STEP 1: Go to https://console.firebase.google.com
   STEP 2: Your project → Project Settings → Your apps → Web app
   STEP 3: Copy the firebaseConfig object and paste values below
   STEP 4: Do the same in js/data.js (PACTPAN_CONFIG block)
   ═══════════════════════════════════════════════════════════════ */

import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDRb0Ne7gsaFhbI2v0KEssqnyVo820tM8k",
    authDomain: "pactpan-palaver.firebaseapp.com",
    projectId: "pactpan-palaver",
    storageBucket: "pactpan-palaver.firebasestorage.app",
    messagingSenderId: "544615347893",
    appId: "1:544615347893:web:219ed4ebf6dc9fd2b0b0fc",
};

/* Reuse existing app if already initialised (e.g. by data.js nav swap) */
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
