class Viajes {

    constructor (){
        this.error = false;
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.showErrors.bind(this));
    }

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

    generateStaticMap(){   
        const section = document.querySelector("section");
        section.innerHTML = "";
        section.insertAdjacentHTML("beforeend", "<h3>Ubicacion actual</h3>");
        if (!this.error) {
            var apiKey = "&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU";
            var url = "https://maps.googleapis.com/maps/api/staticmap?";
            var centro = "center=" + this.latitud + "," + this.longitud;
            var zoom ="&zoom=15";
            var tamaño= "&size=800x600";
            var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
            var sensor = "&sensor=false"; 
        
            this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
            section.insertAdjacentHTML("beforeend", "<img src='" + this.imagenMapa + "' alt='mapa estático google' />");
        }
        else{
            section.insertAdjacentHTML("beforeend", `<p>${this.mensaje}</p>`);
        }
    }

    generateDynamicMap() {  
        const section = document.querySelector("section");
        section.innerHTML = ""; 
        section.insertAdjacentHTML("beforeend", "<h3>Ubicacion actual</h3>");
    
        if (!this.error) {
            
            const mapaDiv = document.createElement("div");
            section.appendChild(mapaDiv);
            
            const centro = { lat: this.latitud, lng: this.longitud };
            const mapaGeoposicionado = new google.maps.Map(mapaDiv, {
                zoom: 15,
                center: centro,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            
            new google.maps.Marker({
                position: centro,
                map: mapaGeoposicionado,
                title: "Tu ubicación actual"
            });
        } else {
            section.insertAdjacentHTML("beforeend", `<p>${this.mensaje}</p>`);
        }
    }
    

}

var geolocalizacion = new Viajes();
