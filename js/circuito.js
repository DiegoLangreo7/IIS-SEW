class Circuito {
    readInputFile(files) {
        const archivo = files[0];
        const section = document.querySelector("section");
        section.innerHTML = "";
        section.insertAdjacentHTML("beforeend", `<h3>Archivo abierto: ${archivo.name}</h3>`);


        if (!archivo) {
            section.insertAdjacentHTML('beforeend', '<p>No se seleccionó ningún archivo.</p>');
            return;
        }

        const tipoArchivo = archivo.type.split('/')[1];

        if (tipoArchivo === 'xml') {
            const lector = new FileReader();
            lector.onload = function () {
                const contenido = lector.result;
                section.insertAdjacentHTML('beforeend', '<pre>' + contenido + '</pre>'); 
            };
            lector.onerror = function () {
                section.insertAdjacentHTML('beforeend', '<p>Hubo un error al leer el archivo.</p>');
            };
            lector.readAsText(archivo);
        }

        else if (tipoArchivo === 'vnd.google-earth.kml+xml') { 
            const archivoKML = archivo;
            const reader = new FileReader();
            
            reader.onload = function (e) {
                const contenido = e.target.result;
                
                const mapaDiv = document.createElement("div");
                mapaDiv.style.width = "100%";
                mapaDiv.style.height = "65vh";
                section.appendChild(mapaDiv);
        
                const map = new google.maps.Map(mapaDiv, {
                    center: { lat: 45.61897580466426, lng: 9.281197983803695 },
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
        
                const parser = new DOMParser();
                const kmlDoc = parser.parseFromString(contenido, "application/xml");
        
                const placemarks = kmlDoc.getElementsByTagName("Placemark");
                const pathCoordinates = [];
                for (let i = 0; i < placemarks.length; i++) {
                    const coordinates = placemarks[i].getElementsByTagName("coordinates")[0];
                    if (coordinates) {
                        const coordsText = coordinates.textContent.trim();
                        const coordsArray = coordsText.split(" ");
                        coordsArray.forEach(coordStr => {
                            const [lng, lat] = coordStr.split(",").map(Number);
                            if (lat && lng) {
                                const position = { lat: lat, lng: lng };
                                new google.maps.Marker({
                                    position: position,
                                    map: map
                                });
        
                                pathCoordinates.push(position);
                            }
                        });
                    }
                }
        
                if (pathCoordinates.length > 1) {
                    new google.maps.Polyline({
                        path: pathCoordinates,
                        geodesic: true,
                        strokeColor: "#FF0000",
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                        map: map
                    });
                }
            };
        
            reader.onerror = function () {
                section.insertAdjacentHTML('beforeend', '<p>Hubo un error al leer el archivo KML.</p>');
            };
        
            reader.readAsText(archivoKML); 
        }
        
        

        else if(tipoArchivo === 'svg+xml') {
            const lector = new FileReader();
            lector.onload = function () {
                const contenidoSVG = lector.result;
                const divSVG = document.createElement("div");
                divSVG.innerHTML = contenidoSVG; 
                section.appendChild(divSVG); 
            };
            lector.onerror = function () {
                section.insertAdjacentHTML('beforeend', '<p>Hubo un error al leer el archivo SVG.</p>');
            };
            lector.readAsText(archivo); 
        }

        else {
            section.insertAdjacentHTML('beforeend', '<p>El tipo de archivo no está permitido.</p>');
        }
    }
}

var circuito = new Circuito();
