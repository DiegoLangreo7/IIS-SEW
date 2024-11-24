class API {
    constructor(baseURL = "https://ergast.com/api/f1") {
        this.baseURL = baseURL;
        this.circuito = "";
        this.ciudad = "";
    }

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
                this.ciudad = location.locality.replace(/ /g, '+');
                raceContainer.appendChild(locationText);

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
                
                this.mostrarImagen(); 
                this.generateStaticMap(); 
            })
            .catch(error => {
                console.error("Error al mostrar la última carrera:", error);
            });
    }

    mostrarImagen() {
        const apiKey = '3ff5c54cc98787d62f7d75efb0f3852e'; 
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${this.ciudad}+circuito+f1&format=json&nojsoncallback=1`;
        console.log(url);
        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                if (data.photos && data.photos.photo.length > 0) {
                    const photo = data.photos.photo[0];  
                    const img_url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`; 
                    this.establecerImagenFondo(img_url);
                } else {
                    console.error("No se encontraron imágenes.");
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error("Error al obtener la imagen de Flickr:", textStatus, errorThrown);
            }
        });
    }

    establecerImagenFondo(img_url) {
        const article = document.querySelector('article');
        const newImage = document.createElement('img');
        newImage.src = img_url;
        newImage.alt = "Imagen del circuito de " + this.circuito;
        article.appendChild(newImage);     
    }

    generateStaticMap() {   
        const article = document.querySelector("article");
        if (!this.error) {
            const location = this.circuito; // Puedes usar el nombre del circuito como ubicación central
            const apiKey = "AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU"; // Clave de la API de Google
    
            const url = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(location)}&zoom=15&size=600x400&key=${apiKey}`;
            
            const marker = `&markers=color:red%7Clabel:S%7C${this.latitud},${this.longitud}`;
    
            const finalUrl = url + marker;
    
            const img = document.createElement('img');
            img.src = finalUrl;
            img.alt = 'Mapa estático de Google del circuito de la carrera';
    
            article.appendChild(img);  
    
        } else {
            article.insertAdjacentHTML("beforeend", `<p>${this.mensaje}</p>`);
        }
    }
    
    
}
