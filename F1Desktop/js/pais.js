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
                    <li>Población: ${this.poblacion} </li>
                    <li>Forma de gobierno: ${this.gobierno}</li>
                    <li>Religión mayoritaria: ${this.religion}</li>
                </ul>
            `;
        }

        escribirCoordenadas() {
            document.write(`<p>Coordenadas del circuito: ${this.coordenadas}</p>`);
        }
    }