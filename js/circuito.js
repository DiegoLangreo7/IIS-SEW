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

        const tipoArchivo = archivo.name.split('.').pop();

		if (tipoArchivo === 'xml') {
            const lector = new FileReader();
        
            lector.onload = function () {
                const contenido = lector.result;
        
                try {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(contenido, "application/xml");
        
                    const parseError = xmlDoc.getElementsByTagName("parsererror");
                    if (parseError.length > 0) {
                        throw new Error("Error al parsear el XML.");
                    }
        
                    const circuito = xmlDoc.getElementsByTagName("uni:circuito")[0];
                    if (circuito) {
                        const nombre = circuito.getElementsByTagName("uni:nombre")[0]?.textContent || "Desconocido";
                        const longitud = circuito.getElementsByTagName("uni:longitud")[0]?.textContent || "Desconocida";
                        const unidadLongitud = circuito.getElementsByTagName("uni:unidad")[0]?.textContent || "";
                        const anchura = circuito.getElementsByTagName("uni:anchura")[0]?.textContent || "Desconocida";
                        const unidadAnchura = circuito.getElementsByTagName("uni:unidad")[1]?.textContent || "";
                        const fecha = circuito.getElementsByTagName("uni:fecha")[0]?.textContent || "Desconocida";
                        const hora = circuito.getElementsByTagName("uni:hora")[0]?.textContent || "Desconocida";
                        const nVueltas = circuito.getElementsByTagName("uni:nvueltas")[0]?.textContent || "Desconocido";
                        const localidad = circuito.getElementsByTagName("uni:localidad")[0]?.textContent || "Desconocida";
                        const pais = circuito.getElementsByTagName("uni:pais")[0]?.textContent || "Desconocido";
        
                        const referencias = Array.from(circuito.getElementsByTagName("uni:referencias"))
                            .map(ref => `<li><a href="${ref.textContent}" target="_blank">${ref.textContent}</a></li>`).join('');
        
                        const fotografias = Array.from(circuito.getElementsByTagName("uni:fotografias"))
                            .map(foto => {
                                const fotoUrl = `xml/${foto.textContent}`;
                                return `<picture>
                                                <source media="(max-width:465px)" srcset="${fotoUrl}?w=465">
                                                <source media="(max-width:799px)" srcset="${fotoUrl}?w=799">
                                                <img src="${fotoUrl}" alt="${nombre}" >
                                            </picture>`;
                            }).join('');
        
                        const videos = Array.from(circuito.getElementsByTagName("uni:videos"))
                            .map(video => {
                                return `<video controls>
                                            <source src="${video.textContent}" type="video/mp4">
                                            Tu navegador no soporta el formato de video.
                                        </video>`;
                            }).join('');
        
                        const tramos = Array.from(circuito.getElementsByTagName("uni:tramos"))
                            .map((tramo, index) => {
                                const distancia = tramo.getElementsByTagName("uni:distancia")[0]?.textContent || "Desconocida";
                                const unidadDistancia = tramo.getElementsByTagName("uni:unidad")[0]?.textContent || "";
                                const coordenadas = Array.from(tramo.getElementsByTagName("uni:coordenadas"))
                                    .map(coord => {
                                        const longitud = coord.getElementsByTagName("uni:longitud")[0]?.textContent || "Desconocida";
                                        const latitud = coord.getElementsByTagName("uni:latitud")[0]?.textContent || "Desconocida";
                                        const altitud = coord.getElementsByTagName("uni:altitud")[0]?.textContent || "Desconocida";
                                        return `Longitud: ${longitud}, Latitud: ${latitud}, Altitud: ${altitud}`;
                                    }).join('<br>');
                                const sector = tramo.getElementsByTagName("uni:sector")[0]?.textContent || "Desconocido";
                                return `<li>
                                            <strong>Tramo ${index + 1}</strong>: ${distancia} ${unidadDistancia}<br>
                                            Coordenadas:<br>${coordenadas}<br>
                                            Sector: ${sector}
                                        </li>`;
                            }).join('');
        
                        const tablaDatos = `
                            <h4>Información del Circuito</h4>
                            <table border="1">
                                <tr><th>Nombre</th><td>${nombre}</td></tr>
                                <tr><th>Longitud</th><td>${longitud} ${unidadLongitud}</td></tr>
                                <tr><th>Anchura</th><td>${anchura} ${unidadAnchura}</td></tr>
                                <tr><th>Fecha</th><td>${fecha}</td></tr>
                                <tr><th>Hora</th><td>${hora}</td></tr>
                                <tr><th>Número de Vueltas</th><td>${nVueltas}</td></tr>
                                <tr><th>Localidad</th><td>${localidad}</td></tr>
                                <tr><th>País</th><td>${pais}</td></tr>
                            </table>
                        `;
        
                        const imagenesHTML = fotografias ? `<h4>Fotografías del Circuito</h4>${fotografias}` : '';
        
                        const referenciasHTML = referencias ? `<h4>Referencias</h4><ul>${referencias}</ul>` : '';
        
                        const videosHTML = videos ? `<h4>Videos del Circuito</h4>${videos}` : '';
        
                        const tramosHTML = `<h4>Tramos del Circuito</h4><ul>${tramos}</ul>`;
        
                        section.insertAdjacentHTML('beforeend', tablaDatos);
                        if (imagenesHTML) section.insertAdjacentHTML('beforeend', imagenesHTML);
                        if (referenciasHTML) section.insertAdjacentHTML('beforeend', referenciasHTML);
                        if (videosHTML) section.insertAdjacentHTML('beforeend', videosHTML);
                        section.insertAdjacentHTML('beforeend', tramosHTML);
        
                    } else {
                        section.insertAdjacentHTML('beforeend', '<p>No se encontró información de circuitos en el archivo.</p>');
                    }
                } catch (error) {
                    section.insertAdjacentHTML('beforeend', '<p>Error procesando el archivo XML: ' + error.message + '</p>');
                }
            };
        
            lector.onerror = function () {
                section.insertAdjacentHTML('beforeend', '<p>Hubo un error al leer el archivo.</p>');
            };
        
            lector.readAsText(archivo);
        }     
        

        else if (tipoArchivo === 'kml') { 
            const archivoKML = archivo;
            const reader = new FileReader();
            
            reader.onload = function (e) {
                const contenido = e.target.result;
                
                const mapaDiv = document.createElement("div");
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
        
        

        else if(tipoArchivo === 'svg') {
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
