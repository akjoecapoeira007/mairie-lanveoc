#!/bin/bash
# Hook pour déployer automatiquement après chaque push
# Ce script est utilisé automatiquement par l'assistant

cd /Users/florianklein/Desktop/GITREPO/SavoirFaire3D/papa

# Déployer avec git-ftp
echo "🚀 Déploiement en cours..."
git ftp push

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi !"
else
    echo "❌ Erreur lors du déploiement"
    exit 1
fi

