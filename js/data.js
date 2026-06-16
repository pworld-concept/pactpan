/* ═══════════════════════════════════════
   PACTPAN - Shared Data & Components
   All data is static. Firebase is only
   used for registration writes.
   ═══════════════════════════════════════ */

/* ── NAV HTML ── */
const NAV_HTML = `
<nav id="nav">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo">
      <img src="images/logo.jpg" alt="PACTPAN logo" class="nav-logo-img"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
      <div class="nav-logo-fallback" style="display:none">P</div>
      <div class="nav-brand">
        <span class="nav-brand-main">PACTPAN</span>
        <span class="nav-brand-sub">Palaver Series 2026</span>
      </div>
    </a>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="sessions.html">Sessions</a></li>
      <li><a href="speakers.html">Speakers</a></li>
      <li><a href="papers.html">Papers</a></li>
      <li><a href="partners.html">Partners</a></li>
    </ul>
    <a href="register.html" class="nav-cta-btn">Register Now</a>
    <button class="hamburger" id="hamburger" aria-label="Menu">&#9776;</button>
  </div>
</nav>
<div class="mobile-drawer" id="mobile-drawer">
  <a href="index.html">Home</a>
  <a href="about.html">About</a>
  <a href="sessions.html">Sessions</a>
  <a href="speakers.html">Speakers</a>
  <a href="papers.html">Papers</a>
  <a href="partners.html">Partners</a>
  <a href="register.html" class="btn btn-gold">Register Now</a>
</div>`;

/* ── FOOTER HTML ── */
const FOOTER_HTML = `
<footer>
  <div class="footer-grid">
    <div class="footer-brand">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:.6rem">
        <img src="images/logo.jpg" alt="" style="width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid var(--gold)"
             onerror="this.style.display='none'"/>
        <div>
          <div style="font-family:'Playfair Display',serif;font-weight:700;color:#fff;font-size:1rem">PACTPAN Palaver Series</div>
          <div style="font-size:.62rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gold-bright)">Renewal of Priestly Ministry in Nigeria</div>
        </div>
      </div>
      <p>A joint initiative of CSN, CATHAN, PACTPAN, and Veritas University Abuja, designed to foster spiritual renewal, fraternal communion, and pastoral excellence among Nigerian priests.</p>
    </div>
    <div class="footer-col">
      <h4>Navigate</h4>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About & Mission</a></li>
        <li><a href="sessions.html">Programme</a></li>
        <li><a href="speakers.html">Speakers</a></li>
        <li><a href="papers.html">Papers</a></li>
        <li><a href="partners.html">Partners</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Participate</h4>
      <ul>
        <li><a href="register.html">Register Now</a></li>
        <li><a href="papers.html">Access Papers</a></li>
        <li><a href="partners.html">Our Partners</a></li>
      </ul>
    </div>
    <div class="footer-col footer-contact">
      <h4>Contact</h4>
      <p>&#128222; +234 703 209 6095</p>
      <p>&#9993; <a href="mailto:renewmycathpriestspactpan@gmail.com">renewmycathpriestspactpan@gmail.com</a></p>
      <p>&#127760; <a href="https://www.pactpan.org" target="_blank">www.pactpan.org</a></p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 PACTPAN Palaver Series. All rights reserved.</p>
    <div class="footer-motto">
      <span>Communion</span><span class="diamond">&#9670;</span>
      <span>Renewal</span><span class="diamond">&#9670;</span>
      <span>Mission</span>
    </div>
  </div>
</footer>`;

/* ── INJECT NAV + FOOTER ── */
function injectShell() {
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
  document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);

  /* Active nav link */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  /* Hamburger */
  document.getElementById('hamburger').addEventListener('click', () => {
    const d = document.getElementById('mobile-drawer');
    d.classList.toggle('open');
    document.getElementById('hamburger').innerHTML = d.classList.contains('open') ? '&#10005;' : '&#9776;';
  });
  document.querySelectorAll('.mobile-drawer a').forEach(a =>
    a.addEventListener('click', () => {
      document.getElementById('mobile-drawer').classList.remove('open');
      document.getElementById('hamburger').innerHTML = '&#9776;';
    })
  );

  /* Nav scroll shadow */
  window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 30);
  });

}

/* ── TOAST ── */
function showToast(msg) {
  let t = document.getElementById('site-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'site-toast'; t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ════════════════════════════════════════
   STATIC DATA - everything lives here.
   Firestore is only used for registration.
   ════════════════════════════════════════ */
const SESSIONS = [
  {
    id: 1, date: "July 23, 2026", month: "Jul", day: "23",
    label: "Palaver 1",
    title: "Fully Alive in Christ: Caring for the Self – The Priest as a Living Gift",
    focus: "Reclaiming self-care as a spiritual and pastoral responsibility. This session addresses physical health, emotional balance, spiritual renewal, and healthy relationships with the temporal and spiritual goods of the Church. It highlights the sources of tension in the pastoral setting by addressing the realities of burnout, loneliness, stress, and emotional fatigue, as well as the need for a disciplined, joyful life rooted in contentment, integrity, missionary zeal, and a healthy priestly identity.",
    bible: '"Come away by yourselves to a deserted place and rest a while" - Mark 6:31',
    speakers: [
      { name: "Most Rev. Fortunatus Nwachukwu", role: "Allocutio" },
      { name: "Fr Anthony Akinwale, OP", role: "Theological & Philosophical Foundations of Priestly Self-care, Wholeness, and Integrity" },
      { name: "Mrs Regina Ibekwe", role: "Mental Health, Burnout, and Healthy Well-being in Priestly Ministry" },
      { name: "Fr Peter Tanko", role: "Simplicity of Life, and Healthy Relationships with Money and Power" }
    ],
    moderators: "Rev. Fr. Prof. Anthony Kanu and Edel Akighir"
  },
  {
    id: 2, date: "July 30, 2026", month: "Jul", day: "30",
    label: "Palaver 2",
    title: "Caring for One Another: Fraternity, Synodality, and Building Relationships",
    focus: "Building a culture of trust, accountability, and mutual support among priests, and fostering healthy, respectful, and mission-oriented relationships between priests and bishops. This session explores fraternity, conflict resolution, communication, reconciliation, and the healing of wounded relationships within the presbyterate. It also reflects on the spirituality of communion and synodality as foundations for a healthy and united Church.",
    bible: '"That they may all be one" - John 17:21',
    speakers: [
      { name: "Cardinal John Onaiyekan", role: "Allocutio" },
      { name: "Sr. Sylvia Nwachukwu, DDL", role: "The Trinity as the Foundation and Model of Communion, Reconciliation and Collaborative Ministry" },
      { name: "Fr Vitalis Anehobi", role: "A Synodal Approach to Healing Wounded Relationships and Rebuilding Trust" },
      { name: "Fr Anthony Bature", role: "Conflict Resolution, Communication, and Relational Maturity in Priestly Ministry" }
    ],
    moderators: "Sr. Florence Oso, EHJ and Fr Patrick Alumuku"
  },
  {
    id: 3, date: "August 6, 2026", month: "Aug", day: "6",
    label: "Palaver 3",
    title: "Shepherds after the Heart of Jesus: Caring for God's People – Prophetic Service and Pastoral Maturity",
    focus: "Renewing the priest's identity as a servant leader who accompanies God's people with compassion, wisdom, and courage. Emphasis is placed on transformational leadership, preaching, listening, pastoral presence, and being prophetic voices in contexts of corruption, injustice, insecurity, and suffering, as well as on the healthy application of Catholic Social Teaching in the socio-political context.",
    bible: '"I am the good shepherd. The good shepherd lays down his life for the sheep" - John 10:11',
    speakers: [
      { name: "Most Rev. Matthew Man Oso Ndagaso", role: "Allocutio" },
      { name: "Fr Raymond Aina, MSP", role: "Contested Moral Issues and the Ethics of Pastoral Accompaniment" },
      { name: "Dr Willy Mamah", role: "Church and State, Civil Society, and the Role of Priests in the Public Square" },
      { name: "Fr Atta Barkindo", role: "Ministry in Contexts of Violence, Insecurity, Trauma, and Interreligious Tension" }
    ],
    moderators: "Fr. Barnabas Sama'ila Shabayang and Sr. Grace John Emezi, HHCJ"
  },
  {
    id: 4, date: "August 13, 2026", month: "Aug", day: "13",
    label: "Palaver 4",
    title: "Caring for the Future: Welfare, Sustainability, and Retirement",
    focus: "Addressing the often neglected question of priests' welfare, maintenance, healthcare, aging priests, financial integrity, and retirement planning. This session encourages responsible foresight, accountability, and communal support structures for the care of priests, thereby promoting dignity in later years and avoiding a future marked by neglect, dependency, or abandonment.",
    bible: '"The laborer deserves his wage" - Luke 10:7',
    speakers: [
      { name: "Most Rev. Augustine Akubeze", role: "Allocutio" },
      { name: "Fr Hyacinth Ichoku", role: "Financial Accountability, Sustainability, and Responsible Stewardship in Priestly Ministry" },
      { name: "Mrs. Angela Chimezea", role: "Health Insurance, Pensions, Retirement Structures, and Institutional Support Systems" },
      { name: "Mr Elias Igbin Akenzua", role: "Managing Money, Accountability, and Financial Planning, and Church Investment" }
    ],
    moderators: "Mr Tony Nnacheta and Sr Titilayo Aduloju"
  },
  {
    id: 5, date: "August 20, 2026", month: "Aug", day: "20",
    label: "Palaver 5",
    title: "Toward a Vital Church: Integrating Care, Mission, and Leadership",
    focus: "Bringing together the insights of the series to articulate a vision of a vital Church and the ten dimensions of a Church that gives life and makes possible the abundant life offered by the Lord Jesus. This session will identify practical pathways, accountability structures, and a shared commitment to ongoing renewal, synodality, pastoral planning, and the vitality of ecclesial life at all levels.",
    bible: '"I came that they may have life, and have it abundantly" - John 10:10',
    speakers: [
      { name: "Most Rev. Matthew Hassan Kukah", role: "Allocutio" },
      { name: "Fr Stan Chu Ilo", role: "The Ten Dimensions of a Vital Church and Transformational Servant Leadership" },
      { name: "Prof. Felix Enegho", role: "Missionary Renewal, Synodality, and Inter-Faith Mission in the Nigerian Church" },
      { name: "Rev. Idara Otu, MSP", role: "Pastoral Planning, Accountability Structures, and Sustaining Ecclesial Vitality" }
    ],
    moderators: "Dr Anthonia Otunla and Fr. Mike Umoh"
  },
  {
    id: 6, date: "August 27, 2026", month: "Aug", day: "27",
    label: "Palaver 6",
    title: "Convergence and Cascading Communication: Full Presence in a Digital World",
    focus: "This session focuses on the challenges and opportunities of communicating Christ in a rapidly changing digital and media culture. It examines how priests can become credible, compassionate, and effective communicators in both physical and digital spaces - addressing social media, digital evangelization, media ethics, misinformation, online conflict, and the pressures of celebrity culture in ministry.",
    bible: '"Go into all the world and proclaim the good news to the whole creation" - Mark 16:15',
    speakers: [
      { name: "Bishop Gerald Mamman Musa", role: "Allocutio" },
      { name: "Rev. Emmanuel Ojeifo", role: "Digital Evangelization, Catholic Media Engagement, and Best Practices for Priests on Social Media" },
      { name: "Mrs. Adesua Onyenokwe", role: "Media Ethics, Storytelling, Public Communication, and Connecting Faith with Everyday Life" },
      { name: "Mr. Vinmartin Ilo", role: "Catholic Digital Media, Visual Communication, Online Catechesis, and Shaping Public Narratives" }
    ],
    moderators: "Sir Joseph Ngung Ari and Sr Ijeoma Ejiogu, HHCJ"
  }
];

/*
  SPEAKER PHOTOS
  ──────────────
  Set `photo` to a URL or a local path like "images/speakers/firstname-lastname.jpg"
  If the image fails to load (404, wrong path, not yet uploaded) the card
  automatically falls back to the gradient background + initials - no blank boxes.

  To add a photo later:
    1. Drop the image into images/speakers/
    2. Set photo: "images/speakers/their-name.jpg"
  To remove a photo and revert to gradient: set photo: null
*/
const SPEAKERS = [
  {
    name: "Most Rev. Fortunatus Nwachukwu",
    role: "Archbishop - Allocutio Speaker, Palaver 1",
    session: "Palaver 1", initials: "FN",
    color: ["#1E4D2B", "#B8860B"],
    photo: "images/speakers/bishop-fortunatus.png",
    bio: "Most Rev. Fortunatus Nwachukwu brings decades of pastoral and diplomatic experience to this formation initiative, speaking to the call of priests to live fully alive in Christ. His allocutio sets the tone for the entire series.",
    paper: "Keynote Allocutio: The Priest as a Living Gift"
  },
  {
    name: "Fr Anthony Akinwale, OP",
    role: "Theologian & Philosopher - Palaver 1",
    session: "Palaver 1", initials: "AA",
    color: ["#2E3A59", "#1E4D2B"],
    photo: "images/speakers/anthony-akinwale.jpeg",
    bio: "Fr Anthony Akinwale, OP, is a distinguished Dominican theologian and philosopher whose work on priestly identity, virtue ethics, and formation has profoundly influenced Catholic intellectual life across Africa.",
    paper: "Theological and Philosophical Foundations of Priestly Self-care, Wholeness, and Integrity"
  },
  {
    name: "Mrs Regina Ibekwe",
    role: "Mental Health Practitioner - Palaver 1",
    session: "Palaver 1", initials: "RI",
    color: ["#7B3F1A", "#2E3A59"],
    photo: "images/speakers/woman.png",
    bio: "Mrs Regina Ibekwe is a leading practitioner in mental health and wellbeing, bringing professional expertise to the often overlooked dimension of psychological health among clergy in Nigeria.",
    paper: "Mental Health, Burnout, and Healthy Well-being in Priestly Ministry"
  },
  {
    name: "Fr Peter Tanko",
    role: "Priest & Formation Facilitator - Palaver 1",
    session: "Palaver 1", initials: "PT",
    color: ["#1E4D2B", "#7B3F1A"],
    photo: "images/speakers/man.png",
    bio: "Fr Peter Tanko engages questions of financial integrity, simplicity of life, and the priest's relationship with material goods with both theological depth and pastoral directness.",
    paper: "Simplicity of Life, and Healthy Relationships with Money and Power"
  },
  {
    name: "Cardinal John Onaiyekan",
    role: "Cardinal Archbishop Emeritus of Abuja - Palaver 2",
    session: "Palaver 2", initials: "JO",
    color: ["#4A2060", "#1E4D2B"],
    photo: "images/speakers/john-onaiyekan.webp",
    bio: "Cardinal John Onaiyekan is one of Nigeria's most respected Church leaders, known for his wisdom, ecumenical breadth, and fearless prophetic witness spanning decades of episcopal ministry.",
    paper: "Keynote Allocutio: On Priestly Fraternity and Ecclesial Communion"
  },
  {
    name: "Sr. Sylvia Nwachukwu, DDL",
    role: "Biblical Scholar - Palaver 2",
    session: "Palaver 2", initials: "SN",
    color: ["#1E4D2B", "#4A2060"],
    photo: "images/speakers/sylvia-nwachukwu.jpg",
    bio: "Sr. Sylvia Nwachukwu, DDL, is a renowned biblical theologian. Her work on the Trinity as a model for human relationships provides the deepest theological foundation for priestly fraternity and synodal communion.",
    paper: "The Trinity as the Foundation and Model of Communion, Reconciliation and Collaborative Ministry"
  },
  {
    name: "Fr Vitalis Anehobi",
    role: "Pastoral Theologian - Palaver 2",
    session: "Palaver 2",
    initials: "VA",
    color: ["#1E4D2B", "#2E3A59"],
    photo: "images/speakers/man.png",
    bio: "Fr Vitalis Anehobi brings a synodal perspective to questions of healing and reconciliation within the presbyterate, drawing on the fruits of the Synod on Synodality.",
    paper: "A Synodal Approach to Healing Wounded Relationships and Rebuilding Trust in the Church",
  },
  {
    name: "Fr Anthony Bature",
    role: "Priest & Formation Facilitator - Palaver 2",
    session: "Palaver 2",
    initials: "AB",
    color: ["#2E3A59", "#7B3F1A"],
    photo: "images/speakers/man.png",
    bio: "Fr Anthony Bature engages the deeply human dimensions of priestly relationships - communication, conflict, and the relational maturity that sustains fraternal life in the presbyterate.",
    paper: "Conflict Resolution, Communication, and Relational Maturity in Priestly Ministry",
  },
  {
    name: "Most Rev. Matthew Man Oso Ndagaso",
    role: "Bishop - Allocutio Speaker, Palaver 3",
    session: "Palaver 3",
    initials: "MN",
    color: ["#122B18", "#1E4D2B"],
    photo: "images/speakers/matthew-man-oso.jpg",
    bio: "Most Rev. Matthew Man Oso Ndagaso brings episcopal wisdom and pastoral authority to this session, delivering the allocutio that frames the third palaver on shepherding God's people with courage and compassion.",
    paper: "Keynote Allocutio: Shepherds after the Heart of Jesus",
  },
  {
    name: "Fr Raymond Aina, MSP",
    role: "Missionary of St. Paul - Palaver 3",
    session: "Palaver 3",
    initials: "RA",
    color: ["#7B3F1A", "#1E4D2B"],
    photo: "images/speakers/raymond-aina.jpg",
    bio: "Fr Raymond Aina, MSP, brings theological depth and pastoral sensitivity to some of the most contested moral questions facing priests today, offering a framework of accompaniment rooted in mercy and truth.",
    paper: "Contested Moral Issues and the Ethics of Pastoral Accompaniment",
  },
  {
    name: "Dr Willy Mamah",
    role: "Scholar - Church & Public Square - Palaver 3",
    session: "Palaver 3", initials: "WM",
    color: ["#4A2060", "#7B3F1A"],
    photo: "images/speakers/man.png",
    bio: "Dr Willy Mamah is an authority on the relationship between Church, State, and civil society in Nigeria, bringing clarity to the often turbulent role of priests in the complex Nigerian public square.",
    paper: "Church and State, Civil Society, and the Role of Priests in the Public Square"
  },
  {
    name: "Fr Atta Barkindo",
    role: "Researcher - Conflict & Mission - Palaver 3",
    session: "Palaver 3", initials: "AB",
    color: ["#1E4D2B", "#7B3F1A"],
    photo: "images/speakers/atta-barkindo.jpg",
    bio: "Fr Atta Barkindo is a researcher and practitioner whose work on ministry in contexts of violence, trauma, and interreligious tension draws on lived pastoral experience in Nigeria's most challenging regions.",
    paper: "Ministry in Contexts of Violence, Insecurity, Trauma, and Interreligious Tension"
  },
  {
    name: "Most Rev. Augustine Akubeze",
    role: "Archbishop - Allocutio Speaker, Palaver 4",
    session: "Palaver 4",
    initials: "AA",
    color: ["#1E4D2B", "#4A2060"],
    photo: "images/speakers/augustine-akubeze.webp",
    bio: "Most Rev. Augustine Akubeze is one of Nigeria's most senior and respected archbishops, whose allocutio on the welfare and sustainability of priests speaks from decades of episcopal governance and pastoral care.",
    paper: "Keynote Allocutio: Caring for the Future - Welfare, Sustainability, and Retirement",
  },
  {
    name: "Fr Hyacinth Ichoku",
    role: "Economist & Theologian - Palaver 4",
    session: "Palaver 4",
    initials: "HI",
    color: ["#2E3A59", "#1E4D2B"],
    photo: "images/speakers/ichoku-hyacinth.jpg",
    bio: "Fr Hyacinth Ichoku brings rare interdisciplinary expertise as both a theologian and an economist, addressing financial accountability, sustainability, and the responsible stewardship of resources in priestly ministry with rigour and clarity.",
    paper: "Financial Accountability, Sustainability, and Responsible Stewardship in Priestly Ministry",
  },
  {
    name: "Mrs. Angela Chimezea",
    role: "Benefits & Welfare Specialist - Palaver 4",
    session: "Palaver 4",
    initials: "AC",
    color: ["#7B3F1A", "#2E3A59"],
    photo: "images/speakers/woman.png",
    bio: "Mrs. Angela Chimezea is a specialist in institutional welfare systems, bringing professional expertise on health insurance, pensions, retirement structures, and the support frameworks that give priests dignity and security in later life.",
    paper: "Health Insurance, Pensions, Retirement Structures, and Institutional Support Systems",
  },
  {
    name: "Mr Elias Igbin Akenzua",
    role: "Financial Planner & Church Investment Advisor - Palaver 4",
    session: "Palaver 4",
    initials: "EA",
    color: ["#4A2060", "#7B3F1A"],
    photo: "images/speakers/elias-igbinakenzua.png",
    bio: "Mr Elias Igbin Akenzua is a seasoned financial planner whose work at the intersection of faith and finance helps Church institutions and individual priests navigate money management, accountability structures, and long-term investment planning.",
    paper: "Managing Money, Accountability, and Financial Planning, and Church Investment",
  },
  {
    name: "Most Rev. Matthew Hassan Kukah",
    role: "Bishop of Sokoto - Palaver 5",
    session: "Palaver 5", initials: "MK",
    color: ["#7B3F1A", "#1E4D2B"],
    photo: "images/speakers/matthew-kukah.jpeg",
    bio: "Bishop Matthew Hassan Kukah is one of Africa's foremost public theologians, celebrated for his courageous prophetic witness, his engagement with the Nigerian State, and his vision of a vital, synodal Church.",
    paper: "Keynote Allocutio: Toward a Vital Church in Nigeria"
  },
  {
    name: "Fr Stan Chu Ilo",
    role: "Professor of World Christianity - Palaver 5",
    session: "Palaver 5", initials: "SI",
    color: ["#1E4D2B", "#2E3A59"],
    photo: "images/speakers/chu-ilo.jpg",
    bio: "Fr Stan Chu Ilo is a professor of World Christianity and Practical Theology. His work on the vital Church and transformational servant leadership provides the conceptual backbone for this entire formation series.",
    paper: "The Ten Dimensions of a Vital Church and Transformational Servant Leadership"
  },
  {
    name: "Prof. Felix Enegho",
    role: "Professor & Missiologist - Palaver 5",
    session: "Palaver 5",
    initials: "FE",
    color: ["#2E3A59", "#1E4D2B"],
    photo: "images/speakers/felix-enegho.jpg",
    bio: "Prof. Felix Enegho is a distinguished missiologist whose work on missionary renewal, synodality, and inter-faith engagement offers a compelling vision for how the Nigerian Church can embrace its evangelising mission with renewed energy and ecumenical breadth.",
    paper: "Missionary Renewal, Synodality, and Inter-Faith Mission in the Nigerian Church",
  },
  {
    name: "Rev. Idara Otu, MSP",
    role: "Missionary of St. Paul - Palaver 5",
    session: "Palaver 5",
    initials: "IO",
    color: ["#7B3F1A", "#2E3A59"],
    photo: "images/speakers/man.png",
    bio: "Rev. Idara Otu, MSP, brings practical pastoral experience and missiological depth to questions of ecclesial planning, offering concrete accountability structures and frameworks for sustaining the vitality of Church life at every level.",
    paper: "Pastoral Planning, Accountability Structures, and Sustaining Ecclesial Vitality",
  },
  {
    name: "Bishop Gerald Mamman Musa",
    role: "Bishop - Allocutio Speaker, Palaver 6",
    session: "Palaver 6",
    initials: "GM",
    color: ["#122B18", "#2E3A59"],
    photo: "images/speakers/mamman-musa.webp",
    bio: "Bishop Gerald Mamman Musa delivers the allocutio for the sixth and final palaver, framing the Church's call to full presence in the digital world with episcopal authority and prophetic clarity about the priest as communicator of the Gospel in every space.",
    paper: "Keynote Allocutio: Full Presence in a Digital World",
  },
  {
    name: "Rev. Emmanuel Ojeifo",
    role: "Priest & Digital Evangelist - Palaver 6",
    session: "Palaver 6", initials: "EO",
    color: ["#2E3A59", "#7B3F1A"],
    photo: "images/speakers/emmanuel-ojeifo.jpg",
    bio: "Rev. Emmanuel Ojeifo is widely regarded as one of Nigeria's most effective priestly communicators, blending evangelization with digital media to reach a vast audience across Africa and beyond.",
    paper: "Digital Evangelization, Catholic Media Engagement, and Best Practices for Priests on Social Media"
  },
  {
    name: "Mrs. Adesua Onyenokwe",
    role: "Broadcaster & Media Expert - Palaver 6",
    session: "Palaver 6", initials: "AO",
    color: ["#7B3F1A", "#4A2060"],
    photo: "images/speakers/woman.png",
    bio: "Mrs. Adesua Onyenokwe is a celebrated broadcaster and media practitioner whose expertise in storytelling, ethics, and public communication has shaped Nigerian public discourse for decades.",
    paper: "Media Ethics, Storytelling, Public Communication, and Connecting Faith with Everyday Life"
  },
  {
    name: "Mr. Vinmartin Ilo",
    role: "Catholic Digital Media Practitioner - Palaver 6",
    session: "Palaver 6",
    initials: "VI",
    color: ["#2E3A59", "#7B3F1A"],
    photo: "images/speakers/vinmartin-ilo.webp",
    bio: "Mr. Vinmartin Ilo is a practitioner at the forefront of Catholic digital media in Nigeria, whose work in visual communication, online catechesis, and public narrative-shaping offers priests practical tools for an effective and credible digital presence.",
    paper: "Catholic Digital Media, Visual Communication, Online Catechesis, and Shaping Public Narratives",
  },
];

const PAPERS = [
  { title: "Theological and Philosophical Foundations of Priestly Self-care, Wholeness, and Integrity", author: "Fr Anthony Akinwale, OP", session: "Palaver 1", open: false },
  { title: "Mental Health, Burnout, and Healthy Well-being in Priestly Ministry", author: "Mrs Regina Ibekwe", session: "Palaver 1", open: false },
  { title: "Simplicity of Life, and Healthy Relationships with Money and Power", author: "Fr Peter Tanko", session: "Palaver 1", open: false },
  { title: "The Trinity as the Foundation and Model of Communion, Reconciliation and Collaborative Ministry", author: "Sr. Sylvia Nwachukwu, DDL", session: "Palaver 2", open: false },
  { title: "A Synodal Approach to Healing Wounded Relationships and Rebuilding Trust in the Church", author: "Fr Vitalis Anehobi", session: "Palaver 2", open: false },
  { title: "Conflict Resolution, Communication, and Relational Maturity in Priestly Ministry", author: "Fr Anthony Bature", session: "Palaver 2", open: false },
  { title: "Contested Moral Issues and the Ethics of Pastoral Accompaniment", author: "Fr Raymond Aina, MSP", session: "Palaver 3", open: false },
  { title: "Church and State, Civil Society, and the Role of Priests in the Public Square", author: "Dr Willy Mamah", session: "Palaver 3", open: false },
  { title: "Ministry in Contexts of Violence, Insecurity, Trauma, and Interreligious Tension", author: "Fr Atta Barkindo", session: "Palaver 3", open: false },
  { title: "Financial Accountability, Sustainability, and Responsible Stewardship in Priestly Ministry", author: "Fr Hyacinth Ichoku", session: "Palaver 4", open: false },
  { title: "Health Insurance, Pensions, Retirement Structures, and Institutional Support Systems", author: "Mrs. Angela Chimezea", session: "Palaver 4", open: false },
  { title: "The Ten Dimensions of a Vital Church and Transformational Servant Leadership", author: "Fr Stan Chu Ilo", session: "Palaver 5", open: true },
  { title: "Missionary Renewal, Synodality, and Inter-Faith Mission in the Nigerian Church", author: "Prof. Felix Enegho", session: "Palaver 5", open: false },
  { title: "Digital Evangelization, Catholic Media Engagement, and Best Practices for Priests on Social Media", author: "Rev. Emmanuel Ojeifo", session: "Palaver 6", open: false },
  { title: "Media Ethics, Storytelling, Public Communication, and Connecting Faith with Everyday Life", author: "Mrs. Adesua Onyenokwe", session: "Palaver 6", open: false }
];

/*
  PARTNER LOGOS
  ─────────────
  Set `logo` to a local path e.g. "images/partners/pactpan.png"
  or a full URL. If null (or the image fails), the abbr text shows instead.
  Recommended size: 160 × 160 px, transparent PNG.
*/
const PARTNERS = [
  { abbr: "PACTPAN", full: "", logo: "images/partners/pactpan.png" },
  { abbr: "CATHAN", full: "", logo: "images/partners/cathan.jpg" },
  { abbr: "CSN", full: "", logo: "images/partners/csn.png" },
  { abbr: "Veritas", full: "", logo: "images/partners/veritas.png" },
  { abbr: "NCDPA", full: "", logo: "images/partners/ncdpa.jpeg" }
];

const COORDINATORS = [
  "Rev. Barnabas Shabayang", "Rev. Idara Otu, MSP", "Rev. Augustine Okochi",
  "Rev. Atta Barkindo", "Rev. Anthony Kanu, OSA", "Rev. Stan Chu Ilo",
  "Sr Ijeoma Ejiogu, HHCJ", "Rev. James Ogbuigo (Secretary)"
];