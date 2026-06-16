/* ════════════════════════════════════════════════
   app.js - UI interactions only. No Firebase.
   ════════════════════════════════════════════════ */

/* ── TOAST ── */
function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3500);
}
window.showToast = toast;

/* ── NAV ── */
document.querySelectorAll('.sidebar-nav a[data-panel]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.sidebar-nav a').forEach(x => x.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(x => {
            x.classList.remove('active');
            x.style.display = 'none';
        });
        a.classList.add('active');
        const panel = document.getElementById('panel-' + a.dataset.panel);
        if (panel) { panel.classList.add('active'); panel.style.display = 'block'; }
        /* When Speakers panel opens, fetch latest from Firestore first, then render */
        if (a.dataset.panel === 'speakers-admin') {
            if (typeof window.fetchAllSpeakersAndRender === 'function') {
                window.fetchAllSpeakersAndRender();
            } else {
                window.renderSpeakersAdmin(); /* fallback if firebase-app.js not ready */
            }
        }
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('mob-overlay').classList.remove('open');
    });
});

/* ── MOBILE ── */
document.getElementById('mob-menu-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('mob-overlay').classList.toggle('open');
});
document.getElementById('mob-overlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('mob-overlay').classList.remove('open');
});

/* ── CONTENT TYPE TABS ── */
window._contentType = 'pdf';
document.querySelectorAll('.ct-tab').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.ct-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.ct-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        window._contentType = btn.dataset.ct;
        document.getElementById('ct-' + window._contentType).classList.add('active');
    });
});

/* ── PAPER DROPDOWN ── */
window.uploadedTitles = new Set();
window.populatePaperDropdown = function () {
    const sel = document.getElementById('up-paper-select');
    while (sel.options.length > 1) sel.remove(1);
    PAPERS.forEach((p, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        const isUp = window.uploadedTitles.has(p.title);
        opt.textContent = (isUp ? '✓ ' : '') + p.session + ' - ' + p.author + ': ' + p.title.slice(0, 55) + (p.title.length > 55 ? '…' : '');
        if (isUp) opt.style.color = '#94a3b8';
        sel.appendChild(opt);
    });
};
window.populatePaperDropdown();

document.getElementById('up-paper-select').addEventListener('change', function () {
    const idx = parseInt(this.value, 10);
    const btn = document.getElementById('btn-publish');
    const lbl = document.getElementById('publish-label');
    const msg = document.getElementById('up-already-msg');
    if (isNaN(idx)) {
        document.getElementById('up-title').value = '';
        document.getElementById('up-author').value = '';
        document.getElementById('up-session').value = '';
        btn.disabled = true; btn.style.opacity = '.6';
        lbl.textContent = 'Select a paper above to enable';
        msg.style.display = 'none';
        return;
    }
    const p = PAPERS[idx];
    const isUp = window.uploadedTitles.has(p.title);
    document.getElementById('up-title').value = p.title;
    document.getElementById('up-author').value = p.author;
    document.getElementById('up-session').value = p.session;
    msg.style.display = isUp ? 'block' : 'none';
    btn.disabled = isUp;
    btn.style.opacity = isUp ? '.5' : '1';
    lbl.textContent = isUp ? 'Already uploaded - manage in All Papers' : 'Publish Paper';
});

/* ── RICH TEXT EDITOR ── */
const editor = document.getElementById('up-editor');
let isSourceMode = false;

document.querySelectorAll('.tb-btn[data-cmd]').forEach(btn => {
    btn.addEventListener('mousedown', e => {
        e.preventDefault();
        if (isSourceMode) return;
        const cmd = btn.dataset.cmd;
        if (['h2', 'h3', 'p', 'blockquote'].indexOf(cmd) !== -1) {
            document.execCommand('formatBlock', false, '<' + cmd + '>');
        } else {
            document.execCommand(cmd, false, null);
        }
        syncEditor(); updateToolbarState();
    });
});
document.getElementById('tb-link').addEventListener('mousedown', e => {
    e.preventDefault();
    const url = prompt('Enter URL (include https://):');
    if (url) document.execCommand('createLink', false, url);
    syncEditor();
});
document.getElementById('tb-html-toggle').addEventListener('click', () => {
    isSourceMode = !isSourceMode;
    document.getElementById('tb-html-toggle').classList.toggle('active', isSourceMode);
    if (isSourceMode) { editor.textContent = editor.innerHTML; editor.classList.add('source-mode'); }
    else { editor.innerHTML = editor.textContent; editor.classList.remove('source-mode'); }
    syncEditor();
});
editor.addEventListener('input', syncEditor);
editor.addEventListener('keyup', updateToolbarState);
editor.addEventListener('mouseup', updateToolbarState);
function syncEditor() {
    document.getElementById('up-body').value = isSourceMode ? editor.textContent : editor.innerHTML;
}
function updateToolbarState() {
    document.querySelectorAll('.tb-btn[data-cmd]').forEach(b => {
        try { b.classList.toggle('active', document.queryCommandState(b.dataset.cmd)); } catch (e) { }
    });
}

/* ── DROP ZONE ── */
window.selectedFile = null;
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', e => {
    e.preventDefault(); dropZone.classList.remove('drag-over');
    const f = e.dataTransfer.files[0];
    if (f && f.type === 'application/pdf') setFile(f);
});
fileInput.addEventListener('change', () => { if (fileInput.files[0]) setFile(fileInput.files[0]); });
function setFile(f) {
    window.selectedFile = f;
    const el = document.getElementById('file-selected');
    el.textContent = '✓ ' + f.name + ' (' + (f.size / 1024 / 1024).toFixed(1) + ' MB)';
    el.style.display = 'block';
}

/* ── TABLE SEARCH ── */
document.getElementById('tsearch').addEventListener('input', function () {
    const q = this.value.toLowerCase();
    const all = window._allRegs || [];
    renderTable(all.filter(r =>
        (r.fname + ' ' + r.lname + ' ' + r.diocese + ' ' + r.country).toLowerCase().indexOf(q) !== -1
    ));
});

/* ── EXPORT CSV ── */
document.getElementById('btn-export').addEventListener('click', () => {
    const all = window._allRegs || [];
    if (!all.length) { toast('No data to export.'); return; }
    const h = ['First Name', 'Last Name', 'Title', 'Email', 'Phone', 'Diocese', 'Country', 'Ordination', 'Role', 'Registered'];
    const rows = all.map(r => {
        const date = (r.registeredAt && r.registeredAt.toDate) ? r.registeredAt.toDate().toLocaleDateString() : '';
        return [r.fname, r.lname, r.title, r.email, r.phone, r.diocese, r.country, r.ordination, r.role, date]
            .map(v => '"' + (v || '').toString().replace(/"/g, '""') + '"').join(',');
    });
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent([h.join(','), ...rows].join('\n'));
    a.download = 'pactpan-registrants.csv'; a.click();
});

/* ── RENDER TABLE ── */
function renderTable(list) {
    const tbody = document.getElementById('reg-tbody');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="tbl-empty">No registrants found.</td></tr>';
        return;
    }
    tbody.innerHTML = list.map((r, i) => {
        const date = (r.registeredAt && r.registeredAt.toDate) ? r.registeredAt.toDate().toLocaleDateString() : '-';
        return '<tr>'
            + '<td style="color:#94a3b8">' + (i + 1) + '</td>'
            + '<td><strong>' + (r.fname || '') + ' ' + (r.lname || '') + '</strong></td>'
            + '<td>' + (r.title || '-') + '</td>'
            + '<td style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + (r.diocese || '-') + '</td>'
            + '<td>' + (r.country || '-') + '</td>'
            + '<td>' + (r.ordination || '-') + '</td>'
            + '<td>' + date + '</td>'
            + '<td><span class="' + (r.role === 'admin' ? 'ba' : 'bp') + '">' + (r.role || 'participant') + '</span></td>'
            + '</tr>';
    }).join('');
}
window.renderTable = renderTable;

/* ── SPEAKERS ADMIN ── */
/* renderSpeakersAdmin is defined in firebase-app.js so it can merge Firestore data.
   app.js exposes a stub that firebase-app.js overwrites once loaded. */
window.renderSpeakersAdmin = function () {
    const container = document.getElementById('speakers-admin-list');
    if (container) container.innerHTML = '<p style="color:#94a3b8;font-size:.88rem">Loading speakers from Firestore…</p>';
};

/* populateSpeakerForm - called by editSpeaker with merged static+Firestore data */
window.populateSpeakerForm = function (i, data) {
    const sp = data; /* merged: Firestore wins over static */

    document.getElementById('sp-edit-name').value = sp.name || '';
    document.getElementById('sp-edit-role').value = sp.role || '';
    document.getElementById('sp-edit-email').value = sp.email || '';
    document.getElementById('sp-edit-twitter').value = sp.twitter || '';
    document.getElementById('sp-edit-linkedin').value = sp.linkedin || '';
    document.getElementById('sp-edit-website').value = sp.website || '';
    document.getElementById('sp-edit-photo').value = sp.photo || '';
    document.getElementById('sp-edit-idx').value = i;

    /* Rich bio editor */
    const bioEditor = document.getElementById('sp-bio-editor');
    const bioHidden = document.getElementById('sp-edit-bio');
    if (bioEditor) {
        spBioSourceMode = false;
        bioEditor.classList.remove('source-mode');
        const htmlToggle = document.getElementById('sp-bio-html-toggle');
        if (htmlToggle) htmlToggle.classList.remove('active');
        bioEditor.innerHTML = sp.bio || '';
        if (bioHidden) bioHidden.value = bioEditor.innerHTML;
    }

    /* Open modal */
    document.getElementById('sp-edit-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    history.pushState({ spModal: true, spIdx: i }, '');
};

/* editSpeaker - called from the speakers list buttons.
   Delegates to firebase-app.js which fetches Firestore first,
   merges with static data, then calls populateSpeakerForm. */
window.editSpeaker = function (i) {
    /* Show modal immediately with static data so there's no blank wait */
    window.populateSpeakerForm(i, SPEAKERS[i]);
    /* Then firebase-app.js.fetchAndPopulateSpeaker overwrites with Firestore data */
    if (typeof window.fetchAndPopulateSpeaker === 'function') {
        window.fetchAndPopulateSpeaker(i);
    }
};

/* ── Speaker modal close ── */
document.getElementById('sp-edit-close').onclick = closeSpEdit;
document.getElementById('sp-edit-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeSpEdit();
});
function closeSpEdit() {
    exitFullscreen();
    document.getElementById('sp-edit-overlay').classList.remove('open');
    document.body.style.overflow = '';
}
window.closeSpEdit = closeSpEdit;

/* ── BIO RICH EDITOR setup ── */
let spBioSourceMode = false;

(function () {
    const bioEditor = document.getElementById('sp-bio-editor');
    const bioHidden = document.getElementById('sp-edit-bio');
    if (!bioEditor) return;

    function syncBio() {
        if (bioHidden) bioHidden.value = spBioSourceMode ? bioEditor.textContent : bioEditor.innerHTML;
    }
    window._syncBio = syncBio; /* expose for firebase-app.js */

    document.querySelectorAll('.tb-btn[data-sp-cmd]').forEach(btn => {
        btn.addEventListener('mousedown', e => {
            e.preventDefault();
            if (spBioSourceMode) return;
            const cmd = btn.dataset.spCmd;
            if (['h2', 'h3', 'p', 'blockquote'].includes(cmd)) {
                document.execCommand('formatBlock', false, '<' + cmd + '>');
            } else {
                document.execCommand(cmd, false, null);
            }
            syncBio(); updateBioState();
        });
    });

    const linkBtn = document.getElementById('sp-bio-link-btn');
    const htmlToggle = document.getElementById('sp-bio-html-toggle');

    if (linkBtn) linkBtn.addEventListener('mousedown', e => {
        e.preventDefault();
        const url = prompt('Enter URL (include https://):');
        if (url) document.execCommand('createLink', false, url);
        syncBio();
    });

    if (htmlToggle) htmlToggle.addEventListener('click', () => {
        spBioSourceMode = !spBioSourceMode;
        htmlToggle.classList.toggle('active', spBioSourceMode);
        if (spBioSourceMode) {
            bioEditor.textContent = bioEditor.innerHTML;
            bioEditor.classList.add('source-mode');
        } else {
            bioEditor.innerHTML = bioEditor.textContent;
            bioEditor.classList.remove('source-mode');
        }
        syncBio();
    });

    bioEditor.addEventListener('input', syncBio);
    bioEditor.addEventListener('keyup', updateBioState);
    bioEditor.addEventListener('mouseup', updateBioState);

    function updateBioState() {
        document.querySelectorAll('.tb-btn[data-sp-cmd]').forEach(b => {
            try { b.classList.toggle('active', document.queryCommandState(b.dataset.spCmd)); } catch (e) { }
        });
    }
})();

/* ── FULLSCREEN ── */
const _overlay = document.getElementById('sp-edit-overlay');
const _modalBox = _overlay ? _overlay.querySelector('.modal-box') : null;
const _fsBtn = document.getElementById('sp-bio-fullscreen-btn');
let isFullscreen = false;
let _origStyles = {};

function exitFullscreen() {
    if (!isFullscreen) return;
    isFullscreen = false;
    if (_modalBox) {
        _modalBox.style.maxWidth = _origStyles.maxWidth || '';
        _modalBox.style.maxHeight = _origStyles.maxHeight || '';
        _modalBox.style.width = '';
        _modalBox.style.height = '';
        _modalBox.style.borderRadius = _origStyles.borderRadius || '';
        _modalBox.style.margin = _origStyles.margin || '';
    }
    const bioEditor = document.getElementById('sp-bio-editor');
    if (bioEditor) bioEditor.style.minHeight = '180px';
    if (_fsBtn) _fsBtn.textContent = '⛶ Fullscreen';
}

if (_fsBtn && _modalBox) {
    _fsBtn.addEventListener('click', () => {
        isFullscreen = !isFullscreen;
        if (isFullscreen) {
            _origStyles = {
                maxWidth: _modalBox.style.maxWidth,
                maxHeight: _modalBox.style.maxHeight,
                borderRadius: _modalBox.style.borderRadius,
                margin: _modalBox.style.margin,
            };
            _modalBox.style.maxWidth = '100vw';
            _modalBox.style.maxHeight = '100vh';
            _modalBox.style.width = '100vw';
            _modalBox.style.height = '100vh';
            _modalBox.style.borderRadius = '0';
            _modalBox.style.margin = '0';
            const bioEditor = document.getElementById('sp-bio-editor');
            if (bioEditor) bioEditor.style.minHeight = 'calc(100vh - 420px)';
            _fsBtn.textContent = '⊡ Exit Fullscreen';
            history.pushState({ spFullscreen: true }, '');
        } else {
            exitFullscreen();
        }
    });
}

/* ── BACK BUTTON ── */
window.addEventListener('popstate', () => {
    if (isFullscreen) { exitFullscreen(); return; }
    const ov = document.getElementById('sp-edit-overlay');
    if (ov && ov.classList.contains('open')) {
        ov.classList.remove('open');
        document.body.style.overflow = '';
    }
});