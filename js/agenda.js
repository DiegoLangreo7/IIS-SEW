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
        $("#carreras").empty();
        
        const carreras = data.MRData.RaceTable.Races;

        carreras.forEach((carrera) => {
            const nombreCarrera = carrera.raceName;
            const circuito = carrera.Circuit.circuitName;
            const coordenadas = carrera.Circuit.Location.lat + ", " + carrera.Circuit.Location.long;
            const fecha = carrera.date + " " + carrera.time; 

            const carreraHTML = `
                
                <article class="carrera">
                    <h3>${nombreCarrera}</h3>
                    <p><strong>Circuito:</strong> ${circuito}</p>
                    <p><strong>Coordenadas:</strong> ${coordenadas}</p>
                    <p><strong>Fecha y hora:</strong> ${fecha}</p>
                </article>
            `;
            $("#carreras").append(carreraHTML);
        });
    }
}
