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

// Utiliser plusieurs sources d'images avec fallback
$searchQuery = urlencode($query . ' France');

// Option: Utiliser Pexels API (gratuite, nécessite une clé API)
// Pour activer, ajoutez PEXELS_API_KEY dans config.php
$pexelsApiKey = ''; // Vous pouvez ajouter votre clé Pexels ici
if (!empty($pexelsApiKey)) {
    $pexelsUrl = 'https://api.pexels.com/v1/search?query=' . $searchQuery . '&per_page=1&orientation=landscape';
    $ch = curl_init($pexelsUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Authorization: ' . $pexelsApiKey],
        CURLOPT_TIMEOUT => 5
    ]);
    $pexelsResponse = curl_exec($ch);
    $pexelsHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($pexelsHttpCode === 200) {
        $pexelsData = json_decode($pexelsResponse, true);
        if (isset($pexelsData['photos'][0]['src']['medium'])) {
            echo json_encode([
                'success' => true,
                'imageUrl' => $pexelsData['photos'][0]['src']['medium'],
                'query' => $query,
                'source' => 'pexels'
            ]);
            exit;
        }
    }
}

// Liste de sources d'images à essayer (dans l'ordre) - fallback si pas d'API
$imageSources = [
    // Source 1: Unsplash Source (peut ne pas fonctionner mais on essaie)
    'https://source.unsplash.com/400x300/?' . $searchQuery,
    // Source 2: Images Unsplash directes avec recherche par mot-clé
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop&q=80', // Paysage français générique
    // Source 3: Image de la Bretagne (si c'est dans la région)
    'https://images.unsplash.com/photo-1531538517172-0e981df47f01?w=400&h=300&fit=crop&q=80',
    // Source 4: Image de plage française
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop&q=80'
];

// Essayer de trouver une image qui fonctionne
$workingImageUrl = null;

foreach ($imageSources as $imageUrl) {
    $ch = curl_init($imageUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_NOBODY => true,
        CURLOPT_HEADER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 3,
        CURLOPT_CONNECTTIMEOUT => 2,
        CURLOPT_SSL_VERIFYPEER => false
    ]);
    
    curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200 || $httpCode === 301 || $httpCode === 302) {
        $workingImageUrl = $imageUrl;
        break;
    }
}

// Si aucune image ne fonctionne, utiliser un fallback
if (!$workingImageUrl) {
    $workingImageUrl = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop&q=80';
}

echo json_encode([
    'success' => true,
    'imageUrl' => $workingImageUrl,
    'query' => $query
]);

