const projects = [
    { name: "Portfolio", url: "https://portfolio.nathan-baud.fr", date: "Apr 28 15:45", comment: "Mon portfolio personnel et ma présentation" },
    { name: "Timeline", url: "https://timeline.nathan-baud.fr", date: "Apr 25 09:30", comment: "Une application React inspirée du jeu Timeline" },
    { name: "AimTrainer", url: "https://trainer.nathan-baud.fr", date: "Apr 20 18:20", comment: "Une petite application web pour entraîner sa visée" },
    { name: "Potion", url: "https://potion.nathan-baud.fr", date: "Apr 29 10:12", comment: "Application mobile pour le fitness et la nutrition" },
    { name: "FlashXSL", url: "https://xml.nathan-baud.fr", date: "Apr 15 11:05", comment: "Outil de transformation XSL rapide et efficace" }
];

const terminalBody = document.getElementById('terminal-body');
const loaderScreen = document.getElementById('loader-screen');

async function typeText(element, text, speed = 50) {
    for (let i = 0; i < text.length; i++) {
        element.textContent += text.charAt(i);
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

function createNewLine(promptText = "nathan@hub:~$") {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = promptText;

    const command = document.createElement('span');
    command.className = 'command';

    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    line.appendChild(prompt);
    line.appendChild(command);
    line.appendChild(cursor);

    terminalBody.appendChild(line);
    return { line, prompt, command, cursor };
}


function removeCursor(lineObj) {
    if (lineObj.cursor) {
        lineObj.cursor.remove();
    }
}

async function startSequence() {
    // 1. On attend que le loader finisse
    await new Promise(resolve => setTimeout(resolve, 2500));
    loaderScreen.classList.add('hide');
    document.getElementById('main-content').classList.add('visible');

    // On attend un tout petit peu 
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. On tape la première commande
    const firstLine = {
        command: document.getElementById('command-1'),
        cursor: document.querySelector('#line-1 .cursor')
    };

    await typeText(firstLine.command, "cd www/monSite/projets/tous_les_projets", 40);
    await new Promise(resolve => setTimeout(resolve, 500));
    removeCursor(firstLine);

    // 3. Nouvelle ligne avec le chemin mis à jour
    const secondLine = createNewLine("nathan@hub:~/www/monSite/projets/tous_les_projets$");
    await new Promise(resolve => setTimeout(resolve, 600));
    await typeText(secondLine.command, "ls -l", 60);
    await new Promise(resolve => setTimeout(resolve, 400));
    removeCursor(secondLine);

    // Affichage de la liste des projets
    displayProjects();


    // Ligne de fermeture pour faire jolis
    await new Promise(resolve => setTimeout(resolve, 500));
    const lastLine = createNewLine("nathan@hub:~/www/monSite/projets/tous_les_projets$");
    activeLine = lastLine;

    // Vitesse de la vidéo
    const eyesVideo = document.getElementById('eyes-bg');
    eyesVideo.playbackRate = 0.65;
}


document.addEventListener('DOMContentLoaded', startSequence);

// Easter Egg: Shutdown terminal when typing "off"
let inputBuffer = "";
let isShuttingDown = false;
let activeLine = null;

window.addEventListener('keydown', (e) => {
    if (isShuttingDown || !activeLine) return;

    // Prevent scrolling or browser navigation with specific keys
    if (e.key === "Backspace" || e.key === "Enter") {
        e.preventDefault();
    }

    // Only consider single characters (letters, numbers, etc)
    if (e.key.length === 1 && inputBuffer.length < 50) {
        inputBuffer += e.key;
        activeLine.command.textContent = inputBuffer;
    } else if (e.key === "Backspace") {


        inputBuffer = inputBuffer.slice(0, -1);
        activeLine.command.textContent = inputBuffer;
    } else if (e.key === "Enter") {
        handleEnter();
    }

    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;

    // Reset inactivity timer for the smile
    resetInactivityTimer();
});

// Reset timer on mouse move or click as well
window.addEventListener('mousemove', resetInactivityTimer);
window.addEventListener('click', resetInactivityTimer);

// Monster Smile Logic
let inactivityTimer;
let isSmileAuto = false;
let isMonsterHidden = false;
const smileImg = document.getElementById('monster-smile');
const eyesImg = document.getElementById('eyes-bg');

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    // If the smile was shown because of inactivity, hide it when user acts
    if (isSmileAuto) {
        if (!isMonsterHidden) {
            smileImg.style.opacity = "0";
            eyesImg.classList.remove('approaching');
        }
        isSmileAuto = false;
    }

    if (window.innerWidth > 1200 && !isMonsterHidden) {
        inactivityTimer = setTimeout(() => showMonsterSmile(true), 30000); // 30 seconds
    }
}

function showMonsterSmile(isAuto = false) {
    if (window.innerWidth > 1200 && !isShuttingDown && !isMonsterHidden) {
        smileImg.style.opacity = "1";
        eyesImg.classList.add('approaching');

        if (isAuto) {
            isSmileAuto = true;
        } else {
            // Manual trigger (cd ../) still hides after 5s
            setTimeout(() => {
                if (!isSmileAuto) {
                    smileImg.style.opacity = "0";
                    eyesImg.classList.remove('approaching');
                }
            }, 5000);
        }
    }
}


// Start the timer on load
resetInactivityTimer();



let lastEnterTime = 0;
function handleEnter() {
    const now = Date.now();
    if (now - lastEnterTime < 100) return; // Basic anti-spam
    lastEnterTime = now;

    const command = inputBuffer.trim().toLowerCase();

    const forbiddenPrefixes = ['cd', 'sudo', 'apt', 'cat', 'touch', 'mkdir', 'mkfile', 'rm', 'mv', 'cp', 'chmod', 'chown', 'vi', 'nano', 'grep', 'find', 'git', 'ssh', 'top', 'pkill', 'kill'];
    const isForbiddenCommand = (cmd) => forbiddenPrefixes.some(prefix => cmd.startsWith(prefix));

    const isKindnessCommand = (cmd) => {
        const phrases = [
            /it'?s not your fault/i,
            /i love (u|you)/i,
            /you('?re| are| aren'?t) (not a|no) monster/i
        ];
        return phrases.some(regex => regex.test(cmd));
    };

    if (command === "off" || command.startsWith("shutdown")) {

        removeCursor(activeLine);
        triggerShutdown();
        return;
    }


    if (command === "ls -l" || command === "ls") {
        removeCursor(activeLine);
        displayProjects();
    } else if (command === "whoami") {
        removeCursor(activeLine);
        displayWhoAmI();
    } else if (command === "smile") {
        removeCursor(activeLine);
        clearTerminal();
        displayAsciiSmile();
    } else if (command.includes('?') && (command.includes('sad') || command.includes('lonely') || command.includes('alone'))) {
        removeCursor(activeLine);
        handleSadCommand();
    } else if (command.includes('?') && command.includes('help')) {
        removeCursor(activeLine);
        triggerFake404();
    } else if (isKindnessCommand(command)) {
        removeCursor(activeLine);
        handleKindness();
    } else if (isForbiddenCommand(command)) {






        removeCursor(activeLine);
        activeLine.prompt.classList.add('danger');
        const audio = new Audio('./assets/monster.mp3');
        audio.volume = 0.4;
        audio.play().catch(e => console.log("Audio play blocked", e));
        showMonsterSmile();
    } else {
        // Silently fail for unknown commands or empty lines
        removeCursor(activeLine);
    }



    inputBuffer = "";
    activeLine = createNewLine("nathan@hub:~/www/monSite/projets/tous_les_projets$");
    terminalBody.scrollTop = terminalBody.scrollHeight;
}


function displayProjects() {
    const output = document.createElement('div');
    output.className = 'project-list';

    projects.forEach(project => {
        const item = document.createElement('a');
        item.href = project.url;
        item.className = 'project-item';

        const dateSpan = document.createElement('span');
        dateSpan.className = 'project-date';
        dateSpan.textContent = project.date;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = project.name;

        item.appendChild(dateSpan);
        item.appendChild(nameSpan);

        output.appendChild(item);

        if (project.comment) {
            const commentLine = document.createElement('div');
            commentLine.className = 'project-comment';
            commentLine.textContent = `# ${project.comment}`;
            output.appendChild(commentLine);
        }
    });

    terminalBody.appendChild(output);
}

function displayWhoAmI() {
    const responses = [
        "A prey...",
        "Here, you're not the danger...",
        "Don't try to know...",
        "There are weird things here...",
        "A lost soul in the machine...",
        "Someone who should have stayed away.",
        "Just a guest... for now.",
        "Nothing but fresh data.",
        "Don't try to shut me down..."
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    const output = document.createElement('div');
    output.className = 'output-line';
    output.style.fontStyle = 'italic';
    output.style.color = 'var(--text-dim)';
    output.textContent = response;
    terminalBody.appendChild(output);
}

function clearTerminal() {
    terminalBody.innerHTML = "";
}

function displayAsciiSmile() {
    const faces = [
        `
       .ed"""" """""be.
     .d""            ""b.
    .d"                "b.
   .d"  ama      ama  "b.
  .d"  ama      ama  "b.
  d"                  "b
 .d"                  "b.
 .d"  .beeeeeeeeee.   "b.
  "b. 'beeeeeeeee'   .d"
    "b.            .d"
      "b.        .d"
        "b.    .d"
          "b..d"
           "bd"
        `,
        `
          .----------.
         /  (o)  (o)  \\
        /    ______    \\
       |    /      \\    |
       |   |        |   |
        \\   \\______/   /
         \\____________/
        `,
        `
        # # # # # # # # # #
        #  X         X  #
        #       V       #
        #   #########   #
        #   # # # # #   #
        # # # # # # # # # #
        `,
        `
          _____________
         /             \\
        /  _         _  \\
       |  / \\       / \\  |
       |  \\_/       \\_/  |
        \\      ___      /
         \\    /   \\    /
          \\___________/
        `
    ];

    const smile = faces[Math.floor(Math.random() * faces.length)];

    const pre = document.createElement('pre');
    pre.style.color = 'var(--accent)';
    pre.style.textShadow = '0 0 10px rgba(255, 62, 62, 0.5)';
    pre.style.lineHeight = '1.2';
    pre.style.margin = '2rem 0';
    pre.style.textAlign = 'center';
    pre.textContent = smile;
    terminalBody.appendChild(pre);
}

function handleSadCommand() {
    isMonsterHidden = true;

    // Hide visual elements
    eyesImg.classList.add('monster-gone');
    smileImg.classList.add('monster-gone');

    // Play random sad sound
    const rand = Math.floor(Math.random() * 3) + 1;
    const audio = new Audio(`assets/sad${rand}.mp3`);
    audio.play().catch(e => console.log("Audio play blocked", e));

    const output = document.createElement('div');
    output.className = 'output-line';
    output.style.fontStyle = 'italic';
    output.style.color = 'var(--text-dim)';
    output.textContent = "...";
    terminalBody.appendChild(output);

    // Bring monster back after 1 minute
    setTimeout(() => {
        isMonsterHidden = false;
        eyesImg.classList.remove('monster-gone');
        smileImg.classList.remove('monster-gone');
        resetInactivityTimer();
    }, 60000);
}

function handleKindness() {
    const container = document.querySelector('.terminal-container');
    const wrapper = document.querySelector('.cathodic-wrapper');

    container.classList.add('light-mode');
    wrapper.classList.add('tilted');

    const output = document.createElement('div');
    output.className = 'output-line';
    output.style.fontStyle = 'italic';
    output.style.color = '#2563eb';
    output.textContent = "You seem to be different of them...";
    terminalBody.appendChild(output);
}








function triggerFake404() {
    // We redirect to a non-existent page to trigger a real 404 or at least a browser error
    // which feels more "broken" than a custom 404 in this context.
    window.location.href = "/404-help-not-found-for-prey";
}


async function triggerShutdown() {

    if (isShuttingDown) return;
    isShuttingDown = true;

    const terminalBody = document.getElementById('terminal-body');
    const container = document.querySelector('.terminal-container');

    // Play singing sound
    const singing = new Audio('assets/girl_singing.mp3');
    singing.loop = true;
    singing.play().catch(e => console.log("Audio play blocked", e));


    // Add a new line with the "Bye" message

    const byeLine = document.createElement('div');
    byeLine.className = 'terminal-line';
    byeLine.style.fontWeight = "bold";
    byeLine.style.marginTop = "1rem";
    byeLine.textContent = "Bye.";
    terminalBody.appendChild(byeLine);

    // Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;

    // Wait a bit so the user can see the message (increased delay)
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Start the CSS animation
    container.classList.add('shutdown');

    // Show TV off video after terminal shrinks (only for desktop)
    setTimeout(() => {
        if (window.innerWidth > 1200) {
            const tvOffVideo = document.getElementById('tv-off-video');
            tvOffVideo.classList.add('visible');
            tvOffVideo.play().catch(e => console.log("TV Off Video play blocked", e));
        }
    }, 600); // 600ms matches the crt-off animation duration
}

