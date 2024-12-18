<?php
class F1Teams {
    public $server;
    public $user;
    public $pass;
    public $dbname;
    public $message = "";

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "f1teams";
    }

    private function fetchData($query, $paramType = "", $param = null) {
        $conn = new mysqli($this->server, $this->user, $this->pass);
        
        // Verificar si la base de datos existe
        $dbCheck = $conn->query("SHOW DATABASES LIKE '{$this->dbname}'");
        if (!$dbCheck || $dbCheck->num_rows === 0) {
            $this->message = "La base de datos no existe. Por favor, créala primero antes de importar o exportar nada.";
            $conn->close();
            return [];
        }
    
        // Conectar a la base de datos ahora que sabemos que existe
        $conn->select_db($this->dbname);
        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }
    
        $data = [];
        $stmt = $conn->prepare($query);
        if ($param) {
            $stmt->bind_param($paramType, $param);
        }
    
        $stmt->execute();
        $result = $stmt->get_result();
    
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    
        $stmt->close();
        $conn->close();
        return $data;
    }
    
    // Crear la base de datos desde un archivo SQL
    public function createDatabaseFromSQL($filePath) {
        $conn = new mysqli($this->server, $this->user, $this->pass);
        if ($conn->connect_error) {
            $this->message = "Error: Conexión fallida.";
            return;
        }

        if (file_exists($filePath)) {
            $sql = file_get_contents($filePath);
            if ($conn->multi_query($sql)) {
                do {
                    if ($result = $conn->store_result()) {
                        $result->free();
                    }
                } while ($conn->next_result());

                $this->message = "Base de datos y tablas creadas con éxito desde el archivo SQL.";
            } else {
                $this->message = "Error al ejecutar el archivo SQL.";
            }
        } else {
            $this->message = "El archivo SQL no existe en la ruta especificada.";
        }
        $conn->close();
    }

    // Importar una tabla en formato CSV
    public function importFromCSV($file, $table) {
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        if ($conn->connect_error) {
            $this->message = "Error: Conexión fallida.";
            return;
        }

        if (($handle = fopen($file, "r")) !== FALSE) {
            $headers = fgetcsv($handle);
            if (!$headers) {
                $this->message = "El archivo CSV no contiene encabezados válidos.";
                return;
            }
            $columns = implode(", ", array_map([$conn, 'real_escape_string'], $headers));

            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $values = implode("', '", array_map([$conn, 'real_escape_string'], $data));
                $sql = "INSERT INTO `$table` ($columns) VALUES ('$values')";

                if (!$conn->query($sql)) {
                    $this->message = "Error al insertar los datos en la tabla $table.";
                    break;
                }
            }

            fclose($handle);
            $this->message = "Datos importados con éxito a la tabla $table.";
        } else {
            $this->message = "Error al abrir el archivo.";
        }
        $conn->close();
    }

    // Exportar toda la base de datos a un archivo CSV
    public function exportToCSV($file) {
        $tables = $this->fetchData("SHOW TABLES");
        $fp = fopen($file, 'w');
        if (!$fp) {
            $this->message = "Error al crear el archivo CSV.";
            return;
        }

        foreach ($tables as $tableRow) {
            $table = $tableRow['Tables_in_' . $this->dbname];
            fputcsv($fp, ["Tabla: $table"]);
            $columns = $this->fetchData("SHOW COLUMNS FROM $table");
            fputcsv($fp, array_column($columns, 'Field'));

            $rows = $this->fetchData("SELECT * FROM $table");
            foreach ($rows as $row) {
                fputcsv($fp, $row);
            }
            fputcsv($fp, []);
        }

        fclose($fp);
        $this->message = "Base de datos exportada a $file.";
    }

    // Obtener todos los equipos
    public function getEquipos() {
        return $this->fetchData("SELECT id, nombre FROM equipos");
    }

    // Obtener información detallada de un equipo y sus tablas relacionadas
    public function getEquipoDetalle($equipoId) {
        $detalle = [
            'equipo' => null,
            'coches' => [],
            'pilotos' => [],
            'patrocinadores' => []
        ];

        $detalle['equipo'] = $this->fetchData("SELECT * FROM equipos WHERE id = ?", "i", $equipoId)[0] ?? null;
        $detalle['coches'] = $this->fetchData("SELECT * FROM coches WHERE id_equipo = ?", "i", $equipoId);
        $detalle['pilotos'] = $this->fetchData("SELECT * FROM pilotos WHERE id_equipo = ?", "i", $equipoId);
        $detalle['patrocinadores'] = $this->fetchData("SELECT p.* FROM patrocinador p INNER JOIN es_patrocinador e ON p.id = e.id_patrocinador WHERE e.id_equipo = ?", "i", $equipoId);

        return $detalle;
    }
}

$f1 = new F1Teams();
$equipos = $f1->getEquipos();
$detalleEquipo = null;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['create_db'])) {
        $sqlFilePath = 'f1teams.sql';
        $f1->createDatabaseFromSQL($sqlFilePath);
        $equipos = $f1->getEquipos();
    } elseif (isset($_POST['import_csv'])) {
        $selectedTable = $_POST['tablas'];
        if (!empty($_FILES['csv_file']['tmp_name']) && !empty($selectedTable)) {
            $f1->importFromCSV($_FILES['csv_file']['tmp_name'], $selectedTable);
            $equipos = $f1->getEquipos();
        } else {
            $f1->message = "Por favor, selecciona un archivo CSV y una tabla para importar.";
        }
    } elseif (isset($_POST['export_csv'])) {
        $f1->exportToCSV("exported_database.csv");
    } elseif (isset($_POST['mostrar_equipo'])) {
        $detalleEquipo = $f1->getEquipoDetalle($_POST['equipo_id']);
    } elseif (isset($_POST['volver'])) {
        $detalleEquipo = null;
    }
}
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1 Desktop - Informacion Equipos</title>
    <link rel="icon" href="multimedia/imagenes/favicon.ico" type="image/x-icon">
    <meta name="author" content="Diego García" />
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../css/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../css/layout.css" />
    <link rel="stylesheet" type="text/css" href="../css/librePHP.css" />
</head>
<body>
    <header>
        <h1><a href="../index.html">F1 Desktop</a></h1>
        <nav> 
            <a href="../index.html">Inicio</a>
            <a href="../piloto.html">Pilotos</a>
            <a href="../noticias.html">Noticias</a>
            <a href="../calendario.html">Calendario</a>
            <a href="../metereologia.html">Meteorología</a>
            <a href="../circuito.html">Circuitos</a>
            <a href="../viajes.php">Viajes</a>
            <a href="../juegos.html" class="active">Juegos</a>
        </nav>
    </header>
    <p>
        Estás en: <a href="../index.html">Inicio</a> >>> Juegos
    </p>
    <main>
        <h2>Juegos</h2>
        <ul>
            <li>
                <a href="../memoria.html">Juego de Memoria</a>
            </li>
            <li>
                <a href="../semaforo.php">Juego de tiempo de reacción</a>
            </li>
            <li>
                <a href="../api.html">Resultados ultima carrera</a>
            </li>
            <li>
                <a href="libre.php">Ejercicio libre</a>
            </li>
        </ul>
    </main>

    <!-- Mensajes de aviso del resultado de las operaciones de base de datos -->
    <?php if (!empty($f1->message)): ?>
        <p><?php echo htmlspecialchars($f1->message); ?></p>
    <?php endif; ?>

    <section>
        <h2>Gestión de Equipos de F1</h2>
        <form method="POST" enctype="multipart/form-data">
            <article>
                <h3>Crear la base de datos</h3>
                <p>
                    Esta accion creara la base de datos en su estado incial.
                    En caso de estar ya creada, vaciara los datos que no sean los iniciales.
                    En caso de querer introducir mas datos, importar el csv correspondiente.
                    *Se recomienda importar los csv proporcionados para probar la funcionalidad*
                </p>
                <button name="create_db">Crear Base de Datos</button>
            </article>
            <article>
                <h3>Importar el CSV de una tabla</h3>
                <label for="tablas">Seleccionar la tabla correspondiente:</label>
                <select name="tablas" id="tablas">
                    <option value="equipos">Tabla equipos</option>
                    <option value="patrocinador">Tabla patrocinador</option>
                    <option value="coches">Tabla coches</option>
                    <option value="es_patrocinador">Tabla es_patrocinador</option>
                    <option value="pilotos">Tabla pilotos</option>
                </select>
                <p>
                    *Se recomienda importar en el orden de aparicion 
                    en el combobox, para evitar violar restricciones*
                </p>
                <label for="archivo">Introduzca el archivo csv correspondiente:</label>
                <input type="file" id="archivo" name="csv_file" accept=".csv">
                <button name="import_csv">Importar CSV</button>          
            </article>
            <article>
                <h3>Exportar a CSV</h3>
                <p>
                    Esta accion exportada la base de datos al completo
                    a un fichero exported_database.csv, en la misma carpeta php.
                </p>
                <button name="export_csv">Exportar a CSV</button>
            </article>
        </form>
    </section>

    <section>
        <h3>Listado de Equipos</h3>
        <?php if (!$detalleEquipo): ?>
            <?php foreach ($equipos as $equipo): ?>
                <form method="POST">
                    <button name="mostrar_equipo" value="<?php echo $equipo['id']; ?>" type="submit">
                        <?php echo htmlspecialchars($equipo['nombre']); ?>
                    </button>
                    <input type="hidden" name="equipo_id" value="<?php echo $equipo['id']; ?>">
                </form>
            <?php endforeach; ?>
        <?php else: ?>
            <h4>Información del Equipo: <?php echo htmlspecialchars($detalleEquipo['equipo']['nombre']); ?></h4>
            <p>Base: <?php echo htmlspecialchars($detalleEquipo['equipo']['base']); ?></p>
            <p>Jefe: <?php echo htmlspecialchars($detalleEquipo['equipo']['jefe']); ?></p>
            <p>Fundación: <?php echo htmlspecialchars($detalleEquipo['equipo']['fundation_date']); ?></p>
            <p>Mundiales: <?php echo $detalleEquipo['equipo']['world_championships']; ?></p>
            <p>Poles: <?php echo $detalleEquipo['equipo']['pole_positions']; ?></p>
            <p>Vueltas Rapidas: <?php echo $detalleEquipo['equipo']['vueltas_rapidas']; ?></p>

            <h4>Coches</h4>
            <ul>
                <?php foreach ($detalleEquipo['coches'] as $coche): ?>
                    <li><?php echo htmlspecialchars($coche['nombre']) . " - Motor: " . htmlspecialchars($coche['motor']); ?></li>
                <?php endforeach; ?>
            </ul>

            <h4>Pilotos</h4>
            <ul>
                <?php foreach ($detalleEquipo['pilotos'] as $piloto): ?>
                    <li><?php echo htmlspecialchars($piloto['nombre']) . " - Nacionalidad: " . htmlspecialchars($piloto['nacionalidad']); ?></li>
                <?php endforeach; ?>
            </ul>

            <h4>Patrocinadores</h4>
            <ul>
                <?php foreach ($detalleEquipo['patrocinadores'] as $patrocinador): ?>
                    <li><?php echo htmlspecialchars($patrocinador['nombre_patrocinador']); ?></li>
                <?php endforeach; ?>
            </ul>

            <form method="POST">
                <button name="volver">Volver</button>
            </form>
        <?php endif; ?>
    </section>
</body>
</html>
