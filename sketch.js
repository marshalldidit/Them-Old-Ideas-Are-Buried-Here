let serialPort;
let serialReader;
let serialBuffer = '';

let volume = 0.6;

let audioStopTimer = null;

let img;
let font;

let sceneMode = 'map'; // 'map' | 'illustration'
let currentChapter = null;

let showVolumeIndicator = false;
let volumeIndicatorLastChange = 0;

let showContextModal = false;
let contextPageIndex = 0;

let visitedMarkers = new Set();
let visitedOrder = []; // records the sequence markers were first visited, for drawing the trail

let mapMusic;

let videoFinished = false;

let narrationPages = [''];
let narrationPageIndex = 0;

const VOLUME_INDICATOR_DURATION = 1500; // ms it stays visible after the last change

// const CHAPTER_AUDIO_DURATION = 90; // seconds — how long each chapter's song plays before auto-stopping

const PROJECT_CONTEXT_PAGES = [
  `Them Old Ideas Are Buried Here reimagines Beyoncé's 2024 studio album "Cowboy Carter" as a speculative Western epic — part myth, part memory, and part retro-futurist narrative. When I listen to the album, I see a Western film in my mind. This project is an attempt to honor that vision. Drawing from the album's expansive soundscape, its deliberate resistance to fixed genre classifications, and its assertion in taking up space where "it doesn't belong," this is a multi-part illustrated cinematic work that unfolds across time (and space).\n\nThe epic traverses Black-founded pioneer towns, graveyards, brothels, rodeo arenas, recognizable American concert venues and deserts, and even the surface of the moon. In alignment with the album's engagement with music history and cultural revision, the illustrations are grounded in documented facts and historical realities, using them as a framework for speculative interpretation. They center the lived experiences of the Black frontiersmen (and women) who lived, worked, traveled, formed relationships, and caused good trouble within the Old West.`,
  `Black cowboys have been present in the Americas since at least the 16th century, with significant influence stemming from the vaqueros in Colonial Mexico. Vaqueros — many of whom were runaway Black or mixed race slaves — were originators of many of the practices central to North American cowboy culture today, including ranching, herding, and visual styling. Coinciding with emancipation, the Homestead Act of 1862 also enabled Black Americans to migrate westward, claim land, and establish communities, situating them as active participants in the formation of the American frontier rather than as just historical footnotes.\n\nInterpreting "Cowboy Carter" as not just a country album but also a cinematic text, the illustrated series presents the album as a sequence of interconnected yet standalone scenes. Each illustration corresponds to a specific song while contributing to a broader narrative unified by recurring motifs: horses as loyal companions, the expansive American Western landscape as a persistent setting, and a central figure navigating themes of love, legacy, autonomy, and freedom.`,
  `Similar to contributions made to country music by Black musicians, popular depictions of the Western frontier often erase Black presence or flatten it into symbolism without authorship. This project responds by anchoring narrative, music and geography into a single visual system and aims to contextual Black lives outside of the slavery of Jim Crow contexts of the late 19th and early to mid-20th centuries. Them Old Ideas Are Buried Here examines how historical memory, popular music, and illustration can collectively reframe dominant narratives of American identity.\n\n-- James M. Marshall`,
];

let places = [
  {name: "The Chihuahuan Desert", x: 510.1774, y: 565.6781, chapterId: 'ameriican-requiem'},
  {name: "Freedmen's Town", x: 623.2268, y: 577.9568, chapterId: 'blackbiird'}, 
  {name: "The Shawnee Trail", x: 614.9657, y: 557.6972, chapterId: '16-carriages'},
  {name: "Tamina, TX", x: 593.8148, y: 548.7163, chapterId: 'texas-hold-em'},
  {name: "Boley, OK", x: 627.7173, y: 449.5009, chapterId: 'bodyguard'},
  {name: "Taft, OK", x: 599.808, y: 442.937, chapterId: 'jolene'},
  {name: "Dearfield, CO", x: 493.9346, y: 347.1873, chapterId: 'daughter'},
  {name: "Wilcox, WY", x: 394.327, y: 348.1873, chapterId: 'spaghettii'},
  {name: "THE UNITED STATES OF AMERICA", x: 960.7919, y: 391.2736, chapterId: 'alliigator-tears'},
  {name: "Guthrie, OK", x: 592.8148, y: 468.4818, chapterId: 'just-for-fun'},
  {name: "Nicodemus, KS", x: 560.3761, y: 379.4567, chapterId: 'ii-most-wanted'},
  {name: "Ogden, UT", x: 473.8354, y: 304.4388, chapterId: 'leviis-jeans'},
  {name: "Allensworth, CA", x: 293.7194, y: 446.6063, chapterId: 'flamenco'},
  {name: "Kennedy Space Center", x: 867.5745, y: 595.2165, chapterId: 'ya-ya'},
  {name: "New Orleans, LA", x: 710.3559, y: 563.1876, chapterId: 'oh-louisiana'},
  {name: "Eldorado Canyon, NV", x: 312.9651, y: 373.0545, chapterId: 'desert-eagle'},
  {name: "The Colorado River", x: 351.7569, y: 436.4465, chapterId: 'riiverdance'},
  {name: "The Great Basin Desert", x: 339.1597, y: 442.937, chapterId: 'ii-hands-ii-heaven'},
  {name: "Tombstone, AZ", x: 415.1776, y: 524.0927, chapterId: 'tyrant'},
  {name: "The Sonoran Desert", x: 372.6935, y: 511.061, chapterId: 'sweet-honey-buckiin'},
  {name: "Blackdom, NM", x: 476.7021, y: 511.061, chapterId: 'amen'},
];

let chapters = {
  'ameriican-requiem': {
    title: 'ACT I, SCENE I - Ameriican Requiem',
    song: 'Ameriican Requiem',
    location: 'THE CHIHUAHUAN DESERT',
    illustrationPath: 'illustrations/CC_01.Ameriican_Requiem I.png',
    videoPath: 'video/Ameriican_Requiem.mp4',
    audioPath: 'audio/AMERIICAN_REQUIEM.mp3',
    audioStartTime: 7,
    contexts: [
      {
      label: `I am the one to cleanse me of my father's sins...`, 
      pages: [
        `It's the early 1900s. A funeral procession moseys along the open road as if cuts through the Chihuahuan Desert and passes a lonely, dilapidated graveyard.\n\nThe sun scorches the Old West landscape.`, 
        `Each grave hints at forgotten ancestors and unresolved debts.\n\nThis piece foreshadows the story's central tension: whether one can outrun the past, change it or carry it forward into whatever comes next.`]
      },
    ],
  },
  'blackbiird': {
    title: 'ACT I, SCENE II - Blackbiird',
    song: 'Blackbiird',
    location: 'FREEDMEN’S TOWN NEIGHBORHOOD (Houston, TX)',
    illustrationPath: 'illustrations/CC_02.Blackbiird.png',
    videoPath: 'video/Blackbiird.mp4',
    audioPath: 'audio/BLACKBIIRD.mp3',
    audioStartTime: 5,
    contexts: [
      {label: `You were only waiting for this moment to arise…`, 
      pages: [
        `Set against a moonlit hot summer night, this scene captures the quiet insomnia of a young woman contemplating what’s next. She is anxious, introspective and honestly a bit bored.\n\nGrackles sing softly outside her window.`, 
        `This chapter hints at isolation, while the grackles, symbols of intelligence, resourcefulness and opportunity, hint at the act of leaving the nest.`,
        `Freedmen's Town · Houston, TX\n\nFounded in the 1860s by formerly enslaved Houstonians in the 4th Ward. Residents laid their own brick streets by hand — many still stand today.`,
        `Freedmen's Town · Houston, TX\n\nA birthplace of Black Houston's churches, businesses, and civic life.`]
      }
    ],
  },
  '16-carriages': {
    title: 'ACT I, SCENE III - 16 Carriages',
    song: '16 Carriages',
    location: 'A LONG BACK ROAD ALONG THE SHAWNEE TRAIL',
    illustrationPath: 'illustrations/CC_03.16_Carriages.png',
    videoPath: 'video/16_Carriages.mp4',
    audioPath: 'audio/16_CARRIAGES.mp3',
    audioStartTime: 0,
    contexts: [
      {label: `For legacy, if it’s the last thing I do…`, 
      pages: [
        `A carriage rattles down a dusty road, carrying the protagonist away from her home. Her belongings are carefully packed; her gaze is fixed on the horizon.`, 
        `Set against the backdrop of the early 1900s rural South, the scene captures both the hope and the heartbreak of leaving.`]
      }
    ],
  },
  'texas-hold-em': {
    title: `ACT II, SCENE I - Texas Hold 'Em`,
    song: 'Texas Hold Em',
    location: 'A HOEDOWN IN TAMINA, TEXAS',
    illustrationPath: 'illustrations/CC_04.Texas_Hold_Em.png',
    videoPath: `video/Texas_Hold_Em.mp4`,
    audioPath: 'audio/TEXAS_HOLD_EM.mp3',
    audioStartTime: 12,
    contexts: [
      {label: `So lay your cards down, down, down, down…`, 
      pages: [
        `Our protagonist stumbles upon a good ol' country hoedown before shit gets real. A dusty barnyard erupts, dancers in between a two-step and a whiskey refill.`, 
        `Cards scatter tables, boots and their spurs blur in motion, and at the center, a budding love interest spins our protagonist in the middle, takes one step to the right, and then runs to the left.\n\nThis is jubilee even in times unsettled.`,
        `Tamina · Montgomery County, TX\n\nFounded in 1871 as "Tammany" by freedmen who helped build the Houston and Great Northern Railroad.`,
        `Tamina · Montgomery County, TX\n\nThe oldest surviving freedmen's town in Texas and still home to its founders' descendants.`]
      }
    ],
  },
  'bodyguard': {
    title: 'ACT II, SCENE II - Bodyguard',
    song: 'Bodyguard',
    location: 'A HOMESTEAD IN BOLEY, OKLAHOMA',
    illustrationPath: 'illustrations/CC_05.Bodyguard.png',
    videoPath: 'video/Bodyguard.mp4',
    audioPath: 'audio/BODYGUARD.mp3',
    audioStartTime: 7,
    contexts: [
      {label: `Somebody better hold me back…`, 
      pages: [ 
        `Lovers who have nothing but humble beginnings, a few dogs, the wind, a loaded shotgun and each other for protection.\n\nI guess that's enough.`,
        `Boley · OK\n\nFounded in 1903 on former Creek Nation land along the Fort Smith & Western Railroad.`, 
        `Boley · OK\n\nGrew into one of the largest and most prosperous all-Black towns in America.`]
      }
    ],
  },
  'jolene': {
    title: 'ACT II, SCENE III - Jolene',
    song: 'Jolene',
    location: 'A SALOON IN TAFT, OKLAHOMA',
    illustrationPath: 'illustrations/CC_06.Jolene.png',
    videoPath: 'video/Jolene.mp4',
    audioPath: 'audio/JOLENE.mp3',
    audioStartTime: 11,
    contexts: [
      {label: `I’m still a Creole banjee bitch from Louisianne…`, 
      pages: [
        `Two women willing to die behind theirs: love, lust, power, and respect. Faceless beneath her hat, she stands with pistol drawn. Somewhere behind the barrels someone whispers a prayer.`,
        `This chapter reinterprets a classic tale of jealousy as one of enraged vitriol.\n\nThe Oklahoman summer heat does no favors when it comes to keeping tensions low.`,
        `Taft · OK\n\nFounded in 1902, originally called Twine. One of Oklahoma's largest all-Black towns, later renamed for President William Howard Taft.`]
      }
    ],
  },
  'daughter': {
    title: 'ACT II, SCENE IV - Daughter',
    song: 'Daughter',
    location: 'A CHAPEL IN DEARFIELD, COLORADO',
    illustrationPath: 'illustrations/CC_07.Daughter.png',
    videoPath: 'video/Daughter.mp4',
    audioPath: 'audio/DAUGHTER.mp3',
    audioStartTime: 10,
    contexts: [
      {label: `Help me, Lord, from these fantasies in my head…`, 
      pages: [
        `The chapel is empty except for her and the blood on her hands. She kneels at the altar, not sure if she is praying for forgiveness though.\n\nCandles burn low, cigarette smoke curling toward the ceiling like the ghosts of Jolenes.`, 
        `Daughter is the saga’s darkest reckoning: an unflinching portrait of a lover's rage and the cost of carrying unchecked pain.`,
        `Dearfield · CO\n\nFounded in 1910 by Oliver Toussaint Jackson on Colorado's high plains.`,
        `Dearfield · CO\n\nA self-sufficient Black farming colony that peaked at 700 residents before drought and the Depression emptied it out.`]
      }
    ],
  },
  'spaghettii': {
    title: 'ACT II, SCENE V - Spaghettii',
    song: 'Spaghettii',
    location: 'A TRAIN ROBBERY IN WILCOX, WYOMING',
    illustrationPath: 'illustrations/CC_08.Spaghettii II.png',
    videoPath: 'video/Spaghettii.mp4',
    audioPath: 'audio/SPAGHETTII.mp3',
    audioStartTime: 44,
    contexts: [
      {label: `One hand on my holster then pass it to Hova…`, 
      pages: [
        `A train screeches through the Wyoming landscape. Basically standing atop her horse, pistol raised, our protagonist commands her gang with the confidence of a born leader.\n\n “Spaghettii” reimagines the Western outlaw.`, 
        `The scene is framed as both spectacle and subversion: the robbery becomes a metaphor for reclaiming ownership, seizing what history denied.`]
      }
    ],
  },
  'alliigator-tears': {
    title: 'ACT II, SCENE VI - Alliigator Tears',
    song: 'Alliigator Tears',
    location: 'THE UNITED STATES OF AMERICA',
    illustrationPath: 'illustrations/CC_09.Alliigator_Tears.png',
    videoPath: 'video/Alliigator_Tears.mp4',
    audioPath: 'audio/ALLIGATOR_TEARS.mp3',
    audioStartTime: 25,
    contexts: [
      {label: `How does it feel to be adored?`, 
      pages: [
        `A biting political cartoon.`]
      }
    ],
  },
  'just-for-fun': {
    title: 'ACT II, SCENE VII - Just For Fun',
    song: 'Just For Fun',
    location: 'GUTHRIE, OKLAHOMA',
    illustrationPath: 'illustrations/CC_10.Just_For_Fun.png',
    videoPath: 'video/Just_For_Fun.mp4',
    audioPath: 'audio/JUST_FOR_FUN.mp3',
    audioStartTime: 12,
    contexts: [
      {label: `I need to get through this, or just get used to it…`, 
      pages: [
        `A lone cowboy tends to a small campfire under the wide Oklahoma night sky. His horse grazes quietly nearby, its silhouette stark against the moonlit horizon. The desert around them stretches endlessly, both beautiful and unforgiving.`]
      }
    ],
  },
  'ii-most-wanted': {
    title: 'ACT II, SCENE VIII - II Most Wanted',
    song: 'II Most Wanted',
    location: 'IN HIDING IN NICODEMUS, KANSAS',
    illustrationPath: 'illustrations/CC_11.II_Most_Wanted.png',
    videoPath: 'video/II_Most_Wanted.mp4',
    audioPath: 'audio/II_MOST_WANTED.mp3',
    audioStartTime: 20,
    contexts: [
      {label: `I'll be your shotgun rider…`, 
      pages: [
        `Two friends (lovers?) lean on each other, sun rays peeking through the blinds.\n\nTheir intimacy is quiet: resting head in lap, staring at the ceiling and sharing a cigarette.`, 
        `This chapter reframes outlaw love not as Bonnie-and-Clyde chaos but as a queer sanctuary: fugitives bound together by trust amid persecution and pursuit.`,
        `Nicodemus · KS\n\nFounded in 1877 by "Exodusters" fleeing the post-Reconstruction South. The oldest, and only remaining, Black settlement west of the Mississippi and now a National Historic Site.`,]
      }
    ],
  },
  'leviis-jeans': {
    title: 'ACT II, SCENE IX - Levii’s Jeans',
    song: 'Levii’s Jeans',
    location: 'AT HOME IN OGDEN, UTAH',
    illustrationPath: 'illustrations/CC_12.Leviis_Jeans.png',
    videoPath: 'video/Leviis_Jeans.mp4',
    audioPath: 'audio/LEVIIS_JEANS.mp3',
    audioStartTime: 22,
    contexts: [
      {label: `Girl, you don’t need designer…`, 
      pages: [
        `The lovers meet again at home. Wind tugs at the clothesline, lifting damp denim into the dry Utah air.\n\nDenim, sweat, and quiet admiration during household chores fuse into something familiar again.`, 
        `With the Cadillac parked nearby and a train passing by in the distance, this is a love scene personified as Americana, transforming rugged workwear into sacred ritual.`]
      }
    ],
  },
  'flamenco': {
    title: 'ACT II, SCENE X - Flamenco',
    song: 'Flamenco',
    location: 'A GRAVEYARD IN ALLENSWORTH, CALIFORNIA',
    illustrationPath: 'illustrations/CC_13.Flamenco.png',
    videoPath: 'video/Flamenco.mp4',
    audioPath: 'audio/FLAMENCO.mp3',
    audioStartTime: 8,
    contexts: [
      {label: `They won't be around…`, 
      pages: [
        `In a dusty grave in old California, we remember lives and loves past. The graves here have no real names, just markers beaten smooth by wind and sun.\n\nA trumpet sounds in remembrance.`, 
        `Blending Black Western history with Spanish frontier motifs, Flamenco reclaims forgotten narratives. The trumpet also speaks to Mexico's contribution to American music.`,
        `Allensworth · CA\n\nFounded in 1908 by Lt. Col. Allen Allensworth, a former slave and Union Army chaplain. The first California town founded, financed, and governed entirely by Black Americans.`]
      }
    ],
  },
  'ya-ya': {
    title: 'ACT III, SCENE I - Ya Ya',
    song: 'YA YA',
    location: 'THE MOON',
    illustrationPath: 'illustrations/CC_14.YA_YA.png',
    videoPath: 'video/Ya_Ya.mp4',
    audioPath: 'audio/YA_YA.mp3',
    audioStartTime: 65,
    contexts: [
      {label: `Those petty ones can’t fuck with me…`, 
      pages: [
        `Somewhere between past and future, a stage blooms on the surface of the Moon. Beneath a fluttering American flag, our protagonist, sequined and electric, leads a performance that transcends gravity.`, 
        `Drawing from the wild energy of 20th-century soul revues, the scene fuses cosmic imagery with Southern showmanship.\n\n“Ya Ya” is where sound, spectacle, and legacy are reclaimed in a realm untouched by earthly rules.`]
      }
    ],
  },
  'oh-louisiana': {
    title: 'ACT III, SCENE II - Oh Louisiana',
    song: 'Oh Louisiana',
    location: 'A DINER IN NEW ORLEANS, LOUISIANA',
    illustrationPath: 'illustrations/CC_15.Oh_Louisiana.png',
    videoPath: 'video/Oh_Louisiana.mp4',
    audioPath: 'audio/OH_LOUISIANA.mp3',
    audioStartTime: 5,
    contexts: [
      {label: `I stayed away from you too long…`, 
      pages: [
        `A jukebox hums softly, spinning a Chuck Berry tune that fills the still air with memory. Chrome counters gleam, coffee cools in forgotten cups, and the silence feels almost sacred.`, 
        `This is the quiet aftermath of an out-of-this-world party and a love letter to the South and its ghosts.`]
      }
    ],
  },
  'desert-eagle': {
    title: 'ACT III, SCENE III - Desert Eagle',
    song: 'Desert Eagle',
    location: 'A BROTHEL IN ELDORADO CANYON, NEVADA',
    illustrationPath: 'illustrations/CC_16.Desert_Eagle.png',
    videoPath: 'video/Desert_Eagle.mp4',
    audioPath: 'audio/DESERT_EAGLE.mp3',
    audioStartTime: 8,
    contexts: [
      {label: `Make ‘em Cash App to see the rodeo…`, 
      pages: [
        `Inside a brothel draped in velvet and lamplight, our protagonist reclines — poised between power and performance. Gold jewelry catches the glow, and hidden on the nearby nightstand, a Desert Eagle rests beside a glass of red wine.`,
        `The composition suggests more than it reveals, inviting viewers to confront the intersection of desire and danger in the lawless world of the Western frontier.`] 
      }
    ],
  },
  'riiverdance': {
    title: 'ACT III, SCENE IV - Riiverdance',
    song: 'Riiverdance',
    location: 'ALONG THE COLORADO RIVER',
    illustrationPath: 'illustrations/CC_17.Riiverdance.png',
    videoPath: 'video/Riiverdance.mp4',
    audioPath: 'audio/RIIVERDANCE.mp3',
    audioStartTime: 5,
    contexts: [
      {label: `He was my mess, my ball of string…`, 
      pages: [
        `Their bodies blur into motion. Joyous, fleeting, wild.`] 
      }
    ],
  },
  'ii-hands-ii-heaven': {
    title: 'ACT III, SCENE V - II Hands II Heaven',
    song: ' II Hands II Heaven',
    location: 'THE GREAT BASIN DESERT',
    illustrationPath: 'illustrations/CC_18.II_Hands_II_Heaven II.png',
    videoPath: 'video/II_Hands_II_Heaven.mp4',
    audioPath: 'audio/II_HANDS_II_HEAVEN.mp3',
    audioStartTime: 7,
    contexts: [
      {label: `Baby, I've been waiting my whole life…`, 
      pages: [
        `A Cadillac idles in the Nevada desert, windows fogged, pink smoke curling from beneath the chassis. Wild horses gallop under a full moon, and slow tunes play faintly through the car's speakers.\n\nThis kind of love-making is futuristic, cosmic.`, 
        `This chapter blurs passion and the otherworldly. The lovers’ intimacy, though unseen, radiates through the scene’s surreal details.`]
      }
    ],
  },
  'tyrant': {
    title: 'ACT III, SCENE VI - Tyrant',
    song: 'Tyrant',
    location: 'TOMBSTONE, ARIZONA',
    illustrationPath: 'illustrations/CC_19.Tyrant II.png',
    videoPath: 'video/Tyrant.mp4',
    audioPath: 'audio/TYRANT.mp3',
    audioStartTime: 50,
    contexts: [
      {label: `Hide ya man when the hangman come in town…`, 
      pages: [
        `The protagonist, now a hangman, gallops across scrubland with lasso raised. At her feet lie the town’s captured outlaws, bound and hooded, trophies of her cold efficiency. She sets her sights on the prize, lures it in, and gallops away with her bounty into the night.`]
      }
    ],
  },
  'sweet-honey-buckiin': {
    title: 'ACT III, SCENE VII - Sweet Honey Buckiin',
    song: 'Sweet Honey Buckiin',
    location: 'THE SONORAN DESERT',
    illustrationPath: 'illustrations/CC_20.Sweet_Honey_Buckiin III.png',
    videoPath: 'video/Sweet_Honey_Buckiin.mp4',
    audioPath: 'audio/SWEET_HONEY_BUCKIIN.mp3',
    audioStartTime: 9,
    contexts: [
      {label: `AOTY, who ain’t win?`, 
      pages: [
        `A rodeo bull bucks violently as rattlesnakes coil at the arena’s edge; the crowd cheers for the new champion in town. Her command of the bull and the crowd speaks to her showmanship ability and her penchant for proving the naysayers wrong.`, 
        `Exuberant and triumphant, Sweet Honey Buckiin’ crowns the saga’s arc: a reclamation of joy, heritage, and self-determination.`]
      }
    ],
  },
  'amen': {
    title: 'ACT III, SCENE VIII - Amen',
    song: 'Amen',
    location: 'BLACKDOM, NEW MEXICO',
    illustrationPath: 'illustrations/CC_21.Amen II.png',
    videoPath: 'video/Amen.mp4',
    audioPath: 'audio/AMEN.mp3',
    audioStartTime: 91,
    contexts: [
      {label: `Them old ideas are buried here. Amen…`, 
      pages: [
        `Notice the thread running through every stop on this journey--not the myth of the Old West as it's usually told, but the frontier as it was actually lived...`,
        `...by people who showed up anyway, who built anyway, who claimed space in a story that tried to write them out of it.`,
        `Dedicated to the fearless ones who aim to challenge the status quo and flip the establishment on its head.`,
        `Blackdom · NM\n\nFounded in 1903 by Francis Boyer near Roswell. New Mexico's first Black settlement and an agricultural colony built on hope and hard land, undone by drought by the 1920s.`]
      }
    ],
  },
}

let selectedIndex = 0;
let contextIndex = 0;



async function connectArduino() {
  if (!('serial' in navigator)) {
    console.error('Web Serial not supported in this browser — use Chrome or Edge.');
    return;
  }
  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 9600 });
 
    const textDecoder = new TextDecoderStream();
    serialPort.readable.pipeTo(textDecoder.writable);
    serialReader = textDecoder.readable.getReader();
 
    console.log('Arduino connected.');
    readSerialLoop();
  } catch (err) {
    console.error('Serial connection failed:', err);
  }
}

async function readSerialLoop() {
  const { value, done } = await serialReader.read();
  if (done) return;

  serialBuffer += value;
  const lines = serialBuffer.split('\n');
  serialBuffer = lines.pop(); // keep any incomplete trailing line for next read
  
  lines.forEach(line => {
    try {
      handleSerialLine(line);
    } catch (err) {
      console.error('Error handling serial line:', line, err);
    }
  });

  // lines.forEach(handleSerialLine);

  readSerialLoop(); // schedule the next read — recursion, not a loop
}

async function setup() {
  img = await loadImage('TOIABH Interactive Map.png');
  font = await loadFont('WesternBangBang-Regular.ttf');
  mapMusic = await loadSound('audio/INSTRUMENTAL.mp3');

  const chapterIds = Object.keys(chapters);
  for (const id of chapterIds) {
    console.log('loading:', id, chapters[id].illustrationPath);
    chapters[id].illustration = await loadImage(chapters[id].illustrationPath);
    console.log('loaded:', id, '— dimensions:', chapters[id].illustration.width, chapters[id].illustration.height);

    if (chapters[id].audioPath) {
      chapters[id].audio = await loadSound(chapters[id].audioPath);
     }

  }
  console.log('preload complete — all chapters processed');
  console.log(chapters['ameriican-requiem'].audio);
  console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(chapters['ameriican-requiem'].audio)));

  console.log(chapters['ameriican-requiem'].audio.play.toString());
  console.log(chapters['ameriican-requiem'].audio.jump.toString());

  createCanvas(1280, 720);
  // Center the fixed-size canvas within the browser window, black
  // fills everywhere the canvas doesn't reach — canvas size never
  // changes, regardless of the actual screen/monitor resolution.
  document.documentElement.style.height = '100%';
  document.body.style.height = '100%';
  document.body.style.margin = '0';
  document.body.style.backgroundColor = '#000000';
  document.body.style.display = 'flex';
  document.body.style.justifyContent = 'center';
  document.body.style.alignItems = 'center';

}

function draw() {
  if (sceneMode === 'map') {
    drawMapScene();
  } else if (sceneMode === 'illustration') {
    drawIllustrationScene();
  }
  drawVolumeIndicator();
  drawContextModal();
}

function drawMapScene() {
  background(220)
  const displayWidth = width;
  const displayHeight = displayWidth * (img.height / img.width);
  image(img, 0, 0, displayWidth, displayHeight);
  drawVisitedTrail();
  drawMarkers();
  drawContextLabel();
  // textFont(font);
  // text('Context', 225, 660);
}

function playInstrumental() {
  if (!mapMusic) return;
  mapMusic.jump(0);
  mapMusic.play();
  mapMusic.output.gain.value = volume;
}

function stopInstrumental() {
  if (mapMusic && mapMusic.isPlaying()) {
    mapMusic.stop();
  }
}

function drawMarkers() {
  places.forEach((place, i) => {
    const markerIndex = i + 1;
    const isSelected = (markerIndex === selectedIndex);
    const isVisited = visitedMarkers.has(markerIndex);

    noStroke();
    if (isSelected) {
      fill('#fdaf24');
    } else if (isVisited) {
      fill('#fdaf24');
    } else {
      fill('#000000');
    }

    const size = isSelected ? 14 : 8;
    circle(place.x, place.y, size);

    if(isSelected) {
      textFont(font);
      fill('#000000');
      textAlign(CENTER, BOTTOM);
      textSize(25);
      text(place.name, place.x, place.y - 14);
    }
    if(isSelected) {
      textFont(font);
      fill('#fdaf24');
      textAlign(CENTER, BOTTOM);
      textSize(24);
      text(place.name, place.x, place.y - 14);
    }
  });
}

const CONTEXT_LABEL_X = 200;
const CONTEXT_LABEL_Y = 640;

function drawContextLabel() {
  const isActive = showContextModal || isContextLabelClicked(mouseX, mouseY) || selectedIndex === 0;
  
  fill(isActive ? '#fdaf24' : '#000000');
  textFont(font);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  textSize(18);
  text('Context', CONTEXT_LABEL_X, CONTEXT_LABEL_Y);
}

function isContextLabelClicked(mx, my) {
  return mx >= CONTEXT_LABEL_X && mx <= CONTEXT_LABEL_X + 90 &&
         my >= CONTEXT_LABEL_Y && my <= CONTEXT_LABEL_Y + 26;
}

function drawVolumeIndicator() {
  if (!showVolumeIndicator) return;

  if (millis() - volumeIndicatorLastChange > VOLUME_INDICATOR_DURATION) {
    showVolumeIndicator = false;
    return;
  }

  const barW = 200;
  const barH = 8;
  const x = width - barW - 30;
  const y = 30;

  // Card background — same cream/border language as the postcard/placard
  fill('#f0e6d2');
  stroke('#2a1a10');
  strokeWeight(1);
  rect(x - 16, y - 24, barW + 32, 56, 3);
  noStroke();

  fill('#a8532e');
  textFont('Georgia');
  textStyle(ITALIC);
  textAlign(LEFT, TOP);
  textSize(11);
  text('VOLUME', x, y - 18);

  fill('#c9bda3'); // track
  rect(x, y, barW, barH, 2);

  fill('#a8532e'); // fill
  rect(x, y, barW * volume, barH, 2);

  textStyle(NORMAL);
}

function drawContextModal() {
  if (!showContextModal) return;

  noStroke();
  fill(0, 0, 0, 160);
  rect(0, 0, width, height);

  const cardW = 541;
  const cardH = 700;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  fill('#f0e6d2');
  stroke('#2a1a10');
  strokeWeight(1);
  rect(cardX, cardY, cardW, cardH);
  strokeWeight(3);
  line(cardX, cardY, cardX + cardW, cardY);
  noStroke();

  fill('#a8532e');
  textFont('Georgia');
  textAlign(LEFT, TOP);
  textSize(14);
  text('A NOTE FROM THE ARTIST', cardX + 36, cardY + 30);

  fill('#2a1a10');
  textStyle(NORMAL);
  textSize(16);
  textLeading(24);
  text(PROJECT_CONTEXT_PAGES[contextPageIndex], cardX + 36, cardY + 64, cardW - 72, cardH - 140);

  fill('#6b5a45');
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text(`${contextPageIndex + 1} / ${PROJECT_CONTEXT_PAGES.length}`, width / 2, cardY + cardH - 40);

  textStyle(ITALIC);
  text('Turn DIAL to cycle · Press DIAL to close', width / 2, cardY + cardH - 20);

  textStyle(NORMAL); // reset — same italics-leak lesson as the volume indicator
}

function drawVisitedTrail() {
  if (visitedOrder.length < 2) return; // need at least two visited places to draw a line

  stroke('#fdaf24');
  strokeWeight(2);
  for (let i = 1; i < visitedOrder.length; i++) {
    const prevPlace = places[visitedOrder[i - 1] - 1];
    const currPlace = places[visitedOrder[i] - 1];
    line(prevPlace.x, prevPlace.y, currPlace.x, currPlace.y);
  }
  noStroke();
}

function computeNarrationPages() {
  if (!currentChapter || !currentChapter.contexts || currentChapter.contexts.length === 0) {
    narrationPages = [''];
    narrationPageIndex = 0;
    return;
  }
  const ctx = currentChapter.contexts[contextIndex];
  const cardW = 320;
  const cardH = 160;
  narrationPages = paginateText(ctx.text, cardW - 40, cardH - 100, 13, 18);
  narrationPageIndex = 0;
}

function paginateText(str, maxWidth, maxHeight, size, leading) {
  textFont('Georgia');
  textSize(size);
  textLeading(leading);

  const paragraphs = str.split('\n\n');
  let lines = [];

  paragraphs.forEach((para, pIndex) => {
    const words = para.split(/\s+/).filter(w => w.length > 0);
    let currentLine = '';

    words.forEach(word => {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      if (textWidth(testLine) > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    if (pIndex < paragraphs.length - 1) {
      lines.push(''); // blank line for the paragraph gap — now counted, not silently absorbed
    }
  });

  const linesPerPage = Math.floor(maxHeight / leading);
  let pages = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage).join('\n'));
  }
  return pages.length ? pages : [''];
}

function drawPlacard() {
  const contexts = currentChapter.contexts || [];
  if (contexts.length === 0) return; // nothing to show yet for this chapter

  const ctx = contexts[contextIndex];
  const pages = ctx.pages || [''];
  const cardW = 320;
  const cardH = 160;
  const cardX = width - cardW - 30;
  const cardY = height - cardH - 30;

  // Card background — aged cream, thin border, heavier top edge
  // like a label actually mounted to a wall
  fill('#f0e6d2');
  stroke('#2a1a10');
  strokeWeight(1);
  rect(cardX, cardY, cardW, cardH);
  strokeWeight(3);
  line(cardX, cardY, cardX + cardW, cardY);
  noStroke();

  // Quote
  fill('#a8532e');
  textFont('Georgia');
  textStyle(ITALIC);
  textAlign(LEFT, TOP);
  textSize(12);
  textLeading(20);
  text(`"${ctx.label}"`, cardX + 20, cardY + 16, cardW - 40, 60);

  // Narration — current page only
  fill('#2a1a10');
  textStyle(NORMAL);
  textSize(12);
  textLeading(18);
  text(pages[narrationPageIndex], cardX + 20, cardY + 40, cardW - 40, cardH - 40);

  // // Label — small caps, accent color
  // fill('#a8532e');
  // textFont('Georgia');
  // textStyle(BOLD);
  // textAlign(LEFT, TOP);
  // textSize(16);
  // text('James M. Marshall', cardX + 20, cardY + 16);
  // // text(ctx.label.toUpperCase(), cardX + 20, cardY + 16);

  // // Body — restrained serif, deliberately plainer than the
  // // display font used for the chapter title
  // fill('#2a1a10');
  // textStyle(NORMAL);
  // textSize(14);
  // textLeading(19);
  // text('American, 1990', cardX + 20, cardY + 40, cardW - 40, cardH - 60);
  // textStyle(BOLD);
  // textSize(14);
  // text(ctx.text, cardX + 20, cardY + 80, cardW - 40, cardH - 60);
  // textStyle(NORMAL)
  // textSize(12);
  // text('Bauxite, silica, cobalt, and lithium on Gorilla Glass', cardX + 20, cardY + 104, cardW - 40, cardH - 60);

  // Position indicator — only when there's more than one entry
  if (pages.length > 1) {
    fill('#6b5a45');
    textAlign(RIGHT, BOTTOM);
    textSize(11);
    text(`${narrationPageIndex + 1} / ${pages.length}`, cardX + cardW - 16, cardY + cardH - 12);
  } else if (contexts.length > 1) {
    fill('#6b5a45');
    textAlign(RIGHT, BOTTOM);
    textSize(11);
    text(`${contextIndex + 1} / ${contexts.length}`, cardX + cardW - 16, cardY + cardH - 12);
  }
}

function selectNextMarker() {
  selectedIndex = (selectedIndex + 1) % (places.length + 1);
}

function selectPreviousMarker() {
  selectedIndex = (selectedIndex - 1 + (places.length + 1)) % (places.length + 1);
}

function confirmMarkerSelection() { // specifies that the scene should change on action
    if (selectedIndex === 0) {
    openContextModal();
    return;
  }
  
  if (!visitedMarkers.has(selectedIndex)) {
    visitedOrder.push(selectedIndex);
  }
  visitedMarkers.add(selectedIndex);

  stopCurrentAudio();

  const place = places[selectedIndex - 1];
  currentChapter = chapters[place.chapterId];
  contextIndex = 0;
  narrationPageIndex = 0;
  sceneMode = 'illustration';

  if (currentChapter.videoPath) {
    videoFinished = false;
    if (!currentChapter.video) {
      currentChapter.video = createVideo(currentChapter.videoPath);
      currentChapter.video.hide();
      currentChapter.video.volume(0);
      currentChapter.video.onended(() => {
        videoFinished = true;
      });
    } else {
      currentChapter.video.time(0);
    }
    currentChapter.video.play();
  } else {
    videoFinished = true;
  }

  // moved out here — runs every time, regardless of video
  if (currentChapter.audio) {
    currentChapter.audio.play();
    currentChapter.audio.jump(currentChapter.audioStartTime || 0);
    currentChapter.audio.output.gain.value = volume;
  }

    // audioStopTimer = setTimeout(() => { // specifies when to turn a song off
    //   stopCurrentAudio(); // calls the function that specifies when to cut a song off; in this case 90 secs
    // }, CHAPTER_AUDIO_DURATION * 1000); // multiplies the duration of a song by 1000 miliseconds
    // currentChapter.audio.play(0, 1, volume, currentChapter.audioStartTime || 0, CHAPTER_AUDIO_DURATION);
    
    // currentChapter.audio.play();
    // currentChapter.audio.setVolume(volume);
    // currentChapter.audio.jump(currentChapter.audioStartTime || 0, CHAPTER_AUDIO_DURATION);

}



function selectNextContext() {
  if (!currentChapter || !currentChapter.contexts || currentChapter.contexts.length === 0) return;
  const pages = currentChapter.contexts[contextIndex].pages || [''];
  if (narrationPageIndex < pages.length - 1) {
    narrationPageIndex++;
  } else {
    contextIndex = (contextIndex + 1) % currentChapter.contexts.length;
    narrationPageIndex = 0;
  }
}

function selectPreviousContext() {
  if (!currentChapter || !currentChapter.contexts || currentChapter.contexts.length === 0) return;
  if (narrationPageIndex > 0) {
    narrationPageIndex--;
  } else {
    contextIndex = (contextIndex - 1 + currentChapter.contexts.length) % currentChapter.contexts.length;
    const pages = currentChapter.contexts[contextIndex].pages || [''];
    narrationPageIndex = pages.length - 1;
  }
}

function cycleNext() {
  if (showContextModal) {
    nextContextPage();
    return;
  }
  if (sceneMode === 'map') {
    selectNextMarker();
  } else if (sceneMode === 'illustration') {
    selectNextContext();
  }
}

function cyclePrevious() {
  if (showContextModal) {
    previousContextPage();
    return;
  }
  if (sceneMode === 'map') {
    selectPreviousMarker();
  } else if (sceneMode === 'illustration') {
    selectPreviousContext();
  }
}

function confirmOrBack() {
  if (showContextModal) {
    closeContextModal();
    return;
  }
  if (sceneMode === 'map') {
    confirmMarkerSelection();
  } else if (sceneMode === 'illustration') {
    goBack();
  }
}

function openContextModal() {
  showContextModal = true;
  contextPageIndex = 0;
  playInstrumental(); // start the instrumental music when the context modal opens
}

function closeContextModal() {
  showContextModal = false;
  stopInstrumental(); // stop the instrumental music when the context modal closes
}

function nextContextPage() {
  contextPageIndex = (contextPageIndex + 1) % PROJECT_CONTEXT_PAGES.length;
}

function previousContextPage() {
  contextPageIndex = (contextPageIndex - 1 + PROJECT_CONTEXT_PAGES.length) % PROJECT_CONTEXT_PAGES.length;
}

function drawIllustrationScene() {
  background(0);

  fill(255);
  textFont(font);
  textAlign(CENTER, TOP);
  textSize(24);
  text(currentChapter.title, width / 2, 20);
  text(currentChapter.location, width / 2, 50);

  if (currentChapter.videoPath && !videoFinished && currentChapter.video) {
  const dw = width;
  const dh = dw * (currentChapter.video.height / currentChapter.video.width);
  image(currentChapter.video, 0, (height - dh) / 2, dw, dh);
  } else if (currentChapter.illustration) {
    const dw = width;
    const dh = dw * (currentChapter.illustration.height / currentChapter.illustration.width);
    image(currentChapter.illustration, 0, (height - dh) / 2, dw, dh);
  }

  textSize(14);
  text('Press DIAL to go back', width / 2, height - 30);

  drawPlacard();
}

function goBack() {
  stopCurrentAudio();
  if (currentChapter && currentChapter.video) {
    currentChapter.video.pause();
  }
  sceneMode = 'map';
}

function stopCurrentAudio() {
  if (currentChapter && currentChapter.audio && currentChapter.audio.isPlaying()) {
   currentChapter.audio.stop();
 }
}

async function mousePressed() {
  await getAudioContext().resume();

  if (showContextModal) {
    closeContextModal();
    return;
  }

  if (sceneMode !== 'map') return;

  if (isContextLabelClicked(mouseX, mouseY)) {
    openContextModal();
    return;
  }

  const clickRadius = 12; // generous hit area — bigger than the visible 8px dot, easier to actually click
  let closestIndex = -1;
  let closestDist = Infinity;

  places.forEach((place, i) => {
    const d = dist(mouseX, mouseY, place.x, place.y);
    if (d < clickRadius && d < closestDist) {
      closestIndex = i;
      closestDist = d;
    }
  });

  if (closestIndex !== -1) {
    selectedIndex = closestIndex + 1;
    confirmMarkerSelection();
  }
}

async function keyPressed() {
  await getAudioContext().resume();

  if (code === RIGHT_ARROW) {
    cycleNext();
  } else if (code === LEFT_ARROW) {
    cyclePrevious();
  } else if (code === ENTER) {
    confirmOrBack();
  }

  if (key === 'b' || key === 'B') {
    goBack();
  }

  if (key === 'f' || key === 'F') {
    fullscreen(!fullscreen());
  }

  if (key === 'c' || key === 'C') {
    connectArduino();
  }
}

function handleSerialLine(rawLine) {
  const command = rawLine.trim();

  if (command === 'NEXT') {
    cycleNext();
  } else if (command === 'PREV') {
    cyclePrevious();
  } else if (command === 'SELECT') {
    confirmOrBack();
  } else if (command.startsWith('VOL:')) {
    const percent = parseInt(command.slice(4), 10);
    if (!isNaN(percent)) {
      setVolume(percent / 100);
    }
  }
}

function setVolume(v) {
  console.log('setVolume called with:', v);
  volume = constrain(v, 0, 1);
  if (currentChapter && currentChapter.audio) {
    console.log('applying gain:', volume, 'to', currentChapter.song);
    currentChapter.audio.output.gain.value = volume;
    console.log('gain is now:', currentChapter.audio.output.gain.value);
  } else {
    console.log('no current chapter/audio to apply volume to');
  } 

  if (mapMusic) {
    mapMusic.output.gain.value = volume;
  }

  showVolumeIndicator = true;
  volumeIndicatorLastChange = millis();
}

// function setVolume(v) {
  // volume = constrain(v, 0, 1);
  // if (currentChapter && currentChapter.audio && currentChapter.audio.output) {
   // currentChapter.audio.output.gain.value = volume;
 // }
// }