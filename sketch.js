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

const VOLUME_INDICATOR_DURATION = 1500; // ms it stays visible after the last change

const CHAPTER_AUDIO_DURATION = 90; // seconds — how long each chapter's song plays before auto-stopping

let places = [
  {name: "The Chihuahuan Desert", x: 510.1774, y: 565.6781, chapterId: 'ameriican-requiem'},
  {name: "Freedmen's Town", x: 623.2268, y: 577.9568, chapterId: 'blackbiird'}, 
  {name: "The Shawnee Trail", x: 614.9657, y: 557.6972, chapterId: '16-carriages'},
  {name: "Tamina, TX", x: 593.8148, y: 548.7163, chapterId: 'texas-hold-em'},
  {name: "Boley, OK", x: 627.7173, y: 449.5009, chapterId: 'bodyguard'},
  {name: "Taft, OK", x: 599.808, y: 442.937, chapterId: 'jolene'},
  {name: "Dearfield, CO", x: 493.9346, y: 347.1873, chapterId: 'daughter'},
  {name: "Wilcox, WY", x: 394.327, y: 348.1873, chapterId: 'spaghettii'},
  {name: "America", x: 960.7919, y: 391.2736, chapterId: 'alliigator-tears'},
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
    title: 'ACT I, SCENE I',
    song: 'Ameriican Requiem',
    location: 'THE CHIHUAHUAN DESERT',
    illustrationPath: 'illustrations/CC_01.Ameriican_Requiem I.png',
    audioPath: 'audio/AMERIICAN_REQUIEM.mp3',
    audioStartTime: 56,
    contexts: [
      {label: 'Artist Note', text: 'Ameriican Requiem, 2025'},
      {label: 'Historical Context', text: 'Goodbye to What Has Been'},
    ],
  },
  'blackbiird': {
    title: 'ACT I, SCENE II',
    song: 'Blackbiird',
    location: 'FREEDMEN’S TOWN NEIGHBORHOOD - Houston, TX',
    illustrationPath: 'illustrations/CC_02.Blackbiird.png',
    audioPath: 'audio/BLACKBIIRD.mp3',
    audioStartTime: 5,
    contexts: [
      {label: 'Artist Note', text: 'Blackbiird, 2025'},
      {label: 'Historical Context', text: 'Black Bird, Fly'},
    ],
  },
  '16-carriages': {
    title: 'ACT I, SCENE III',
    song: '16 Carriages',
    location: 'A LONG BACK ROAD ALONG THE SHAWNEE TRAIL',
    illustrationPath: 'illustrations/CC_03.16_Carriages.png',
    audioPath: 'audio/16_CARRIAGES.mp3',
    audioStartTime: 0,
    contexts: [
      {label: 'Artist Note', text: '16 Carriages, 2025'},
      {label: 'Historical Context', text: 'Obedience is Better Than Sacrifice'},
    ],
  },
  'texas-hold-em': {
    title: 'ACT II, SCENE I',
    song: 'Texas Hold Em',
    location: 'A HOEDOWN IN TAMINA, TEXAS',
    illustrationPath: 'illustrations/CC_04.Texas_Hold_Em.png',
    audioPath: 'audio/TEXAS_HOLD_EM.mp3',
    audioStartTime: 40,
    contexts: [
      {label: 'Artist Note', text: 'Texas Hold Em, 2025'},
      {label: 'Historical Context', text: 'A Hootin Hollerin Hoedown'},
    ],
  },
  'bodyguard': {
    title: 'ACT II, SCENE II',
    song: 'Bodyguard',
    location: 'A HOMESTEAD IN BOLEY, OKLAHOMA',
    illustrationPath: 'illustrations/CC_05.Bodyguard.png',
    audioPath: 'audio/BODYGUARD.mp3',
    audioStartTime: 7,
    contexts: [
      {label: 'Artist Note', text: 'Bodyguard, 2025'},
      {label: 'Historical Context', text: 'Let Me Ride Shotgun'},
    ],
  },
  'jolene': {
    title: 'ACT II, SCENE III',
    song: 'Jolene',
    location: 'A SALOON IN TAFT, OKLAHOMA',
    illustrationPath: 'illustrations/CC_06.Jolene.png',
    audioPath: 'audio/JOLENE.mp3',
    audioStartTime: 11,
    contexts: [
      {label: 'Artist Note', text: 'Jolene, 2025'},
      {label: 'Historical Context', text: 'Heated--Hot Hot Hot'},
    ],
  },
  'daughter': {
    title: 'ACT II, SCENE IV',
    song: 'Daughter',
    location: 'A CHAPEL IN DEARFIELD, COLORADO',
    illustrationPath: 'illustrations/CC_07.Daughter.png',
    audioPath: 'audio/DAUGHTER.mp3',
    audioStartTime: 10,
    contexts: [
      {label: 'Artist Note', text: 'Daughter, 2025'},
      {label: 'Historical Context', text: 'Its me, God'},
    ],
  },
  'spaghettii': {
    title: 'ACT II, SCENE V',
    song: 'Spaghettii',
    location: 'A TRAIN ROBBERY IN WILCOX, WYOMING',
    illustrationPath: 'illustrations/CC_08.Spaghettii II.png',
    audioPath: 'audio/SPAGHETTII.mp3',
    audioStartTime: 44,
    contexts: [
      {label: 'Artist Note', text: 'Spaghettii, 2025'},
      {label: 'Historical Context', text: 'Now Putcha Hands Up'},
    ],
  },
  'alliigator-tears': {
    title: 'ACT II, SCENE VI',
    song: 'Alliigator Tears',
    location: 'THE UNITED STATES OF AMERICA',
    illustrationPath: 'illustrations/CC_09.Alliigator_Tears.png',
    audioPath: 'audio/ALLIGATOR_TEARS.mp3',
    audioStartTime: 25,
    contexts: [
      {label: 'Artist Note', text: 'Alliigator Tears, 2025'},
      {label: 'Historical Context', text: 'A Biting Political Cartoon'},
    ],
  },
  'just-for-fun': {
    title: 'ACT II, SCENE VII ',
    song: 'Just For Fun',
    location: 'GUTHRIE, OKLAHOMA',
    illustrationPath: 'illustrations/CC_10.Just_For_Fun.png',
    audioPath: 'audio/JUST_FOR_FUN.mp3',
    audioStartTime: 12,
    contexts: [
      {label: 'Artist Note', text: 'Just For Fun, 2025'},
      {label: 'Historical Context', text: 'Everywhere I Go, They Know My Name'},
    ],
  },
  'ii-most-wanted': {
    title: 'ACT II, SCENE VIII',
    song: 'II Most Wanted',
    location: 'IN HIDING IN NICODEMUS, KANSAS',
    illustrationPath: 'illustrations/CC_11.II_Most_Wanted.png',
    audioPath: 'audio/II_MOST_WANTED.mp3',
    audioStartTime: 20,
    contexts: [
      {label: 'Artist Note', text: 'II Most Wanted, 2025'},
      {label: 'Historical Context', text: 'Friends With Benefits'},
    ],
  },
  'leviis-jeans': {
    title: 'ACT II, SCENE IX',
    song: 'Levii’s Jeans',
    location: 'AT HOME IN OGDEN, UTAH',
    illustrationPath: 'illustrations/CC_12.Leviis_Jeans.png',
    audioPath: 'audio/LEVIIS_JEANS.mp3',
    audioStartTime: 124,
    contexts: [
      {label: 'Artist Note', text: 'Leviis Jeans, 2025'},
      {label: 'Historical Context', text: 'America Quintessential'},
    ],
  },
  'flamenco': {
    title: 'ACT II, SCENE X',
    song: 'Flamenco',
    location: 'A GRAVEYARD IN ALLENSWORTH, CALIFORNIA',
    illustrationPath: 'illustrations/CC_13.Flamenco.png',
    audioPath: 'audio/FLAMENCO.mp3',
    audioStartTime: 8,
    contexts: [
      {label: 'Artist Note', text: 'Flamenco, 2025'},
      {label: 'Historical Context', text: 'Help me, God'},
    ],
  },
  'ya-ya': {
    title: 'ACT III, SCENE I',
    song: 'YA YA',
    location: 'THE MOON',
    illustrationPath: 'illustrations/CC_14.YA_YA.png',
    audioPath: 'audio/YA_YA.mp3',
    audioStartTime: 65,
    contexts: [
      {label: 'Artist Note', text: 'Ya Ya, 2025'},
      {label: 'Historical Context', text: 'The Alien Superstar'},
    ],
  },
  'oh-louisiana': {
    title: 'ACT III, SCENE II',
    song: 'Oh Louisiana',
    location: 'A DINER IN NEW ORLEANS, LOUISIANA',
    illustrationPath: 'illustrations/CC_15.Oh_Louisiana.png',
    audioPath: 'audio/OH_LOUISIANA.mp3',
    audioStartTime: 5,
    contexts: [
      {label: 'Artist Note', text: 'Oh Louisiana, 2025'},
      {label: 'Historical Context', text: 'Chucks'},
    ],
  },
  'desert-eagle': {
    title: 'ACT III, SCENE III',
    song: 'Desert Eagle',
    location: 'A BROTHEL IN ELDORADO CANYON, NEVADA',
    illustrationPath: 'illustrations/CC_16.Desert_Eagle.png',
    audioPath: 'audio/DESERT_EAGLE.mp3',
    audioStartTime: 8,
    contexts: [
      {label: 'Artist Note', text: 'Desert Eagle, 2025'},
      {label: 'Historical Context', text: 'Eat My Pussy'},
    ],
  },
  'riiverdance': {
    title: 'ACT III, SCENE IV',
    song: 'Riiverdance',
    location: 'ALONG THE COLORADO RIVER',
    illustrationPath: 'illustrations/CC_17.Riiverdance.png',
    audioPath: 'audio/RIIVERDANCE.mp3',
    audioStartTime: 5,
    contexts: [
      {label: 'Artist Note', text: 'Riiverdance, 2025'},
      {label: 'Historical Context', text: 'Bounce On That Shit, Dance'},
    ],
  },
  'ii-hands-ii-heaven': {
    title: 'ACT III, SCENE V',
    song: ' II Hands II Heaven',
    location: 'THE GREAT BASIN DESERT',
    illustrationPath: 'illustrations/CC_18.II_Hands_II_Heaven II.png',
    audioPath: 'audio/II_HANDS_II_HEAVEN.mp3',
    audioStartTime: 213,
    contexts: [
      {label: 'Artist Note', text: 'II Hands II Heaven, 2025'},
      {label: 'Historical Context', text: 'Cosmic Lovemaking'},
    ],
  },
  'tyrant': {
    title: 'ACT III, SCENE VI',
    song: 'Tyrant',
    location: 'TOMBSTONE, ARIZONA',
    illustrationPath: 'illustrations/CC_19.Tyrant II.png',
    audioPath: 'audio/TYRANT.mp3',
    audioStartTime: 50,
    contexts: [
      {label: 'Artist Note', text: 'Tyrant, 2025'},
      {label: 'Historical Context', text: 'The Law'},
    ],
  },
  'sweet-honey-buckiin': {
    title: 'ACT III, SCENE VII',
    song: 'Sweet Honey Buckiin',
    location: 'THE SONORAN DESERT',
    illustrationPath: 'illustrations/CC_20.Sweet_Honey_Buckiin III.png',
    audioPath: 'audio/SWEET_HONEY_BUCKIIN.mp3',
    audioStartTime: 171,
    contexts: [
      {label: 'Artist Note', text: 'Sweet Honey Buckiin, 2025'},
      {label: 'Historical Context', text: 'Like a Mechanical Bull'},
    ],
  },
  'amen': {
    title: 'ACT III, SCENE VIII',
    song: 'Amen',
    location: 'BLACKDOM, NEW MEXICO',
    illustrationPath: 'illustrations/CC_21.Amen II.png',
    audioPath: 'audio/AMEN.mp3',
    audioStartTime: 7,
    contexts: [
      {label: 'Artist Note', text: 'Amen, 2025'},
      {label: 'Historical Context', text: 'Them Old Ideas Are Buried Here'},
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
}

function drawMapScene() {
  background(220)
  const displayWidth = width;
  const displayHeight = displayWidth * (img.height / img.width);
  image(img, 0, 0, displayWidth, displayHeight);
  drawMarkers();
}

function drawMarkers() {
  places.forEach((place, i) => {
    const isSelected = (i === selectedIndex);

    noStroke();
    fill(isSelected ? '#fdaf24' : '#000000');

    const size = isSelected ? 14 : 8;
    circle(place.x, place.y, size);

    if(isSelected) {
      textFont(font);
      fill('#000000');
      textAlign(CENTER, BOTTOM);
      textSize(24);
      text(place.name, place.x, place.y - 14);
    }
  });
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

function drawPlacard() {
  const contexts = currentChapter.contexts || [];
  if (contexts.length === 0) return; // nothing to show yet for this chapter

  const ctx = contexts[contextIndex];
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

  // Label — small caps, accent color
  fill('#a8532e');
  textFont('Georgia');
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  textSize(16);
  text('James M. Marshall', cardX + 20, cardY + 16);
  // text(ctx.label.toUpperCase(), cardX + 20, cardY + 16);

  // Body — restrained serif, deliberately plainer than the
  // display font used for the chapter title
  fill('#2a1a10');
  textStyle(NORMAL);
  textSize(14);
  textLeading(19);
  text('American, 1990', cardX + 20, cardY + 40, cardW - 40, cardH - 60);
  textStyle(BOLD);
  textSize(14);
  text(ctx.text, cardX + 20, cardY + 80, cardW - 40, cardH - 60);
  textStyle(NORMAL)
  textSize(12);
  text('Bauxite, silica, cobalt, and lithium on Gorilla Glass', cardX + 20, cardY + 104, cardW - 40, cardH - 60);

  // Position indicator — only when there's more than one entry
  if (contexts.length > 1) {
    fill('#6b5a45');
    textAlign(RIGHT, BOTTOM);
    textSize(11);
    text(`${contextIndex + 1} / ${contexts.length}`, cardX + cardW - 16, cardY + cardH - 12);
  }
}

function selectNextMarker() {
  selectedIndex = (selectedIndex + 1) % places.length;
}

function selectPreviousMarker() {
  selectedIndex = (selectedIndex - 1 + places.length) % places.length;
}

function confirmMarkerSelection() { // specifies that the scene should change on action
  stopCurrentAudio(); // in case anything was still playing from a previous chapter

  const place = places[selectedIndex]; // refers to the fact that items in the place array will drive this
  currentChapter = chapters[place.chapterId]; // the current chapter is driven by the chapter id variable in the place array
  contextIndex = 0; // always start a chapter at its first context entry
  sceneMode = 'illustration'; // the scene to switch to is the illustration scene

  if (currentChapter.audio) { // controls the audio
    currentChapter.audio.play(); // play the song that is specified in the place array
    currentChapter.audio.jump(currentChapter.audioStartTime || 0); // the song should start at a specific point, otherwise it should start at 0
    currentChapter.audio.output.gain.value = volume; // this records the current chapter's volume

    audioStopTimer = setTimeout(() => { // specifies when to turn a song off
      stopCurrentAudio(); // calls the function that specifies when to cut a song off; in this case 90 secs
    }, CHAPTER_AUDIO_DURATION * 1000); // multiplies the duration of a song by 1000 miliseconds
    // currentChapter.audio.play(0, 1, volume, currentChapter.audioStartTime || 0, CHAPTER_AUDIO_DURATION);
    
    // currentChapter.audio.play();
    // currentChapter.audio.setVolume(volume);
    // currentChapter.audio.jump(currentChapter.audioStartTime || 0, CHAPTER_AUDIO_DURATION);
  }
}

function stopCurrentAudio() {
  if (audioStopTimer) {
    clearTimeout(audioStopTimer);
    audioStopTimer = null;
  }
  if (currentChapter && currentChapter.audio && currentChapter.audio.isPlaying()) {
    currentChapter.audio.stop();
  }
}

function selectNextContext() {
  if (!currentChapter || !currentChapter.contexts || currentChapter.contexts.length === 0) return;
  contextIndex = (contextIndex + 1) % currentChapter.contexts.length;
}

function selectPreviousContext() {
  if (!currentChapter || !currentChapter.contexts || currentChapter.contexts.length === 0) return;
  contextIndex = (contextIndex - 1 + currentChapter.contexts.length) % currentChapter.contexts.length;
}

function cycleNext() {
  if (sceneMode === 'map') {
    selectNextMarker();
  } else if (sceneMode === 'illustration') {
    selectNextContext();
  }
}

function cyclePrevious() {
  if (sceneMode === 'map') {
    selectPreviousMarker();
  } else if (sceneMode === 'illustration') {
    selectPreviousContext();
  }
}

function confirmOrBack() {
  if (sceneMode === 'map') {
    confirmMarkerSelection();
  } else if (sceneMode === 'illustration') {
    goBack();
  }
}

function drawIllustrationScene() {
  background(0);

  fill(255);
  textFont(font);
  textAlign(CENTER, TOP);
  textSize(24);
  text(currentChapter.title, width / 2, 20);
  text(currentChapter.location, width / 2, 50);

  if (currentChapter && currentChapter.illustration) {
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
  sceneMode = 'map';
}

// function stopCurrentAudio() {
  // if (currentChapter && currentChapter.audio && currentChapter.audio.isPlaying()) {
   // currentChapter.audio.stop();
 // }
// }

async function mousePressed() {
  await getAudioContext().resume();

  if (sceneMode !== 'map') return;

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
    selectedIndex = closestIndex;
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
  showVolumeIndicator = true;
  volumeIndicatorLastChange = millis();
}

// function setVolume(v) {
  // volume = constrain(v, 0, 1);
  // if (currentChapter && currentChapter.audio && currentChapter.audio.output) {
   // currentChapter.audio.output.gain.value = volume;
 // }
// }