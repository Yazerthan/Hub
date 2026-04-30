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
    return { line, command, cursor };
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
    const output = document.createElement('div');
    output.className = 'project-list';

    projects.forEach(project => {
        const item = document.createElement('a');
        item.href = project.url;
        item.className = 'project-item';

        // Clear item content and rebuild to control order
        const dateSpan = document.createElement('span');
        dateSpan.className = 'project-date';
        dateSpan.textContent = project.date;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = project.name;

        item.appendChild(dateSpan);
        item.appendChild(nameSpan);

        output.appendChild(item);

        // Add comment if it exists
        if (project.comment) {
            const commentLine = document.createElement('div');
            commentLine.className = 'project-comment';
            commentLine.textContent = `# ${project.comment}`;
            output.appendChild(commentLine);
        }
    });

    terminalBody.appendChild(output);

    // Ligne de fermeture pour faire jolis
    await new Promise(resolve => setTimeout(resolve, 500));
    createNewLine("nathan@hub:~/www/monSite/projets/tous_les_projets$");

    // Vitesse de la vidéo
    const eyesVideo = document.getElementById('eyes-bg');
    eyesVideo.playbackRate = 0.65;
}

document.addEventListener('DOMContentLoaded', startSequence);
