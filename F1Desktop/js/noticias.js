class Noticia {
    readInputFile(files) {
        const archivo = files[0];
        this.deleteParagraph();
        if (archivo.type.match(/text.*/)) {
            const lector = new FileReader();
            lector.onload = () => {
                const contenido = lector.result;
                const section = document.querySelector("section");
                let contadorNoticias = 0;
    
                const lineas = contenido.split("\n");
                for (const linea of lineas) {
                    const trozos = linea.split("_");
    
                    if (trozos.length >= 3) { 
                        const detalles = `<article>
                            <h6>${trozos[0]}</h6>
                            <ul>
                                <li>${trozos[1]}</li>
                                <li>${trozos[2]}</li>
                            </ul>
                        </article>`;
                        section.insertAdjacentHTML("beforeend", detalles);
                        contadorNoticias++;
                    }
                }
                if (contadorNoticias > 0) {
                    const articles = document.querySelectorAll("article");
                    const articleInputFile = articles[articles.length - 1];
                    const mensaje = `<p>Has introducido ${contadorNoticias} noticias con éxito.</p>`;
                    articleInputFile.insertAdjacentHTML("beforeend", mensaje);
                }
            };
            lector.readAsText(archivo);
        }
    }
    
    generateFormNotice() {
        const form = $(`
            <form>
                <label for="titulo">Titular:</label>
                <input type="text" id="titulo" name="titulo" required placeholder="Escribe el titular de la noticia" />
            
                <label for="cuerpo">Cuerpo de la Noticia:</label>
                <input type="text" id="cuerpo" name="cuerpo" required placeholder="Escribe el cuerpo de la noticia"/>            
                <label for="autor">Nombre del Redactor:</label>
                <input type="text" id="autor" name="autor" required placeholder="Escribe el nombre del redactor" />
            
                <button type="submit">Publicar Noticia</button>
            </form>
        `);

        const articles = document.querySelectorAll("article");
        const articleCreateNotice = articles[articles.length - 2];

        const button = articleCreateNotice.querySelector("button");
        if (button) {
            button.remove();
        }
        articleCreateNotice.append(form[0]);
        this.deleteParagraph();

        form.on("submit", (e) => {
            e.preventDefault();  
            this.publishNotice();
        });
    }

    publishNotice() {
        const form = document.querySelector("form");
        const section = document.querySelector("section");

        const inputs = form.querySelectorAll("input");
        const titular = inputs[0].value.trim();
        const cuerpo = inputs[1].value.trim();
        const redactor = inputs[2].value.trim();

        if (titular && cuerpo && redactor) {
            const noticia = `<article>
                <h6>${titular}</h6>
                <ul>
                    <li>${cuerpo}</li>
                    <li>${redactor}</li>
                </ul>
            </article>`;
            section.insertAdjacentHTML("beforeend", noticia);

            this.endForm();
        }
    }

    endForm(){
        const articles = document.querySelectorAll("article");
        const articleCreateNotice = articles[articles.length - 2];

        const createButton = document.createElement("button");
        createButton.textContent = "CrearNoticia";
        createButton.addEventListener("click", () => this.generateFormNotice());
        articleCreateNotice.appendChild(createButton);

        const form = articleCreateNotice.querySelector("form");
        form.remove();

        this.deleteParagraph();

        const mensaje = `<p>Noticia creada con exito</p>`;
        articleCreateNotice.insertAdjacentHTML("beforeend", mensaje);
    }

    deleteParagraph(){
        $(document).ready(function() {
            $("article p").remove();
        });
    }
}

const noticia = new Noticia();
