<?php
$dir = "C:/Users/User/Desktop/Cursado 2025/tesis/bcfexa-remote/";
$files = array_merge(glob($dir . "editar_*.php"), glob($dir . "nueva_*.php"));

$new_nav = '<div class="navbar navbar-fixed-top" style="background: linear-gradient(135deg, #1a4b8c, #2c6eb5); border-bottom: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div class="navbar-inner" style="background: transparent; border: none; box-shadow: none;">
                <div class="container" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
                    <a class="brand" href="index.php" style="color: white; font-weight: bold; text-shadow: none; font-size: 20px; float: none; padding: 0;">
                        <i class="icon-university"></i> BCFEXA - Intranet
                    </a>
                    <a href="index.php" class="btn btn-info" style="color: white; padding: 10px 20px; font-weight: bold; border-radius: 5px;">
                        <i class="icon-home" style="margin-right:5px;"></i> Volver al Menú Inicial
                    </a>
                </div>
            </div>
            
        </div><br />';

foreach ($files as $file) {
    if (strpos($file, 'editar_original') !== false || strpos($file, 'editar.php') !== false) continue; // skip backups
    $content = file_get_contents($file);
    
    // Find where the navbar starts
    $start = strpos($content, '<div class="navbar navbar-fixed-top">');
    if ($start !== false) {
        $end = strpos($content, '</div><br />', $start);
        if ($end !== false) {
            $end += strlen('</div><br />');
            $old_nav = substr($content, $start, $end - $start);
            // Replace old nav with new nav
            $content = str_replace($old_nav, $new_nav, $content);
            file_put_contents($file, $content);
            echo "Updated $file\n";
        }
    }
}
?>
