#!/bin/bash
# Script to deploy config.js separately (not tracked in git)

cd /Users/florianklein/Desktop/GITREPO/SavoirFaire3D/papa

# Use curl to upload config.js via FTP
curl -T config.js \
  --user "mairie-lanveoc@akjoe.com:WgfHiK0jB1EK" \
  ftp://ftp.akjoe.com/config.js

if [ $? -eq 0 ]; then
    echo "✅ config.js déployé avec succès !"
else
    echo "❌ Erreur lors du déploiement de config.js"
    exit 1
fi

