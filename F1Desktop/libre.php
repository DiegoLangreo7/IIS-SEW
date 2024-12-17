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
        $this->dbname = "prueba1";   
    }

    // Método para crear la base de datos utilizando un archivo SQL
    public function createDatabaseFromSQL($filePath) {
        $conn = new mysqli($this->server, $this->user, $this->pass);
        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }

        // Leer el contenido del archivo SQL
        if (file_exists($filePath)) {
            $sql = file_get_contents($filePath);
            if ($sql === false) {
                die("Error al leer el archivo SQL.");
            }

            // Ejecutar las sentencias del archivo SQL
            if ($conn->multi_query($sql)) {
                do {
                    if ($result = $conn->store_result()) {
                        $result->free();
                    }
                } while ($conn->next_result());

                echo "Base de datos y tablas creadas con éxito desde el archivo SQL.<br>";
            } else {
                echo "Error al ejecutar el archivo SQL: " . $conn->error . "<br>";
            }
        } else {
            echo "El archivo SQL no existe en la ruta especificada.<br>";
        }

        $conn->close();
    }

    public function importFromCSV($file, $table) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }
    
        if (($handle = fopen($file, "r")) !== FALSE) {
            $headers = fgetcsv($handle); 
            $columns = implode(", ", array_map([$conn, 'real_escape_string'], $headers)); 
    
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $values = implode("', '", array_map([$conn, 'real_escape_string'], $data));
                $sql = "INSERT INTO `$table` ($columns) VALUES ('$values')";
    
                if (!$conn->query($sql)) {
                    echo "Error al insertar los datos en la tabla $table: " . $conn->error . "<br>";
                }
            }
    
            fclose($handle);
            echo "Datos importados con éxito a la tabla $table.";
        } else {
            echo "Error al abrir el archivo.";
        }
    
        $conn->close();
    }
    

    // Método para exportar toda la base de datos a un archivo CSV
    public function exportToCSV($file) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }

        // Obtener todas las tablas de la base de datos
        $tables = [];
        $result = $conn->query("SHOW TABLES");
        if ($result) {
            while ($row = $result->fetch_array()) {
                $tables[] = $row[0];
            }
        }

        $fp = fopen($file, 'w');
        if (!$fp) {
            die("Error al crear el archivo CSV.");
        }

        // Exportar cada tabla
        foreach ($tables as $table) {
            fputcsv($fp, ["Tabla: $table"]);
            $columnsResult = $conn->query("SHOW COLUMNS FROM $table");
            $columns = [];
            while ($column = $columnsResult->fetch_assoc()) {
                $columns[] = $column['Field'];
            }
            fputcsv($fp, $columns);

            $dataResult = $conn->query("SELECT * FROM $table");
            while ($row = $dataResult->fetch_assoc()) {
                fputcsv($fp, $row);
            }
            fputcsv($fp, []); // Línea en blanco para separar tablas
        }

        fclose($fp);
        echo "Base de datos exportada a $file.";

        $conn->close();
    }
}

$f1 = new F1Teams();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['create_db'])) {
        $sqlFilePath = 'prueba1.sql'; 
        $f1->createDatabaseFromSQL($sqlFilePath);
    } elseif (isset($_POST['import_csv'])) {
        $selectedTable = $_POST['tablas']; 
        if (!empty($_FILES['csv_file']['tmp_name']) && !empty($selectedTable)) {
            $f1->importFromCSV($_FILES['csv_file']['tmp_name'], $selectedTable);
        } else {
            echo "Por favor, selecciona un archivo CSV y una tabla para importar.";
        }
    } elseif (isset($_POST['export_csv'])) {
        $f1->exportToCSV("database2.csv");
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
    <link rel="stylesheet" type="text/css" href="css/librePHP.css" />
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
    <section>
        <h2>Gestión de Equipos de F1</h2>
        <form method="POST" enctype="multipart/form-data">
            <article>
                <h3>Crear la base de datos</h3>
                <p>
                    Esta accion creara la base de datos vacia,
                    es necesario importar las tablas para el uso 
                    de la informacion.
                </p>
                <button name="create_db">Crear Base de Datos</button>
            </article>
            <article>
                <h3>Importar el CSV de una tabla</h3>
                <label for="tablas">Seleccionar la tabla correspondiente:</label>
                <select name="tablas" id="tablas">
                    <option value="coches">Tabla coches</option>
                    <option value="equipos">Tabla equipos</option>
                    <option value="es_patrocinador">Tabla es_patrocinador</option>
                    <option value="patrocinador">Tabla patrocinador</option>
                    <option value="pilotos">Tabla pilotos</option>
                </select>
                <input type="file" name="csv_file" accept=".csv">  
                <button name="import_csv">Importar CSV</button>          
            </article>
            <article>
                <h3>Exportar a CSV</h3>
                <p>
                    Esta accion exportada la base de datos al completo
                    a un fichero database.csv
                </p>
                <button name="export_csv">Exportar a CSV</button>
            </article>
        </form>
    </section>
</body>
</html>
