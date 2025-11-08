# API GPT Backend

Ce dossier contient l'endpoint PHP pour gérer les requêtes vers OpenAI GPT-5.

## Fichiers

- `gpt.php` - Endpoint principal pour les requêtes GPT
- `config.example.php` - Exemple de fichier de configuration
- `.htaccess` - Configuration Apache pour la sécurité

## Configuration

### Option 1: Utiliser les valeurs par défaut (déjà configurées)
Le fichier `gpt.php` contient déjà la clé API et la configuration. Fonctionne immédiatement.

### Option 2: Utiliser un fichier de configuration séparé (recommandé pour la production)

1. Copiez `config.example.php` en `config.php`:
   ```bash
   cp api/config.example.php api/config.php
   ```

2. Modifiez `api/config.php` avec votre clé API:
   ```php
   'OPENAI_API_KEY' => 'votre-cle-api-ici',
   ```

3. Le fichier `config.php` est ignoré par git pour la sécurité.

## Utilisation

L'endpoint accepte des requêtes POST avec un JSON contenant le message:

```javascript
fetch('api/gpt.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        message: 'Votre question ici'
    })
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log(data.content); // Réponse du GPT
    } else {
        console.error(data.error);
    }
});
```

## Réponse

### Succès
```json
{
    "success": true,
    "content": "Réponse du GPT...",
    "model": "gpt-5-2025-08-07",
    "usage": {
        "prompt_tokens": 68,
        "completion_tokens": 3342,
        "total_tokens": 3410
    }
}
```

### Erreur
```json
{
    "error": "Message d'erreur",
    "code": 400
}
```

## Sécurité

- La clé API est stockée côté serveur, jamais exposée au client
- CORS est configuré pour permettre les requêtes depuis votre domaine
- Le fichier `.htaccess` protège les fichiers de configuration

