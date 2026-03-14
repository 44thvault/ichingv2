import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   易 經  I CHING — NUMOGRAMMATIC ORACLE ENGINE
   Aesthetic: CCRU Decadence technopunk (neon green / black / CRT)
   ═══════════════════════════════════════════════════════════ */

// ── HEXAGRAM DATABASE (King Wen sequence) ──
const HEXAGRAMS = [
  {n:1,name:"Ch'ien",eng:"The Creative",tri:["☰","☰"],judge:"Sublime success. Perseverance furthers.",image:"Heaven above, heaven below. Ceaseless creative force. The sage strengthens himself without rest.",lines:[1,1,1,1,1,1]},
  {n:2,name:"K'un",eng:"The Receptive",tri:["☷","☷"],judge:"Sublime success through the perseverance of a mare. The superior one has an undertaking.",image:"Earth above, earth below. The condition of receptive devotion. Boundless capacity.",lines:[0,0,0,0,0,0]},
  {n:3,name:"Chun",eng:"Difficulty at the Beginning",tri:["☵","☳"],judge:"Sublime success. Perseverance furthers. Nothing should be undertaken. Appoint helpers.",image:"Water over thunder. Clouds and thunder: the image of difficulty at the beginning.",lines:[1,0,0,0,1,0]},
  {n:4,name:"Mêng",eng:"Youthful Folly",tri:["☶","☵"],judge:"Success. I do not seek the young fool; the young fool seeks me.",image:"Mountain over water. A spring wells up at the foot of the mountain.",lines:[0,1,0,0,1,0]},
  {n:5,name:"Hsü",eng:"Waiting",tri:["☵","☰"],judge:"Sincerity leads to brilliant success. Perseverance brings good fortune. It furthers to cross the great water.",image:"Water over heaven. Clouds rise in the sky: the image of waiting.",lines:[1,1,1,0,1,0]},
  {n:6,name:"Sung",eng:"Conflict",tri:["☰","☵"],judge:"Sincerity is obstructed. A cautious halt midway brings good fortune. Going through to the end brings misfortune.",image:"Heaven over water. Their motions move in opposite directions.",lines:[0,1,0,1,1,1]},
  {n:7,name:"Shih",eng:"The Army",tri:["☷","☵"],judge:"The army needs perseverance and a strong leader. Good fortune without blame.",image:"Water within the earth. The superior one increases his masses by generosity toward the people.",lines:[0,1,0,0,0,0]},
  {n:8,name:"Pi",eng:"Holding Together",tri:["☵","☷"],judge:"Holding together brings good fortune. Those who are uncertain gradually join.",image:"Water over earth. Each king of old established states and maintained close relations with the princes.",lines:[0,0,0,0,1,0]},
  {n:9,name:"Hsiao Ch'u",eng:"Small Taming",tri:["☴","☰"],judge:"Dense clouds, no rain from our western territory. Success through gentle restraint.",image:"Wind over heaven. The superior one refines the outward aspect of his nature.",lines:[1,1,1,0,1,1]},
  {n:10,name:"Lü",eng:"Treading",tri:["☰","☱"],judge:"Treading upon the tail of the tiger. It does not bite. Success.",image:"Heaven above, lake below. The superior one discriminates between high and low.",lines:[1,1,0,1,1,1]},
  {n:11,name:"T'ai",eng:"Peace",tri:["☷","☰"],judge:"The small departs, the great approaches. Good fortune. Success.",image:"Heaven and earth unite: the image of peace. The ruler completes the way of heaven and earth.",lines:[1,1,1,0,0,0]},
  {n:12,name:"P'i",eng:"Standstill",tri:["☰","☷"],judge:"Standstill. Evil people do not further the perseverance of the superior one.",image:"Heaven and earth do not unite: the image of standstill.",lines:[0,0,0,1,1,1]},
  {n:13,name:"T'ung Jen",eng:"Fellowship",tri:["☰","☲"],judge:"Fellowship in the open. Success. It furthers to cross the great water.",image:"Heaven together with fire. The superior one organizes the clans.",lines:[1,0,1,1,1,1]},
  {n:14,name:"Ta Yu",eng:"Great Possession",tri:["☲","☰"],judge:"Supreme success.",image:"Fire in heaven above. The superior one curbs evil and furthers good.",lines:[1,1,1,1,0,1]},
  {n:15,name:"Ch'ien",eng:"Modesty",tri:["☷","☶"],judge:"Modesty creates success. The superior one carries things through.",image:"Within the earth a mountain. The superior one reduces what is too much and augments what is too little.",lines:[0,0,1,0,0,0]},
  {n:16,name:"Yü",eng:"Enthusiasm",tri:["☳","☷"],judge:"It furthers one to install helpers and to set armies marching.",image:"Thunder comes resounding out of the earth: enthusiasm. The ancient kings made music and honored merit.",lines:[0,0,0,1,0,0]},
  {n:17,name:"Sui",eng:"Following",tri:["☱","☳"],judge:"Following has supreme success. Perseverance furthers. No blame.",image:"Thunder within the lake. The superior one at nightfall goes within and rests.",lines:[1,0,0,1,1,0]},
  {n:18,name:"Ku",eng:"Work on the Decayed",tri:["☶","☴"],judge:"Supreme success. It furthers to cross the great water. Before and after the starting point, three days.",image:"Wind at the foot of the mountain. The superior one stirs up the people and strengthens their spirit.",lines:[0,1,1,0,0,1]},
  {n:19,name:"Lin",eng:"Approach",tri:["☷","☱"],judge:"Approach has supreme success. Perseverance furthers. When the eighth month comes, there is misfortune.",image:"Earth above the lake. The superior one is inexhaustible in teaching and sustaining the people.",lines:[1,1,0,0,0,0]},
  {n:20,name:"Kuan",eng:"Contemplation",tri:["☴","☷"],judge:"The ablution has been made, but not yet the offering. Full of trust, they look up.",image:"Wind blows over the earth. The kings of old visited the regions of the world and contemplated the people.",lines:[0,0,0,0,1,1]},
  {n:21,name:"Shih Ho",eng:"Biting Through",tri:["☲","☳"],judge:"Biting through has success. It is favorable to let justice be administered.",image:"Thunder and lightning: the image of biting through. The kings of old made firm the laws with penalties.",lines:[1,0,0,1,0,1]},
  {n:22,name:"Pi",eng:"Grace",tri:["☶","☲"],judge:"Grace has success. In small matters it is favorable to undertake something.",image:"Fire at the foot of the mountain. The superior one clarifies current affairs without daring to decide lawsuits.",lines:[1,0,1,0,0,1]},
  {n:23,name:"Po",eng:"Splitting Apart",tri:["☶","☷"],judge:"Splitting apart. It does not further to go anywhere.",image:"Mountain resting on the earth. Those above ensure their position by giving generously to those below.",lines:[0,0,0,0,0,1]},
  {n:24,name:"Fu",eng:"Return",tri:["☷","☳"],judge:"Return. Success. Going out and coming in without error. Companions come without blame.",image:"Thunder within the earth. The kings of old closed the passes at the time of solstice.",lines:[1,0,0,0,0,0]},
  {n:25,name:"Wu Wang",eng:"Innocence",tri:["☰","☳"],judge:"Supreme success. Perseverance furthers. If someone is not as they should be, misfortune. Nothing furthers.",image:"Under heaven, thunder rolls. All things attain the natural state of innocence.",lines:[1,0,0,1,1,1]},
  {n:26,name:"Ta Ch'u",eng:"Great Taming",tri:["☶","☰"],judge:"Perseverance furthers. Not eating at home brings good fortune. It furthers to cross the great water.",image:"Heaven within the mountain. The superior one acquaints themselves with many sayings of antiquity.",lines:[1,1,1,0,0,1]},
  {n:27,name:"I",eng:"Nourishment",tri:["☶","☳"],judge:"Perseverance brings good fortune. Pay heed to the providing of nourishment and what one seeks to fill one's mouth with.",image:"At the foot of the mountain, thunder. The superior one is careful of words and temperate in eating and drinking.",lines:[1,0,0,0,0,1]},
  {n:28,name:"Ta Kuo",eng:"Great Excess",tri:["☱","☴"],judge:"The ridgepole sags. It furthers to have somewhere to go. Success.",image:"The lake rises above the trees. The superior one stands alone without fear and withdraws from the world without regret.",lines:[0,1,1,1,1,0]},
  {n:29,name:"K'an",eng:"The Abysmal",tri:["☵","☵"],judge:"Repetition of the abysmal. Sincerity in the heart leads to success. Whatever one does has value.",image:"Water flows on, reaching the goal: the image of the abyss repeated.",lines:[0,1,0,0,1,0]},
  {n:30,name:"Li",eng:"The Clinging",tri:["☲","☲"],judge:"The clinging. Perseverance furthers. Success. Care of the cow brings good fortune.",image:"Brightness rises twice: the image of fire. The great one illuminates the four quarters of the world.",lines:[1,0,1,1,0,1]},
  {n:31,name:"Hsien",eng:"Influence",tri:["☱","☶"],judge:"Success. Perseverance furthers. To take a maiden to wife brings good fortune.",image:"A lake on the mountain. The superior one encourages people to approach through receptiveness.",lines:[0,0,1,1,1,0]},
  {n:32,name:"Hêng",eng:"Duration",tri:["☳","☴"],judge:"Success. No blame. Perseverance furthers. It furthers to have somewhere to go.",image:"Thunder and wind: the image of duration. The superior one stands firm without changing direction.",lines:[0,1,1,1,0,0]},
  {n:33,name:"Tun",eng:"Retreat",tri:["☰","☶"],judge:"Retreat. Success. In what is small, perseverance furthers.",image:"Mountain under heaven. The superior one keeps the inferior at a distance — not angrily but with reserve.",lines:[0,0,1,1,1,1]},
  {n:34,name:"Ta Chuang",eng:"Great Power",tri:["☳","☰"],judge:"Perseverance furthers.",image:"Thunder in heaven above. The superior one does not tread upon paths that are not in accord with established order.",lines:[1,1,1,1,0,0]},
  {n:35,name:"Chin",eng:"Progress",tri:["☲","☷"],judge:"The powerful prince is honored with horses in large numbers. In a single day he is granted audience three times.",image:"The sun rises over the earth. The superior one brightens their bright virtue.",lines:[0,0,0,1,0,1]},
  {n:36,name:"Ming I",eng:"Darkening of the Light",tri:["☷","☲"],judge:"In adversity it furthers to be persevering.",image:"The light has sunk into the earth. The superior one veils their light yet still shines.",lines:[1,0,1,0,0,0]},
  {n:37,name:"Chia Jen",eng:"The Family",tri:["☴","☲"],judge:"The perseverance of the woman furthers.",image:"Wind coming from fire. The superior one has substance in words and duration in conduct.",lines:[1,0,1,0,1,1]},
  {n:38,name:"K'uei",eng:"Opposition",tri:["☲","☱"],judge:"In small matters, good fortune.",image:"Fire above, the lake below. The superior one retains individuality amid community.",lines:[1,1,0,1,0,1]},
  {n:39,name:"Chien",eng:"Obstruction",tri:["☵","☶"],judge:"The southwest furthers. The northeast does not further. Seeing the great one furthers. Perseverance: good fortune.",image:"Water on the mountain. The superior one turns attention to oneself and molds character.",lines:[0,0,1,0,1,0]},
  {n:40,name:"Hsieh",eng:"Deliverance",tri:["☳","☵"],judge:"The southwest furthers. If there is no longer anything to be gained, return brings good fortune.",image:"Thunder and rain set in. The superior one pardons mistakes and forgives misdeeds.",lines:[0,1,0,1,0,0]},
  {n:41,name:"Sun",eng:"Decrease",tri:["☶","☱"],judge:"Decrease combined with sincerity brings supreme good fortune. It furthers to have somewhere to go.",image:"At the foot of the mountain, the lake. The superior one controls anger and restrains the instincts.",lines:[1,1,0,0,0,1]},
  {n:42,name:"I",eng:"Increase",tri:["☴","☳"],judge:"It furthers to undertake something. It furthers to cross the great water.",image:"Wind and thunder: the image of increase. The superior one furthers improvement without limits.",lines:[1,0,0,0,1,1]},
  {n:43,name:"Kuai",eng:"Breakthrough",tri:["☱","☰"],judge:"One must resolutely make the matter known at the court. Danger. One must notify one's own city.",image:"The lake has risen up to heaven. The superior one dispenses riches downward and refrains from resting on virtue.",lines:[1,1,1,1,1,0]},
  {n:44,name:"Kou",eng:"Coming to Meet",tri:["☰","☴"],judge:"The maiden is powerful. One should not marry such a maiden.",image:"Under heaven, wind. The prince disseminates commands and proclaims them to the four quarters.",lines:[0,1,1,1,1,1]},
  {n:45,name:"Ts'ui",eng:"Gathering Together",tri:["☱","☷"],judge:"Success. The king approaches his temple. It furthers to see the great one.",image:"Over the earth, the lake. The superior one renews their weapons to meet the unforeseen.",lines:[0,0,0,1,1,0]},
  {n:46,name:"Shêng",eng:"Pushing Upward",tri:["☷","☴"],judge:"Pushing upward has supreme success. One must see the great one. Fear not. Departure toward the south brings good fortune.",image:"Within the earth, wood grows. The superior one accumulates small things to achieve something high and great.",lines:[0,1,1,0,0,0]},
  {n:47,name:"K'un",eng:"Oppression",tri:["☱","☵"],judge:"Success. Perseverance. The great one brings good fortune. No blame. When one has something to say, it is not believed.",image:"There is no water in the lake. The superior one stakes their life on following their will.",lines:[0,1,0,1,1,0]},
  {n:48,name:"Ching",eng:"The Well",tri:["☵","☴"],judge:"The town may be changed, but not the well. It neither decreases nor increases. One may draw from the well.",image:"Water over wood: the image of the well. The superior one encourages the people and exhorts them to help one another.",lines:[0,1,1,0,1,0]},
  {n:49,name:"Ko",eng:"Revolution",tri:["☱","☲"],judge:"On your own day you are believed. Supreme success, furthering through perseverance. Remorse disappears.",image:"Fire in the lake. The superior one sets the calendar in order and makes the seasons clear.",lines:[1,0,1,1,1,0]},
  {n:50,name:"Ting",eng:"The Cauldron",tri:["☲","☴"],judge:"Supreme good fortune. Success.",image:"Fire over wood: the image of the cauldron. The superior one consolidates fate by making position correct.",lines:[0,1,1,1,0,1]},
  {n:51,name:"Chên",eng:"The Arousing",tri:["☳","☳"],judge:"Shock brings success. Shock comes — oh, oh! Laughing words — ha, ha! The shock terrifies for a hundred miles.",image:"Thunder repeated: the image of shock. The superior one through anxiety and fear sets life in order.",lines:[1,0,0,1,0,0]},
  {n:52,name:"Kên",eng:"Keeping Still",tri:["☶","☶"],judge:"Keeping the back still so that one no longer feels the body. Going into the courtyard, one does not see the people. No blame.",image:"Mountains standing close together. The superior one does not permit thoughts to go beyond the situation.",lines:[0,0,1,0,0,1]},
  {n:53,name:"Chien",eng:"Development",tri:["☴","☶"],judge:"The maiden is given in marriage. Good fortune. Perseverance furthers.",image:"On the mountain, a tree. The superior one abides in dignity and virtue in order to improve the mores.",lines:[0,0,1,0,1,1]},
  {n:54,name:"Kuei Mei",eng:"The Marrying Maiden",tri:["☳","☱"],judge:"Undertakings bring misfortune. Nothing that would further.",image:"Thunder over the lake. The superior one understands the transitory in the light of the eternal.",lines:[1,1,0,1,0,0]},
  {n:55,name:"Fêng",eng:"Abundance",tri:["☳","☲"],judge:"Abundance has success. The king attains abundance. Be not sad. Be like the sun at midday.",image:"Both thunder and lightning come. The superior one decides lawsuits and carries out punishments.",lines:[1,0,1,1,0,0]},
  {n:56,name:"Lü",eng:"The Wanderer",tri:["☲","☶"],judge:"Success through smallness. Perseverance brings good fortune to the wanderer.",image:"Fire on the mountain. The superior one is clear-minded and cautious in imposing penalties.",lines:[0,0,1,1,0,1]},
  {n:57,name:"Sun",eng:"The Gentle",tri:["☴","☴"],judge:"The gentle. Success through what is small. It furthers to have somewhere to go. It furthers to see the great one.",image:"Winds following one upon the other. The superior one spreads commands abroad and carries out undertakings.",lines:[0,1,1,0,1,1]},
  {n:58,name:"Tui",eng:"The Joyous",tri:["☱","☱"],judge:"The joyous. Success. Perseverance is favorable.",image:"Lakes resting one on the other. The superior one joins with friends for discussion and practice.",lines:[1,1,0,1,1,0]},
  {n:59,name:"Huan",eng:"Dispersion",tri:["☴","☵"],judge:"Success. The king approaches his temple. It furthers to cross the great water. Perseverance furthers.",image:"Wind blows over water. The kings of old sacrificed to the Lord and built temples.",lines:[0,1,0,0,1,1]},
  {n:60,name:"Chieh",eng:"Limitation",tri:["☵","☱"],judge:"Success. Galling limitation must not be persevered in.",image:"Water over lake. The superior one creates number and measure and examines the nature of virtue and correct conduct.",lines:[1,1,0,0,1,0]},
  {n:61,name:"Chung Fu",eng:"Inner Truth",tri:["☴","☱"],judge:"Inner truth. Pigs and fishes. Good fortune. It furthers to cross the great water. Perseverance furthers.",image:"Wind over lake. The superior one discusses criminal cases in order to delay executions.",lines:[1,1,0,0,1,1]},
  {n:62,name:"Hsiao Kuo",eng:"Small Excess",tri:["☳","☶"],judge:"Small excess. Success. Perseverance furthers. Small things may be done; great things should not be done.",image:"Thunder on the mountain. The superior one gives excess to reverence, to grief in bereavement, to frugality in expenditure.",lines:[0,0,1,1,0,0]},
  {n:63,name:"Chi Chi",eng:"After Completion",tri:["☵","☲"],judge:"Success in small matters. Perseverance furthers. Good fortune at the beginning, disorder at the end.",image:"Water over fire. The superior one takes thought of misfortune and arms against it in advance.",lines:[1,0,1,0,1,0]},
  {n:64,name:"Wei Chi",eng:"Before Completion",tri:["☲","☵"],judge:"Success. But if the little fox, after nearly completing the crossing, gets its tail in the water, there is nothing that would further.",image:"Fire over water. The superior one carefully discriminates among things to give each its place.",lines:[0,1,0,1,0,1]},
];

// ── TRIGRAM DATA ──
const TRIGRAMS = {
  "111": { name: "Ch'ien", sym: "☰", nature: "Heaven", attr: "Creative" },
  "000": { name: "K'un", sym: "☷", nature: "Earth", attr: "Receptive" },
  "100": { name: "Chên", sym: "☳", nature: "Thunder", attr: "Arousing" },
  "010": { name: "K'an", sym: "☵", nature: "Water", attr: "Abysmal" },
  "001": { name: "Kên", sym: "☶", nature: "Mountain", attr: "Keeping Still" },
  "011": { name: "Sun", sym: "☴", nature: "Wind", attr: "Gentle" },
  "101": { name: "Li", sym: "☲", nature: "Fire", attr: "Clinging" },
  "110": { name: "Tui", sym: "☱", nature: "Lake", attr: "Joyous" },
};

// King Wen lookup: [lower_trigram_binary][upper_trigram_binary] -> hexagram number
const KING_WEN = {
  "111-111":1,"000-000":2,"100-010":3,"010-001":4,"111-010":5,"010-111":6,
  "000-010":7,"010-000":8,"111-011":9,"110-111":10,"111-000":11,"000-111":12,
  "101-111":13,"111-101":14,"000-001":15,"100-000":16,"110-100":17,"001-011":18,
  "110-000":19,"000-011":20,"101-100":21,"001-101":22,"000-001":23,"100-000":24,
  "100-111":25,"111-001":26,"100-001":27,"011-110":28,"010-010":29,"101-101":30,
  "001-110":31,"011-100":32,"001-111":33,"111-100":34,"000-101":35,"101-000":36,
  "011-101":37,"101-110":38,"010-001":39,"100-010":40,"110-001":41,"011-100":42,
  "111-110":43,"011-111":44,"000-110":45,"011-000":46,"110-010":47,"010-011":48,
  "110-101":49,"101-011":50,"100-100":51,"001-001":52,"001-011":53,"110-100":54,
  "101-100":55,"001-101":56,"011-011":57,"110-110":58,"011-010":59,"010-110":60,
  "011-110":61,"100-001":62,"010-101":63,"101-010":64,
};

function lookupHexagram(lines) {
  // lines[0] = bottom, lines[5] = top
  const lower = lines.slice(0, 3).map(l => l.yang ? 1 : 0).join("");
  const upper = lines.slice(3, 6).map(l => l.yang ? 1 : 0).join("");
  const key = `${lower}-${upper}`;
  // Direct lookup might miss due to King Wen complexity, so match by line pattern
  const pattern = lines.map(l => l.yang ? 1 : 0);
  const hex = HEXAGRAMS.find(h => 
    h.lines[0] === pattern[0] && h.lines[1] === pattern[1] && h.lines[2] === pattern[2] &&
    h.lines[3] === pattern[3] && h.lines[4] === pattern[4] && h.lines[5] === pattern[5]
  );
  return hex || HEXAGRAMS[0];
}

// ── COIN THROW SIMULATION ──
// 3 coins: heads=3, tails=2. Sum determines line:
// 6 = old yin (changing), 7 = young yang, 8 = young yin, 9 = old yang (changing)
function throwCoins() {
  const coins = [0,1,2].map(() => Math.random() < 0.5 ? 3 : 2);
  const sum = coins[0] + coins[1] + coins[2];
  return {
    coins,
    sum,
    yang: sum === 7 || sum === 9,
    changing: sum === 6 || sum === 9,
    lineType: sum === 6 ? "old_yin" : sum === 7 ? "young_yang" : sum === 8 ? "young_yin" : "old_yang"
  };
}

// ── PARTICLE SYSTEM ──
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = window.innerWidth;
    let h = c.height = window.innerHeight;
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
    }));
    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0f3";
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.globalAlpha = 0.3;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      // connections
      ctx.strokeStyle = "#0f3";
      ctx.lineWidth = 0.3;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.globalAlpha = (1 - dist / 120) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} />;
}

// ── ASCII COIN COMPONENT ──
const COIN_HEADS = [
  "   ┌───────┐   ",
  "  │ ╔═════╗ │  ",
  " │  ║  ☰  ║  │ ",
  " │  ║ ─── ║  │ ",
  " │  ║ YAO ║  │ ",
  " │  ║  3  ║  │ ",
  "  │ ╚═════╝ │  ",
  "   └───────┘   ",
];
const COIN_TAILS = [
  "   ┌───────┐   ",
  "  │ ╔═════╗ │  ",
  " │  ║  ☷  ║  │ ",
  " │  ║ ─ ─ ║  │ ",
  " │  ║ YIN ║  │ ",
  " │  ║  2  ║  │ ",
  "  │ ╚═════╝ │  ",
  "   └───────┘   ",
];
const COIN_SPINNING = [
  ["  ──────────  ", "  │        │  ", "  │  ≋≋≋≋  │  ", "  │  ≋≋≋≋  │  ", "  │        │  ", "  ──────────  "],
  ["    │    │    ", "    │╱╲╱│    ", "    │╲╱╲│    ", "    │    │    "],
  ["      ││      ", "      ││      ", "      ││      "],
  ["    │    │    ", "    │╲╱╲│    ", "    │╱╲╱│    ", "    │    │    "],
];

function AnimatedCoin({ result, spinning, delay = 0 }) {
  const [frame, setFrame] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!spinning) { setDone(false); setFrame(0); return; }
    let f = 0;
    const startTime = Date.now();
    const iv = setInterval(() => {
      if (Date.now() - startTime < delay) return;
      f++;
      setFrame(f % COIN_SPINNING.length);
      if (f > 12 + Math.random() * 6) {
        clearInterval(iv);
        setDone(true);
      }
    }, 80);
    return () => clearInterval(iv);
  }, [spinning, delay]);

  const lines = done && result !== null
    ? (result === 3 ? COIN_HEADS : COIN_TAILS)
    : spinning
    ? COIN_SPINNING[frame % COIN_SPINNING.length]
    : ["", "   ⌁ ⌁ ⌁   ", ""];

  return (
    <pre style={{
      fontFamily: "'Courier New', monospace",
      fontSize: "clamp(7px, 2vw, 11px)",
      lineHeight: 1.2,
      color: done ? (result === 3 ? "#0f3" : "#0a8") : "#0f3",
      textShadow: done ? `0 0 8px ${result === 3 ? "#0f3" : "#0a8"}` : "0 0 4px #0f3",
      textAlign: "center",
      margin: 0,
      padding: "4px 0",
      opacity: done ? 1 : 0.7,
      transition: "opacity 0.3s",
      minHeight: "80px",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      {lines.map((l, i) => <span key={i}>{l}</span>)}
    </pre>
  );
}

// ── HEXAGRAM LINE DISPLAY ──
function HexagramLine({ yang, changing, revealed, animDelay }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => setShow(true), animDelay);
      return () => clearTimeout(t);
    }
  }, [revealed, animDelay]);

  if (!show) return (
    <div style={{ height: 22, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.15 }}>
      <span style={{ fontFamily: "monospace", color: "#0f3", fontSize: 10, letterSpacing: 6 }}>· · · · · · · · ·</span>
    </div>
  );

  const lineColor = changing ? "#ff0" : "#0f3";
  const glow = changing ? "0 0 12px #ff0, 0 0 24px #ff044" : "0 0 8px #0f3";

  return (
    <div style={{
      height: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
      animation: "lineReveal 0.4s ease-out",
    }}>
      {yang ? (
        <div style={{
          width: "clamp(120px, 50vw, 220px)", height: 5, background: lineColor,
          boxShadow: glow, borderRadius: 1,
          position: "relative",
        }}>
          {changing && <span style={{
            position: "absolute", right: -20, top: -5, fontSize: 10, color: "#ff0",
            fontFamily: "monospace", textShadow: "0 0 6px #ff0"
          }}>○</span>}
        </div>
      ) : (
        <div style={{ display: "flex", gap: "clamp(14px, 4vw, 28px)", alignItems: "center" }}>
          <div style={{
            width: "clamp(48px, 20vw, 92px)", height: 5, background: lineColor,
            boxShadow: glow, borderRadius: 1,
          }} />
          <div style={{
            width: "clamp(48px, 20vw, 92px)", height: 5, background: lineColor,
            boxShadow: glow, borderRadius: 1,
          }} />
          {changing && <span style={{
            fontSize: 10, color: "#ff0", fontFamily: "monospace", textShadow: "0 0 6px #ff0", marginLeft: -4,
          }}>✕</span>}
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──
export default function IChing() {
  const [phase, setPhase] = useState("intro"); // intro | question | throwing | reading
  const [throwSub, setThrowSub] = useState("ready"); // ready | animating | result
  const [question, setQuestion] = useState("");
  const [currentThrow, setCurrentThrow] = useState(0); // 0-5
  const [lines, setLines] = useState([]);
  const [coinResult, setCoinResult] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [hexagram, setHexagram] = useState(null);
  const [relatingHex, setRelatingHex] = useState(null);
  const [glitch, setGlitch] = useState(false);
  const [showReading, setShowReading] = useState(false);

  // Refs to avoid stale closures in timeouts
  const linesRef = useRef([]);
  const throwRef = useRef(0);
  linesRef.current = lines;
  throwRef.current = currentThrow;

  // Glitch effect
  useEffect(() => {
    const iv = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100 + Math.random() * 150);
    }, 4000 + Math.random() * 6000);
    return () => clearInterval(iv);
  }, []);

  const startConsultation = () => {
    setPhase("question");
    setThrowSub("ready");
    setCurrentThrow(0);
    setLines([]);
    linesRef.current = [];
    throwRef.current = 0;
    setCoinResult(null);
    setSpinning(false);
    setHexagram(null);
    setRelatingHex(null);
    setShowReading(false);
  };

  const beginThrow = () => {
    if (throwRef.current >= 6) return;
    setPhase("throwing");
    setThrowSub("animating");
    setSpinning(true);
    setCoinResult(null);
    const result = throwCoins();
    setTimeout(() => {
      setCoinResult(result);
      setSpinning(false);
      // Record the line after a brief display pause
      setTimeout(() => {
        const newLines = [...linesRef.current, result];
        setLines(newLines);
        linesRef.current = newLines;
        const next = throwRef.current + 1;
        setCurrentThrow(next);
        throwRef.current = next;
        if (next >= 6) {
          // All 6 lines thrown — compute hexagram
          const hex = lookupHexagram(newLines);
          setHexagram(hex);
          const hasChanging = newLines.some(l => l.changing);
          if (hasChanging) {
            const changedLines = newLines.map(l => ({
              ...l,
              yang: l.changing ? !l.yang : l.yang,
              changing: false,
            }));
            const rel = lookupHexagram(changedLines);
            setRelatingHex(rel);
          }
          setTimeout(() => {
            setPhase("reading");
            setTimeout(() => setShowReading(true), 800);
          }, 600);
        } else {
          // Show result and wait for user to click next
          setThrowSub("result");
        }
      }, 800);
    }, 1500 + Math.random() * 800);
  };

  const lineLabels = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];
  const lineTypeNames = { old_yin: "OLD YIN ⚋⚋ [6]", young_yang: "YOUNG YANG ⚊ [7]", young_yin: "YOUNG YIN ⚋ [8]", old_yang: "OLD YANG ⚊⚊ [9]" };

  return (
    <div style={{
      minHeight: "100vh", background: "#000", color: "#0f3",
      fontFamily: "'Courier New', 'Lucida Console', monospace",
      position: "relative", overflow: "hidden",
    }}>
      {/* CRT scanlines */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)",
      }} />
      {/* Vignette */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
      }} />

      <ParticleCanvas />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 600, margin: "0 auto", padding: "20px 16px" }}>

        {/* ═══ TITLE ═══ */}
        <header style={{ textAlign: "center", padding: "30px 0 20px" }}>
          <div style={{
            fontSize: "clamp(8px, 2.2vw, 11px)", letterSpacing: 8, color: "#0a5", marginBottom: 12,
          }}>NUMOGRAMMATIC DIVINATION ENGINE</div>
          <h1 style={{
            fontSize: "clamp(28px, 8vw, 52px)", fontWeight: 400, letterSpacing: "0.15em",
            margin: "0 0 4px", lineHeight: 1,
            textShadow: glitch ? "-2px 0 #f00, 2px 0 #0ff" : "0 0 20px #0f3, 0 0 40px #0f388, 0 0 60px #0f322",
            transform: glitch ? `translate(${Math.random()*4-2}px, ${Math.random()*2-1}px)` : "none",
            transition: glitch ? "none" : "text-shadow 0.3s",
          }}>
            易 經
          </h1>
          <div style={{
            fontSize: "clamp(14px, 4vw, 22px)", letterSpacing: "0.35em", color: "#0f3",
            textShadow: "0 0 10px #0f3",
            transform: glitch ? "skewX(-2deg)" : "none",
          }}>I CHING</div>
          <div style={{ fontSize: 8, color: "#073", letterSpacing: 4, marginTop: 8 }}>
            BOOK OF CHANGES ⌁ ORACLE PROTOCOL v1.0
          </div>
        </header>

        {/* ═══ INTRO ═══ */}
        {phase === "intro" && (
          <div style={{ textAlign: "center", padding: "30px 0", animation: "fadeIn 1s ease-out" }}>
            <div style={{
              border: "1px solid #0f3", borderRadius: 2, padding: "24px 20px", marginBottom: 24,
              background: "rgba(0,255,51,0.02)", boxShadow: "inset 0 0 30px rgba(0,255,51,0.03)",
            }}>
              <div style={{ fontSize: 9, color: "#0a5", letterSpacing: 4, marginBottom: 12 }}>DIVINATION METHOD</div>
              <pre style={{
                fontSize: "clamp(8px, 2vw, 11px)", color: "#0f3", lineHeight: 1.8, margin: 0,
                textShadow: "0 0 4px #0f3",
              }}>{`
  ╔══════════════════════════════════╗
  ║   THREE COINS × SIX THROWS     ║
  ║                                 ║
  ║   ☰ HEADS = 3   ☷ TAILS = 2    ║
  ║                                 ║
  ║   SUM 6 → OLD YIN    ⚋⚋ ✕     ║
  ║   SUM 7 → YOUNG YANG ⚊        ║
  ║   SUM 8 → YOUNG YIN  ⚋        ║
  ║   SUM 9 → OLD YANG   ⚊⚊ ○     ║
  ║                                 ║
  ║   CHANGING LINES REVEAL THE     ║
  ║   RELATING HEXAGRAM             ║
  ╚══════════════════════════════════╝
`}</pre>
            </div>
            <button onClick={startConsultation} style={{
              padding: "14px 40px", background: "transparent",
              border: "1px solid #0f3", color: "#0f3",
              fontFamily: "monospace", fontSize: 12, letterSpacing: 6,
              cursor: "pointer", borderRadius: 2,
              boxShadow: "0 0 15px #0f318, inset 0 0 15px #0f308",
              transition: "all 0.3s",
            }}
            onMouseOver={e => { e.target.style.boxShadow = "0 0 25px #0f340, inset 0 0 25px #0f315"; e.target.style.textShadow = "0 0 10px #0f3"; }}
            onMouseOut={e => { e.target.style.boxShadow = "0 0 15px #0f318, inset 0 0 15px #0f308"; e.target.style.textShadow = "none"; }}
            >
              CONSULT THE ORACLE
            </button>
          </div>
        )}

        {/* ═══ QUESTION ═══ */}
        {phase === "question" && (
          <div style={{ textAlign: "center", padding: "20px 0", animation: "fadeIn 0.6s ease-out" }}>
            <div style={{ fontSize: 9, color: "#0a5", letterSpacing: 4, marginBottom: 16 }}>FORMULATE YOUR INQUIRY</div>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Enter your question for the oracle..."
              style={{
                width: "100%", maxWidth: 400, height: 80, background: "rgba(0,255,51,0.03)",
                border: "1px solid #0f340", borderRadius: 2, color: "#0f3",
                fontFamily: "monospace", fontSize: 12, padding: 12, resize: "none",
                outline: "none", boxShadow: "inset 0 0 20px rgba(0,255,51,0.03)",
              }}
              onFocus={e => e.target.style.borderColor = "#0f3"}
              onBlur={e => e.target.style.borderColor = "#0f340"}
            />
            <div style={{ marginTop: 16 }}>
              <button onClick={beginThrow} style={{
                padding: "12px 32px", background: "transparent",
                border: "1px solid #0f3", color: "#0f3",
                fontFamily: "monospace", fontSize: 11, letterSpacing: 5,
                cursor: "pointer", borderRadius: 2,
                boxShadow: "0 0 15px #0f318",
              }}>
                CAST COINS
              </button>
            </div>
            <div style={{ fontSize: 8, color: "#052", marginTop: 12, letterSpacing: 2 }}>
              THROW {currentThrow + 1} OF 6 ⌁ {lines.length === 0 ? "FIRST LINE (BOTTOM)" : `LINE ${currentThrow + 1}`}
            </div>
          </div>
        )}

        {/* ═══ THROWING ═══ */}
        {phase === "throwing" && (
          <div style={{ textAlign: "center", padding: "10px 0", animation: "fadeIn 0.3s ease-out" }}>
            {question && (
              <div style={{
                fontSize: 9, color: "#073", letterSpacing: 2, marginBottom: 12,
                padding: "6px 12px", border: "1px solid #0f315", borderRadius: 2,
                background: "rgba(0,255,51,0.02)", maxWidth: 400, margin: "0 auto 16px",
              }}>
                "{question.length > 60 ? question.slice(0, 60) + "..." : question}"
              </div>
            )}

            <div style={{ fontSize: 9, color: "#0a5", letterSpacing: 4, marginBottom: 8 }}>
              {throwSub === "result" ? `THROW ${currentThrow} COMPLETE` : throwSub === "animating" ? `THROWING COINS — LINE ${currentThrow + 1} OF 6` : `READY — LINE ${currentThrow + 1} OF 6`}
            </div>

            {/* Coins display */}
            <div style={{
              display: "flex", justifyContent: "center", gap: "clamp(4px, 2vw, 12px)",
              margin: "12px 0",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  border: "1px solid #0f325", borderRadius: 2, padding: 4,
                  background: "rgba(0,255,51,0.02)", minWidth: "clamp(80px, 25vw, 130px)",
                }}>
                  <AnimatedCoin
                    result={coinResult ? coinResult.coins[i] : null}
                    spinning={spinning}
                    delay={i * 200}
                  />
                </div>
              ))}
            </div>

            {/* Throw result */}
            {coinResult && (
              <div style={{
                animation: "fadeIn 0.5s ease-out", marginTop: 8, marginBottom: 16,
                padding: "10px 16px", border: "1px solid #0f330",
                background: "rgba(0,255,51,0.03)", borderRadius: 2,
              }}>
                <div style={{ fontSize: 11, color: "#0f3", letterSpacing: 3, marginBottom: 4 }}>
                  SUM: {coinResult.coins.join(" + ")} = {coinResult.sum}
                </div>
                <div style={{
                  fontSize: 10, letterSpacing: 2,
                  color: coinResult.changing ? "#ff0" : "#0f3",
                  textShadow: coinResult.changing ? "0 0 8px #ff0" : "0 0 4px #0f3",
                }}>
                  {lineLabels[currentThrow - 1]} LINE → {lineTypeNames[coinResult.lineType]}
                  {coinResult.changing && " ⚡ CHANGING"}
                </div>
              </div>
            )}

            {/* Hexagram building */}
            <div style={{
              margin: "16px auto", padding: "12px 20px",
              border: "1px solid #0f315", borderRadius: 2,
              background: "rgba(0,0,0,0.4)", maxWidth: 300,
            }}>
              <div style={{ fontSize: 8, color: "#0a5", letterSpacing: 4, marginBottom: 10, textAlign: "center" }}>
                HEXAGRAM FORMING
              </div>
              <div style={{ display: "flex", flexDirection: "column-reverse", gap: 3 }}>
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <HexagramLine
                    key={i}
                    yang={lines[i]?.yang}
                    changing={lines[i]?.changing}
                    revealed={i < lines.length}
                    animDelay={0}
                  />
                ))}
              </div>
            </div>

            {/* Next throw button */}
            {throwSub === "result" && currentThrow < 6 && (
              <button onClick={beginThrow} style={{
                padding: "10px 28px", background: "transparent",
                border: "1px solid #0f3", color: "#0f3",
                fontFamily: "monospace", fontSize: 11, letterSpacing: 4,
                cursor: "pointer", borderRadius: 2, marginTop: 8,
                boxShadow: "0 0 12px #0f318",
                animation: "fadeIn 0.5s ease-out",
              }}>
                {currentThrow < 5 ? `THROW LINE ${currentThrow + 1}` : "FINAL THROW"}
              </button>
            )}
          </div>
        )}

        {/* ═══ READING ═══ */}
        {phase === "reading" && hexagram && (
          <div style={{ padding: "10px 0 40px", animation: "fadeIn 0.8s ease-out" }}>
            {question && (
              <div style={{
                textAlign: "center", fontSize: 9, color: "#073", letterSpacing: 2, marginBottom: 16,
                padding: "6px 12px", border: "1px solid #0f315", borderRadius: 2,
                background: "rgba(0,255,51,0.02)",
              }}>
                "{question}"
              </div>
            )}

            {/* Primary hexagram */}
            <div style={{
              border: "1px solid #0f3", borderRadius: 2, padding: "20px 16px",
              background: "rgba(0,255,51,0.02)", boxShadow: "0 0 30px #0f308, inset 0 0 30px #0f305",
              marginBottom: 20,
            }}>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 8, color: "#0a5", letterSpacing: 6 }}>PRIMARY HEXAGRAM</div>
                <div style={{
                  fontSize: "clamp(40px, 10vw, 64px)", margin: "8px 0",
                  textShadow: "0 0 20px #0f3, 0 0 40px #0f366",
                  animation: showReading ? "pulseGlow 3s ease-in-out infinite" : "none",
                }}>{hexagram.tri[0]}<br />{hexagram.tri[1]}</div>
                <div style={{
                  fontSize: "clamp(18px, 5vw, 28px)", letterSpacing: "0.2em", fontWeight: 400,
                  textShadow: "0 0 12px #0f3",
                }}>
                  {hexagram.n}. {hexagram.name}
                </div>
                <div style={{ fontSize: "clamp(11px, 3vw, 15px)", color: "#0a8", letterSpacing: 4, marginTop: 4 }}>
                  {hexagram.eng.toUpperCase()}
                </div>
              </div>

              {/* Hexagram lines display */}
              <div style={{
                margin: "16px auto", padding: "12px 20px",
                border: "1px solid #0f320", borderRadius: 2,
                background: "rgba(0,0,0,0.3)", maxWidth: 300,
              }}>
                <div style={{ display: "flex", flexDirection: "column-reverse", gap: 4 }}>
                  {lines.map((l, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 8, color: "#052", width: 14, textAlign: "right", flexShrink: 0 }}>{i + 1}</span>
                      <HexagramLine yang={l.yang} changing={l.changing} revealed={true} animDelay={i * 150} />
                      <span style={{ fontSize: 7, color: l.changing ? "#ff0" : "#052", width: 20, flexShrink: 0 }}>
                        [{l.sum}]
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Judgment */}
              {showReading && (
                <div style={{ animation: "fadeIn 1s ease-out" }}>
                  <div style={{
                    margin: "16px 0", padding: "14px",
                    borderLeft: "2px solid #0f3", background: "rgba(0,255,51,0.02)",
                  }}>
                    <div style={{ fontSize: 8, color: "#0a5", letterSpacing: 4, marginBottom: 8 }}>THE JUDGMENT</div>
                    <div style={{ fontSize: "clamp(11px, 3vw, 14px)", lineHeight: 1.8, color: "#0f3", textShadow: "0 0 3px #0f3" }}>
                      {hexagram.judge}
                    </div>
                  </div>

                  {/* Image */}
                  <div style={{
                    margin: "12px 0", padding: "14px",
                    borderLeft: "2px solid #0a5", background: "rgba(0,255,51,0.015)",
                  }}>
                    <div style={{ fontSize: 8, color: "#0a5", letterSpacing: 4, marginBottom: 8 }}>THE IMAGE</div>
                    <div style={{ fontSize: "clamp(10px, 2.5vw, 13px)", lineHeight: 1.8, color: "#0a8" }}>
                      {hexagram.image}
                    </div>
                  </div>

                  {/* Changing lines detail */}
                  {lines.some(l => l.changing) && (
                    <div style={{
                      margin: "12px 0", padding: "14px",
                      borderLeft: "2px solid #ff0", background: "rgba(255,255,0,0.02)",
                    }}>
                      <div style={{ fontSize: 8, color: "#aa0", letterSpacing: 4, marginBottom: 8 }}>CHANGING LINES</div>
                      {lines.map((l, i) => l.changing ? (
                        <div key={i} style={{ fontSize: 10, color: "#ff0", marginBottom: 4, lineHeight: 1.6, textShadow: "0 0 4px #ff044" }}>
                          ⚡ {lineLabels[i]} line ({l.yang ? "Yang→Yin" : "Yin→Yang"}): Movement and transformation at position {i + 1}.
                        </div>
                      ) : null)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Relating hexagram */}
            {showReading && relatingHex && (
              <div style={{
                border: "1px solid #ff044", borderRadius: 2, padding: "20px 16px",
                background: "rgba(255,255,0,0.02)", boxShadow: "0 0 20px #ff008",
                marginBottom: 20, animation: "fadeIn 1.2s ease-out",
              }}>
                <div style={{ textAlign: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 8, color: "#aa0", letterSpacing: 6 }}>RELATING HEXAGRAM</div>
                  <div style={{ fontSize: 7, color: "#660", letterSpacing: 3, marginTop: 2 }}>WHERE THE SITUATION IS HEADING</div>
                  <div style={{
                    fontSize: "clamp(32px, 8vw, 48px)", margin: "8px 0",
                    textShadow: "0 0 15px #ff0, 0 0 30px #ff044",
                    color: "#ff0",
                  }}>{relatingHex.tri[0]}<br />{relatingHex.tri[1]}</div>
                  <div style={{
                    fontSize: "clamp(16px, 4vw, 24px)", letterSpacing: "0.2em", color: "#ff0",
                    textShadow: "0 0 8px #ff0",
                  }}>
                    {relatingHex.n}. {relatingHex.name}
                  </div>
                  <div style={{ fontSize: "clamp(10px, 2.5vw, 13px)", color: "#aa0", letterSpacing: 3, marginTop: 4 }}>
                    {relatingHex.eng.toUpperCase()}
                  </div>
                </div>

                <div style={{
                  margin: "12px 0", padding: "14px",
                  borderLeft: "2px solid #ff044", background: "rgba(255,255,0,0.015)",
                }}>
                  <div style={{ fontSize: 8, color: "#aa0", letterSpacing: 4, marginBottom: 8 }}>JUDGMENT</div>
                  <div style={{ fontSize: "clamp(10px, 2.5vw, 13px)", lineHeight: 1.8, color: "#ff0" }}>
                    {relatingHex.judge}
                  </div>
                </div>
              </div>
            )}

            {/* Consult again */}
            {showReading && (
              <div style={{ textAlign: "center", marginTop: 24, animation: "fadeIn 1.5s ease-out" }}>
                <button onClick={startConsultation} style={{
                  padding: "12px 32px", background: "transparent",
                  border: "1px solid #0f3", color: "#0f3",
                  fontFamily: "monospace", fontSize: 11, letterSpacing: 5,
                  cursor: "pointer", borderRadius: 2,
                  boxShadow: "0 0 15px #0f318",
                }}>
                  NEW CONSULTATION
                </button>
                <button onClick={() => setPhase("intro")} style={{
                  padding: "12px 24px", background: "transparent",
                  border: "1px solid #44444440", color: "#666",
                  fontFamily: "monospace", fontSize: 10, letterSpacing: 3,
                  cursor: "pointer", borderRadius: 2, marginLeft: 12,
                }}>
                  RETURN
                </button>
              </div>
            )}
          </div>
        )}

        {/* ═══ FOOTER ═══ */}
        <footer style={{
          textAlign: "center", padding: "40px 0 20px",
          borderTop: "1px solid #111", marginTop: 40,
        }}>
          <div style={{ fontSize: 8, color: "#333", letterSpacing: 4, lineHeight: 2 }}>
            SYSTEM DERIVED FROM THE BOOK OF CHANGES<br />
            THREE-COIN METHOD ⌁ KING WEN SEQUENCE<br />
            NUMOGRAMMATIC ORACLE ENGINE v1.0
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineReveal {
          from { opacity: 0; transform: scaleX(0); }
          to { opacity: 1; transform: scaleX(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { text-shadow: 0 0 20px #0f3, 0 0 40px #0f366; }
          50% { text-shadow: 0 0 30px #0f3, 0 0 60px #0f388, 0 0 80px #0f344; }
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: #000; }
        textarea::placeholder { color: #0f330; }
        button:hover { opacity: 0.9; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #0f330; }
      `}</style>
    </div>
  );
}
