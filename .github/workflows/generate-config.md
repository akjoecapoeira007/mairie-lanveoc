# Configuration GitHub Secrets pour le déploiement automatique

Pour que `config.php` soit généré automatiquement lors du déploiement, ajoutez ces secrets dans GitHub :

## Secrets requis

Allez sur : https://github.com/akjoecapoeira007/mairie-lanveoc/settings/secrets/actions

### Secrets obligatoires

1. **OPENAI_API_KEY** - Votre clé API OpenAI
2. **FTP_USERNAME** - Nom d'utilisateur FTP
3. **FTP_HOST** - Adresse du serveur FTP
4. **FTP_PASSWORD** - Mot de passe FTP

### Secrets optionnels (pour le prompt personnalisé)

5. **SYSTEM_MESSAGE** - Le prompt système complet (multiligne)
   - Si non défini, un prompt par défaut sera utilisé
   - Pour un prompt multiligne, utilisez `\n` pour les retours à la ligne

6. **GPT_MODEL** - Modèle à utiliser (défaut: `gpt-4o-mini`)

7. **GOOGLE_API_KEY** - Clé API Google (optionnel, pour images Google)

8. **GOOGLE_CSE_ID** - ID du Custom Search Engine (optionnel)

9. **PEXELS_API_KEY** - Clé API Pexels (optionnel, pour images)

## Format du SYSTEM_MESSAGE

Pour un prompt multiligne dans les secrets GitHub, utilisez `\n` pour les retours à la ligne :

```
Tu es Guide France, un conseiller touristique virtuel.\n\nIMPORTANT - Format de réponse requis:\n- Réponses COMPLÈTES...
```

Ou utilisez un secret multiligne directement (GitHub le supporte).

