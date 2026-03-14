import { useState, useEffect, useRef, useCallback } from "react";

const PURPLE = "#b44aff";
const PURPLE_DIM = "#7a2db8";
const PURPLE_GLOW = "0 0 12px #b44aff, 0 0 24px #b44aff44";
const GREEN = "#0f3";

const HEXAGRAMS = [
  {n:1,name:"Ch'ien",eng:"The Creative",tri:["☰","☰"],judge:"Sublime success. Perseverance furthers.",image:"Heaven above, heaven below. Ceaseless creative force. The sage strengthens himself without rest.",lines:[1,1,1,1,1,1],explain:"This hexagram represents pure creative power — the energy that starts things, drives ambition, and shapes reality. It's telling you that you have tremendous creative potential right now. The key is to use this power wisely and persistently, not recklessly. Think of it like a strong wind at your back — it will carry you far, but only if you hold a steady course."},
  {n:2,name:"K'un",eng:"The Receptive",tri:["☷","☷"],judge:"Sublime success through the perseverance of a mare. The superior one has an undertaking.",image:"Earth above, earth below. The condition of receptive devotion. Boundless capacity.",lines:[0,0,0,0,0,0],explain:"The Receptive is the complement to The Creative — it represents openness, acceptance, and the power of yielding. Rather than forcing things to happen, this hexagram advises you to be like fertile earth: receive what comes, nurture it, and let things grow naturally. Strength here comes from patience and support, not from pushing forward."},
  {n:3,name:"Chun",eng:"Difficulty at the Beginning",tri:["☵","☳"],judge:"Sublime success. Perseverance furthers. Nothing should be undertaken. Appoint helpers.",image:"Water over thunder. Clouds and thunder: the image of difficulty at the beginning.",lines:[1,0,0,0,1,0],explain:"Like a seed pushing through frozen ground, you're in the difficult early stages of something new. This is the chaos that always precedes creation. Don't rush — the oracle advises seeking help and being patient. The difficulty is temporary and natural, like the storm before the clearing."},
  {n:4,name:"Mêng",eng:"Youthful Folly",tri:["☶","☵"],judge:"Success. I do not seek the young fool; the young fool seeks me.",image:"Mountain over water. A spring wells up at the foot of the mountain.",lines:[0,1,0,0,1,0],explain:"This hexagram speaks of inexperience — not as a flaw, but as a starting point. Like a student approaching a teacher, the key is genuine willingness to learn. If you're asking the same question repeatedly hoping for a different answer, the oracle won't respond. Be open, be humble, and accept the lesson."},
  {n:5,name:"Hsü",eng:"Waiting",tri:["☵","☰"],judge:"Sincerity leads to brilliant success. Perseverance brings good fortune. It furthers to cross the great water.",image:"Water over heaven. Clouds rise in the sky: the image of waiting.",lines:[1,1,1,0,1,0],explain:"Rain clouds are gathering but the storm hasn't broken yet. This is a time of necessary waiting — not passive idleness, but active patience. Nourish yourself, prepare, and trust that the right moment will come. Trying to force things now would be like planting seeds in a drought."},
  {n:6,name:"Sung",eng:"Conflict",tri:["☰","☵"],judge:"Sincerity is obstructed. A cautious halt midway brings good fortune. Going through to the end brings misfortune.",image:"Heaven over water. Their motions move in opposite directions.",lines:[0,1,0,1,1,1],explain:"You're in a situation where two forces are pulling in opposite directions. The oracle warns against pushing this conflict to its conclusion. Compromise, mediation, or stepping back is far wiser than fighting to the bitter end. Know when to stop."},
  {n:7,name:"Shih",eng:"The Army",tri:["☷","☵"],judge:"The army needs perseverance and a strong leader. Good fortune without blame.",image:"Water within the earth. The superior one increases his masses by generosity toward the people.",lines:[0,1,0,0,0,0],explain:"Your situation requires disciplined organization and strong leadership — whether that means leading others or marshaling your own inner resources. Success comes through structure, loyalty, and having a clear chain of command."},
  {n:8,name:"Pi",eng:"Holding Together",tri:["☵","☷"],judge:"Holding together brings good fortune. Those who are uncertain gradually join.",image:"Water over earth. Each king of old established states and maintained close relations with the princes.",lines:[0,0,0,0,1,0],explain:"This hexagram is about alliance, unity, and belonging. Water on earth naturally flows together and nourishes everything it touches. The oracle suggests this is a time to build or strengthen your connections with others. But the bond must be genuine — based on shared values, not convenience."},
  {n:9,name:"Hsiao Ch'u",eng:"Small Taming",tri:["☴","☰"],judge:"Dense clouds, no rain from our western territory. Success through gentle restraint.",image:"Wind over heaven. The superior one refines the outward aspect of his nature.",lines:[1,1,1,0,1,1],explain:"You have the power to influence your situation, but only gently — like wind shaping clouds but unable to force them to rain. This is a time for subtle persuasion and small adjustments rather than dramatic moves. The big breakthrough hasn't come yet, but you're preparing the conditions."},
  {n:10,name:"Lü",eng:"Treading",tri:["☰","☱"],judge:"Treading upon the tail of the tiger. It does not bite. Success.",image:"Heaven above, lake below. The superior one discriminates between high and low.",lines:[1,1,0,1,1,1],explain:"You're in a delicate situation — like walking behind a tiger and stepping on its tail. But if you conduct yourself with proper awareness and respect, even dangerous situations can be navigated safely. Be mindful of your behavior and proceed with cheerful confidence despite the danger."},
  {n:11,name:"T'ai",eng:"Peace",tri:["☷","☰"],judge:"The small departs, the great approaches. Good fortune. Success.",image:"Heaven and earth unite: the image of peace. The ruler completes the way of heaven and earth.",lines:[1,1,1,0,0,0],explain:"One of the most auspicious hexagrams. Heaven and earth are in perfect harmony — creative energy flows freely, obstacles dissolve, and there is deep peace and prosperity. This is a golden period. Use it wisely, because all cycles turn — enjoy and build on this good fortune while it lasts."},
  {n:12,name:"P'i",eng:"Standstill",tri:["☰","☷"],judge:"Standstill. Evil people do not further the perseverance of the superior one.",image:"Heaven and earth do not unite: the image of standstill.",lines:[0,0,0,1,1,1],explain:"The opposite of Peace — communication has broken down and things are stagnant. This isn't a time to push forward. Retreat inward, protect your values, and wait. Like winter, this period of standstill is natural and temporary. Don't compromise your integrity to force progress."},
  {n:13,name:"T'ung Jen",eng:"Fellowship",tri:["☰","☲"],judge:"Fellowship in the open. Success. It furthers to cross the great water.",image:"Heaven together with fire. The superior one organizes the clans.",lines:[1,0,1,1,1,1],explain:"True fellowship — people united by shared purpose rather than selfish interest. Genuine community and open cooperation will lead to success, even in great challenges. The key word is 'open' — this fellowship must be inclusive and transparent."},
  {n:14,name:"Ta Yu",eng:"Great Possession",tri:["☲","☰"],judge:"Supreme success.",image:"Fire in heaven above. The superior one curbs evil and furthers good.",lines:[1,1,1,1,0,1],explain:"Fire burning brightly in the heavens — abundance, wealth, and great resources at your disposal. But the oracle's advice is crucial: use this abundance to do good, not to hoard or show off. True greatness in possession means being generous and using your power to further what is right."},
  {n:15,name:"Ch'ien",eng:"Modesty",tri:["☷","☶"],judge:"Modesty creates success. The superior one carries things through.",image:"Within the earth a mountain. The superior one reduces what is too much and augments what is too little.",lines:[0,0,1,0,0,0],explain:"A mountain hidden within the earth — immense strength that doesn't advertise itself. Modesty is not weakness but a form of power. By leveling out imbalances — reducing excess here, adding where there's lack — you create lasting harmony. The modest person completes their work precisely because they don't seek credit."},
  {n:16,name:"Yü",eng:"Enthusiasm",tri:["☳","☷"],judge:"It furthers one to install helpers and to set armies marching.",image:"Thunder comes resounding out of the earth: enthusiasm. The ancient kings made music and honored merit.",lines:[0,0,0,1,0,0],explain:"Thunder erupts from the earth with joyful, irresistible energy. This is the hexagram of inspiration and momentum — when the time is right to rally others, launch projects, and ride the wave of genuine enthusiasm. The key is that this energy must be natural and authentic, not manufactured."},
  {n:17,name:"Sui",eng:"Following",tri:["☱","☳"],judge:"Following has supreme success. Perseverance furthers. No blame.",image:"Thunder within the lake. The superior one at nightfall goes within and rests.",lines:[1,0,0,1,1,0],explain:"Sometimes wisdom means knowing when to follow. This hexagram suggests adapting to the situation, going with the flow, and being willing to follow good guidance rather than always insisting on your own way. Rest when it's time to rest."},
  {n:18,name:"Ku",eng:"Work on the Decayed",tri:["☶","☴"],judge:"Supreme success. It furthers to cross the great water. Before and after the starting point, three days.",image:"Wind at the foot of the mountain. The superior one stirs up the people and strengthens their spirit.",lines:[0,1,1,0,0,1],explain:"Something has been neglected or fallen into decay. This hexagram says it's time to repair what's broken. Take three days to plan, three days after to evaluate. The work is necessary and will lead to great success."},
  {n:19,name:"Lin",eng:"Approach",tri:["☷","☱"],judge:"Approach has supreme success. Perseverance furthers. When the eighth month comes, there is misfortune.",image:"Earth above the lake. The superior one is inexhaustible in teaching and sustaining the people.",lines:[1,1,0,0,0,0],explain:"Good things are approaching — opportunity, growth, progress. But the oracle warns: this favorable period won't last forever. Use this time wisely, teach and support others, and prepare for the inevitable turn of the cycle."},
  {n:20,name:"Kuan",eng:"Contemplation",tri:["☴","☷"],judge:"The ablution has been made, but not yet the offering. Full of trust, they look up.",image:"Wind blows over the earth. The kings of old visited the regions of the world and contemplated the people.",lines:[0,0,0,0,1,1],explain:"Step back and observe. This hexagram asks you to take a wider view of your situation before acting. Contemplation here isn't passive daydreaming — it's the focused, almost sacred act of truly seeing what is, so that when you do act, it comes from deep understanding."},
  {n:21,name:"Shih Ho",eng:"Biting Through",tri:["☲","☳"],judge:"Biting through has success. It is favorable to let justice be administered.",image:"Thunder and lightning: the image of biting through. The kings of old made firm the laws with penalties.",lines:[1,0,0,1,0,1],explain:"Something is blocking progress, like a bone stuck between the teeth. This hexagram says to bite through the obstacle decisively. It often points to a need for clear consequences, firm boundaries, or decisive action. Don't let obstruction persist — deal with it directly."},
  {n:22,name:"Pi",eng:"Grace",tri:["☶","☲"],judge:"Grace has success. In small matters it is favorable to undertake something.",image:"Fire at the foot of the mountain. The superior one clarifies current affairs without daring to decide lawsuits.",lines:[1,0,1,0,0,1],explain:"Beauty, form, and elegance — but this hexagram reminds you that grace is the finishing touch, not the substance. This is a good time for small, refined actions — polishing, beautifying, presenting well — but not for making major decisions based on appearances alone."},
  {n:23,name:"Po",eng:"Splitting Apart",tri:["☶","☷"],judge:"Splitting apart. It does not further to go anywhere.",image:"Mountain resting on the earth. Those above ensure their position by giving generously to those below.",lines:[0,0,0,0,0,1],explain:"The foundation is eroding. This is not the time to act or push forward — accept the natural dissolution and give generously. What splits apart now will reform later in a better configuration. Sometimes things must collapse before they can be rebuilt."},
  {n:24,name:"Fu",eng:"Return",tri:["☷","☳"],judge:"Return. Success. Going out and coming in without error. Companions come without blame.",image:"Thunder within the earth. The kings of old closed the passes at the time of solstice.",lines:[1,0,0,0,0,0],explain:"After the darkest point, the first light returns. This hexagram marks a turning point — the seed of new growth appearing after a period of decline. Like the winter solstice, when days begin to grow longer again. Don't rush this renewal. Let it build naturally."},
  {n:25,name:"Wu Wang",eng:"Innocence",tri:["☰","☳"],judge:"Supreme success. Perseverance furthers. If someone is not as they should be, misfortune.",image:"Under heaven, thunder rolls. All things attain the natural state of innocence.",lines:[1,0,0,1,1,1],explain:"Act from your true nature, without calculation or ulterior motives. This hexagram represents the power of genuine, innocent action — doing what's right simply because it's right. If you're scheming or being dishonest (even with yourself), the oracle warns of misfortune."},
  {n:26,name:"Ta Ch'u",eng:"Great Taming",tri:["☶","☰"],judge:"Perseverance furthers. Not eating at home brings good fortune. It furthers to cross the great water.",image:"Heaven within the mountain. The superior one acquaints themselves with many sayings of antiquity.",lines:[1,1,1,0,0,1],explain:"Tremendous creative energy is being held in check. This is a time of building inner strength, studying wisdom, and accumulating power for a future breakthrough. You have stored enough energy to succeed at big undertakings."},
  {n:27,name:"I",eng:"Nourishment",tri:["☶","☳"],judge:"Perseverance brings good fortune. Pay heed to the providing of nourishment.",image:"At the foot of the mountain, thunder. The superior one is careful of words and temperate in eating and drinking.",lines:[1,0,0,0,0,1],explain:"What are you feeding — your body, your mind, your spirit? This hexagram asks you to examine both what you consume and what you give to others. Are your words nourishing or toxic? Pay attention to the quality of your input and output in all areas of life."},
  {n:28,name:"Ta Kuo",eng:"Great Excess",tri:["☱","☴"],judge:"The ridgepole sags. It furthers to have somewhere to go. Success.",image:"The lake rises above the trees. The superior one stands alone without fear.",lines:[0,1,1,1,1,0],explain:"The load is too heavy — the central beam is bending. Something in your life has become excessive or unsustainable. Don't panic, but do act: redistribute the weight or move to a new position entirely. Courage and independence are needed now."},
  {n:29,name:"K'an",eng:"The Abysmal",tri:["☵","☵"],judge:"Repetition of the abysmal. Sincerity in the heart leads to success.",image:"Water flows on, reaching the goal: the image of the abyss repeated.",lines:[0,1,0,0,1,0],explain:"Danger upon danger — like being caught in rapids. But water teaches us the way through: it flows with absolute sincerity and consistency. You're in real danger, but if you stay true to your inner values and keep moving forward honestly, you will find your way through. Don't try to escape — flow through."},
  {n:30,name:"Li",eng:"The Clinging",tri:["☲","☲"],judge:"The clinging. Perseverance furthers. Success. Care of the cow brings good fortune.",image:"Brightness rises twice: the image of fire. The great one illuminates the four quarters.",lines:[1,0,1,1,0,1],explain:"Fire clings to its fuel to burn — it depends on something outside itself. This hexagram is about interdependence, clarity, and illumination. You need something to attach to: a purpose, a discipline, a relationship. Through this attachment, you gain brilliance."},
  {n:31,name:"Hsien",eng:"Influence",tri:["☱","☶"],judge:"Success. Perseverance furthers. To take a maiden to wife brings good fortune.",image:"A lake on the mountain. The superior one encourages people to approach through receptiveness.",lines:[0,0,1,1,1,0],explain:"Mutual attraction, influence, and connection. This hexagram describes the power of genuine openness to attract and influence others. In relationships, it speaks of natural chemistry and mutual responsiveness. Be open, be receptive, and let the connection form naturally."},
  {n:32,name:"Hêng",eng:"Duration",tri:["☳","☴"],judge:"Success. No blame. Perseverance furthers. It furthers to have somewhere to go.",image:"Thunder and wind: the image of duration. The superior one stands firm without changing direction.",lines:[0,1,1,1,0,0],explain:"Thunder and wind reinforce each other endlessly. This hexagram is about commitment, consistency, and the long game. Stay the course. True duration isn't rigid stubbornness — it's the ability to remain constant in your direction while being flexible in your methods."},
  {n:33,name:"Tun",eng:"Retreat",tri:["☰","☶"],judge:"Retreat. Success. In what is small, perseverance furthers.",image:"Mountain under heaven. The superior one keeps the inferior at a distance.",lines:[0,0,1,1,1,1],explain:"Strategic withdrawal, not cowardly escape. There are times when retreating is the strongest possible move. Pull back with dignity, maintain your boundaries, and don't waste energy engaging with what drags you down. Retreat now to advance later."},
  {n:34,name:"Ta Chuang",eng:"Great Power",tri:["☳","☰"],judge:"Perseverance furthers.",image:"Thunder in heaven above. The superior one does not tread paths not in accord with established order.",lines:[1,1,1,1,0,0],explain:"You have great power right now — the question is how you use it. Thunder rolling across the heavens is mighty but follows natural law. Power + righteousness = true greatness. Power + ego = inevitable downfall."},
  {n:35,name:"Chin",eng:"Progress",tri:["☲","☷"],judge:"The powerful prince is honored with horses in large numbers.",image:"The sun rises over the earth. The superior one brightens their bright virtue.",lines:[0,0,0,1,0,1],explain:"The sun rising over the earth — clear, unstoppable, illuminating everything. This is a time of rapid, natural progress. You're being recognized and given resources. Let your inner light shine honestly as the sun does."},
  {n:36,name:"Ming I",eng:"Darkening of the Light",tri:["☷","☲"],judge:"In adversity it furthers to be persevering.",image:"The light has sunk into the earth. The superior one veils their light yet still shines.",lines:[1,0,1,0,0,0],explain:"The sun has gone below the earth — your brilliance must be hidden for now. This hexagram appears when showing your true nature would be dangerous. Like an ember buried in ash, keep your inner fire alive but concealed. The darkness will pass."},
  {n:37,name:"Chia Jen",eng:"The Family",tri:["☴","☲"],judge:"The perseverance of the woman furthers.",image:"Wind coming from fire. The superior one has substance in words and duration in conduct.",lines:[1,0,1,0,1,1],explain:"This hexagram is about the home, family, and your inner circle. It speaks to the importance of right relationships, clear roles, and genuine warmth within your closest bonds."},
  {n:38,name:"K'uei",eng:"Opposition",tri:["☲","☱"],judge:"In small matters, good fortune.",image:"Fire above, the lake below. The superior one retains individuality amid community.",lines:[1,1,0,1,0,1],explain:"Fire rises, water sinks — they move in opposite directions. You're dealing with opposing forces or conflicting perspectives. But opposition isn't always bad. Small things can still succeed even amid major disagreements. Maintain your individuality while finding common ground."},
  {n:39,name:"Chien",eng:"Obstruction",tri:["☵","☶"],judge:"The southwest furthers. The northeast does not further. Perseverance: good fortune.",image:"Water on the mountain. The superior one turns attention to oneself and molds character.",lines:[0,0,1,0,1,0],explain:"An obstacle blocks your path. Don't charge forward. Instead, turn inward and use this blockage as an opportunity for self-improvement. Seek wise counsel. The obstacle is redirecting you toward the path you should actually be on."},
  {n:40,name:"Hsieh",eng:"Deliverance",tri:["☳","☵"],judge:"The southwest furthers. If there is no longer anything to be gained, return brings good fortune.",image:"Thunder and rain set in. The superior one pardons mistakes and forgives misdeeds.",lines:[0,1,0,1,0,0],explain:"The storm has broken and tension is released. The obstacle or danger has passed. Now is the time for forgiveness, fresh starts, and moving on quickly. Don't linger in what went wrong. Return to normal life and let go of grudges."},
  {n:41,name:"Sun",eng:"Decrease",tri:["☶","☱"],judge:"Decrease combined with sincerity brings supreme good fortune.",image:"At the foot of the mountain, the lake. The superior one controls anger and restrains the instincts.",lines:[1,1,0,0,0,1],explain:"Sometimes you must give something up to gain something greater. This hexagram asks: what are you willing to sacrifice? If your decrease is sincere and purposeful, it leads to supreme good fortune. Restraining excess is a form of increase."},
  {n:42,name:"I",eng:"Increase",tri:["☴","☳"],judge:"It furthers to undertake something. It furthers to cross the great water.",image:"Wind and thunder: the image of increase. The superior one furthers improvement without limits.",lines:[1,0,0,0,1,1],explain:"Now is a time of genuine increase and expansion. Wind and thunder amplify each other. Take on big projects, push your limits. When you see something good, adopt it. When you see a flaw in yourself, correct it. Use this energy boldly."},
  {n:43,name:"Kuai",eng:"Breakthrough",tri:["☱","☰"],judge:"One must resolutely make the matter known at the court. Danger.",image:"The lake has risen up to heaven. The superior one dispenses riches downward.",lines:[1,1,1,1,1,0],explain:"The floodwaters have risen to the breaking point. Something must give — a truth must be spoken, a corrupt element must be removed. The breakthrough must be made through openness and generosity, not through violence or self-righteous fury."},
  {n:44,name:"Kou",eng:"Coming to Meet",tri:["☰","☴"],judge:"The maiden is powerful. One should not marry such a maiden.",image:"Under heaven, wind. The prince disseminates commands to the four quarters.",lines:[0,1,1,1,1,1],explain:"Something unexpected has appeared — perhaps a temptation or influence that seems harmless but carries hidden power. This hexagram warns against being seduced by what seems insignificant. Stay alert to subtle, creeping influences that could gradually take over."},
  {n:45,name:"Ts'ui",eng:"Gathering Together",tri:["☱","☷"],judge:"Success. The king approaches his temple. It furthers to see the great one.",image:"Over the earth, the lake. The superior one renews their weapons to meet the unforeseen.",lines:[0,0,0,1,1,0],explain:"People are gathering for a shared purpose. This hexagram speaks of the power of assembly and the importance of having a central principle around which people can unite. But whenever people gather, prepare for the unexpected."},
  {n:46,name:"Shêng",eng:"Pushing Upward",tri:["☷","☴"],judge:"Pushing upward has supreme success. One must see the great one. Fear not.",image:"Within the earth, wood grows. The superior one accumulates small things to achieve something great.",lines:[0,1,1,0,0,0],explain:"A tree growing through the earth toward the light — steady, determined upward growth. This is gradual ascent through persistent effort. Each small step builds on the last. Don't be afraid. Your consistent effort will carry you to heights you can't yet see."},
  {n:47,name:"K'un",eng:"Oppression",tri:["☱","☵"],judge:"Success. Perseverance. The great one brings good fortune. When one has something to say, it is not believed.",image:"There is no water in the lake. The superior one stakes their life on following their will.",lines:[0,1,0,1,1,0],explain:"The lake has dried up — you're exhausted, confined, or oppressed. Words won't help because no one believes you right now. But the oracle still says 'success' — because your response to adversity defines you. Stay true to your purpose even when all external support has dried up."},
  {n:48,name:"Ching",eng:"The Well",tri:["☵","☴"],judge:"The town may be changed, but not the well. It neither decreases nor increases.",image:"Water over wood: the image of the well. The superior one encourages people to help one another.",lines:[0,1,1,0,1,0],explain:"The well is the unchanging source — while everything around it changes, it remains constant. This hexagram points to your deep, inner source of wisdom. Are you drawing from it? Or has the rope become too short? Repair your connection to your own deepest truth."},
  {n:49,name:"Ko",eng:"Revolution",tri:["☱","☲"],judge:"On your own day you are believed. Supreme success. Remorse disappears.",image:"Fire in the lake. The superior one sets the calendar in order.",lines:[1,0,1,1,1,0],explain:"Fire and water in direct conflict — something fundamental must change. Revolution must come at the right time, for the right reasons, and with the trust of others. When the time is truly right, act with conviction and all regret will vanish."},
  {n:50,name:"Ting",eng:"The Cauldron",tri:["☲","☴"],judge:"Supreme good fortune. Success.",image:"Fire over wood: the image of the cauldron. The superior one consolidates fate.",lines:[0,1,1,1,0,1],explain:"The cauldron was the most sacred vessel in ancient China — used to cook offerings for the divine. You're being called to take what you have and transform it into something of real spiritual and practical value. Supreme good fortune."},
  {n:51,name:"Chên",eng:"The Arousing",tri:["☳","☳"],judge:"Shock brings success. Shock comes — oh, oh! Laughing words — ha, ha!",image:"Thunder repeated: the image of shock. The superior one through anxiety sets life in order.",lines:[1,0,0,1,0,0],explain:"BOOM — thunder upon thunder. A sudden shock that terrifies but ultimately awakens. Those who meet the shock with composure and even humor will find it leads to success. Use the adrenaline to reorganize your life."},
  {n:52,name:"Kên",eng:"Keeping Still",tri:["☶","☶"],judge:"Keeping the back still so that one no longer feels the body. No blame.",image:"Mountains standing close together. The superior one does not permit thoughts to go beyond the situation.",lines:[0,0,1,0,0,1],explain:"Absolute stillness — meditation, rest, cessation of movement. This hexagram says: stop. Stop moving, stop thinking beyond your immediate situation. In this perfect stillness, the restless mind quiets and clarity emerges. This is the I Ching's most direct instruction to meditate."},
  {n:53,name:"Chien",eng:"Development",tri:["☴","☶"],judge:"The maiden is given in marriage. Good fortune. Perseverance furthers.",image:"On the mountain, a tree. The superior one abides in dignity and virtue.",lines:[0,0,1,0,1,1],explain:"A tree growing on a mountain — slow, gradual, but inexorable development. Your situation is developing at exactly the right pace. Don't try to skip steps. Each stage must be completed properly before moving to the next."},
  {n:54,name:"Kuei Mei",eng:"The Marrying Maiden",tri:["☳","☱"],judge:"Undertakings bring misfortune. Nothing that would further.",image:"Thunder over the lake. The superior one understands the transitory in the light of the eternal.",lines:[1,1,0,1,0,0],explain:"A difficult hexagram — it describes being in a subordinate or compromised position. The oracle bluntly says: undertakings bring misfortune right now. Make the best of an imperfect situation while maintaining awareness that all conditions are temporary."},
  {n:55,name:"Fêng",eng:"Abundance",tri:["☳","☲"],judge:"Abundance has success. The king attains abundance. Be not sad. Be like the sun at midday.",image:"Both thunder and lightning come. The superior one decides lawsuits and carries out punishments.",lines:[1,0,1,1,0,0],explain:"Absolute peak — like the sun at high noon. This is a moment of tremendous abundance and success. But midday is also when the sun begins to descend. Don't be sad. Enjoy the fullness and use this peak of clarity to make important decisions."},
  {n:56,name:"Lü",eng:"The Wanderer",tri:["☲","☶"],judge:"Success through smallness. Perseverance brings good fortune to the wanderer.",image:"Fire on the mountain. The superior one is clear-minded and cautious.",lines:[0,0,1,1,0,1],explain:"You're a stranger in a strange land — passing through, not settled. Success comes through being modest, careful, and not overstepping your welcome. Travel light. Don't get entangled. Move through with grace and awareness."},
  {n:57,name:"Sun",eng:"The Gentle",tri:["☴","☴"],judge:"The gentle. Success through what is small. It furthers to see the great one.",image:"Winds following one upon the other. The superior one spreads commands abroad.",lines:[0,1,1,0,1,1],explain:"Wind upon wind — gentle, persistent penetration. The softest force, applied consistently, achieves what brute strength cannot. Have a clear direction, then advance softly but steadily."},
  {n:58,name:"Tui",eng:"The Joyous",tri:["☱","☱"],judge:"The joyous. Success. Perseverance is favorable.",image:"Lakes resting one on the other. The superior one joins with friends for discussion.",lines:[1,1,0,1,1,0],explain:"Pure joy — two lakes connected, sharing their waters. This hexagram celebrates genuine happiness, friendship, and open communication. True joy is not frivolous pleasure but deep, sustained gladness from inner strength and good company."},
  {n:59,name:"Huan",eng:"Dispersion",tri:["☴","☵"],judge:"Success. The king approaches his temple. It furthers to cross the great water.",image:"Wind blows over water. The kings of old sacrificed to the Lord and built temples.",lines:[0,1,0,0,1,1],explain:"Wind scattering water — dissolving what has hardened, breaking up rigid patterns. The remedy is spiritual or communal: reconnecting with something larger than yourself. When the heart thaws, the ice breaks and the river flows again."},
  {n:60,name:"Chieh",eng:"Limitation",tri:["☵","☱"],judge:"Success. Galling limitation must not be persevered in.",image:"Water over lake. The superior one creates number and measure.",lines:[1,1,0,0,1,0],explain:"Boundaries, limits, structure — like the banks that give a river its direction. Healthy limitations create the structure for success. But limitation that becomes oppressive defeats its own purpose. Set boundaries, but don't make them into prisons."},
  {n:61,name:"Chung Fu",eng:"Inner Truth",tri:["☴","☱"],judge:"Inner truth. Pigs and fishes. Good fortune. It furthers to cross the great water.",image:"Wind over lake. The superior one discusses criminal cases in order to delay executions.",lines:[1,1,0,0,1,1],explain:"The most difficult creatures to influence — pigs and fish — can be reached by inner truth. This hexagram describes sincerity so deep and authentic that it moves even the most resistant beings. This is the power of integrity: real alignment between your inner and outer self."},
  {n:62,name:"Hsiao Kuo",eng:"Small Excess",tri:["☳","☶"],judge:"Small excess. Success. Small things may be done; great things should not be done.",image:"Thunder on the mountain. The superior one gives excess to reverence and frugality.",lines:[0,0,1,1,0,0],explain:"A bird in flight — it can go a little too high, but not much. Exceed in small things (extra care, extra modesty, extra detail) while not attempting anything too ambitious. A time for caution and humility."},
  {n:63,name:"Chi Chi",eng:"After Completion",tri:["☵","☲"],judge:"Success in small matters. Good fortune at the beginning, disorder at the end.",image:"Water over fire. The superior one takes thought of misfortune and arms against it.",lines:[1,0,1,0,1,0],explain:"Everything is in its right place — the task is complete. But paradoxically, this is one of the most dangerous moments. After completion, the only direction is toward disorder. Don't become complacent. Prepare now for the challenges that follow success."},
  {n:64,name:"Wei Chi",eng:"Before Completion",tri:["☲","☵"],judge:"Success. But if the little fox gets its tail in the water, there is nothing that would further.",image:"Fire over water. The superior one carefully discriminates among things.",lines:[0,1,0,1,0,1],explain:"The final hexagram — nothing is ever truly 'complete.' You're almost across the river, but the last steps are the most dangerous. Every ending is really a new beginning. Stay focused until the very end. The cycle continues."},
];

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

function lookupHexagram(lines) {
  const pattern = lines.map(l => l.yang ? 1 : 0);
  return HEXAGRAMS.find(h =>
    h.lines[0]===pattern[0]&&h.lines[1]===pattern[1]&&h.lines[2]===pattern[2]&&
    h.lines[3]===pattern[3]&&h.lines[4]===pattern[4]&&h.lines[5]===pattern[5]
  ) || HEXAGRAMS[0];
}

function throwCoins() {
  const coins = [0,1,2].map(() => Math.random() < 0.5 ? 3 : 2);
  const sum = coins[0]+coins[1]+coins[2];
  return { coins, sum, yang: sum===7||sum===9, changing: sum===6||sum===9,
    lineType: sum===6?"old_yin":sum===7?"young_yang":sum===8?"young_yin":"old_yang" };
}

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = window.innerWidth, h = c.height = window.innerHeight;
    const ps = Array.from({length:50},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:Math.random()*1.5+0.5}));
    let frame;
    const draw = () => {
      ctx.clearRect(0,0,w,h); ctx.fillStyle=GREEN;
      ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;ctx.globalAlpha=0.3;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});
      ctx.strokeStyle=GREEN;ctx.lineWidth=0.3;
      for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){const dx=ps[i].x-ps[j].x,dy=ps[i].y-ps[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<120){ctx.globalAlpha=(1-d/120)*0.12;ctx.beginPath();ctx.moveTo(ps[i].x,ps[i].y);ctx.lineTo(ps[j].x,ps[j].y);ctx.stroke()}}
      frame=requestAnimationFrame(draw);
    };
    draw();
    const resize=()=>{w=c.width=window.innerWidth;h=c.height=window.innerHeight};
    window.addEventListener("resize",resize);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener("resize",resize)};
  },[]);
  return <canvas ref={canvasRef} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none"}}/>;
}

const COIN_HEADS=["  ┌───────┐  "," │ ╔═════╗ │ "," │ ║  ☰  ║ │ "," │ ║ ─── ║ │ "," │ ║  3  ║ │ "," │ ╚═════╝ │ ","  └───────┘  "];
const COIN_TAILS=["  ┌───────┐  "," │ ╔═════╗ │ "," │ ║  ☷  ║ │ "," │ ║ ─ ─ ║ │ "," │ ║  2  ║ │ "," │ ╚═════╝ │ ","  └───────┘  "];
const COIN_SPINNING=[["  ──────────  ","  │  ≋≋≋≋  │  ","  │  ≋≋≋≋  │  ","  ──────────  "],["    │    │    ","    │╱╲╱│    ","    │╲╱╲│    ","    │    │    "],["      ││      ","      ││      ","      ││      "],["    │    │    ","    │╲╱╲│    ","    │╱╲╱│    ","    │    │    "]];

function AnimatedCoin({result,spinning,delay=0}){
  const[frame,setFrame]=useState(0);const[done,setDone]=useState(false);
  useEffect(()=>{if(!spinning){setDone(false);setFrame(0);return}let f=0;const st=Date.now();const iv=setInterval(()=>{if(Date.now()-st<delay)return;f++;setFrame(f%COIN_SPINNING.length);if(f>12+Math.random()*6){clearInterval(iv);setDone(true)}},80);return()=>clearInterval(iv)},[spinning,delay]);
  const lines=done&&result!==null?(result===3?COIN_HEADS:COIN_TAILS):spinning?COIN_SPINNING[frame%COIN_SPINNING.length]:["","  ⌁ ⌁ ⌁  ",""];
  return(<pre style={{fontFamily:"'Courier New',monospace",fontSize:"clamp(7px,1.8vw,10px)",lineHeight:1.2,color:done?(result===3?GREEN:"#0a8"):GREEN,textShadow:done?`0 0 8px ${result===3?GREEN:"#0a8"}`:`0 0 4px ${GREEN}`,textAlign:"center",margin:0,padding:"4px 0",opacity:done?1:0.7,transition:"opacity 0.3s",minHeight:"72px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>{lines.map((l,i)=><span key={i}>{l}</span>)}</pre>);
}

const LINE_W=200;const GAP_W=24;
function HexagramLine({yang,changing,revealed,animDelay}){
  const[show,setShow]=useState(false);
  useEffect(()=>{if(revealed){const t=setTimeout(()=>setShow(true),animDelay);return()=>clearTimeout(t)}else{setShow(false)}},[revealed,animDelay]);
  if(!show)return(<div style={{height:20,display:"flex",alignItems:"center",justifyContent:"center",width:LINE_W}}><span style={{fontFamily:"monospace",color:GREEN,fontSize:9,letterSpacing:4,opacity:0.15}}>· · · · · · ·</span></div>);
  const lineColor=changing?PURPLE:GREEN;const glow=changing?PURPLE_GLOW:`0 0 8px ${GREEN}`;const segW=(LINE_W-GAP_W)/2;
  return(<div style={{height:20,display:"flex",alignItems:"center",justifyContent:"center",width:LINE_W,animation:"lineReveal 0.4s ease-out"}}>{yang?(<div style={{width:LINE_W,height:5,background:lineColor,boxShadow:glow,borderRadius:1}}/>):(<div style={{display:"flex",width:LINE_W,justifyContent:"space-between"}}><div style={{width:segW,height:5,background:lineColor,boxShadow:glow,borderRadius:1}}/><div style={{width:segW,height:5,background:lineColor,boxShadow:glow,borderRadius:1}}/></div>)}</div>);
}

function Collapsible({title,children}){
  const[open,setOpen]=useState(false);
  return(<div style={{border:`1px solid ${open?GREEN+"40":"#0f320"}`,borderRadius:2,marginBottom:16,background:open?"rgba(0,255,51,0.015)":"rgba(0,255,51,0.005)",transition:"all 0.3s"}}><button onClick={()=>setOpen(!open)} style={{width:"100%",padding:"14px 16px",background:"transparent",border:"none",color:GREEN,fontFamily:"monospace",fontSize:11,letterSpacing:3,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",textAlign:"left"}}><span>{title}</span><span style={{transform:open?"rotate(180deg)":"rotate(0)",transition:"transform 0.3s",fontSize:10,color:"#0a5"}}>▼</span></button>{open&&(<div style={{padding:"0 16px 16px",animation:"fadeIn 0.4s ease-out",fontSize:13,lineHeight:1.9,color:"#0a8"}}>{children}</div>)}</div>);
}

export default function IChing(){
  const[phase,setPhase]=useState("intro");
  const[question,setQuestion]=useState("");
  const[currentThrow,setCurrentThrow]=useState(0);
  const[lines,setLines]=useState([]);
  const[coinResults,setCoinResults]=useState([]);
  const[activeThrow,setActiveThrow]=useState(-1);
  const[spinning,setSpinning]=useState(false);
  const[hexagram,setHexagram]=useState(null);
  const[relatingHex,setRelatingHex]=useState(null);
  const[glitch,setGlitch]=useState(false);
  const[showReading,setShowReading]=useState(false);

  useEffect(()=>{const iv=setInterval(()=>{setGlitch(true);setTimeout(()=>setGlitch(false),100+Math.random()*150)},4000+Math.random()*6000);return()=>clearInterval(iv)},[]);

  const startConsultation=()=>{setPhase("question");setCurrentThrow(0);setLines([]);setCoinResults([]);setActiveThrow(-1);setSpinning(false);setHexagram(null);setRelatingHex(null);setShowReading(false)};

  const runAllThrows=useCallback(()=>{
    setPhase("throwing");
    const allResults=[];for(let i=0;i<6;i++)allResults.push(throwCoins());
    let throwIndex=0;
    const doThrow=()=>{
      if(throwIndex>=6){setTimeout(()=>{const hex=lookupHexagram(allResults);setHexagram(hex);if(allResults.some(l=>l.changing)){const ch=allResults.map(l=>({...l,yang:l.changing?!l.yang:l.yang,changing:false}));setRelatingHex(lookupHexagram(ch))}setPhase("reading");setTimeout(()=>setShowReading(true),600)},400);return}
      const i=throwIndex;setActiveThrow(i);setSpinning(true);setCurrentThrow(i);
      setTimeout(()=>{setCoinResults(prev=>[...prev,allResults[i]]);setSpinning(false);
        setTimeout(()=>{setLines(prev=>[...prev,allResults[i]]);throwIndex++;setTimeout(doThrow,600)},500);
      },1200+Math.random()*400);
    };
    doThrow();
  },[]);

  const lineLabels=["First","Second","Third","Fourth","Fifth","Sixth"];
  const lineTypeNames={old_yin:"OLD YIN ⚋⚋ [6]",young_yang:"YOUNG YANG ⚊ [7]",young_yin:"YOUNG YIN ⚋ [8]",old_yang:"OLD YANG ⚊⚊ [9]"};

  return(
    <div style={{minHeight:"100vh",background:"#000",color:GREEN,fontFamily:"'Courier New','Lucida Console',monospace",position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:1,pointerEvents:"none",background:"repeating-linear-gradient(0deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 3px)"}}/>
      <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:1,pointerEvents:"none",background:"radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.6) 100%)"}}/>
      <ParticleCanvas/>

      <div style={{position:"relative",zIndex:2,maxWidth:620,margin:"0 auto",padding:"20px 16px"}}>
        <header style={{textAlign:"center",padding:"30px 0 20px"}}>
          <div style={{fontSize:"clamp(8px,2.2vw,11px)",letterSpacing:8,color:"#0a5",marginBottom:12}}>ANCIENT DIVINATION SYSTEM ⌁ 64 HEXAGRAMS</div>
          <h1 style={{fontSize:"clamp(28px,8vw,52px)",fontWeight:400,letterSpacing:"0.15em",margin:"0 0 4px",lineHeight:1,textShadow:glitch?`-2px 0 #f00, 2px 0 ${PURPLE}`:`0 0 20px ${GREEN}, 0 0 40px ${GREEN}88, 0 0 60px ${GREEN}22`,transform:glitch?`translate(${Math.random()*4-2}px,${Math.random()*2-1}px)`:"none",transition:glitch?"none":"text-shadow 0.3s"}}>易 經</h1>
          <div style={{fontSize:"clamp(14px,4vw,22px)",letterSpacing:"0.35em",color:GREEN,textShadow:`0 0 10px ${GREEN}`,transform:glitch?"skewX(-2deg)":"none"}}>I CHING</div>
          <div style={{fontSize:8,color:"#0e9",letterSpacing:4,marginTop:8}}>BOOK OF CHANGES ⌁ ORACLE PROTOCOL v1.0</div>
        </header>

        {phase==="intro"&&(
          <div style={{padding:"10px 0 30px",animation:"fadeIn 1s ease-out"}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <button onClick={startConsultation} style={{padding:"16px 44px",background:"transparent",border:`1px solid ${GREEN}`,color:GREEN,fontFamily:"monospace",fontSize:14,letterSpacing:6,cursor:"pointer",borderRadius:2,boxShadow:`0 0 15px ${GREEN}18, inset 0 0 15px ${GREEN}08`,transition:"all 0.3s"}}>CONSULT THE ORACLE</button>
            </div>
            <Collapsible title="WHAT IS THE I CHING?">
              <p style={{margin:"0 0 12px"}}>The <strong style={{color:GREEN}}>I Ching</strong> (易經), or "Book of Changes," is one of the oldest texts in human history — over 3,000 years old, originating in ancient China. It's a divination system, a philosophical guide, and a map of how change works in the universe.</p>
              <p style={{margin:"0 0 12px"}}>The core idea is that reality is always in flux between two fundamental forces: <strong style={{color:GREEN}}>Yang</strong> (the active, creative, solid) and <strong style={{color:GREEN}}>Yin</strong> (the receptive, yielding, open). These combine into 64 <strong style={{color:GREEN}}>hexagrams</strong> — six-line figures that each represent a specific situation or archetype.</p>
              <p style={{margin:"0 0 12px"}}>When you consult the oracle, you ask a question and then generate a hexagram through a random process. The randomness is the point — it creates an opening for insight that your conscious mind might block.</p>
              <p style={{margin:"0 0 12px"}}>Each hexagram has a <strong style={{color:GREEN}}>Judgment</strong> (the core advice) and an <strong style={{color:GREEN}}>Image</strong> (a metaphor from nature). Some lines may be "changing" — these transform the hexagram into a <strong style={{color:PURPLE}}>Relating Hexagram</strong>, which shows where your situation is heading.</p>
              <p style={{margin:0}}>The I Ching doesn't predict the future — it mirrors your present situation and offers ancient wisdom about how to navigate it. Think of it as a conversation with 3,000 years of accumulated human insight.</p>
            </Collapsible>
            <Collapsible title="HOW DOES THE COIN METHOD WORK?">
              <p style={{margin:"0 0 12px"}}>This oracle uses the <strong style={{color:GREEN}}>three-coin method</strong>. For each of the six lines, three coins are thrown simultaneously.</p>
              <p style={{margin:"0 0 12px"}}>Each coin lands as <strong style={{color:GREEN}}>heads (value 3)</strong> or <strong style={{color:GREEN}}>tails (value 2)</strong>. The three values are added, giving a sum between 6 and 9:</p>
              <div style={{fontFamily:"monospace",fontSize:13,lineHeight:2,margin:"8px 0 12px",color:GREEN}}>
                <span style={{color:GREEN}}>Sum 6</span> → Old Yin (broken line, <span style={{color:PURPLE}}>changing</span>)<br/>
                <span style={{color:GREEN}}>Sum 7</span> → Young Yang (solid line, stable)<br/>
                <span style={{color:GREEN}}>Sum 8</span> → Young Yin (broken line, stable)<br/>
                <span style={{color:GREEN}}>Sum 9</span> → Old Yang (solid line, <span style={{color:PURPLE}}>changing</span>)
              </div>
              <p style={{margin:"0 0 12px"}}>Lines are built from the <strong style={{color:GREEN}}>bottom up</strong>. "Changing" lines (shown in <span style={{color:PURPLE}}>purple</span>) transform into their opposite, creating a second hexagram that shows the future direction.</p>
              <p style={{margin:0}}>After you click "Cast Coins," all six throws happen automatically.</p>
            </Collapsible>
          </div>
        )}

        {phase==="question"&&(
          <div style={{textAlign:"center",padding:"20px 0",animation:"fadeIn 0.6s ease-out"}}>
            <div style={{fontSize:9,color:"#0a5",letterSpacing:4,marginBottom:16}}>FORMULATE YOUR INQUIRY</div>
            <div style={{fontSize:12,color:"#0a8",lineHeight:1.8,marginBottom:16,maxWidth:440,margin:"0 auto 16px",textAlign:"left",padding:"0 8px"}}>Focus on a specific situation or question. Open-ended questions work best — "What do I need to understand about..." rather than simple yes/no.</div>
            <textarea value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What do I need to understand about..." style={{width:"100%",maxWidth:440,height:80,background:"rgba(0,255,51,0.03)",border:`1px solid ${GREEN}40`,borderRadius:2,color:GREEN,fontFamily:"monospace",fontSize:13,padding:14,resize:"none",outline:"none",boxShadow:"inset 0 0 20px rgba(0,255,51,0.03)"}} onFocus={e=>e.target.style.borderColor=GREEN} onBlur={e=>e.target.style.borderColor=`${GREEN}40`}/>
            <div style={{marginTop:16}}><button onClick={runAllThrows} style={{padding:"12px 32px",background:"transparent",border:`1px solid ${GREEN}`,color:GREEN,fontFamily:"monospace",fontSize:11,letterSpacing:5,cursor:"pointer",borderRadius:2,boxShadow:`0 0 15px ${GREEN}18`}}>CAST COINS</button></div>
            <div style={{fontSize:9,color:"#0c8",marginTop:12,letterSpacing:2}}>SIX THROWS WILL BE CAST AUTOMATICALLY</div>
          </div>
        )}

        {phase==="throwing"&&(
          <div style={{textAlign:"center",padding:"10px 0",animation:"fadeIn 0.3s ease-out"}}>
            {question&&(<div style={{fontSize:10,color:"#0e9",letterSpacing:2,padding:"8px 14px",border:`1px solid ${GREEN}15`,borderRadius:2,background:"rgba(0,255,51,0.02)",maxWidth:440,margin:"0 auto 16px"}}>"{question.length>80?question.slice(0,80)+"...":question}"</div>)}
            <div style={{fontSize:9,color:"#0a5",letterSpacing:4,marginBottom:8}}>CASTING LINE {currentThrow+1} OF 6</div>
            <div style={{display:"flex",justifyContent:"center",gap:"clamp(4px,2vw,10px)",margin:"12px 0"}}>
              {[0,1,2].map(i=>(<div key={i} style={{border:`1px solid ${GREEN}25`,borderRadius:2,padding:4,background:"rgba(0,255,51,0.02)",minWidth:"clamp(76px,24vw,120px)"}}><AnimatedCoin result={coinResults[activeThrow]?coinResults[activeThrow].coins[i]:null} spinning={spinning} delay={i*150}/></div>))}
            </div>
            {coinResults.length>0&&(
              <div style={{animation:"fadeIn 0.4s ease-out",padding:"8px 14px",border:`1px solid ${GREEN}30`,background:"rgba(0,255,51,0.03)",borderRadius:2,maxWidth:340,margin:"4px auto 12px"}}>
                <div style={{fontSize:10,color:GREEN,letterSpacing:2,marginBottom:2}}>{coinResults[coinResults.length-1].coins.join(" + ")} = {coinResults[coinResults.length-1].sum}</div>
                <div style={{fontSize:10,letterSpacing:2,color:coinResults[coinResults.length-1].changing?PURPLE:GREEN,textShadow:coinResults[coinResults.length-1].changing?`0 0 8px ${PURPLE}`:`0 0 4px ${GREEN}`}}>{lineLabels[coinResults.length-1]} → {lineTypeNames[coinResults[coinResults.length-1].lineType]}{coinResults[coinResults.length-1].changing&&" ⚡ CHANGING"}</div>
              </div>
            )}
            <div style={{margin:"12px auto",padding:"14px 0",border:`1px solid ${GREEN}15`,borderRadius:2,background:"rgba(0,0,0,0.4)",width:"fit-content"}}>
              <div style={{fontSize:8,color:"#0a5",letterSpacing:4,marginBottom:10,textAlign:"center"}}>HEXAGRAM FORMING</div>
              <div style={{display:"flex",flexDirection:"column-reverse",gap:3,alignItems:"center",padding:"0 24px"}}>
                {[0,1,2,3,4,5].map(i=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:8,color:"#0c8",width:12,textAlign:"right",flexShrink:0}}>{i+1}</span><HexagramLine yang={lines[i]?.yang} changing={lines[i]?.changing} revealed={i<lines.length} animDelay={0}/><span style={{fontSize:7,width:28,flexShrink:0,textAlign:"left",color:lines[i]?.changing?PURPLE:"#052"}}>{lines[i]?`[${lines[i].sum}]`:""}{lines[i]?.changing?" ✕":""}</span></div>))}
              </div>
            </div>
          </div>
        )}

        {phase==="reading"&&hexagram&&(
          <div style={{padding:"10px 0 40px",animation:"fadeIn 0.8s ease-out"}}>
            {question&&(<div style={{textAlign:"center",fontSize:"clamp(12px,3.2vw,14px)",color:"#0a8",letterSpacing:1,marginBottom:20,padding:"10px 16px",border:`1px solid ${GREEN}20`,borderRadius:2,background:"rgba(0,255,51,0.02)",lineHeight:1.6}}>Your question: "{question}"</div>)}
            <div style={{border:`1px solid ${GREEN}60`,borderRadius:2,padding:"24px 20px",background:"rgba(0,255,51,0.02)",boxShadow:`0 0 30px ${GREEN}08, inset 0 0 30px ${GREEN}05`,marginBottom:24}}>
              <div style={{textAlign:"center",marginBottom:20}}>
                <div style={{fontSize:9,color:"#0a5",letterSpacing:6,marginBottom:4}}>PRIMARY HEXAGRAM</div>
                <div style={{fontSize:"clamp(40px,10vw,60px)",margin:"8px 0",textShadow:`0 0 20px ${GREEN}, 0 0 40px ${GREEN}66`,animation:showReading?"pulseGlow 3s ease-in-out infinite":"none"}}>{hexagram.tri[0]}<br/>{hexagram.tri[1]}</div>
                <div style={{fontSize:"clamp(20px,5vw,30px)",letterSpacing:"0.15em",fontWeight:400,textShadow:`0 0 12px ${GREEN}`}}>{hexagram.n}. {hexagram.name}</div>
                <div style={{fontSize:"clamp(13px,3.5vw,17px)",color:"#0a8",letterSpacing:3,marginTop:6}}>{hexagram.eng.toUpperCase()}</div>
              </div>
              <div style={{margin:"16px auto",padding:"14px 0",border:`1px solid ${GREEN}20`,borderRadius:2,background:"rgba(0,0,0,0.3)",width:"fit-content"}}>
                <div style={{display:"flex",flexDirection:"column-reverse",gap:4,alignItems:"center",padding:"0 24px"}}>
                  {lines.map((l,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:8,color:"#0c8",width:12,textAlign:"right",flexShrink:0}}>{i+1}</span><HexagramLine yang={l.yang} changing={l.changing} revealed={true} animDelay={i*120}/><span style={{fontSize:8,width:36,flexShrink:0,textAlign:"left",color:l.changing?PURPLE:"#052"}}>[{l.sum}]{l.changing?" ✕":""}</span></div>))}
                </div>
              </div>
              {showReading&&(
                <div style={{animation:"fadeIn 1s ease-out"}}>
                  <div style={{margin:"20px 0",padding:"18px",borderLeft:`3px solid ${GREEN}`,background:"rgba(0,255,51,0.025)",borderRadius:"0 2px 2px 0"}}>
                    <div style={{fontSize:10,color:"#0a5",letterSpacing:4,marginBottom:10}}>WHAT THIS MEANS FOR YOU</div>
                    <div style={{fontSize:"clamp(16px,4.2vw,19px)",lineHeight:2,color:"#ddf2df"}}>{hexagram.explain}</div>
                  </div>
                  <div style={{margin:"16px 0",padding:"18px",borderLeft:`3px solid ${GREEN}80`,background:"rgba(0,255,51,0.015)",borderRadius:"0 2px 2px 0"}}>
                    <div style={{fontSize:10,color:"#0a5",letterSpacing:4,marginBottom:10}}>THE JUDGMENT</div>
                    <div style={{fontSize:"clamp(16px,4.2vw,19px)",lineHeight:2,color:"#c8e8cb",fontStyle:"italic"}}>{hexagram.judge}</div>
                    <div style={{fontSize:"clamp(13px,3.5vw,15px)",lineHeight:1.9,color:"#8fc493",marginTop:8}}>The Judgment is the oracle's core advice — the essential message about your situation. Read it slowly and consider how it applies to your question.</div>
                  </div>
                  <div style={{margin:"16px 0",padding:"18px",borderLeft:"3px solid #0a5",background:"rgba(0,255,51,0.01)",borderRadius:"0 2px 2px 0"}}>
                    <div style={{fontSize:10,color:"#0a5",letterSpacing:4,marginBottom:10}}>THE IMAGE</div>
                    <div style={{fontSize:"clamp(16px,4.2vw,19px)",lineHeight:2,color:"#b0d4b3",fontStyle:"italic"}}>{hexagram.image}</div>
                    <div style={{fontSize:"clamp(13px,3.5vw,15px)",lineHeight:1.9,color:"#8fc493",marginTop:8}}>The Image is a metaphor drawn from nature that shows you how to embody this hexagram's wisdom in daily life.</div>
                  </div>
                  {lines.some(l=>l.changing)&&(
                    <div style={{margin:"16px 0",padding:"18px",borderLeft:`3px solid ${PURPLE}`,background:"rgba(180,74,255,0.03)",borderRadius:"0 2px 2px 0"}}>
                      <div style={{fontSize:10,color:PURPLE_DIM,letterSpacing:4,marginBottom:10}}>CHANGING LINES</div>
                      <div style={{fontSize:"clamp(13px,3.5vw,15px)",lineHeight:1.9,color:"#c4a0d9",marginBottom:12}}>Changing lines show where transformation is actively happening — the specific points of movement in your situation. These lines are shifting from one state to another, creating the Relating Hexagram below.</div>
                      {lines.map((l,i)=>l.changing?(<div key={i} style={{fontSize:"clamp(14px,3.8vw,16px)",color:PURPLE,marginBottom:8,lineHeight:1.7,textShadow:`0 0 4px ${PURPLE}44`,padding:"6px 0",borderBottom:`1px solid ${PURPLE}15`}}>⚡ <strong>{lineLabels[i]} line</strong> ({l.yang?"Yang → Yin":"Yin → Yang"}) — Position {i+1} {i<3?"(inner/lower trigram)":"(outer/upper trigram)"} is in active transition.</div>):null)}
                    </div>
                  )}
                </div>
              )}
            </div>
            {showReading&&relatingHex&&(
              <div style={{border:`1px solid ${PURPLE}44`,borderRadius:2,padding:"24px 20px",background:"rgba(180,74,255,0.02)",boxShadow:`0 0 20px ${PURPLE}08`,marginBottom:24,animation:"fadeIn 1.2s ease-out"}}>
                <div style={{textAlign:"center",marginBottom:16}}>
                  <div style={{fontSize:9,color:PURPLE_DIM,letterSpacing:6}}>RELATING HEXAGRAM</div>
                  <div style={{fontSize:11,color:"#a06cc8",letterSpacing:2,marginTop:4,lineHeight:1.6}}>This is where your situation is heading. The changing lines transform the primary hexagram into this one.</div>
                  <div style={{fontSize:"clamp(32px,8vw,48px)",margin:"12px 0",textShadow:`0 0 15px ${PURPLE}, 0 0 30px ${PURPLE}44`,color:PURPLE}}>{relatingHex.tri[0]}<br/>{relatingHex.tri[1]}</div>
                  <div style={{fontSize:"clamp(18px,4.5vw,26px)",letterSpacing:"0.15em",color:PURPLE,textShadow:`0 0 8px ${PURPLE}`}}>{relatingHex.n}. {relatingHex.name}</div>
                  <div style={{fontSize:"clamp(12px,3vw,15px)",color:PURPLE_DIM,letterSpacing:3,marginTop:4}}>{relatingHex.eng.toUpperCase()}</div>
                </div>
                <div style={{margin:"16px 0",padding:"18px",borderLeft:`3px solid ${PURPLE}60`,background:"rgba(180,74,255,0.02)",borderRadius:"0 2px 2px 0"}}>
                  <div style={{fontSize:10,color:PURPLE_DIM,letterSpacing:4,marginBottom:10}}>WHERE THIS IS HEADING</div>
                  <div style={{fontSize:"clamp(16px,4.2vw,19px)",lineHeight:2,color:"#dcc8ee"}}>{relatingHex.explain}</div>
                </div>
                <div style={{margin:"12px 0 0",padding:"18px",borderLeft:`3px solid ${PURPLE}40`,background:"rgba(180,74,255,0.015)",borderRadius:"0 2px 2px 0"}}>
                  <div style={{fontSize:10,color:PURPLE_DIM,letterSpacing:4,marginBottom:10}}>JUDGMENT</div>
                  <div style={{fontSize:"clamp(15px,4vw,18px)",lineHeight:2,color:"#d4b8ea",fontStyle:"italic"}}>{relatingHex.judge}</div>
                </div>
              </div>
            )}
            {showReading&&(
              <div style={{textAlign:"center",marginTop:28,animation:"fadeIn 1.5s ease-out"}}>
                <button onClick={startConsultation} style={{padding:"14px 36px",background:"transparent",border:`1px solid ${GREEN}`,color:GREEN,fontFamily:"monospace",fontSize:12,letterSpacing:5,cursor:"pointer",borderRadius:2,boxShadow:`0 0 15px ${GREEN}18`}}>NEW CONSULTATION</button>
                <button onClick={()=>setPhase("intro")} style={{padding:"14px 24px",background:"transparent",border:"1px solid #44444440",color:"#0c8",fontFamily:"monospace",fontSize:11,letterSpacing:3,cursor:"pointer",borderRadius:2,marginLeft:12}}>RETURN</button>
              </div>
            )}
          </div>
        )}

        <footer style={{textAlign:"center",padding:"40px 0 20px",borderTop:"1px solid #0f320",marginTop:40}}>
          <div style={{fontSize:8,color:"#0c8",letterSpacing:4,lineHeight:2.2}}>SYSTEM DERIVED FROM THE BOOK OF CHANGES<br/>THREE-COIN METHOD ⌁ KING WEN SEQUENCE<br/>ORACLE ENGINE v1.0</div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes lineReveal{from{opacity:0;transform:scaleX(0)}to{opacity:1;transform:scaleX(1)}}
        @keyframes pulseGlow{0%,100%{text-shadow:0 0 20px ${GREEN},0 0 40px ${GREEN}66}50%{text-shadow:0 0 30px ${GREEN},0 0 60px ${GREEN}88,0 0 80px ${GREEN}44}}
        *{box-sizing:border-box}body{margin:0;background:#000}
        textarea::placeholder{color:${GREEN}30}button:hover{opacity:0.9}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#000}::-webkit-scrollbar-thumb{background:${GREEN}30}
      `}</style>
    </div>
  );
}
