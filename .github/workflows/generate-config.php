<?php
/**
 * Script pour générer config.php depuis les variables d'environnement
 * Utilisé par GitHub Actions pour créer config.php lors du déploiement
 */

$config = [
    'OPENAI_API_KEY' => getenv('OPENAI_API_KEY') ?: '',
    'GOOGLE_API_KEY' => getenv('GOOGLE_API_KEY') ?: '',
    'GOOGLE_CSE_ID' => getenv('GOOGLE_CSE_ID') ?: '',
    'PEXELS_API_KEY' => getenv('PEXELS_API_KEY') ?: '',
    'GPT_MODEL' => getenv('GPT_MODEL') ?: 'gpt-4o-mini',
    'SYSTEM_MESSAGE' => getenv('SYSTEM_MESSAGE') ?: 'Tu es Guide France, un conseiller touristique virtuel pour toutes les régions de France. Tu aides les utilisateurs à découvrir les spécialités locales, les activités, et les meilleurs endroits où manger, dormir, ou visiter.',
    'OPENAI_API_URL' => 'https://api.openai.com/v1/chat/completions'
];

$output = "<?php\n";
$output .= "/**\n";
$output .= " * Fichier de configuration pour l'API GPT\n";
$output .= " * Généré automatiquement depuis les secrets GitHub lors du déploiement\n";
$output .= " */\n\n";
$output .= "return [\n";

foreach ($config as $key => $value) {
    if ($key === 'SYSTEM_MESSAGE') {
        // Pour le prompt multiligne, utiliser heredoc ou échapper correctement
        $output .= "    '{$key}' => " . var_export($value, true) . ",\n";
    } else {
        $output .= "    '{$key}' => " . var_export($value, true) . ",\n";
    }
}

$output .= "];\n";

file_put_contents(__DIR__ . '/config.php', $output);
echo "✅ config.php généré avec succès\n";

