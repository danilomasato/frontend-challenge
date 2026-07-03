<?php
// 1. Permite que o seu site faça requisições para esta API
header("Access-Control-Allow-Origin: https://tudosobreap.com.br");

// 2. Define os métodos HTTP permitidos
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// 3. Permite os cabeçalhos que o Axios/Fetch costumam enviar (como Content-Type e Authorization)
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// 4. IMPORTANTE: Responde imediatamente às requisições de teste (Preflight OPTIONS) do navegador
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- O RESTANTE DO SEU CÓDIGO ATUAL COMEÇA AQUI ---
?>