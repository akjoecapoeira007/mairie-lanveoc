# Configuration Google Images Search

Pour utiliser la recherche d'images Google, vous devez configurer Google Custom Search API.

## Étapes de configuration

### 1. Créer un Custom Search Engine (CSE)

1. Allez sur https://cse.google.com/cse/
2. Cliquez sur "Add" pour créer un nouveau moteur de recherche
3. Dans "Sites to search", entrez: `*` (pour rechercher tout le web)
4. Cliquez sur "Create"
5. Cliquez sur "Control Panel" de votre nouveau CSE
6. Allez dans "Setup" → "Basics"
7. Activez "Search the entire web"
8. Allez dans "Setup" → "Advanced" → "Image search"
9. Activez "Image search"
10. Copiez votre "Search engine ID" (c'est votre GOOGLE_CSE_ID)

### 2. Obtenir une clé API Google

1. Allez sur https://console.cloud.google.com/
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez "Custom Search API" dans la bibliothèque d'APIs
4. Allez dans "Credentials" → "Create Credentials" → "API Key"
5. Copiez votre clé API (c'est votre GOOGLE_API_KEY)

### 3. Configurer dans config.php

Ajoutez dans `api/config.php`:

```php
'GOOGLE_API_KEY' => 'VOTRE_CLE_API_ICI',
'GOOGLE_CSE_ID' => 'VOTRE_CSE_ID_ICI',
```

### 4. Limites

- **Gratuit**: 100 requêtes/jour
- **Payant**: $5 pour 1000 requêtes supplémentaires

### Alternative: Pexels API

Si vous préférez utiliser Pexels (gratuit, illimité):
1. Créez un compte sur https://www.pexels.com/api/
2. Obtenez votre clé API
3. Ajoutez dans config.php: `'PEXELS_API_KEY' => 'votre-cle-pexels'`

