/* ════════════════════════════════════════════════
   firebase-app.js — all Firebase operations.
   Loaded as <script type="module">
   Depends on app.js having run first.
   ════════════════════════════════════════════════ */

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { auth, db, storage } from './firebase.js';
import { getDownloadURL, ref, uploadBytesResumable }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { onAuthStateChanged, signOut }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

/* ── RENDER SPEAKERS ADMIN LIST (with Firestore data merged in) ── */
window.renderSpeakersAdmin = async function () {
    const container = document.getElementById('speakers-admin-list');
    if (!container) return;

    container.innerHTML = '<p style="color:#94a3b8;font-size:.88rem;padding:.5rem">Loading…</p>';

    /* Fetch all saved speaker docs from Firestore */
    try {
        const snap = await getDocs(collection(db, 'speakers'));
        const firestoreMap = {};
        snap.forEach(d => { firestoreMap[d.id] = d.data(); });

        /* Merge Firestore data into each SPEAKERS entry */
        SPEAKERS.forEach((sp, i) => {
            const key = sp.name.replace(/[^a-zA-Z0-9]/g, '_');
            const saved = firestoreMap[key];
            if (saved) {
                /* Update in-memory array so modal also gets fresh data */
                SPEAKERS[i] = {
                    ...sp,
                    bio: saved.bio ?? sp.bio,
                    role: saved.role ?? sp.role,
                    email: saved.email ?? sp.email,
                    twitter: saved.twitter ?? sp.twitter,
                    linkedin: saved.linkedin ?? sp.linkedin,
                    website: saved.website ?? sp.website,
                    photo: saved.photo ?? sp.photo,
                };
            }
        });
    } catch (err) {
        /* Firestore unavailable — render from static data with warning */
        console.warn('renderSpeakersAdmin Firestore error:', err.message);
    }

    /* Render with merged data */
    container.innerHTML = SPEAKERS.map((sp, i) => {
        const socials = [
            sp.email ? '<a href="mailto:' + sp.email + '" class="sp-admin-social" title="Email">✉️</a>' : '',
            sp.twitter ? '<a href="https://twitter.com/' + sp.twitter + '" target="_blank" class="sp-admin-social" title="Twitter/X">𝕏</a>' : '',
            sp.linkedin ? '<a href="https://linkedin.com/in/' + sp.linkedin + '" target="_blank" class="sp-admin-social" title="LinkedIn">in</a>' : '',
            sp.website ? '<a href="' + sp.website + '" target="_blank" class="sp-admin-social" title="Website">🌐</a>' : '',
        ].filter(Boolean).join('');

        /* Use data-* attribute instead of inline onerror with quotes — avoids
           the single-quote collision that previously broke this string. */
        const avatarInner = sp.photo
            ? '<img src="' + sp.photo + '" alt="" data-fallback-text="' + sp.initials + '" ' +
            'style="width:100%;height:100%;object-fit:cover;border-radius:50%" ' +
            'onerror="this.style.display=&quot;none&quot;;this.nextElementSibling.style.display=&quot;flex&quot;">' +
            '<span style="display:none;width:100%;height:100%;align-items:center;justify-content:center">' + sp.initials + '</span>'
            : sp.initials;

        return '<div class="sp-admin-row">'
            + '<div class="sp-admin-avatar" style="background:linear-gradient(135deg,' + sp.color[0] + ',' + sp.color[1] + ')">'
            + avatarInner
            + '</div>'
            + '<div class="sp-admin-info">'
            + '<div class="sp-admin-name">' + sp.name + '</div>'
            + '<div class="sp-admin-role">' + sp.role.replace(/ — Palaver \d+/, '') + '</div>'
            + '<div class="sp-admin-session">' + sp.session + '</div>'
            + '<div class="sp-admin-socials">'
            + (socials
                ? socials
                : '<span style="font-size:.72rem;color:#94a3b8">No contact info yet — click Edit</span>')
            + '</div>'
            + '</div>'
            + '<button class="btn btn-sm btn-ghost" onclick="editSpeaker(' + i + ')" style="flex-shrink:0;align-self:start">✏️ Edit</button>'
            + '</div>';
    }).join('');
};

/* ── FETCH ALL SPEAKERS FROM FIRESTORE AND REFRESH THE LIST ──
   Called every time the Speakers panel is opened so the list
   always shows the latest saved contact details.              */
window.fetchAllSpeakersAndRender = async function () {
    /* Show a loading state while fetching */
    const container = document.getElementById('speakers-admin-list');
    if (container) {
        container.innerHTML = '<p style="color:#94a3b8;font-size:.88rem;padding:.5rem">Refreshing from Firestore…</p>';
    }

    try {
        const snap = await getDocs(collection(db, 'speakers'));
        /* Build a lookup by the same key used when saving */
        const saved = {};
        snap.forEach(d => { saved[d.id] = d.data(); });

        /* Merge Firestore data into every SPEAKERS entry */
        SPEAKERS.forEach((sp, i) => {
            const key = sp.name.replace(/[^a-zA-Z0-9]/g, '_');
            if (saved[key]) {
                const s = saved[key];
                SPEAKERS[i] = {
                    ...sp,
                    bio: s.bio ?? sp.bio,
                    role: s.role ?? sp.role,
                    email: s.email ?? sp.email,
                    twitter: s.twitter ?? sp.twitter,
                    linkedin: s.linkedin ?? sp.linkedin,
                    website: s.website ?? sp.website,
                    photo: s.photo ?? sp.photo,
                };
            }
        });
    } catch (err) {
        console.warn('fetchAllSpeakersAndRender:', err.message);
        /* Still render — with whatever data we have */
    }

    /* Now render the list (data.js SPEAKERS array is now up to date) */
    if (typeof window.renderSpeakersAdmin === 'function') {
        window.renderSpeakersAdmin();
    }
};

window.fetchAndPopulateSpeaker = async function (i) {
    const base = SPEAKERS[i];
    const key = base.name.replace(/[^a-zA-Z0-9]/g, '_');
    try {
        const snap = await getDoc(doc(db, 'speakers', key));
        if (!snap.exists()) return; /* No Firestore doc yet — static data is fine */

        const saved = snap.data();
        /* Merge: Firestore fields win; keep static fields (name, initials, color, session, paper) */
        const merged = {
            ...base,
            bio: saved.bio ?? base.bio,
            role: saved.role ?? base.role,
            email: saved.email ?? base.email,
            twitter: saved.twitter ?? base.twitter,
            linkedin: saved.linkedin ?? base.linkedin,
            website: saved.website ?? base.website,
            photo: saved.photo ?? base.photo,
        };

        /* Also update the in-memory array so re-opens are fast */
        SPEAKERS[i] = merged;

        /* Repopulate the form with the authoritative Firestore values */
        if (typeof window.populateSpeakerForm === 'function') {
            window.populateSpeakerForm(i, merged);
        }
    } catch (err) {
        /* Silently keep whatever static/cached data is showing */
        console.warn('fetchAndPopulateSpeaker:', err.message);
    }
};

/* ── AUTH GUARD ── */
onAuthStateChanged(auth, async user => {
    if (!user) { window.location.href = 'admin-login.html'; return; }
    try {
        const snap = await getDoc(doc(db, 'registrants', user.uid));
        const profile = snap.exists() ? snap.data() : {};
        if (profile.role !== 'admin') { window.location.href = 'dashboard.html'; return; }
        document.getElementById('admin-email').textContent = user.email;
        loadRegistrants();
        loadPapers();
    } catch (err) {
        document.getElementById('admin-email').textContent =
            '⚠ Permission error — deploy Firestore rules (' + err.code + ')';
    }
});

/* ── SIGN OUT ── */
document.getElementById('btn-signout').addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = 'admin-login.html';
});

/* ── LOAD REGISTRANTS ── */
async function loadRegistrants() {
    try {
        /* orderBy requires a Firestore composite index if you filter too.
           Simple getDocs without orderBy works without an index, so we
           sort client-side instead. */
        const snap = await getDocs(collection(db, 'registrants'));
        const list = snap.docs.map(d => d.data())
            .sort((a, b) => {
                const ta = (a.registeredAt && a.registeredAt.toDate) ? a.registeredAt.toDate().getTime() : 0;
                const tb = (b.registeredAt && b.registeredAt.toDate) ? b.registeredAt.toDate().getTime() : 0;
                return tb - ta; // newest first
            });

        window._allRegs = list;
        document.getElementById('s-total').textContent = list.length;
        document.getElementById('s-nigeria').textContent = list.filter(r => r.country === 'Nigeria').length;
        document.getElementById('s-priests').textContent = list.filter(r => r.title === 'Rev. Fr.').length;
        window.renderTable(list);
    } catch (err) {
        const isPerm = err.code === 'permission-denied';
        document.getElementById('s-total').textContent = '!';
        document.getElementById('reg-tbody').innerHTML =
            '<tr><td colspan="8" class="tbl-empty" style="color:#ef4444">⚠ ' +
            (isPerm
                ? 'Permission denied — go to Firebase Console → Firestore → Rules → publish the updated rules, then refresh.'
                : err.message) +
            '</td></tr>';
    }
}

/* ── LOAD PAPERS ── */
async function loadPapers() {
    try {
        const snap = await getDocs(collection(db, 'papers'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        document.getElementById('s-papers').textContent = list.length;
        window.uploadedTitles = new Set(list.map(p => p.title));
        window.populatePaperDropdown();

        const container = document.getElementById('papers-list');
        if (!list.length) {
            container.innerHTML = '<p style="color:#94a3b8;font-size:.88rem;padding:1rem">No papers uploaded yet.</p>';
            return;
        }
        container.innerHTML = list.map(p => {
            const bg = p.type === 'video' ? 'rgba(59,130,246,.1)' : p.type === 'text' ? 'rgba(30,77,43,.1)' : 'rgba(239,68,68,.1)';
            const icon = p.type === 'video' ? '🎬' : p.type === 'text' ? '📝' : '📄';
            return '<div class="paper-row">'
                + '<div class="pr-icon" style="background:' + bg + '">' + icon + '</div>'
                + '<div class="pr-info"><div class="pr-title">' + p.title + '</div>'
                + '<div class="pr-meta">' + p.author + ' · ' + p.session + ' · ' + (p.access === 'open' ? '🌐 Open' : '🔒 Gated') + '</div></div>'
                + '<button class="btn btn-sm btn-red" onclick="delPaper(\'' + p.id + '\')">Delete</button>'
                + '</div>';
        }).join('');
    } catch (err) {
        document.getElementById('papers-list').innerHTML =
            '<p style="color:#ef4444;font-size:.88rem;padding:1rem">⚠ ' + err.message + '</p>';
    }
}

/* ── DELETE PAPER ── */
window.delPaper = async id => {
    if (!confirm('Delete this paper permanently?')) return;
    try {
        await deleteDoc(doc(db, 'papers', id));
        window.showToast('Paper deleted.'); loadPapers();
    } catch (err) { window.showToast('Delete failed: ' + err.message); }
};

/* ── PUBLISH PAPER ── */
document.getElementById('btn-publish').addEventListener('click', async () => {
    const title = document.getElementById('up-title').value.trim();
    const author = document.getElementById('up-author').value.trim();
    const session = document.getElementById('up-session').value;
    const access = document.getElementById('up-access').value;
    const abstract = document.getElementById('up-abstract').value.trim();
    const ct = document.querySelector('.ct-tab.active').dataset.ct;
    if (!title || !author || !session) { window.showToast('Please select a paper first.'); return; }

    const btn = document.getElementById('btn-publish');
    document.getElementById('publish-label').style.display = 'none';
    document.getElementById('publish-spin').style.display = 'block';
    btn.disabled = true;

    try {
        const data = { title, author, session, access, type: ct, abstract, createdAt: serverTimestamp() };

        if (ct === 'pdf') {
            if (!window.selectedFile) { window.showToast('Please select a PDF file.'); return; }
            const sRef = ref(storage, 'papers/' + Date.now() + '-' + window.selectedFile.name);
            const barWrap = document.getElementById('upload-bar-wrap');
            const bar = document.getElementById('upload-bar');
            barWrap.style.display = 'block';
            await new Promise((res, rej) => {
                const task = uploadBytesResumable(sRef, window.selectedFile);
                task.on('state_changed',
                    s => { bar.style.width = Math.round(s.bytesTransferred / s.totalBytes * 100) + '%'; },
                    rej,
                    async () => { data.pdfUrl = await getDownloadURL(task.snapshot.ref); res(); }
                );
            });
        } else if (ct === 'video') {
            data.videoUrl = document.getElementById('up-video-url').value.trim();
            data.videoDesc = document.getElementById('up-video-desc').value.trim();
        } else {
            const ed = document.getElementById('up-editor');
            data.body = ed ? ed.innerHTML : document.getElementById('up-body').value.trim();
        }

        await addDoc(collection(db, 'papers'), data);
        const ok = document.getElementById('upload-ok');
        ok.classList.add('show'); setTimeout(() => ok.classList.remove('show'), 4000);

        /* reset */
        ['up-abstract', 'up-video-url', 'up-video-desc', 'up-body'].forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });
        document.getElementById('up-paper-select').value = '';
        document.getElementById('up-title').value = '';
        document.getElementById('up-author').value = '';
        document.getElementById('up-session').value = '';
        const ed = document.getElementById('up-editor');
        if (ed) ed.innerHTML = '';
        document.getElementById('btn-publish').disabled = true;
        document.getElementById('btn-publish').style.opacity = '.6';
        document.getElementById('publish-label').textContent = 'Select a paper above to enable';
        document.getElementById('up-already-msg').style.display = 'none';
        window.selectedFile = null;
        document.getElementById('file-selected').style.display = 'none';
        document.getElementById('upload-bar-wrap').style.display = 'none';
        document.getElementById('upload-bar').style.width = '0%';
        loadPapers();
    } catch (err) {
        window.showToast('Upload failed: ' + err.message);
    } finally {
        document.getElementById('publish-label').style.display = 'block';
        document.getElementById('publish-spin').style.display = 'none';
        btn.disabled = false;
    }
});

/* ── SAVE SPEAKER PROFILE ── */
document.getElementById('sp-edit-form').addEventListener('submit', async e => {
    e.preventDefault();
    const i = parseInt(document.getElementById('sp-edit-idx').value, 10);
    const sp = SPEAKERS[i];

    /* Bio: read from rich editor innerHTML (canonical source of truth) */
    const bioEd = document.getElementById('sp-bio-editor');
    const bioVal = bioEd ? bioEd.innerHTML.trim() : document.getElementById('sp-edit-bio').value.trim();
    sp.bio = bioVal; /* update in-memory SPEAKERS array so re-opening modal shows latest */
    sp.email = document.getElementById('sp-edit-email').value.trim() || null;
    sp.twitter = document.getElementById('sp-edit-twitter').value.trim() || null;
    sp.linkedin = document.getElementById('sp-edit-linkedin').value.trim() || null;
    sp.website = document.getElementById('sp-edit-website').value.trim() || null;
    sp.photo = document.getElementById('sp-edit-photo').value.trim() || null;

    try {
        const key = sp.name.replace(/[^a-zA-Z0-9]/g, '_');
        await setDoc(doc(db, 'speakers', key), {
            name: sp.name, role: sp.role, session: sp.session,
            bio: sp.bio, email: sp.email, twitter: sp.twitter,
            linkedin: sp.linkedin, website: sp.website, photo: sp.photo,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        window.showToast('✓ Speaker profile saved to Firestore.');
    } catch (err) {
        window.showToast('Saved in memory. Firestore error: ' + err.message);
    }

    document.getElementById('sp-edit-overlay').classList.remove('open');
    document.body.style.overflow = '';
    /* Re-render the speakers list with updated data */
    window.renderSpeakersAdmin();
});