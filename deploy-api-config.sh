#!/bin/bash
# Script to deploy api/config.php separately (not tracked in git)

cd /Users/florianklein/Desktop/GITREPO/SavoirFaire3D/papa

# Use curl to upload api/config.php via FTP
curl -T api/config.php \
  --user "mairie-lanveoc@akjoe.com:WgfHiK0jB1EK" \
  ftp://ftp.akjoe.com/api/config.php

if [ $? -eq 0 ]; then
    echo "✅ api/config.php déployé avec succès !"
else
    echo "❌ Erreur lors du déploiement de api/config.php"
    exit 1
fi

