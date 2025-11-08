<?php
/**
 * GPT API Endpoint
 * Gère les requêtes vers OpenAI GPT-5 avec le message système Guide France
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Vérifier que la méthode est POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit;
}

// Configuration
// Charger depuis config.php (requis pour la sécurité)
$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Configuration file not found. Please create api/config.php']);
    exit;
}

$config = require $configFile;
$OPENAI_API_KEY = $config['OPENAI_API_KEY'] ?? '';
$GPT_MODEL = $config['GPT_MODEL'] ?? 'gpt-5';
$SYSTEM_MESSAGE = $config['SYSTEM_MESSAGE'] ?? 'Tu es Guide France, un conseiller touristique virtuel pour toutes les régions de France. Tu aides les utilisateurs à découvrir les spécialités locales, les activités, et les meilleurs endroits où manger, dormir, ou visiter.';
$OPENAI_API_URL = $config['OPENAI_API_URL'] ?? 'https://api.openai.com/v1/chat/completions';

// Vérifier que la clé API est configurée
if (empty($OPENAI_API_KEY)) {
    http_response_code(500);
    echo json_encode(['error' => 'OpenAI API key not configured in config.php']);
    exit;
}

// Récupérer les données JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Vérifier que la requête contient un message
if (!isset($data['message']) || empty(trim($data['message']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required']);
    exit;
}

$userMessage = trim($data['message']);

// Préparer la requête pour OpenAI
$requestData = [
    'model' => $GPT_MODEL,
    'messages' => [
        [
            'role' => 'system',
            'content' => $SYSTEM_MESSAGE
        ],
        [
            'role' => 'user',
            'content' => $userMessage . "\n\nIMPORTANT: Réponds de manière courte et structurée. Utilise des listes à puces pour faciliter la comparaison. Mentionne clairement les noms des lieux pour permettre la recherche d'images."
        ]
    ],
    'temperature' => 0.7 // Équilibrer créativité et concision
];

// Utiliser max_completion_tokens pour GPT-5, max_tokens pour les autres modèles
if ($GPT_MODEL === 'gpt-5') {
    $requestData['max_completion_tokens'] = 500;
} else {
    $requestData['max_tokens'] = 500;
}

// Initialiser cURL
$ch = curl_init($OPENAI_API_URL);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $OPENAI_API_KEY
    ],
    CURLOPT_POSTFIELDS => json_encode($requestData),
    CURLOPT_TIMEOUT => 120, // Timeout de 2 minutes pour les réponses longues
    CURLOPT_CONNECTTIMEOUT => 10
]);

// Exécuter la requête
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Gérer les erreurs cURL
if ($response === false || !empty($curlError)) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Network error: ' . ($curlError ?: 'Unknown error')
    ]);
    exit;
}

// Décoder la réponse
$responseData = json_decode($response, true);

// Vérifier si la réponse est valide
if ($httpCode !== 200) {
    http_response_code($httpCode);
    $errorMessage = $responseData['error']['message'] ?? 'Unknown error from OpenAI API';
    echo json_encode([
        'error' => $errorMessage,
        'code' => $httpCode
    ]);
    exit;
}

// Extraire le contenu de la réponse
$content = $responseData['choices'][0]['message']['content'] ?? 'Aucune réponse reçue.';

// Retourner la réponse
echo json_encode([
    'success' => true,
    'content' => $content,
    'model' => $responseData['model'] ?? $GPT_MODEL,
    'usage' => $responseData['usage'] ?? null
]);

