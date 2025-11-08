# Office du Tourisme de Lanvéoc

Site web moderne pour l'Office du Tourisme de la Mairie de Lanvéoc.

## 🚀 Déploiement

Ce dépôt est configuré pour déployer automatiquement sur o2switch via FTP en utilisant git-ftp lorsque des changements sont poussés sur la branche main/master.

### Configuration GitHub Actions

Le déploiement utilise GitHub Actions et nécessite les secrets suivants dans le dépôt :

1. Allez sur : https://github.com/akjoecapoeira007/mairie-lanveoc/settings/secrets/actions
2. Ajoutez les secrets suivants :
   - `FTP_USERNAME` - Nom d'utilisateur FTP
   - `FTP_HOST` - Adresse du serveur FTP
   - `FTP_PORT` - Port FTP (généralement 21)
   - `FTP_PASSWORD` - Mot de passe FTP

Une fois les secrets configurés, chaque push sur `main` déclenchera automatiquement le déploiement.

### Déploiement Local

Pour déployer manuellement avec git-ftp :

**Option 1 : Utiliser le script de déploiement**

```bash
# Définir les variables d'environnement
export FTP_USERNAME="votre-username"
export FTP_HOST="votre-host"
export FTP_PASSWORD="votre-password"

# Exécuter le script
./deploy.sh
```

**Option 2 : Déploiement manuel**

```bash
# Définir les variables d'environnement
export FTP_USERNAME="votre-username"
export FTP_HOST="votre-host"
export FTP_PASSWORD="votre-password"

# Configurer git-ftp
git config git-ftp.user "$FTP_USERNAME"
git config git-ftp.url "$FTP_HOST"
git config git-ftp.password "$FTP_PASSWORD"
git config git-ftp.remote-root "public_html/mairie-lanveoc"

# Premier déploiement (init)
git ftp init

# Déploiements suivants
git ftp push
```

## 📁 Structure du Projet

- `index.html` - Page principale du site
- `styles.css` - Feuille de style CSS
- `script.js` - JavaScript pour l'interactivité
- `.github/workflows/deploy.yml` - Workflow GitHub Actions pour le déploiement automatique

## 🎨 Caractéristiques

- Design moderne et responsive
- Navigation fluide avec menu mobile
- Sections : Accueil, Découvrir, Activités, Contact
- Formulaire de contact
- Animations et transitions
- Optimisé pour tous les appareils

