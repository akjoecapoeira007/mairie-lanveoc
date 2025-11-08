# Configuration du GPT Personnalisé

## Où trouver l'ID du modèle/assistant

### Option 1: Modèle personnalisé (Fine-tuned)
1. Allez sur https://platform.openai.com/finetune
2. Trouvez votre modèle dans la liste
3. L'ID ressemble à: `ft:gpt-4-0613:org-name:model-name:xxxxx`

### Option 2: Assistant personnalisé (GPTs)
1. Allez sur https://platform.openai.com/assistants
2. Cliquez sur votre assistant "guide-france"
3. L'ID se trouve dans l'URL ou dans les paramètres
4. L'ID ressemble à: `asst_xxxxxxxxxxxxx`

### Option 3: Modèle standard
Si vous n'avez pas de modèle personnalisé, utilisez un modèle standard:
- `gpt-4-turbo-preview`
- `gpt-4`
- `gpt-3.5-turbo`

## Comment mettre à jour

1. Ouvrez le fichier `config.js` sur le serveur
2. Modifiez `GPT_MODEL` avec le bon ID
3. Si c'est un Assistant, changez `USE_ASSISTANT_API` à `true` et ajoutez `ASSISTANT_ID`

