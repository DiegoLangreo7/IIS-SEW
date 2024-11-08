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
                const imageUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.png`;
                this.establecerImagenFondo(imageUrl);
            }
        });
    }

    establecerImagenFondo(imageUrl) {
        const actualPhoto = document.querySelector('img');
        if (actualPhoto) {
            actualPhoto.remove();
        }
        const figureForPhoto = document.getElementsByTagName('figure')[0];
        const newPhoto = document.createElement('img');
        newPhoto.src = imageUrl;
        figureForPhoto.appendChild(newPhoto);
    }
}
