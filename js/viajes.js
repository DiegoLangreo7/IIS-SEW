class Viajes {
  constructor() {
      this.error = false;
      this.curSlide = 0;

      navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.showErrors.bind(this));

      this.article = document.querySelector("article");
      this.slides = this.article.querySelectorAll("img");
      this.maxSlide = this.slides.length - 1;
  }

  siguienteFoto() {
      this.curSlide = (this.curSlide === this.maxSlide) ? 0 : this.curSlide + 1;
      this.actualizarCarrusel();
  }

  anteriorFoto() {
      this.curSlide = (this.curSlide === 0) ? this.maxSlide : this.curSlide - 1;
      this.actualizarCarrusel();
  }

  actualizarCarrusel() {
      this.slides.forEach((slide, indx) => {
          const trans = 100 * (indx - this.curSlide);
          slide.style.transform = `translateX(${trans}%)`;
      });
  }

  getPosicion(posicion){
      this.longitud = posicion.coords.longitude; 
      this.latitud = posicion.coords.latitude;  
      this.precision = posicion.coords.accuracy;
      this.altitud = posicion.coords.altitude;
      this.precisionAltitud = posicion.coords.altitudeAccuracy;
      this.rumbo = posicion.coords.heading;
      this.velocidad = posicion.coords.speed;       
  }

  showErrors(error){
      switch(error.code) {
      case error.PERMISSION_DENIED:
          this.mensaje = "El usuario no permite la petición de geolocalización";
          break;
      case error.POSITION_UNAVAILABLE:
          this.mensaje = "Información de geolocalización no disponible";
          break;
      case error.TIMEOUT:
          this.mensaje = "La petición de geolocalización ha caducado";
          break;
      case error.UNKNOWN_ERROR:
          this.mensaje = "Se ha producido un error desconocido";
          break;
      }
      this.error = true;
  }

  generateStaticMap(){   
      const sections = document.querySelectorAll("section");
      const section = sections[1];
      section.innerHTML = "";
      section.insertAdjacentHTML("beforeend", "<h3>Ubicacion actual</h3>");
      if (!this.error) {
          const apiKey = "&key=AIzaSyBU6Pk-2anDmu4HGU_v7Oi89jbuOvxRGqE";
          const url = "https://maps.googleapis.com/maps/api/staticmap?";
          const centro = "center=" + this.latitud + "," + this.longitud;
          const zoom ="&zoom=15";
          const tamaño= "&size=800x600";
          const marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;
          const sensor = "&sensor=false"; 
      
          this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
          section.insertAdjacentHTML("beforeend", "<img src='" + this.imagenMapa + "' alt='mapa estático google' />");
      }
      else{
          section.insertAdjacentHTML("beforeend", `<p>${this.mensaje}</p>`);
      }
  }

  generateDynamicMap() {  
      const sections = document.querySelectorAll("section");
      const section = sections[1];
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

document.addEventListener("DOMContentLoaded", () => {
    const article = document.querySelector("article");
    if (article) {
        const botones = article.querySelectorAll("button");
        
        if (botones.length >= 2) {
            botones[0].addEventListener("click", () => geolocalizacion.siguienteFoto());
            botones[1].addEventListener("click", () => geolocalizacion.anteriorFoto());
        }
    } else {
        console.error("No se encontró el elemento <article>");
    }
});

