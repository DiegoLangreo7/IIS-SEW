<?php
class Carrusel {
    private $pais;
    private $capital;
    private $fotos = []; 

    public function __construct($pais, $capital) {
        $this->pais = $pais;
        $this->capital = $capital;
    }

    public function obtenerFotos() {
        $api_key = '3ff5c54cc98787d62f7d75efb0f3852e';
        $tags = urlencode("{$this->pais},{$this->capital}");
        $url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key={$api_key}&tags={$tags}&per_page=10&format=json&nojsoncallback=1";

        $respuesta = file_get_contents($url);
        if ($respuesta === false) {
            return [];
        }

        $datos = json_decode($respuesta, true);
        if (isset($datos['photos']['photo'])) {
            foreach ($datos['photos']['photo'] as $foto) {
                $farm_id = $foto['farm'];
                $server_id = $foto['server'];
                $photo_id = $foto['id'];
                $secret_id = $foto['secret'];

                $photo_url = "https://farm{$farm_id}.staticflickr.com/{$server_id}/{$photo_id}_{$secret_id}.jpg";
                $this->fotos[] = $photo_url;
            }
        }
        return $this->fotos;
    }

    public function getPais() {
        return $this->pais;
    }
}

class Moneda {
    private $monedaLocal;
    private $monedaExtranjera;

    public function __construct($local, $extranjera){
        $this->monedaLocal = $local;
        $this->monedaExtranjera = $extranjera;
    }

    public function obtenerCambioDeMoneda() {
        if($this->monedaLocal === $this->monedaExtranjera){
            $this->monedaExtranjera = "USD";
        }
        $url = "https://api.exchangerate-api.com/v4/latest/{$this->monedaExtranjera}"; 

        $response = file_get_contents($url);
        $data = json_decode($response, true);

        $tipoDeCambio = $data['rates']['EUR'];

        return "1 {$this->monedaExtranjera} = " . round($tipoDeCambio, 2) . " {$this->monedaLocal}";
    }
}
$cambioMoneda = new Moneda("EUR","EUR");

$carrusel = new Carrusel("Italy", "Rome");
$fotos = $carrusel->obtenerFotos();
?>

<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1 Desktop - Viajes</title>
    <link rel="icon" href="multimedia/imagenes/favicon.ico" type="image/x-icon">
    <meta name="author" content="Diego García" />
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="css/estilo.css" />
    <link rel="stylesheet" type="text/css" href="css/layout.css" />
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU"></script>
    <script src="js/viajes.js" defer></script>

</head>	
<body>
    <header>
        <h1><a href="index.html">F1 Desktop</a></h1>
        <nav> 
            <a href="index.html">Inicio</a>
            <a href="piloto.html">Pilotos</a>
            <a href="noticias.html">Noticias</a>
            <a href="calendario.html">Calendario</a>
            <a href="metereologia.html">Meteorología</a>
            <a href="circuito.html">Circuitos</a>
            <a href="viajes.php" class="active">Viajes</a>
            <a href="juegos.html">Juegos</a>
        </nav>
    </header>
    
    <main>
      <p>
        Estás en: <a href="index.html">Inicio</a> >>> Viajes
      </p>

      <h2>Viajes</h2>

      <article>
      <h3>Imagenes del pais</h3>
        <?php foreach ($fotos as $foto): ?>
            <img src="<?= $foto ?>" alt="Imagen de <?= $carrusel->getPais() ?>">
        <?php endforeach; ?>

        <!-- Control buttons -->
        <button>&gt;</button>
        <button>&lt;</button>
      </article>

      <section>
          <h3>Cambio de moneda</h3>
          <?php
            $cambio = $cambioMoneda->obtenerCambioDeMoneda();
            echo "<p>El tipo de cambio actual es: {$cambio}</p>";
           ?>
      </section>

      <section>
          <h3>Ubicacion actual</h3>
          <button onclick="geolocalizacion.generateStaticMap()">Obtener mapa estatico</button>
          <button onclick="geolocalizacion.generateDynamicMap()">Obtener mapa dinamico</button>
      </section>

    </main>
</body>
</html>
