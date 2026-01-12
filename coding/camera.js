import { loadAudio } from "../libs/loader.js";
import { DRACOLoader } from "../libs/three.js-r132/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js";

const THREE = window.MINDAR.IMAGE.THREE;

// -----------------------------------------------------------------------------
// 1. DATA CONFIGURATION & LANGUAGE SETUP
// -----------------------------------------------------------------------------

const modelNames = ["Barreleye","Blobfish","Atolla Jellyfish","Dumbo Octopus","Gulper Eel",
  "Yeti Crab","Vampire Squid","Deep-sea Shark","Anglerfish","Sea Angel"];

// 1. Detect Language from URL (e.g., ?lang=ms)
const urlParams = new URLSearchParams(window.location.search);
const langParam = urlParams.get('lang'); 
// Default to 'en' if no language is specified
let currentLanguage = (langParam === 'ms' || langParam === 'my') ? 'ms' : 'en';

console.log("Current Language Mode:", currentLanguage);

// 2. UI Translation Dictionary
const uiLabels = {
    en: {
        audioBtn: "🎧 Audio Log",
        stopBtn: "⏹ Stop Log",
        backLink: "instructions-en.html",
        factBtn: "📘 INTERESTING FACT ✨",
        instructionTitle: "👆 INTERACTION",
        tap1: "Tap 1x:",
        tap1Action: "Action + Talk",
        tap2: "Tap 2x:",
        tap2Action: "Interact",
        gestures: "🤏 Pinch to Zoom | 👆 Drag to Rotate"
    },
    ms: {
        audioBtn: "🎧 Log Audio",
        stopBtn: "⏹ Henti Log",
        backLink: "instructions-my.html", 
        factBtn: "📘 FAKTA MENARIK ✨",
        instructionTitle: "👆 INTERAKSI",
        tap1: "Tekan 1x:",
        tap1Action: "Aksi + Cakap",
        tap2: "Tekan 2x:",
        tap2Action: "Berinteraksi",
        gestures: "🤏 Cubit: Zum | 👆 Seret: Pusing"
    }
};

// 3. Narration Scripts (English & Malay)
const narrationText = {
  en: [
    // 0. Barreleye
    `<b>SPECIES:</b> Barreleye Fish (<i>Macropinna microstoma</i>)<br>
    <b>DEPTH:</b> 600 – 800m<br><br>
    <i>“My head is see-through, and my eyes glow!”</i><br>
    Its transparent head is filled with jelly, and its glowing green eyes can rotate to see prey above — through its own forehead!<br><br>
    <span style='color:#0ea5e9'>★ FUN FACT:</span> It spots the shadows of jellyfish above even in the darkest places!`,

    // 1. Blobfish
    `<b>SPECIES:</b> Blobfish (<i>Psychrolutes marcidus</i>)<br>
    <b>DEPTH:</b> 600 – 1,200m<br><br>
    <i>“I’m not ugly — I’m just under pressure!”</i><br>
    It looks squishy on land, but in the deep ocean, it’s just right. It doesn’t swim — it floats and waits for snacks!<br><br>
    <span style='color:#0ea5e9'>★ FUN FACT:</span> It has no muscles! It lets the ocean do the work while it relaxes.`,

    // 2. Atolla Jellyfish
    `<b>SPECIES:</b> Atolla Jellyfish (<i>Atolla wyvillei</i>)<br>
    <b>DEPTH:</b> 1,000 – 4,000m<br><br>
    <i>“When I’m attacked, I light up!”</i><br>
    It flashes red and blue lights in the dark ocean to scare predators or call for help.<br><br>
    <span style='color:#0ea5e9'>★ FUN FACT:</span> Its blinking light trick is called the 'burglar alarm' strategy!`,

    // 3. Dumbo Octopus
    `<b>SPECIES:</b> Dumbo Octopus (<i>Grimpoteuthis spp.</i>)<br>
    <b>DEPTH:</b> 3,000 – 7,000m<br><br>
    <i>“I flap my fins like ears and float like I’m flying!”</i><br>
    With its round head and big floppy fins, it looks like a cartoon flying underwater in the darkest parts of the ocean.<br><br>
    <span style='color:#0ea5e9'>★ FUN FACT:</span> It lives so deep that it doesn’t even need ink — it’s already pitch black!`,

    // 4. Gulper Eel
    `<b>SPECIES:</b> Gulper Eel (<i>Eurypharynx pelecanoides</i>)<br>
    <b>DEPTH:</b> 500 – 3,000m<br><br>
    <i>“My mouth is bigger than my body!”</i><br>
    It has a long tail and a balloon-like mouth that can open wide enough to swallow prey much larger than its head.<br><br>
    <span style='color:#0ea5e9'>★ FUN FACT:</span> It can unhinge its jaw like a pelican and has a glowing tip on its tail!`,

    // 5. Yeti Crab
    `<b>SPECIES:</b> Yeti Crab (<i>Kiwa hirsuta</i>)<br>
    <b>DEPTH:</b> ~2,200m<br><br>
    <i>“I grow food on my claws!”</i><br>
    This crab waves its hairy arms to grow bacteria, which it later eats — like farming underwater.<br><br>
    <span style='color:#0ea5e9'>★ FUN FACT:</span> It was only discovered in 2005, and it has no eyes!`,

    // 6. Vampire Squid
    `<b>SPECIES:</b> Vampire Squid (<i>Vampyroteuthis infernalis</i>)<br>
    <b>DEPTH:</b> 600 – 900m<br><br>
    <i>“I don’t bite — I just glow and go!”</i><br>
    It uses glowing lights and wraps itself in webbed arms to escape danger like a deep-sea superhero.<br><br>
    <span style='color:#0ea5e9'>★ FUN FACT:</span> Despite the name, it doesn’t drink blood — it eats drifting bits of ocean goo!`,

    // 7. Megamouth Shark (Deep-sea Shark)
    `<b>SPECIES:</b> Megamouth Shark (<i>Megachasma pelagios</i>)<br>
    <b>DEPTH:</b> 120 – 1,500m<br><br>
    <i>“I swim with my giant mouth wide open!”</i><br>
    This slow-swimming shark filters plankton with its huge, glowing lips. It’s one of the ocean’s rarest and most mysterious sharks.<br><br>
    <span style='color:#0ea5e9'>★ FUN FACT:</span> It was only discovered in 1976 — and fewer than 100 have ever been seen!`,

    // 8. Anglerfish
    `<b>SPECIES:</b> Anglerfish (<i>Lophiiformes</i>)<br>
    <b>DEPTH:</b> 300 – 1,600m<br><br>
    <i>“I light up the dark to hunt!”</i><br>
    In the deep, dark sea, the anglerfish waves a glowing lure from her head like a built-in fishing rod. Small fish think it’s food and swim closer... and then SNAP!<br><br>
    <span style='color:#0ea5e9'>★ FUN FACT:</span> The male anglerfish is super tiny and actually fuses to the female like a living attachment — for life!`,

    // 9. Sea Angel
    `<b>SPECIES:</b> Sea Angel (<i>Clione limacina</i>)<br>
    <b>DEPTH:</b> 100 – 1,000m<br><br>
    <i>“I’m tiny, glowing, and graceful — but I’m a hunter too!”</i><br>
    This small glowing creature floats like a fairy, but it’s quick and catches prey with hidden hooks.<br><br>
    <span style='color:#0ea5e9'>★ FUN FACT:</span> It hunts sea butterflies and can outswim much bigger animals!`
  ],
  ms: [
    // 0. Barreleye
    `<b>SPESIES:</b> Ikan Barreleye (<i>Macropinna microstoma</i>)<br>
    <b>KEDALAMAN:</b> 600 – 800m<br><br>
    <i>“Kepala saya lutsinar, dan mata saya bercahaya!”</i><br>
    Kepalanya dipenuhi gel seperti jeli, dan matanya yang hijau boleh berpusing ke atas untuk melihat mangsa — melalui dahinya sendiri!<br><br>
    <span style='color:#0ea5e9'>★ FAKTA MENARIK:</span> Ia boleh mengesan bayang obor-obor walaupun dalam kegelapan!`,

    // 1. Blobfish
    `<b>SPESIES:</b> Blobfish (<i>Psychrolutes marcidus</i>)<br>
    <b>KEDALAMAN:</b> 600 – 1,200m<br><br>
    <i>“Saya bukan hodoh — saya cuma di bawah tekanan!”</i><br>
    Ia kelihatan lembik di darat, tetapi di laut dalam, ia sempurna. Ia tidak berenang — cuma terapung dan menunggu makanan!<br><br>
    <span style='color:#0ea5e9'>★ FAKTA MENARIK:</span> Ia tiada otot! Ia hanya biarkan arus laut bekerja untuknya.`,

    // 2. Atolla Jellyfish
    `<b>SPESIES:</b> Obor-obor Atolla (<i>Atolla wyvillei</i>)<br>
    <b>KEDALAMAN:</b> 1,000 – 4,000m<br><br>
    <i>“Bila diserang, saya menyala!”</i><br>
    Ia menyala merah dan biru untuk menakutkan pemangsa atau memanggil bantuan.<br><br>
    <span style='color:#0ea5e9'>★ FAKTA MENARIK:</span> Trik kilatannya dipanggil strategi 'penggera pencuri'!`,

    // 3. Dumbo Octopus
    `<b>SPESIES:</b> Dumbo Octopus (<i>Grimpoteuthis spp.</i>)<br>
    <b>KEDALAMAN:</b> 3,000 – 7,000m<br><br>
    <i>“Saya mengepakkan sirip seperti telinga dan terapung seperti terbang!”</i><br>
    Dengan kepala bulat dan sirip besar yang lembut, ia kelihatan seperti kartun yang terbang di dasar laut yang gelap.<br><br>
    <span style='color:#0ea5e9'>★ FAKTA MENARIK:</span> Ia tinggal begitu dalam sehingga tidak perlukan dakwat — sudah pun gelap sepenuhnya!`,

    // 4. Gulper Eel
    `<b>SPESIES:</b> Belut Gulper (<i>Eurypharynx pelecanoides</i>)<br>
    <b>KEDALAMAN:</b> 500 – 3,000m<br><br>
    <i>“Mulut saya lebih besar dari badan saya!”</i><br>
    Ia mempunyai ekor panjang dan mulut seperti belon yang boleh dibuka besar untuk menelan mangsa lebih besar dari kepalanya.<br><br>
    <span style='color:#0ea5e9'>★ FAKTA MENARIK:</span> Ia boleh membuka rahangnya seperti burung pelikan dan mempunyai cahaya di hujung ekornya!`,

    // 5. Yeti Crab
    `<b>SPESIES:</b> Ketam Yeti (<i>Kiwa hirsuta</i>)<br>
    <b>KEDALAMAN:</b> ~2,200m<br><br>
    <i>“Saya tanam makanan atas tangan saya!”</i><br>
    Ketam berbulu ini mengayunkan ‘tangan’ berbulu untuk menumbuhkan bakteria — dan kemudian memakannya.<br><br>
    <span style='color:#0ea5e9'>★ FAKTA MENARIK:</span> Ia baru sahaja ditemui pada tahun 2005 — dan ia tidak mempunyai mata!`,

    // 6. Vampire Squid
    `<b>SPESIES:</b> Sotong Vampire (<i>Vampyroteuthis infernalis</i>)<br>
    <b>KEDALAMAN:</b> 600 – 900m<br><br>
    <i>“Saya tidak menggigit — saya cuma bersinar dan pergi!”</i><br>
    Ia gunakan cahaya bercahaya dan membalut diri dengan lengan berjala untuk melarikan diri seperti wira laut dalam.<br><br>
    <span style='color:#0ea5e9'>★ FAKTA MENARIK:</span> Walaupun namanya menakutkan, ia tidak hisap darah — cuma makan sisa lautan!`,

    // 7. Megamouth Shark
    `<b>SPESIES:</b> Jerung Megamouth (<i>Megachasma pelagios</i>)<br>
    <b>KEDALAMAN:</b> 120 – 1,500m<br><br>
    <i>“Saya berenang dengan mulut gergasi terbuka luas!”</i><br>
    Jerung yang berenang perlahan ini menapis plankton dengan bibir besar yang bercahaya. Ia adalah salah satu jerung paling jarang dan misteri di lautan.<br><br>
    <span style='color:#0ea5e9'>★ FAKTA MENARIK:</span> Ia hanya ditemui pada tahun 1976 — dan kurang daripada 100 ekor pernah dilihat!`,

    // 8. Anglerfish
    `<b>SPESIES:</b> Anglerfish (<i>Lophiiformes</i>)<br>
    <b>KEDALAMAN:</b> 300 – 1,600m<br><br>
    <i>“Saya menyinari kegelapan untuk memburu!”</i><br>
    Di laut dalam yang gelap, anglerfish menggoyangkan umpan bercahaya dari kepalanya seperti joran. Ikan kecil fikir ia makanan dan berenang lebih dekat... kemudian CEPAT!<br><br>
    <span style='color:#0ea5e9'>★ FAKTA MENARIK:</span> Anglerfish jantan sangat kecil dan akan melekat pada anglerfish betina seumur hidup!`,

    // 9. Sea Angel
    `<b>SPESIES:</b> Malaikat Laut (<i>Clione limacina</i>)<br>
    <b>KEDALAMAN:</b> 100 – 1,000m<br><br>
    <i>“Saya kecil, bercahaya dan anggun — tapi saya juga pemburu!”</i><br>
    Ia kelihatan seperti pari-pari yang bersinar, tetapi ia tangkas dan mempunyai cangkuk tersembunyi untuk menangkap mangsa.<br><br>
    <span style='color:#0ea5e9'>★ FAKTA MENARIK:</span> Ia memburu rama-rama laut dan boleh berenang lebih laju dari haiwan besar!`
  ]
};

const factData = [
  ["Barreleye has tubular eyes.", "Can rotate eyes for vision.", "Lives at 600–800m."],
  ["Blobfish It has no muscles! It lets the ocean do the work while it relaxes.", "Jelly-like body.", "Feeds on edible matter from sea floor."],
  ["Atolla Jellyfish Its blinking light trick is called the'burglar alarm' strategy.", "Deep sea predator.", "Uses flashing lights to distract prey."],
  ["Dumbo Octopus It lives so deep that it doesn’t even need  ink.", "Has ear-like fins.", "Feeds on small crustaceans."],
  ["Gulper Eel  It can unhinge its jaw like a pelican .", "has a glowing tip on its tail."],
  ["Yeti Crab lives at hydrothermal vents.", "Has hairy pincers.", "it has no eyes."],
  ["Vampire Squid Despite the name, it doesn’t drink blood.", "it eats drifting bits of ocean.", "Produces bioluminescent mucus."],
  ["Megamouth Shark It was only discovered in 1976.", "fewer than 100 have ever been seen."],
  ["Anglerfish  The male anglerfish is super tiny.", "fuses to the female like a living attachment for life!.", "Uses bioluminescent lure."],
  ["Sea Angel It hunts sea butterflies.", "Has transparent body.", "can out swim much bigger animals."],
];

// -----------------------------------------------------------------------------
// [UPDATED] 2 dialog options per creature -> Single specific text
// -----------------------------------------------------------------------------
const dialogData = [
  // 1. Barreleye
  ["My head is see-through, and my eyes glow!"],
  // 2. Blobfish
  ["I’m not ugly — I’m just under pressure!"],
  // 3. Atolla
  ["When I’m attacked, I light up!"],
  // 4. Dumbo
  ["I flap my fins like ears and float like I’m flying!"],
  // 5. Gulper
  ["My mouth is bigger than my body!"],
  // 6. Yeti Crab
  ["I grow food on my claws!"],
  // 7. Vampire Squid
  ["I don’t bite — I just glow and go!"],
  // 8. Megamouth Shark
  ["I swim with my giant mouth wide open!"],
  // 9. Anglerfish
  ["I light up the dark to hunt!"],
  // 10. Sea Angel
  ["I’m tiny, glowing, and graceful — but I’m a hunter too!"]
];

// -----------------------------------------------------------------------------
// 2. SETUP FUNCTIONS
// -----------------------------------------------------------------------------

const initializeMindAR = () => new window.MINDAR.IMAGE.MindARThree({
  container: document.body,
  imageTargetSrc: '../assets/targets/targets.mind',
});

const configureGLTFLoader = () => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('../libs/draco/');
  loader.setDRACOLoader(dracoLoader);
  return loader;
};

// AUTO-SCALING LOAD MODEL FUNCTION
const loadModel = async (path, index) => {
  const loader = configureGLTFLoader();
  const model = await loader.loadAsync(path);
  
  // 1. Measure the Model
  const box = new THREE.Box3().setFromObject(model.scene);
  const size = new THREE.Vector3();
  box.getSize(size);
  
  // 2. Find the largest dimension
  const maxDim = Math.max(size.x, size.y, size.z);
  
  // 3. Calculate Scale to fit in a 0.5 unit box
  const targetSize = 0.5; 
  const scaleFactor = targetSize / maxDim;
  
  // 4. Apply Auto-Scale
  model.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
  
  // 5. Center it
  const center = new THREE.Vector3();
  box.getCenter(center);
  model.scene.position.sub(center.multiplyScalar(scaleFactor)); 
  model.scene.position.y = 0; 

  // --- SPECIAL LOGIC FOR ATOLLA (2) & DUMBO (3) ---
  const useOriginalLight = (index === 2 || index === 3);
  
  // [MODIFIED] Increased baseIntensity for Atolla/Dumbo to compensate for dimmer world light
  const baseIntensity = useOriginalLight ? 2.5 : 0.2;

  // Emission Setup
  model.userData.emissiveMeshes = [];
  model.userData.baseIntensity = baseIntensity; 
  model.userData.currentIntensity = baseIntensity; 
  model.userData.targetIntensity = baseIntensity;

  model.scene.traverse((child) => {
    if (child.isMesh) {
      if (child.material) {
        if (useOriginalLight) {
             child.material.emissive = new THREE.Color(0xffffff); 
             if (child.material.map) child.material.emissiveMap = child.material.map;
             child.material.emissiveIntensity = baseIntensity;
             
             // [MODIFIED] Make them look "wet"/shiny for the habitat look
             child.material.roughness = 0.1; 
             child.material.metalness = 0.1;
             
             model.userData.emissiveMeshes.push(child);
        } else if (child.material.emissiveMap || (child.material.emissive && child.material.emissive.getHex() > 0)) {
            child.material.emissiveIntensity = baseIntensity; 
            model.userData.emissiveMeshes.push(child);
        }
      }
    }
  });
  return model;
};

const loadAndConfigureAudio = async (path, camera) => {
  const audioLoader = new THREE.AudioLoader();
  const listener = new THREE.AudioListener();
  camera.add(listener);
  const sound = new THREE.PositionalAudio(listener);
  await new Promise((resolve, reject) => {
    audioLoader.load(path, buffer => {
      sound.setBuffer(buffer);
      sound.setRefDistance(1);
      resolve(sound);
    }, undefined, reject);
  });
  return sound;
};

// -----------------------------------------------------------------------------
// 3. NEW: HOLO-TRANSCRIPT SYSTEM
// -----------------------------------------------------------------------------

const createHoloTranscript = () => {
  const container = document.createElement("div");
  container.id = "holo-transcript-container";
  // [MODIFIED] Mobile adjustments: higher bottom offset
  Object.assign(container.style, {
    position: "absolute", bottom: "160px", left: "50%", transform: "translateX(-50%)",
    width: "90%", maxWidth: "500px", maxHeight: "0px", // Hidden by default
    background: "rgba(8, 15, 30, 0.85)", // Deep sea navy
    backdropFilter: "blur(12px)", 
    border: "1px solid rgba(14, 165, 233, 0.5)", // Cyan border
    borderLeft: "6px solid #0ea5e9", // Thick tech accent on left
    borderRadius: "8px", 
    color: "#e0f2fe", fontFamily: "'Courier New', monospace", 
    zIndex: "9995", overflow: "hidden", transition: "all 0.4s ease-in-out",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  });

  // Header "System Text"
  const header = document.createElement("div");
  header.innerHTML = "/// AUDIO_LOG_DETECTED ///";
  Object.assign(header.style, {
    fontSize: "10px", color: "#0ea5e9", padding: "8px 15px 0 15px", letterSpacing: "2px", fontWeight: "bold"
  });

  // The actual text content
  const content = document.createElement("p");
  content.id = "holo-text-content";
  Object.assign(content.style, {
    fontSize: "14px", lineHeight: "1.6", padding: "5px 15px 15px 15px", margin: "0",
    fontFamily: "'Poppins', sans-serif", fontWeight: "400", opacity: "0.9"
  });

  container.appendChild(header);
  container.appendChild(content);
  document.body.appendChild(container);
  return container;
};

// Helper to toggle the transcript
const toggleTranscript = (isVisible, text = "") => {
  const box = document.getElementById("holo-transcript-container") || createHoloTranscript();
  const textElem = document.getElementById("holo-text-content");
  
  if (isVisible) {
    textElem.innerHTML = text;
    box.style.maxHeight = "300px"; // Slide open
    box.style.opacity = "1";
    box.style.border = "1px solid rgba(14, 165, 233, 0.5)";
  } else {
    box.style.maxHeight = "0px"; // Slide closed
    box.style.opacity = "0";
    box.style.border = "none";
  }
};

// -----------------------------------------------------------------------------
// 4. ADVANCED DIALOG SYSTEM (SPEECH BUBBLES)
// -----------------------------------------------------------------------------

let activeBubble = {
    element: null, model: null, offsetY: 0,
    typewriterTimer: null, timeoutTimer: null
};

const getBubbleElement = () => {
    let bubble = document.getElementById("ar-bubble");
    if (!bubble) {
        bubble = document.createElement("div");
        bubble.id = "ar-bubble";
        Object.assign(bubble.style, {
            position: "absolute", width: "220px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "12px 18px", borderRadius: "15px",
            color: "#0f172a", fontFamily: "'Poppins', sans-serif",
            fontSize: "14px", fontWeight: "600", textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            opacity: "0", pointerEvents: "none",
            transform: "translate(-50%, -100%)",
            transition: "opacity 0.2s ease-out",
            zIndex: "10000", border: "2px solid #0ea5e9",
            whiteSpace: "pre-wrap"
        });
        const tail = document.createElement("div");
        Object.assign(tail.style, {
            position: "absolute", bottom: "-6px", left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: "12px", height: "12px", backgroundColor: "white",
            borderRight: "2px solid #0ea5e9", borderBottom: "2px solid #0ea5e9"
        });
        bubble.appendChild(tail);
        const textSpan = document.createElement("span");
        textSpan.id = "ar-bubble-text";
        bubble.appendChild(textSpan);
        document.body.appendChild(bubble);
    }
    return bubble;
};

const showAdvancedDialog = (modelIndex, modelScene, clickSound) => {
    const bubble = getBubbleElement();
    const textSpan = document.getElementById("ar-bubble-text");
    const options = dialogData[modelIndex];
    const textToType = options[Math.floor(Math.random() * options.length)];

    if (activeBubble.typewriterTimer) clearInterval(activeBubble.typewriterTimer);
    if (activeBubble.timeoutTimer) clearTimeout(activeBubble.timeoutTimer);
    
    if (clickSound && !clickSound.isPlaying) {
        clickSound.setPlaybackRate(1.2); clickSound.play();
    }

    activeBubble.element = bubble;
    activeBubble.model = modelScene;
    
    // ==========================================================
    // [MODIFIED] Increased bubble height (offsetY)
    // ==========================================================
    // Set to 4.5 to ensure it clears all models (including tall ones)
    activeBubble.offsetY = 4.5; 

    bubble.style.opacity = "1";
    textSpan.textContent = ""; 
    let i = 0;
    activeBubble.typewriterTimer = setInterval(() => {
        const char = textToType.charAt(i);
        textSpan.textContent += char;
        i++;
        if (i >= textToType.length) clearInterval(activeBubble.typewriterTimer);
    }, 30); 

    activeBubble.timeoutTimer = setTimeout(() => {
        bubble.style.opacity = "0"; activeBubble.model = null; 
    }, 4000);
};

// -----------------------------------------------------------------------------
// 5. ANIMATION & INTERACTION
// -----------------------------------------------------------------------------

const playSpecificAnimation = (modelData, type) => {
    const { mixer, actions, activeAction } = modelData.userData;
    const targetAction = actions[type];

    if (!targetAction) return;

    modelData.userData.targetIntensity = 4.0; 

    const idleAnim = actions.idle;
    if (activeAction === targetAction && targetAction.isRunning()) return;

    targetAction.reset();
    targetAction.setLoop(THREE.LoopOnce);
    targetAction.clampWhenFinished = true; 

    if (activeAction) activeAction.crossFadeTo(targetAction, 0.5, true);
    targetAction.play();
    modelData.userData.activeAction = targetAction;

    const onFinished = (e) => {
        if (e.action === targetAction) {
            mixer.removeEventListener('finished', onFinished);
            modelData.userData.targetIntensity = modelData.userData.baseIntensity; 

            if (idleAnim) {
                targetAction.crossFadeTo(idleAnim, 0.5, true);
                idleAnim.reset();
                idleAnim.play();
                modelData.userData.activeAction = idleAnim;
            }
        }
    };
    mixer.addEventListener('finished', onFinished);
};

const setupTapInteraction = (camera, models, clickSound) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let tapTimer = null; let isPointerDown = false; let startX = 0; let startY = 0;

    const triggerInteraction = (clientX, clientY, interactionType) => {
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        for (let i = 0; i < models.length; i++) {
            const modelGroup = models[i].scene;
            if (modelGroup.visible) {
                const intersects = raycaster.intersectObjects(modelGroup.children, true);
                if (intersects.length > 0) {
                    if (interactionType === 'single') {
                        showAdvancedDialog(i, modelGroup, clickSound);
                        playSpecificAnimation(models[i], 'action');
                    } else {
                        playSpecificAnimation(models[i], 'interact');
                    }
                    break; 
                }
            }
        }
    };

    const handleTap = (clientX, clientY) => {
        if (tapTimer === null) {
            tapTimer = setTimeout(() => {
                tapTimer = null; triggerInteraction(clientX, clientY, 'single');
            }, 300); 
        } else {
            clearTimeout(tapTimer); tapTimer = null; triggerInteraction(clientX, clientY, 'double');
        }
    };

    window.addEventListener('pointerdown', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        isPointerDown = true; startX = e.clientX; startY = e.clientY;
    });
    window.addEventListener('pointerup', (e) => {
        if (!isPointerDown) return; isPointerDown = false;
        const diffX = Math.abs(e.clientX - startX); const diffY = Math.abs(e.clientY - startY);
        if (diffX < 5 && diffY < 5) handleTap(e.clientX, e.clientY);
    });
};

const enableZoomRotate = (camera, model) => {
  let isDragging = false; let prevPosition = { x: 0, y: 0 };
  let initialPinchDistance = null; let initialScale = model.scene.scale.x; 

  const handleStart = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    if (e.touches && e.touches.length === 1) {
      isDragging = true; prevPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches && e.touches.length === 2) {
      isDragging = false; 
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
      initialScale = model.scene.scale.x; 
    } else if (e.type === "mousedown") {
      isDragging = true; prevPosition = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMove = (e) => {
    if (isDragging && (e.type === "mousemove" || (e.touches && e.touches.length === 1))) {
      const current = e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };
      const delta = { x: current.x - prevPosition.x, y: current.y - prevPosition.y };
      model.scene.rotation.y += delta.x * 0.01; model.scene.rotation.x += delta.y * 0.01;
      prevPosition = current;
    } else if (e.touches && e.touches.length === 2 && initialPinchDistance) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      const scaleRatio = currentDistance / initialPinchDistance;
      let newScale = initialScale * scaleRatio;
      newScale = Math.min(Math.max(newScale, 0.05), 3.0);
      model.scene.scale.set(newScale, newScale, newScale);
    }
  };
  const handleEnd = () => { isDragging = false; initialPinchDistance = null; };

  window.addEventListener("mousedown", handleStart); window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleEnd); window.addEventListener("touchstart", handleStart, { passive: false });
  window.addEventListener("touchmove", handleMove, { passive: false }); window.addEventListener("touchend", handleEnd);
  window.addEventListener("wheel", (e) => {
    let s = model.scene.scale.x; s += e.deltaY * -0.001; s = Math.min(Math.max(s, 0.05), 3.0);
    model.scene.scale.set(s, s, s);
  });
};

const createFactButton = (anchorId, clickSound) => {
  const btn = document.createElement("button");
  // Use dynamic label from uiLabels if desired, or keep hardcoded since it was original code.
  // We'll use the dynamic label to support language switching.
  btn.innerText = uiLabels[currentLanguage].factBtn;

  // [MODIFIED] Mobile Optimizations: Max width and better positioning
  Object.assign(btn.style,{
    position:"absolute", bottom:"30px", left:"50%", transform:"translateX(-50%)",
    width: "70%", maxWidth: "350px", // Fit mobile
    padding:"14px 20px", fontSize:"16px", borderRadius:"30px", border:"none",
    background:"#0ea5e9", color:"#fff", fontWeight:"600", cursor:"pointer",
    display:"none", zIndex:"9999", boxShadow:"0 6px 18px rgba(0,0,0,0.3)",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" // Handle long text
  });
  document.body.appendChild(btn);
  let factBox = null;
  btn.addEventListener("click", ()=>{
    clickSound.setPlaybackRate(0.7); clickSound.play();
    if(factBox){ factBox.remove(); factBox=null; return; }
    factBox = document.createElement("div");
    // [MODIFIED] Raised popup position so it doesn't cover buttons
    Object.assign(factBox.style,{
      position:"absolute", bottom:"150px", left:"50%", transform:"translateX(-50%)",
      width:"88%", maxWidth:"420px", padding:"24px", borderRadius:"20px",
      background:"rgba(10,20,40,0.6)", color:"#e0f2fe", fontFamily:"Poppins, sans-serif",
      zIndex:"9998", boxShadow:"0 20px 50px rgba(0,0,0,0.6)"
    });
    const ul=document.createElement("ul");
    factData[anchorId].forEach(f=>{ const li=document.createElement("li"); li.innerText=f; li.style.marginBottom="8px"; ul.appendChild(li); });
    factBox.appendChild(ul); document.body.appendChild(factBox);
  });
  return btn;
};

// -----------------------------------------------------------------------------
// 6. MAIN EXECUTION
// -----------------------------------------------------------------------------

const createDeepSeaParticles = (scene) => {
    const geometry = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);
    for(let i=0; i<count * 3; i++) positions[i] = (Math.random() - 0.5) * 15; 
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x44aaee, size: 0.03, transparent: true, opacity: 0.6, sizeAttenuation: true });
    const particles = new THREE.Points(geometry, material); scene.add(particles);
    return particles;
};

const createBubbles = (scene) => {
    const bubbles = [];
    const geometry = new THREE.SphereGeometry(0.08, 16, 16); 
    const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.1, transmission: 0.9, transparent: true, opacity: 0.6 });
    for(let i = 0; i < 20; i++) {
        const bubble = new THREE.Mesh(geometry, material);
        bubble.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
        bubble.userData = { speed: 0.01 + Math.random() * 0.02, wobble: Math.random() * Math.PI * 2 };
        scene.add(bubble); bubbles.push(bubble);
    }
    return bubbles;
};

const createPersistentInstruction = () => {
  const instructionBox = document.createElement("div");
  // [MODIFIED] Mobile Optimizations: Max width prevents cutoff
  Object.assign(instructionBox.style, {
    position: "absolute", top: "80px", right: "10px", width: "180px", padding: "12px", borderRadius: "12px",
    background: "rgba(0, 0, 0, 0.5)", color: "#ffffff", fontFamily: "Poppins, sans-serif", fontSize: "12px",
    lineHeight: "1.4", zIndex: "9998", backdropFilter: "blur(4px)", border: "1px solid rgba(255, 255, 255, 0.2)", pointerEvents: "none" 
  });
  
  // [MODIFIED] Use UI Labels instead of hardcoded English text
  const txt = uiLabels[currentLanguage];
  
  instructionBox.innerHTML = `
    <div style="margin-bottom: 8px; font-weight: bold; color: #0ea5e9;">${txt.instructionTitle}</div>
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;"><span>${txt.tap1}</span><span style="opacity:0.8">${txt.tap1Action}</span></div>
    <div style="display:flex; align-items:center; gap:8px;"><span>${txt.tap2}</span><span style="opacity:0.8">${txt.tap2Action}</span></div>
    <div style="display:flex; align-items:center; gap:8px; margin-top:4px; font-size:11px; opacity:0.7"><span>${txt.gestures}</span></div>
  `;
  document.body.appendChild(instructionBox);
};

document.addEventListener("DOMContentLoaded", async()=>{
  const mindarThree = initializeMindAR();
  const {renderer, scene, camera}=mindarThree;
  
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8; 
  renderer.clock=new THREE.Clock();

  // --- UPDATED LIGHTING: WARMER & DIMMER ---
  // Ambient: 0x406080 (Soft Blue-Grey) @ 2.0
  const ambientLight = new THREE.AmbientLight(0x406080, 2.0); 
  
  // [MODIFIED] Reduced directional light to 0.8 (was 2.0)
  // This makes the environment "dimmer" (Deep Sea Habitat feel)
  const directionalLight = new THREE.DirectionalLight(0xfff5e6, 0.8); 
  
  directionalLight.position.set(1,2,3);
  scene.add(ambientLight,directionalLight);

  const particles = createDeepSeaParticles(scene);
  const bubbles = createBubbles(scene);

  const models = await Promise.all(modelNames.map((_,i)=>loadModel(`../assets/models/${i+1}.glb`, i)));

  const bgAudios = await Promise.all(new Array(10).fill('../coding/bg-audio.mp3').map(p=>loadAndConfigureAudio(p,camera)));
  
  // ==========================================================
  // [MODIFIED] Corrected Dynamic Audio Path
  // ==========================================================
  const audioFolder = currentLanguage === 'ms' ? 'malay' : 'english';
  const narrationPaths = modelNames.map((_,i)=>`../assets/audio/${audioFolder}/${i+1}.mp3`);

  const narrationAudios = await Promise.all(narrationPaths.map(p=>loadAndConfigureAudio(p,camera)));
  const clickSound = await loadAndConfigureAudio('../coding/button.mp3', camera);

  setupTapInteraction(camera, models, clickSound); 

  const mixers = models.map((model,i)=>{
    const anchor=mindarThree.addAnchor(i);
    anchor.group.add(model.scene);
    model.scene.visible=false;
    bgAudios[i].setLoop(true);

    const factBtn=createFactButton(i, clickSound);

    // --- UPDATED NARRATION BUTTON ---
    const narrationBtn = document.createElement("button");
    // Dynamic text based on URL language
    narrationBtn.innerText = uiLabels[currentLanguage].audioBtn;

    // [MODIFIED] Mobile Optimizations: Stacked above Fact Button
    Object.assign(narrationBtn.style,{
      position:"absolute", bottom:"85px", left:"50%", transform:"translateX(-50%)", // Stacked
      width: "70%", maxWidth: "350px", // Fit mobile
      padding:"14px 20px", fontSize:"16px", borderRadius:"30px", border:"none",
      background:"#14b8a6", color:"#fff", fontWeight:"600", cursor:"pointer",
      display:"none", zIndex:"9999", boxShadow:"0 6px 18px rgba(0,0,0,0.3)",
      alignItems: "center", gap: "8px", justifyContent: "center"
    });
    document.body.appendChild(narrationBtn);

    narrationBtn.addEventListener("click", ()=>{
      clickSound.setPlaybackRate(0.7); clickSound.play();

      if(narrationAudios[i].isPlaying) {
          // PAUSE
          narrationAudios[i].pause();
          narrationBtn.style.background = "#14b8a6"; // Return to Teal
          narrationBtn.innerText = uiLabels[currentLanguage].audioBtn; 
          toggleTranscript(false); // Hide Text
      }
      else {
          // PLAY
          // Stop others
          narrationAudios.forEach(a => { if(a.isPlaying) a.stop(); });
          
          narrationAudios[i].play();
          narrationBtn.style.background = "#ef4444"; // Red for Stop
          narrationBtn.innerText = uiLabels[currentLanguage].stopBtn;
          
          // SHOW HOLO-TRANSCRIPT
          const text = narrationText[currentLanguage][i];
          toggleTranscript(true, text);
      }
    });

    const mixer = new THREE.AnimationMixer(model.scene);
    model.userData.mixer = mixer;
    model.userData.actions = {};

    let idleClip = model.animations.find(c => c.name.match(/idle/i));
    let actionClip = model.animations.find(c => c.name.match(/action/i));
    let interactClip = model.animations.find(c => c.name.match(/interact/i));
    if (!idleClip && model.animations.length > 0) idleClip = model.animations[0];

    if (idleClip) {
        const action = mixer.clipAction(idleClip);
        action.play();
        model.userData.actions.idle = action;
        model.userData.activeAction = action; 
    }
    if (actionClip) model.userData.actions.action = mixer.clipAction(actionClip);
    if (interactClip) model.userData.actions.interact = mixer.clipAction(interactClip);

    anchor.onTargetFound=()=>{
      model.scene.visible=true;
      factBtn.style.display="block";
      narrationBtn.style.display="flex"; // Changed to flex for alignment
      if(!bgAudios[i].isPlaying) bgAudios[i].play();
    };
    anchor.onTargetLost=()=>{
      model.scene.visible=false;
      factBtn.style.display="none";
      narrationBtn.style.display="none";
      
      // Close transcript and reset button
      toggleTranscript(false);
      narrationBtn.innerText = uiLabels[currentLanguage].audioBtn;
      narrationBtn.style.background = "#14b8a6";

      if (activeBubble.model === model.scene) {
          activeBubble.element.style.opacity = "0";
          activeBubble.model = null;
      }
      if(bgAudios[i].isPlaying) bgAudios[i].pause();
      if(narrationAudios[i].isPlaying) narrationAudios[i].pause();
    };

    enableZoomRotate(camera, model);
    return mixer;
  });

  const audioBtn=document.createElement("div");
  audioBtn.innerText='🔇';
  Object.assign(audioBtn.style,{ position:'absolute', top:'10px', right:'10px', fontSize:'40px', cursor:'pointer', zIndex:'9999' }); // Smaller font for mobile
  document.body.appendChild(audioBtn);
  let isPlaying=false;
  audioBtn.addEventListener("click",()=>{
    isPlaying=!isPlaying;
    bgAudios.forEach(a=>{ if(isPlaying){ if(!a.isPlaying)a.play(); } else{ if(a.isPlaying)a.pause(); } });
    audioBtn.innerText = isPlaying?'🔊':'🔇';
  });

  createPersistentInstruction();

  const backBtn = document.createElement("a");
  // Use a clean SVG arrow instead of the unicode character
  backBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>`;
  
  // DYNAMIC BACK LINK
  backBtn.href = uiLabels[currentLanguage].backLink;

  Object.assign(backBtn.style, { 
    position: "absolute", top: "20px", left: "20px", 
    width: "50px", height: "50px", borderRadius: "50%",
    background: "rgba(8, 15, 30, 0.6)", // Deep sea dark
    border: "2px solid #0ea5e9", // Cyan border (Holo)
    color: "#0ea5e9", // Cyan Icon
    display: "flex", justifyContent: "center", alignItems: "center",
    backdropFilter: "blur(4px)",
    boxShadow: "0 0 15px rgba(14, 165, 233, 0.3)",
    cursor: "pointer", zIndex: "9999",
    transition: "transform 0.2s ease, background 0.2s ease"
  });

  // Simple hover effect
  backBtn.onmouseenter = () => { backBtn.style.transform = "scale(1.1)"; backBtn.style.background = "rgba(14, 165, 233, 0.15)"; };
  backBtn.onmouseleave = () => { backBtn.style.transform = "scale(1.0)"; backBtn.style.background = "rgba(8, 15, 30, 0.6)"; };

  document.body.appendChild(backBtn);

  const tempVector = new THREE.Vector3();

  await mindarThree.start();
  renderer.setAnimationLoop(()=>{
    const delta=renderer.clock.getDelta();
    
    // Environment
    if(particles) { particles.rotation.y += delta * 0.05; particles.position.y += Math.sin(renderer.clock.elapsedTime) * 0.002; }
    if(bubbles) {
        bubbles.forEach(bubble => {
            bubble.position.y += bubble.userData.speed;
            bubble.position.x += Math.sin(renderer.clock.elapsedTime + bubble.userData.wobble) * 0.002;
            if(bubble.position.y > 4) { bubble.position.y = -3; bubble.position.x = (Math.random() - 0.5) * 5; }
        });
    }

    // UPDATE DIALOG BUBBLE POSITION
    if (activeBubble.model && activeBubble.model.visible) {
        activeBubble.model.updateMatrixWorld();
        tempVector.setFromMatrixPosition(activeBubble.model.matrixWorld);
        tempVector.y += activeBubble.offsetY; 
        tempVector.project(camera);
        const x = (tempVector.x * .5 + .5) * window.innerWidth;
        const y = (-(tempVector.y * .5) + .5) * window.innerHeight;
        
        // [MODIFIED] Clamping logic to prevent bubble from going off-screen
        const bubbleWidthHalf = 110; // Half of bubble width (220px)
        const margin = 10;
        const clampedX = Math.max(bubbleWidthHalf + margin, Math.min(window.innerWidth - bubbleWidthHalf - margin, x));

        activeBubble.element.style.left = `${clampedX}px`;
        activeBubble.element.style.top = `${y}px`;
    } else if (activeBubble.element && activeBubble.element.style.opacity === "1" && (!activeBubble.model || !activeBubble.model.visible)) {
        activeBubble.element.style.opacity = "0";
    }

    models.forEach((model, i) => {
        mixers[i].update(delta);
        
        // Manual Emission Lerp
        if (model.userData.emissiveMeshes && model.userData.emissiveMeshes.length > 0) {
            const diff = model.userData.targetIntensity - model.userData.currentIntensity;
            if (Math.abs(diff) > 0.01) {
                model.userData.currentIntensity += diff * delta * 5.0; 
                model.userData.emissiveMeshes.forEach(mesh => {
                    mesh.material.emissiveIntensity = model.userData.currentIntensity;
                });
            }
        }
    });

    renderer.render(scene,camera);
  });
});
