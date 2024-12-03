class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8];
        this.lights = 4;
        this.unload_moment = null;
        this.clic_moment = null;
        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)];
        
        // Almacenamos los botones
        this.startButton = null;
        this.reactionTimeButton = null;

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
        const title = document.createElement('h3');
        title.textContent = 'Juego de Reacción';
        mainElement.appendChild(title);
    }

    // Crear las luces del semáforo
    createTrafficLights(mainElement) {
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement('div'); 
            mainElement.appendChild(light);
        }
    }

    // Crear los botones y agregarlos dentro de una section
    createButtons(mainElement) {
        const buttonSection = document.createElement('section');
        
        this.startButton = document.createElement('button');
        this.startButton.textContent = 'Arranque';
        this.startButton.addEventListener('click', () => {
            this.initSequence(); 
        });
        buttonSection.appendChild(this.startButton);

        this.reactionTimeButton = document.createElement('button');
        this.reactionTimeButton.textContent = 'Reacción';
        this.reactionTimeButton.disabled = true;
        this.reactionTimeButton.addEventListener('click', () => {
            if (!this.reactionTimeButton.disabled)
                this.stopReaction();
        });
        buttonSection.appendChild(this.reactionTimeButton);

        mainElement.appendChild(buttonSection);
    }

    createRecordForm(reactionTime) {
        const difficultyLabel = () => {
            switch(this.difficulty) {
                case 0.2:
                    return 'Dificil';
                case 0.5:
                    return 'Medio';
                case 0.8:
                    return 'Facil';
                default:
                    return this.difficulty;
            }
        };
        
        const form = $(`
            <form>
                <h4>Registrar tu record</h4>
                <label for="name">Nombre:</label>
                <input type="text" id="name" required>
                <label for="surname">Apellidos:</label>
                <input type="text" id="surname" required>
                <label for="dificult">Nivel:</label>
                <input type="text" id="dificult" value="${difficultyLabel()}" readonly>
                <label for="reactionTime">Tiempo de reacción en milisegundos:</label>
                <input type="text" id="reactionTime" value="${reactionTime}" readonly>
                <button type="submit">Guardar</button>
            </form>
        `);
               
        $('main').append(form);
    
        $('form').on('submit', (e) => {
            e.preventDefault();
    
            const nombre = $('input:nth-of-type(1)').val();
            const apellidos = $('input:nth-of-type(2)').val();
            const nivel = $('input:nth-of-type(3)').val();
            const tiempo = $('input:nth-of-type(4)').val();

    
            $.ajax({
                type: "POST",
                url: "semaforo.php", 
                data: {
                    nombre: nombre,
                    apellidos: apellidos,
                    nivel: nivel,
                    tiempo: tiempo
                },
                success: (response) => {
                    alert("¡Registro exitoso!");
                    $('form').remove();
                    this.findTopScores(nivel); 
                },
                error: () => {
                    alert('Error al guardar el record.');
                }
            });
        });
    }

    findTopScores(level) {
        $.ajax({
            type: "GET",
            url: "semaforo.php",
            data: { nivel: level },
            success: (response) => {
                if (response.status === "success") {
                    this.createTopResultsTable(response.top_results);
                } else if (response.status === "error") {
                    alert(response.message);
                }
            },
            error: () => {
                alert('Error al obtener los resultados.');
            }
        });
    }    
    

    createTopResultsTable(results) {
        $('table').remove(); 
        const table = $('<table></table>');
    
        const header = $('<tr></tr>');
        header.append('<th>Ranking</th>'); 
        header.append('<th>Nombre</th>'); 
        header.append('<th>Apellidos</th>'); 
        header.append('<th>Tiempo (ms)</th>'); 
        table.append(header);
    
        results.forEach((result, index) => {
            const row = $('<tr></tr>');
            row.append(`<td>${index + 1}</td>`); 
            row.append(`<td>${result.nombre}</td>`);
            row.append(`<td>${result.apellidos}</td>`);
            row.append(`<td>${result.tiempo}</td>`);
            table.append(row);
        });
    
        $('main').append(table);
    }
    
    

    //////// ACCIONES ///////////////////////////
    initSequence() {
        this.startButton.disabled = true;
        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)];
        $('form').remove();
        $('table').remove();

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
        
        // Habilitar el botón de tiempo de reacción
        this.reactionTimeButton.disabled = false;
    }

    stopReaction() {
        this.clic_moment = new Date();

        const reactionTime = this.clic_moment - this.unload_moment;

        this.createRecordForm(reactionTime);

        // Habilitar el botón de arranque
        this.startButton.disabled = false;

        // Deshabilitar el botón de reacción
        this.reactionTimeButton.disabled = true; 

        this.unload_moment = null;
        this.clic_moment = null;
    }
}
