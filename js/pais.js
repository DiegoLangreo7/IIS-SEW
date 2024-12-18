class Pais {
    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
        this.circuito = '';
        this.gobierno = '';
        this.coordenadas = '';
        this.religion = '';
    }

    inicializar(circuito, gobierno, coordenadas, religion) {
        this.circuito = circuito;
        this.gobierno = gobierno;
        this.coordenadas = coordenadas;
        this.religion = religion;
    }

    obtenerNombre() {
        return this.nombre;
    }

    obtenerCapital() {
        return this.capital;
    }

    obtenerInformacionSecundaria() {
        return `
            <ul>
                <li>Circuito: ${this.circuito}</li>
                <li>Población: ${this.poblacion}</li>
                <li>Forma de gobierno: ${this.gobierno}</li>
                <li>Religión mayoritaria: ${this.religion}</li>
            </ul>
        `;
    }

    escribirCoordenadas() {
        const main = document.querySelector("main");
        const coordenadasHTML = `<p>Coordenadas del circuito: ${this.coordenadas}</p>`;
        main.insertAdjacentHTML("beforeend", coordenadasHTML);
    }

    mostrarDatos() {
        const main = document.querySelector("main");
        main.insertAdjacentHTML("beforeend", `
            <h3>Datos del País:</h3>
            <p>Nombre: ${this.obtenerNombre()}</p>
            <p>Capital: ${this.obtenerCapital()}</p>
            <h4>Información Secundaria:</h4>
            ${this.obtenerInformacionSecundaria()}
        `);
        this.escribirCoordenadas();
    }

    obtenerPrevisionMeteorologica() {
        const apiKey = '35fabbe090d642e1845c89d08ef7ad08';
        const ciudad = "Monza";
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&mode=xml&units=metric&lang=es&APPID=${apiKey}`;

        $.ajax({
            dataType: "xml",
            url: url,
            method: 'GET',
            success: function(datos) {
                const diasAgrupados = {};
        
                $('time', datos).each(function() {
                    const fecha = $(this).attr("from").split("T")[0];
                    const hora = $(this).attr("from").split("T")[1].split(":")[0];
                    if (hora === "12") { 
                        diasAgrupados[fecha] = this;
                    }
                });

                const boton = document.querySelector('button');
                boton.remove();
                const section = $("section");
        
                for (const fecha in diasAgrupados) {
                    let infoClima = `<article><h5>Pronóstico para el día ${fecha}</h5>`;
                    const pronostico = diasAgrupados[fecha];
                    const atributos = (selector, attr) => $(selector, pronostico).attr(attr) || "N/A";
                    const detalles = `
                        <p>${new Date(Date.parse($(pronostico).attr("from"))).toLocaleTimeString("es-ES")}</p>
                        <ul>
                            <li><img src="https://openweathermap.org/img/w/${atributos('symbol', 'var')}.png" alt="${atributos('symbol', 'name')}"></li>
                            <li>Temperatura: ${atributos('temperature', 'value')} °C</li>
                            <li>Humedad: ${atributos('humidity', 'value')}%</li>
                            <li>Descripción: ${atributos('symbol', 'name')}</li>
                        </ul>`;
                    infoClima += detalles;
                    section.append(`${infoClima}</article>`);
                }
            },
            error: function() {
                $("section").text("Error al obtener datos del clima. Intente más tarde.");
            }
        });
    }
}

const pais = new Pais("Italia", "Roma", 58990000);
pais.inicializar("Circuito de Monza", "República Parlamentaria", "45.6150° N, 9.2816° E", "Catolicismo apostólico y romano");
pais.mostrarDatos();
