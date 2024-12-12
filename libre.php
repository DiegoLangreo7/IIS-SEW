<?php
class F1Teams {
    public $server;
    public $user;
    public $pass;
    public $dbname;

    public function __construct() {
        $this->server = "localhost"; 
        $this->user = "DBUSER2024";  
        $this->pass = "DBPSWD2024"; 
        $this->dbname = "teams";   
    }

    // Método para crear la base de datos y sus tablas
    public function createDatabase() {
        $conn = new mysqli($this->server, $this->user, $this->pass);
        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }

        // Crear la base de datos
        $sql = "CREATE DATABASE IF NOT EXISTS " . $this->dbname;
        if ($conn->query($sql) === TRUE) {
            echo "Base de datos creada con éxito.<br>";
        } else {
            echo "Error al crear la base de datos: " . $conn->error . "<br>";
        }

        // Seleccionar la base de datos
        $conn->select_db($this->dbname);

        // Crear tablas
        $sql = <<<SQL
        CREATE TABLE IF NOT EXISTS equipos (
            id INT(11) NOT NULL AUTO_INCREMENT,
            nombre VARCHAR(255) NOT NULL,
            base VARCHAR(255) NOT NULL,
            jefe VARCHAR(255) NOT NULL,
            fundation_date DATE NOT NULL,
            world_championships INT(11) NOT NULL,
            pole_positions INT(11) NOT NULL,
            vueltas_rapidas INT(11) NOT NULL,
            PRIMARY KEY (id)
        );
        CREATE TABLE IF NOT EXISTS coches (
            id INT(11) NOT NULL AUTO_INCREMENT,
            nombre VARCHAR(255) NOT NULL,
            motor VARCHAR(255) NOT NULL,
            id_equipo INT(11) NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (id_equipo) REFERENCES equipos(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS patrocinador (
            id INT(11) NOT NULL AUTO_INCREMENT,
            nombre_patrocinador VARCHAR(255) NOT NULL,
            PRIMARY KEY (id)
        );
        CREATE TABLE IF NOT EXISTS es_patrocinador (
            id_equipo INT(11) NOT NULL,
            id_patrocinador INT(11) NOT NULL,
            PRIMARY KEY (id_equipo, id_patrocinador),
            FOREIGN KEY (id_equipo) REFERENCES equipos(id) ON DELETE CASCADE,
            FOREIGN KEY (id_patrocinador) REFERENCES patrocinador(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS pilotos (
            id INT(11) NOT NULL AUTO_INCREMENT,
            n_pista INT(11) NOT NULL,
            nombre VARCHAR(255) NOT NULL,
            nacionalidad VARCHAR(100) NOT NULL,
            fecha_nacimiento DATE NOT NULL,
            id_equipo INT(11) NOT NULL,
            PRIMARY KEY (id),
            FOREIGN KEY (id_equipo) REFERENCES equipos(id) ON DELETE CASCADE
        );
        SQL;

        if ($conn->multi_query($sql) === TRUE) {
            echo "Tablas creadas con éxito.<br>";
        } else {
            echo "Error al crear las tablas: " . $conn->error . "<br>";
        }

        $conn->close();
    }

    // Método para importar datos desde un archivo CSV
    public function importFromCSV($file) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }

        if (($handle = fopen($file, "r")) !== FALSE) {
            fgetcsv($handle); // Ignorar la primera línea (encabezados)

            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                // Procesar cada fila e insertarla en las tablas
                // Este código asume un formato específico en el CSV. Ajusta según tus necesidades.
                $sql = "INSERT INTO equipos (nombre, base, jefe, fundation_date, world_championships, pole_positions, vueltas_rapidas)
                        VALUES ('" . implode("','", array_map([$conn, 'real_escape_string'], $data)) . "')";
                $conn->query($sql);
            }

            fclose($handle);
            echo "Datos importados con éxito.";
        } else {
            echo "Error al abrir el archivo.";
        }

        $conn->close();
    }

    // Método para exportar datos a un archivo CSV
    public function exportToCSV($file) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }

        $sql = "SELECT * FROM equipos";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $fp = fopen($file, 'w');

            // Escribir encabezados
            fputcsv($fp, array('id', 'nombre', 'base', 'jefe', 'fundation_date', 'world_championships', 'pole_positions', 'vueltas_rapidas'));

            // Escribir datos
            while ($row = $result->fetch_assoc()) {
                fputcsv($fp, $row);
            }

            fclose($fp);
            echo "Datos exportados a $file.";
        } else {
            echo "No hay datos para exportar.";
        }

        $conn->close();
    }
}

$f1 = new F1Teams();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['create_db'])) {
        $f1->createDatabase();
    } elseif (isset($_POST['import_csv'])) {
        $f1->importFromCSV($_FILES['csv_file']['tmp_name']);
    } elseif (isset($_POST['export_csv'])) {
        $f1->exportToCSV("exported_data.csv");
    }
}
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1 Desktop - por poner</title>
    <link rel="icon" href="multimedia/imagenes/favicon.ico" type="image/x-icon">
    <meta name="author" content="Diego García" />
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="css/estilo.css" />
    <link rel="stylesheet" type="text/css" href="css/layout.css" />
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
            <a href="viajes.php">Viajes</a>
            <a href="juegos.html" class="active">Juegos</a>
        </nav>
    </header>
    <p>
        Estás en: <a href="index.html">Inicio</a> >>> Juegos
    </p>
    <main>
        <h2>Juegos</h2>
        <ul>
            <li>
				<a href="memoria.html">Juego de Memoria</a>
			</li>
            <li>
				<a href="semaforo.php">Juego de tiempo de reacción</a>
			</li>
            <li>
				<a href="api.html">Resultados ultima carrera</a>
			</li>
            <li>
				<a href="libre.php">Ejercicio libre</a>
			</li>
        </ul>
    </main>
    <h1>Gestión de Equipos de F1</h1>
    <form method="POST" enctype="multipart/form-data">
        <button name="create_db">Crear Base de Datos</button>
        <br><br>
        <input type="file" name="csv_file" accept=".csv">
        <button name="import_csv">Importar CSV</button>
        <br><br>
        <button name="export_csv">Exportar a CSV</button>
    </form>
</body>
</html>