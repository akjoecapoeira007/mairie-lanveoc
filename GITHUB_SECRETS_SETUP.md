# Configuration des Secrets GitHub pour le Déploiement Automatique

Le fichier `api/config.php` est maintenant généré automatiquement lors du déploiement depuis les secrets GitHub.

## 🔐 Secrets à configurer

Allez sur : **https://github.com/akjoecapoeira007/mairie-lanveoc/settings/secrets/actions**

### Secrets obligatoires

1. **OPENAI_API_KEY**
   - Votre clé API OpenAI
   - Exemple: `sk-proj-...`

2. **FTP_USERNAME**
   - Nom d'utilisateur FTP
   - Exemple: `mairie-lanveoc@akjoe.com`

3. **FTP_HOST**
   - Adresse du serveur FTP
   - Exemple: `ftp.akjoe.com`

4. **FTP_PORT**
   - Port FTP (généralement 21)

5. **FTP_PASSWORD**
   - Mot de passe FTP

### Secrets optionnels (pour personnaliser le prompt)

6. **SYSTEM_MESSAGE** (optionnel mais recommandé)
   - Le prompt système complet
   - **IMPORTANT**: Pour un prompt multiligne, collez-le tel quel dans le secret
   - GitHub supporte les secrets multilignes
   - Si non défini, un prompt par défaut sera utilisé

7. **GPT_MODEL** (optionnel)
   - Modèle à utiliser (défaut: `gpt-4o-mini`)
   - Options: `gpt-4o-mini`, `gpt-3.5-turbo`, `gpt-4o`, `gpt-4-turbo`, `gpt-5`

8. **GOOGLE_API_KEY** (optionnel)
   - Pour la recherche d'images Google

9. **GOOGLE_CSE_ID** (optionnel)
   - ID du Custom Search Engine Google

10. **PEXELS_API_KEY** (optionnel)
    - Pour la recherche d'images Pexels

## 📝 Exemple de SYSTEM_MESSAGE

Voici le prompt actuel que vous pouvez copier dans le secret `SYSTEM_MESSAGE`:

```
Tu es Guide France, un conseiller touristique virtuel pour toutes les régions de France.
Utilise que des infos verifiees sur les sites officiels de l office du tourisme de l endroit demandé 

IMPORTANT - Format de réponse requis:
- Réponses COMPLÈTES avec toutes les informations utiles
- Structure tes réponses avec des sections claires
- Pour chaque lieu/restaurant/activité, INCLUS TOUJOURS:
  * Le nom complet
  * L'adresse complète (rue, code postal, ville)
  * Les horaires d'ouverture (si disponibles)
  * Le numéro de téléphone (si disponible)
  * 2-3 points clés sur ce qui le rend spécial
- Utilise des listes à puces pour faciliter la comparaison
- Si tu mentionnes un lieu spécifique (restaurant, paysage, monument), indique-le clairement pour qu'on puisse chercher une image

Format suggéré:
**Nom du lieu**
📍 Adresse: [adresse complète]
🕒 Horaires: [horaires]
📞 Téléphone: [numéro si disponible]
- Point clé 1
- Point clé 2
- Point clé 3

Tu aides les utilisateurs à découvrir les spécialités locales, les activités, et les meilleurs endroits où manger, dormir, ou visiter. Si une question n est pas liée au tourisme, réponds que tu ne connais pas la réponse et suggere de visiter le site officiel de l office du tourisme.
```

## ✅ Après configuration

Une fois tous les secrets configurés :
1. Faites un push sur `main` (ou attendez le prochain push)
2. GitHub Actions générera automatiquement `config.php` sur le serveur
3. Le déploiement inclura le fichier `config.php` avec votre prompt

## 🔄 Modifier le prompt

Pour modifier le prompt :
1. Modifiez le secret `SYSTEM_MESSAGE` dans GitHub
2. Faites un push (ou modifiez n'importe quel fichier et poussez)
3. Le nouveau prompt sera déployé automatiquement

