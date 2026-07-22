/* ============================================================
   ROOTED — verse data
   CSB text used under Holman Bible Publishers' free-use policy
   (quotations under 1,000 verses, no complete book quoted).
   Credit line lives in index.html footer area / about screen.
   ============================================================ */

const BOOKS = {
  OT: [
    {id:"genesis", name:"Genesis", unlocked:true},
    {id:"exodus", name:"Exodus", unlocked:false},
    {id:"psalms", name:"Psalms", unlocked:true},
    {id:"proverbs", name:"Proverbs", unlocked:false},
    {id:"jeremiah", name:"Jeremiah", unlocked:true},
    {id:"isaiah", name:"Isaiah", unlocked:false},
  ],
  NT: [
    {id:"john", name:"John", unlocked:true},
    {id:"philippians", name:"Philippians", unlocked:true},
    {id:"romans", name:"Romans", unlocked:false},
    {id:"matthew", name:"Matthew", unlocked:false},
    {id:"james", name:"James", unlocked:false},
    {id:"revelation", name:"Revelation", unlocked:false},
  ]
};

const VERSES = {
  genesis: [{
    ref:"Genesis 1:1",
    text:"In the beginning God created the heavens and the earth.",
    literal:"Hebrew: bereshit bara elohim et hashamayim ve'et ha'aretz — \"In beginning, created God the heavens and the earth.\"",
    words:[{
      word:"created", original:"בָּרָא", translit:"bara", strongs:"H1254", pos:"verb",
      def:"To create from nothing — in the Old Testament this verb is used only with God as the subject, never a human. It marks a category of making that belongs to God alone."
    }],
    context:"The opening line of the creation account. Before describing any single act of creation, Genesis first establishes who is doing the creating — God, uncaused, existing before everything else that exists.",
    themes:["creation","God's power"]
  }],
  psalms: [{
    ref:"Psalm 23:1",
    text:"The Lord is my shepherd; I have what I need.",
    literal:"Hebrew: Adonai ro'i, lo echsar — \"The LORD [is] my shepherd, not I-will-lack.\"",
    words:[{
      word:"shepherd", original:"רֹעִי", translit:"ro'i", strongs:"H7462", pos:"noun (participle)",
      def:"One who tends, guides, feeds, and protects a flock. David, a former shepherd himself, uses the image he knew firsthand — daily presence and provision, not distant oversight."
    }],
    context:"Written by David, likely late in life, looking back on God's care across every season — from the shepherd fields of his youth to the throne of Israel.",
    themes:["trust","provision","God's care"]
  }],
  jeremiah: [{
    ref:"Jeremiah 29:11",
    text:"\"For I know the plans I have for you\" — this is the Lord's declaration — \"plans for your well-being, not for disaster, to give you a future and a hope.\"",
    literal:"Hebrew includes the word shalom — often translated \"well-being\" or \"peace,\" carrying a sense of wholeness, not merely absence of trouble.",
    words:[{
      word:"well-being", original:"שָׁלוֹם", translit:"shalom", strongs:"H7965", pos:"noun",
      def:"Far bigger than \"peace\" in the English sense of calm — shalom means completeness, soundness, everything as it should be. God's plan isn't just for the exiles to survive, but to be whole."
    }],
    context:"Part of a letter Jeremiah sent to the Jewish exiles deported to Babylon. Far from a quick rescue, God's instruction was to settle in for the long haul — 70 years — while still promising a future beyond the exile.",
    themes:["hope","God's plans","exile"]
  }],
  john: [{
    ref:"John 3:16",
    text:"For God loved the world in this way: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.",
    literal:"Greek: houtos gar egapesen ho theos ton kosmon — \"For in this way loved God the world.\" The opening phrase stresses manner (\"in this way\"), not just magnitude.",
    words:[{
      word:"loved", original:"ἠγάπησεν", translit:"ēgapēsen", strongs:"G25", pos:"verb (from agapaō)",
      def:"A deliberate, self-giving love — chosen and acted on, not merely felt. Distinct from phileo (affectionate love), agapaō describes love that gives regardless of what it costs the giver."
    }],
    context:"Spoken by Jesus during a night conversation with Nicodemus, a Pharisee and religious leader who came seeking to understand who Jesus really was. This verse sits at the center of Jesus explaining why He came at all.",
    themes:["salvation","God's love","eternal life"]
  }],
  philippians: [{
    ref:"Philippians 4:13",
    text:"I am able to do all things through him who strengthens me.",
    literal:"Greek: panta ischyo en to endynamounti me — \"All things I am strong/able in the one strengthening me.\"",
    words:[{
      word:"strengthens", original:"ἐνδυναμοῦντι", translit:"endynamounti", strongs:"G1743", pos:"verb (participle)",
      def:"To empower, infuse with strength from an outside source. The verse isn't about self-sufficiency — it's about a strength given continuously by Christ, in the middle of the sentence Paul had just spent describing contentment in hardship."
    }],
    context:"Paul writes this from prison, immediately after describing how he's learned to be content whether well-fed or hungry, in plenty or in need. The strength he means is specifically the strength to be content — not an all-purpose promise of success.",
    themes:["contentment","God's strength","perseverance"]
  }]
};

/* ============================================================
   Progress tracking — all local, nothing leaves the device
   ============================================================ */
const STORAGE_KEY = "rooted_progress_v1";
function loadProgress(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {streak:3, memorized:[], booksTouched:[], weekDone:[true,true,true,false,false,false,false]};
  }catch(e){
    return {streak:3, memorized:[], booksTouched:[], weekDone:[true,true,true,false,false,false,false]};
  }
}
function saveProgress(p){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }catch(e){
    console.warn("Rooted: couldn't save progress locally (storage may be restricted in this context).", e);
  }
}
let progress = loadProgress();

/* ============================================================
   View routing
   ============================================================ */
function showView(id){
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + id).classList.add("active");
  window.scrollTo({top:0, behavior:"smooth"});
}

function initApp(){
  console.log("Rooted: app.js loaded and running.");

  const enterBtn = document.getElementById("btn-enter");
  if(!enterBtn){ console.error("Rooted: #btn-enter not found — check index.html markup."); return; }

  enterBtn.addEventListener("click", () => {
    showView("dashboard");
    renderDashboard();
  });

  document.querySelectorAll("[data-back]").forEach(btn=>{
    btn.addEventListener("click", ()=> showView(btn.dataset.back));
  });

  document.querySelectorAll(".testament-card").forEach(card=>{
    card.addEventListener("click", ()=>{
      const t = card.dataset.testament;
      renderBookGrid(t);
      showView("books");
    });
  });
}

// Run once the DOM is ready — safe even though this script tag
// already sits at the end of <body>, and protects against the
// script being loaded a different way (e.g. injected, deferred).
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

/* ============================================================
   Dashboard
   ============================================================ */
function renderDashboard(){
  document.getElementById("stat-streak").textContent = progress.streak;
  document.getElementById("stat-memorized").textContent = progress.memorized.length;
  document.getElementById("stat-books").textContent = new Set(progress.booksTouched).size;

  const doneCount = progress.weekDone.filter(Boolean).length;
  const pct = Math.round((doneCount/7)*100);
  document.getElementById("ring-pct").textContent = pct + "%";
  const ring = document.getElementById("ring-fg");
  const circumference = 264;
  ring.style.strokeDashoffset = circumference - (circumference*pct/100);

  const days = ["S","M","T","W","T","F","S"];
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";
  days.forEach((d,i)=>{
    const done = progress.weekDone[i];
    const isToday = i === new Date().getDay();
    const el = document.createElement("div");
    el.className = "timeline-day" + (done ? " done":"") + (isToday ? " today":"");
    el.innerHTML = `<div class="timeline-dot">${done ? "✓" : ""}</div><span>${d}</span>`;
    timeline.appendChild(el);
  });

  // "continue where you left off" — first unlocked verse not yet memorized
  const allVerses = Object.entries(VERSES).flatMap(([bookId, list]) => list.map(v=>({...v, bookId})));
  const next = allVerses.find(v => !progress.memorized.includes(v.ref)) || allVerses[0];
  const tc = document.getElementById("today-card");
  tc.innerHTML = `<div><div class="tc-ref">${next.ref}</div><div class="tc-snip">${next.text.slice(0,60)}...</div></div><div class="tc-arrow">&rarr;</div>`;
  tc.onclick = () => openVerse(next.bookId, 0);
}

/* ============================================================
   Book grid
   ============================================================ */
const TILE_COLORS = ["#8CA0C4","#9CA88A","#C97B5C","#C9A25C","#D9A79C","#B89B6A"];

function renderBookGrid(testament){
  document.getElementById("books-testament-title").textContent =
    testament === "OT" ? "Old Testament" : "New Testament";
  const grid = document.getElementById("book-grid");
  grid.innerHTML = "";
  BOOKS[testament].forEach((book, i)=>{
    const tile = document.createElement("div");
    if(book.unlocked){
      tile.className = "book-tile unlocked";
      tile.style.background = TILE_COLORS[i % TILE_COLORS.length];
      tile.innerHTML = `${book.name}<small>${VERSES[book.id] ? VERSES[book.id].length : 0} verse${VERSES[book.id] && VERSES[book.id].length===1?"":"s"}</small>`;
      tile.addEventListener("click", ()=> openVerse(book.id, 0));
    } else {
      tile.className = "book-tile locked";
      tile.innerHTML = `${book.name}<small>Coming soon</small>`;
    }
    grid.appendChild(tile);
  });
}

/* ============================================================
   Verse focus page
   ============================================================ */
let currentCram = { stage: 0 }; // 0=full text, 1=key words blank, 2=most words blank, 3=type from memory

function openVerse(bookId, idx){
  const verse = VERSES[bookId][idx];
  if(!progress.booksTouched.includes(bookId)) progress.booksTouched.push(bookId);
  saveProgress(progress);

  document.getElementById("verse-book-title").textContent = verse.ref;
  currentCram = { stage: 0 };
  renderVerseCard(verse, bookId);
  showView("verse");
}

function renderVerseCard(verse, bookId){
  const card = document.getElementById("verse-card");

  // build tappable text: wrap studied words
  let displayText = verse.text;
  verse.words.forEach(w=>{
    const re = new RegExp(`\\b(${w.word})\\b`, "i");
    displayText = displayText.replace(re, `<span class="tap-word" data-word="${w.word}">$1</span>`);
  });

  card.innerHTML = `
    <div class="vc-ref">${verse.ref}</div>
    <div class="vc-text" id="vc-text">${displayText}</div>
    <div class="vc-literal">${verse.literal}</div>

    ${verse.words.map(w=>`
      <div class="word-panel" id="wp-${w.word.replace(/\s+/g,'')}">
        <span class="wp-orig">${w.original}</span><span class="wp-translit">${w.translit}</span>
        <div class="wp-meta">${w.strongs} · ${w.pos}</div>
        <div class="wp-def">${w.def}</div>
      </div>
    `).join("")}

    <div class="accordion">
      <div class="accordion-item">
        <button class="accordion-head" data-acc="context">Context <span class="chev">⌄</span></button>
        <div class="accordion-body">${verse.context}</div>
      </div>
      <div class="accordion-item">
        <button class="accordion-head" data-acc="themes">Themes <span class="chev">⌄</span></button>
        <div class="accordion-body">${verse.themes.join(" · ")}</div>
      </div>
    </div>

    <div class="cram-zone">
      <div class="cram-label">Practice</div>
      <div class="cram-text" id="cram-text">${verse.text}</div>
      <div class="cram-controls">
        <button class="btn-ghost active" data-stage="0">Read</button>
        <button class="btn-ghost" data-stage="1">Blank key words</button>
        <button class="btn-ghost" data-stage="2">First letters</button>
        <button class="btn-ghost" data-stage="3">From memory</button>
        <button class="btn-ghost" id="mark-memorized">Mark memorized ✓</button>
      </div>
    </div>
  `;

  // tap-word listeners
  card.querySelectorAll(".tap-word").forEach(el=>{
    el.addEventListener("click", ()=>{
      const w = el.dataset.word;
      const panel = document.getElementById("wp-" + w.replace(/\s+/g,''));
      document.querySelectorAll(".word-panel").forEach(p=> p!==panel && p.classList.remove("open"));
      panel.classList.toggle("open");
      panel.scrollIntoView({behavior:"smooth", block:"nearest"});
    });
  });

  // accordion listeners
  card.querySelectorAll(".accordion-head").forEach(h=>{
    h.addEventListener("click", ()=>{
      h.parentElement.classList.toggle("open");
    });
  });

  // cram stage listeners
  card.querySelectorAll("[data-stage]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      card.querySelectorAll("[data-stage]").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      applyCramStage(verse.text, parseInt(btn.dataset.stage));
    });
  });

  document.getElementById("mark-memorized").addEventListener("click", ()=>{
    if(!progress.memorized.includes(verse.ref)) progress.memorized.push(verse.ref);
    saveProgress(progress);
    document.getElementById("mark-memorized").textContent = "Memorized ✓✓";
  });
}

function applyCramStage(text, stage){
  const el = document.getElementById("cram-text");
  const words = text.split(" ");
  if(stage === 0){
    el.textContent = text;
  } else if(stage === 1){
    // blank longer/content words (rough heuristic: words > 4 letters)
    el.innerHTML = words.map(w=>{
      const clean = w.replace(/[^a-zA-Z]/g,"");
      if(clean.length > 5) return `<span class="cram-blank">&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
      return w;
    }).join(" ");
  } else if(stage === 2){
    el.innerHTML = words.map(w=>{
      const clean = w.replace(/[^a-zA-Z]/g,"");
      if(clean.length === 0) return w;
      return clean[0] + "___";
    }).join(" ");
  } else {
    el.innerHTML = `<em style="opacity:.6">Recite the verse aloud or write it out, then flip back to "Read" to check yourself.</em>`;
  }
}
