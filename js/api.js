class API {
    constructor(baseURL = "https://ergast.com/api/f1") {
        this.baseURL = baseURL;
        this.circuito = "";
        this.ciudad = "";
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.showErrors.bind(this));
    }

    /// API DE GEOLOCATION
    getPosicion(posicion){
        this.longitud         = posicion.coords.longitude; 
        this.latitud          = posicion.coords.latitude;  
        this.precision        = posicion.coords.accuracy;
        this.altitud          = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo            = posicion.coords.heading;
        this.velocidad        = posicion.coords.speed;       
    }

    showErrors(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
        this.error = true;
    }

    /// FIN DE API DE GEOLOCATION
    

    obtenerUltimaCarrera() {
        const endpoint = "2024/last/results.json";  
        return fetch(`${this.baseURL}/${endpoint}`)
            .then(response => {
                if (!response.ok) {
                    console.error("Error al obtener los resultados de la última carrera.");
                    return null;
                }
                return response.json();
            })
            .then(data => {
                console.log("Datos de la última carrera:", data);  
                return data.MRData.RaceTable.Races[0] || null;  
            });
    }

    mostrarUltimaCarrera() {
        this.obtenerUltimaCarrera()
            .then(race => {
                if (!race) {
                    console.log("No se encontró la última carrera.");
                    return;
                }
                const mainElement = document.querySelector('main');
                const raceContainer = document.createElement('article');

                const raceTitle = document.createElement('h3');
                raceTitle.textContent = `${race.raceName} - ${race.Circuit.circuitName}`;
                this.circuito = race.Circuit.circuitName.replace(/ /g, '+');
                raceContainer.appendChild(raceTitle);

                const location = race.Circuit.Location;
                const locationText = document.createElement('p');
                locationText.textContent = `${location.locality}, ${location.country}`;
                this.ciudad = location.country.replace(/ /g, '+');
                raceContainer.appendChild(locationText);

                this.circuitLatitud = parseFloat(location.lat);
                this.circuitLongitud = parseFloat(location.long);

                if (race.Results && race.Results.length > 0) {
                    const resultsList = document.createElement('ul');
                    race.Results.forEach(result => {
                        const resultItem = document.createElement('li');
                        const driver = `${result.Driver.givenName} ${result.Driver.familyName}`;
                        const position = result.position;
                        resultItem.textContent = `${driver} - Posición: ${position}`;
                        resultsList.appendChild(resultItem);
                    });
                    raceContainer.appendChild(resultsList);
                } else {
                    const noResultsMessage = document.createElement('p');
                    noResultsMessage.textContent = "No hay resultados disponibles para esta carrera.";
                    raceContainer.appendChild(noResultsMessage);
                }

                mainElement.appendChild(raceContainer);

                const titleFavorite = document.createElement("h4");
                titleFavorite.textContent = "Tu Carrera Favorita";
                raceContainer.appendChild(titleFavorite);

                const textoCircuito = this.obtenerCircuitoFavorito();
                const circuitoFavoritoP = document.createElement("p");
                circuitoFavoritoP.textContent = textoCircuito;
                raceContainer.appendChild(circuitoFavoritoP);

                const saveButton = document.createElement("button");
                saveButton.textContent = "Guardar carrera como favorita";
                saveButton.addEventListener("click", () => this.guardarCircuitoFavorito(`${race.raceName} - ${race.Circuit.circuitName}`));
                raceContainer.appendChild(saveButton);

                const fullscreenButton = document.createElement("button");
                fullscreenButton.textContent = "Ver ubicación en Pantalla Completa";
                fullscreenButton.addEventListener("click", () => this.activarPantallaCompleta());
                raceContainer.appendChild(fullscreenButton);
                
                const section = document.createElement("section");
                const ubicationTitle = document.createElement('h4');
                ubicationTitle.textContent = `Ubicacion`;
                section.appendChild(ubicationTitle);
                raceContainer.appendChild(section);

                this.generateUserStaticMap();
                this.generateCircuitStaticMap(); 
                this.activarPointerLock();
            })
            .catch(error => {
                console.error("Error al mostrar la última carrera:", error);
            });
    }

    /// API LOCALSTORAGE

    guardarCircuitoFavorito(circuito) {
        localStorage.setItem("circuitoFavorito", circuito);
        const textoCircuito = this.obtenerCircuitoFavorito();
        const article = document.querySelector("article");
    
        const existingP = article.querySelectorAll("p");
        const lastP = existingP[existingP.length - 2];
    
        if (lastP) {
            lastP.textContent = textoCircuito;
        } 
    }
    

    obtenerCircuitoFavorito() {
        const circuitoFavorito = localStorage.getItem("circuitoFavorito");
        if (circuitoFavorito) {
            return `El circuito favorito guardado es: ${circuitoFavorito}`;
        } else {
            return `No se ha guardado ningún circuito favorito.`;
        }
    }

    /// FIN API LOCALSTORAGE

    /// MOSTRAR MAPAS

    generateUserStaticMap(){   
        const section = document.querySelector("section");
        if (!this.error) {
            var apiKey = "&key=AIzaSyBU6Pk-2anDmu4HGU_v7Oi89jbuOvxRGqE";
            var url = "https://maps.googleapis.com/maps/api/staticmap?";
            var centro = "center=" + this.latitud + "," + this.longitud;
            var zoom ="&zoom=15";
            var tamaño= "&size=600x400";
            var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
        
            this.imagenMapa = url + centro + zoom + tamaño + marcador + apiKey;
            section.insertAdjacentHTML("beforeend", "<img src='" + this.imagenMapa + "' alt='Mapa estático de Google de la ubicación actual' />");
        }
        else{
            section.insertAdjacentHTML("beforeend", `<pre>${this.mensaje}</pre>`);
        }
    }

    generateCircuitStaticMap() {   
        const section = document.querySelector("section");
        if (!this.error) {
            const location = this.circuito; 
            const apiKey = "AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU"; // Clave de la API de Google
    
            const url = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(location)}&zoom=15&size=600x400&key=${apiKey}`;
            
            const marker = `&markers=color:red%7Clabel:S%7C${this.circuitLatitud},${this.circuitLongitud}`;
    
            const finalUrl = url + marker;
    
            const img = document.createElement('img');
            img.src = finalUrl;
            img.alt = 'Mapa estático de Google del circuito de la carrera';
    
            section.appendChild(img);  
            this.mostrarDistancia();
    
        } else {
            section.insertAdjacentHTML("beforeend", `<p>${this.mensaje}</p>`);
        }
    }
    
    /// FIN MOSTRAR MAPAS

    /// API FULLSCREEN

    activarPantallaCompleta() {
        const elemento = document.querySelector("section");
        if (elemento.requestFullscreen) {
            elemento.requestFullscreen();
        } else if (elemento.mozRequestFullScreen) { // Firefox
            elemento.mozRequestFullScreen();
        } else if (elemento.webkitRequestFullscreen) { // Chrome, Safari y Opera
            elemento.webkitRequestFullscreen();
        } else if (elemento.msRequestFullscreen) { // IE/Edge
            elemento.msRequestFullscreen();
        }
    }

    /// FIN API FULLSCREEN

    mostrarDistancia() {
        if (this.latitud !== null && this.longitud !== null && this.circuitLatitud !== null && this.circuitLongitud !== null) {
            const distancia = this.calcularDistancia(this.latitud, this.longitud, this.circuitLatitud, this.circuitLongitud);
            const distanceText = document.createElement('p');
            distanceText.textContent = `Distancia al circuito de la carrera: ${distancia.toFixed(2)} km`;
            const section =  document.querySelector("section");
            section.appendChild(distanceText);
        } else {
            console.error("No se pudo calcular la distancia. Faltan coordenadas.");
        }
    }

    calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6371; 
        const dLat = this.gradosARadianes(lat2 - lat1);
        const dLon = this.gradosARadianes(lon2 - lon1);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.gradosARadianes(lat1)) * Math.cos(this.gradosARadianes(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; 
    }

    gradosARadianes(grados) {
        return grados * (Math.PI / 180);
    }
    
}

$(document).ready(function() {
    const api = new API();
    api.mostrarUltimaCarrera();  
});
