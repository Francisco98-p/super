<?php
$project_dir = "C:/Users/User/Desktop/Cursado 2025/tesis/bcfexa-remote/";
$index_file = $project_dir . "index.php";
$index_content = file_get_contents($index_file);

// Extract the header (from <!DOCTYPE html> to </nav>)
$head_nav_pos = strpos($index_content, '<div class="container mt-4">');
$head_nav = substr($index_content, 0, $head_nav_pos);

// Extract the footer (from <!-- Footer --> to the end)
$footer_pos = strpos($index_content, '<!-- Footer -->');
$footer = substr($index_content, $footer_pos);
// But wait, the js block for datatables is in the footer area. We need to replace the AJAX part.

// We need a clear template. Let's just create the template completely.
// Because extracting parts from index.php might be flaky if we just use strpos.

// We'll read index.php and replace the main content area.
$start_main = strpos($index_content, '<!-- Main Content -->');
$end_main = strpos($index_content, '<!-- Footer -->');
$main_content = substr($index_content, $start_main, $end_main - $start_main);

// We'll also need to extract everything before main content and everything after.
$top_part = substr($index_content, 0, $start_main);
$bottom_part = substr($index_content, $end_main);

// And we need to fix the deletion table in the PHP block at the very top.
$php_pos = strpos($top_part, '// Consultas para estadísticas');
$php_top = substr($top_part, 0, $php_pos);
$php_stats = substr($top_part, $php_pos);

$pages = [
    [
        'file' => 'alta_persona.php',
        'table' => 'persona',
        'title' => 'Alta de Persona',
        'icon' => 'fa-user',
        'new_btn_link' => 'nueva_persona.php',
        'new_btn_text' => 'Nueva Persona',
        'col1' => 'Id',
        'col2' => 'Persona',
        'ajax_url' => 'ajax-persona.php'
    ],
    [
        'file' => 'alta_unidad_ejecutora.php',
        'table' => 'unidadejecutora',
        'title' => 'Alta de Unidad Ejecutora',
        'icon' => 'fa-building',
        'new_btn_link' => 'nueva_unidadejecutora.php',
        'new_btn_text' => 'Nueva Unidad Ejecutora',
        'col1' => 'Id',
        'col2' => 'Unidad Ejecutora',
        'ajax_url' => 'ajax-unidad-ejecutora.php'
    ],
    [
        'file' => 'alta_organizacion.php',
        'table' => 'organizacion',
        'title' => 'Alta de Organización',
        'icon' => 'fa-sitemap',
        'new_btn_link' => 'nueva_organizacion.php',
        'new_btn_text' => 'Nueva Organización',
        'col1' => 'Id',
        'col2' => 'Organización',
        'ajax_url' => 'ajax-organizacion.php'
    ],
    [
        'file' => 'alta_tipo_actividad.php',
        'table' => 'tipoactividad',
        'title' => 'Alta de Tipo de Actividad',
        'icon' => 'fa-tasks',
        'new_btn_link' => 'nueva_tipoactividad.php',
        'new_btn_text' => 'Nuevo Tipo de Actividad',
        'col1' => 'Id',
        'col2' => 'Tipo de Actividad',
        'ajax_url' => 'ajax-tipo-actividad.php'
    ]
];

foreach ($pages as $p) {
    // 1. Build new PHP top
    $new_top = "<?php
include 'conn.php';
include 'session_bcfexa.php';
\$username = \$_SESSION['username'];
\$userID = \$_SESSION['userID'];

// borro registro
if(isset(\$_GET['action']) && \$_GET['action'] == 'delete') {
    \$id_delete = intval(\$_GET['id']);
    \$query = mysqli_query(\$conn, \"SELECT * FROM " . $p['table'] . " WHERE Id='\$id_delete'\");
    if(mysqli_num_rows(\$query) == 0){
        echo '<div class=\"alert alert-warning alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button> No se encontraron datos.</div>';
    }else{
        \$delete = mysqli_query(\$conn, \"DELETE FROM " . $p['table'] . " WHERE Id='\$id_delete'\");
        if(\$delete){
        echo '<div class=\"alert alert-success alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button> El registro ha sido eliminado correctamente.</div>'; 
        }else{
            echo '<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button> Error, no se pudo eliminar el registro.</div>';
        }
    }
}

// Consultas para estadísticas
\$query_total = mysqli_query(\$conn, \"SELECT COUNT(*) as total FROM actividad\");
\$total_actividades = mysqli_fetch_assoc(\$query_total)['total'];
\$query_mes = mysqli_query(\$conn, \"SELECT COUNT(*) as total FROM actividad WHERE MONTH(Fecha_inicio) = MONTH(CURRENT_DATE()) AND YEAR(Fecha_inicio) = YEAR(CURRENT_DATE())\");
\$actividades_mes = mysqli_fetch_assoc(\$query_mes)['total'];
\$query_completadas = mysqli_query(\$conn, \"SELECT COUNT(*) as total FROM actividad WHERE Fecha_final < CURDATE()\");
\$actividades_completadas = mysqli_fetch_assoc(\$query_completadas)['total'];
\$query_proceso = mysqli_query(\$conn, \"SELECT COUNT(*) as total FROM actividad WHERE Fecha_inicio <= CURDATE() AND Fecha_final >= CURDATE()\");
\$actividades_proceso = mysqli_fetch_assoc(\$query_proceso)['total'];
?>";
    
    // 2. We keep the layout HTML top part, but replace the PHP at the top.
    // Let's just use the index.php html from <!DOCTYPE html> downwards
    $html_start = strpos($index_content, '<!DOCTYPE html>');
    $html_top_part = substr($index_content, $html_start, $start_main - $html_start);

    // 3. Main content
    $new_main = '
            <!-- Main Content -->
            <div class="col-lg-9">
                <div class="main-content">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h3 style="color: var(--primary-color);">
                            <i class="fas ' . $p['icon'] . ' me-2"></i>' . $p['title'] . '
                        </h3>
                        <a href="' . $p['new_btn_link'] . '" class="btn btn-primary-custom">
                            <i class="fas fa-plus-circle me-2"></i>' . $p['new_btn_text'] . '
                        </a>
                    </div>
                    
                    <div class="search-box">
                        <h5><i class="fas fa-search me-2"></i>Búsqueda</h5>
                        <div class="input-group">
                            <input type="text" class="form-control dataTables_filter_input" placeholder="Buscar por texto...">
                            <button class="btn btn-primary-custom" type="button" onclick="$(\'.dataTables_filter_input\').trigger(\'keyup\')">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table id="lookup" class="table table-custom table-hover">
                            <thead>
                                <tr>
                                    <th>' . $p['col1'] . '</th>
                                    <th>' . $p['col2'] . '</th>
                                    <th class="text-center" style="width: 120px;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            </div> <!-- End row from top part -->
        </div> <!-- End container from top part -->
    ';

    // 4. Footer & Scripts - we need to replace the AJAX URL and the columnDefs
    // In bottom_part, we find `ajax-grid-data.php` and replace it
    $new_bottom = str_replace('ajax-grid-data.php', $p['ajax_url'], $bottom_part);
    // Since we only have 3 columns (index 0, 1, 2) in these tables, we should update columnDefs.
    // In index.php we had targets: [0] visible: false. Assuming we want to keep ID hidden.
    
    $file_content = $new_top . "\n" . $html_top_part . $new_main . $new_bottom;

    file_put_contents($project_dir . $p['file'], $file_content);
    echo "Generated " . $p['file'] . "\n";
}
?>
