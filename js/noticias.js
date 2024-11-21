class Noticia {
    readInputFile(files) {
        const archivo = files[0];
        if (archivo.type.match(/text.*/)) {
            const lector = new FileReader();
            lector.onload = function () {
                const contenido = lector.result;
                const section = document.querySelector("section"); 
                
                const lineas = contenido.split("\n");
                for (const linea of lineas) {
                    const trozos = linea.split("_");
                    
                        const detalles = `<article>
                            <h6>${trozos[0]}</h6>
                            <ul>
                                <li>${trozos[1]}</li>
                                <li>${trozos[2]}</li>
                            </ul>
                        </article>`;
                    section.insertAdjacentHTML('beforeend', detalles);
                }
            };
            lector.readAsText(archivo);
        }
    }
}

const noticia = new Noticia();
