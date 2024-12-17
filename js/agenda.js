class Agenda {
    constructor() {
        this.url = "https://ergast.com/api/f1/2024/races.json"; 
    }
    
    obtenerCarreras() {
        $.ajax({
            url: this.url,
            method: "GET",
            dataType: "json", 
            success: (data) => {
                this.mostrarCarreras(data);
            }
        });
    }

    mostrarCarreras(data) {
        $("section").empty();
        $("section").append(`<h2>Calendario de carreras</h2>`);
        $("section").append(`<button>Obtener Carreras</button>`);
        
        const carreras = data.MRData.RaceTable.Races;

        carreras.forEach((carrera) => {
            const nombreCarrera = carrera.raceName;
            const circuito = carrera.Circuit.circuitName;
            const coordenadas = carrera.Circuit.Location.lat + ", " + carrera.Circuit.Location.long;
            const fecha = carrera.date + " " + carrera.time; 

            const carreraHTML = `
                
                <article class="carrera">
                    <h3>${nombreCarrera}</h3>
                    <p>Circuito: ${circuito}</p>
                    <p>Coordenadas: ${coordenadas}</p>
                    <p>Fecha y hora: ${fecha}</p>
                </article>
            `;
            $("section").append(carreraHTML);
        });
    }
}
