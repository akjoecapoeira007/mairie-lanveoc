<?php
/**
 * Images API Endpoint
 * Recherche d'images pour les lieux mentionnés dans les réponses GPT
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Vérifier que la méthode est GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use GET.']);
    exit;
}

// Récupérer le paramètre de recherche
$query = isset($_GET['q']) ? trim($_GET['q']) : '';

if (empty($query)) {
    http_response_code(400);
    echo json_encode(['error' => 'Query parameter "q" is required']);
    exit;
}

// Utiliser Unsplash Source API (gratuit, sans clé pour usage basique)
// Format: https://source.unsplash.com/400x300/?{query}
$imageUrl = 'https://source.unsplash.com/400x300/?' . urlencode($query . ' France');

// Vérifier si l'image existe en faisant une requête HEAD
$ch = curl_init($imageUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_NOBODY => true,
    CURLOPT_HEADER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT => 5,
    CURLOPT_CONNECTTIMEOUT => 3
]);

curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo json_encode([
        'success' => true,
        'imageUrl' => $imageUrl,
        'query' => $query
    ]);
} else {
    // Fallback: utiliser une image générique de paysage français
    $fallbackUrl = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop&q=80';
    echo json_encode([
        'success' => true,
        'imageUrl' => $fallbackUrl,
        'query' => $query,
        'fallback' => true
    ]);
}

