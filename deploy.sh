#!/bin/bash

# Deploy script for git-ftp
# Usage: ./deploy.sh

# Check if environment variables are set
if [ -z "$FTP_USERNAME" ] || [ -z "$FTP_HOST" ] || [ -z "$FTP_PASSWORD" ]; then
    echo "Error: FTP credentials not set as environment variables"
    echo "Please set the following environment variables:"
    echo "  export FTP_USERNAME=your_username"
    echo "  export FTP_HOST=your_host"
    echo "  export FTP_PASSWORD=your_password"
    echo ""
    echo "Then run: ./deploy.sh"
    exit 1
fi

# Configure git-ftp
git config git-ftp.user "$FTP_USERNAME"
git config git-ftp.url "$FTP_HOST"
git config git-ftp.password "$FTP_PASSWORD"
git config git-ftp.remote-root "/"

# Deploy
echo "Deploying to FTP..."
git ftp push --syncroot .

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed!"
    exit 1
fi

