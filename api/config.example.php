<?php
/**
 * Fichier de configuration exemple
 * Copiez ce fichier en config.php et ajoutez votre clé API
 * Le fichier config.php est ignoré par git pour la sécurité
 */

return [
    'OPENAI_API_KEY' => 'votre-cle-api-ici',
    
    // Google Custom Search API pour les images (gratuit jusqu'à 100 requêtes/jour)
    // Obtenez votre clé sur: https://developers.google.com/custom-search/v1/overview
    // Créez un Custom Search Engine sur: https://cse.google.com/cse/
    // Dans les paramètres du CSE, activez "Search the entire web" et "Image search"
    'GOOGLE_API_KEY' => '', // Votre clé API Google
    'GOOGLE_CSE_ID' => '', // Votre Custom Search Engine ID
    
    // Pexels API (alternative, gratuite)
    'PEXELS_API_KEY' => '', // Votre clé Pexels (optionnel)
    // Modèles disponibles (du moins cher au plus cher):
    // 'gpt-4o-mini' - Le moins cher (~$0.15/$0.60 par 1M tokens), très rapide (recommandé)
    // 'gpt-3.5-turbo' - Économique (~$0.50/$1.50 par 1M tokens), rapide
    // 'gpt-4o' - Équilibre qualité/prix (~$2.50/$10 par 1M tokens)
    // 'gpt-4-turbo' - Plus cher (~$10/$30 par 1M tokens), meilleure qualité
    // 'gpt-5' - Le plus cher, meilleure qualité mais très coûteux
    'GPT_MODEL' => 'gpt-4o-mini', // Modèle économique recommandé
    'SYSTEM_MESSAGE' => 'Tu es Guide France, un conseiller touristique virtuel pour toutes les régions de France. Tu aides les utilisateurs à découvrir les spécialités locales, les activités, et les meilleurs endroits où manger, dormir, ou visiter.',
    'OPENAI_API_URL' => 'https://api.openai.com/v1/chat/completions'
];
