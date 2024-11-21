class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8];
        this.lights = 4;
        this.unload_moment = null;
        this.clic_moment = null;
        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)];

        this.createStructure();
    }

    createStructure() {
        const mainElement = document.querySelector('main');
        this.createHeader(mainElement);
        this.createTrafficLights(mainElement);
        this.createButtons(mainElement);
    }

    // Crear encabezado
    createHeader(mainElement) {
        const head = document.createElement('section');
        const title = document.createElement('h3');
        const nav = document.createElement('nav');

        title.textContent = 'Juego de Reacción';

        head.appendChild(title);
        head.appendChild(nav);

        mainElement.appendChild(head);
    }

    // Crear las luces del semáforo
    createTrafficLights(mainElement) {
        const trafficLightsContainer = document.createElement('section');

        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement('div'); 
            trafficLightsContainer.appendChild(light);
        }

        mainElement.appendChild(trafficLightsContainer);
    }

    // Crear los botones y agregarlos al contenedor principal
    createButtons(mainElement) {
        const buttonsContainer = document.createElement('section');

        const startButton = document.createElement('button');
        startButton.textContent = 'Arranque';
        startButton.addEventListener('click', () => {
            this.initSequence(); 
        });
        buttonsContainer.appendChild(startButton);

        const reactionTimeButton = document.createElement('button');
        reactionTimeButton.textContent = 'Reacción';
        reactionTimeButton.disabled = true;
        reactionTimeButton.addEventListener('click', () => {
            if (!reactionTimeButton.disabled)
                this.stopReaction();
        });
        buttonsContainer.appendChild(reactionTimeButton);

        mainElement.appendChild(buttonsContainer);
    }

    ////////ACCIONES/////////////////////////

    initSequence() {
        const existingMessage = document.querySelector('p');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Deshabilitar el botón de arranque y habilitar el de reacción
        const arranqueButton = document.querySelector('button:nth-child(1)');
        arranqueButton.disabled = true;

        // Iniciar la secuencia de luces
        const main = document.getElementsByTagName('main')[0];
        main.classList.add('load'); 

        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence();
        }, 2000 + this.difficulty * 100);
    }

    endSequence() {
        const main = document.getElementsByTagName('main')[0];
        main.classList.remove('load'); 
        main.classList.add('unload'); 
        const reactionButton = document.querySelector('button:nth-child(2)');
        reactionButton.disabled = false;
    }

    stopReaction() {
        this.clic_moment = new Date();

        const reactionTime = this.clic_moment - this.unload_moment;

        const reactionMessage = document.createElement('p');
        reactionMessage.textContent = `Tu tiempo de reacción fue de: ${reactionTime} milisegundos`;
        document.body.appendChild(reactionMessage);

        const arranqueButton = document.querySelector('button:nth-child(1)');
        arranqueButton.disabled = false; 

        const reactionButton = document.querySelector('button:nth-child(2)');
        reactionButton.disabled = true; 

        this.unload_moment = null;
        this.clic_moment = null;
    }
}
