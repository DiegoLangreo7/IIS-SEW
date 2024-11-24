
class Fondo {
    constructor(pais, capital, circuito) {
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
    }

    obtenerImagenFlickr() {
        const apiKey = '3ff5c54cc98787d62f7d75efb0f3852e'; 
        const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&text=${this.circuito}+circuito+f1&format=json&nojsoncallback=1`;

        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                const photo = data.photos.photo[0];  
                const img_url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.png`;
                this.establecerImagenFondo(img_url);
            }
        });
    }

    establecerImagenFondo(img_url) {
        const figureFotoPredeterminada = document.querySelector('figure');
        if (figureFotoPredeterminada) {
            figureFotoPredeterminada.remove();
        }

        const fondo = document.getElementsByTagName('body')[0];
        fondo.style.backgroundImage = `url('${img_url}')`;
        fondo.style.backgroundSize = 'cover';
        fondo.style.backgroundPosition = 'center';
        fondo.style.backgroundRepeat = 'no-repeat';
    }
}
