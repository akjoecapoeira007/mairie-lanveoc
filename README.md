# Mairie Lanvéoc

Website for Mairie Lanvéoc

## Deployment

This repository is configured to automatically deploy to o2switch via FTP using git-ftp when changes are pushed to the main/master branch.

### Setup

The deployment uses GitHub Actions and requires the following secrets to be configured in the repository:

- `FTP_USERNAME` - FTP username
- `FTP_HOST` - FTP host address
- `FTP_PORT` - FTP port (usually 21)
- `FTP_PASSWORD` - FTP password

### Local Development

To deploy manually using git-ftp:

```bash
# Set environment variables
export FTP_USERNAME="your-username"
export FTP_HOST="your-host"
export FTP_PASSWORD="your-password"

# Deploy
git ftp push
```

