# Google Drive integration


To connect cht-conf with your Google Drive, you need to follow [these steps](https://developers.google.com/drive/activity/v2/guides/project) to:

- Create a Google Cloud project
- Enable the Drive API on that project
- Create OAuth credentials

When creating the OAuth credentials, you will need to first create an OAuth consent screen. Then you will be able to use the "CREATE CREDENTIALS" button to create an "OAuth client ID". You can select "Desktop app" as the application type. Then, you will be able to download the credentials as a JSON file. This file contains the `client_id`, `client_secret`, and `redirect_uris` that needs to be copied to the `.gdrive.secrets.json` file.

Alternatively, instead of the `.gdrive.secrets.json` file, you can set the following environment variables:

- `GOOGLE_CLIENT_ID` 
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`

When running `cht fetch-forms-from-google-drive` for the first time, it will prompt you to open a link in your browser to authenticate with Google Drive. After you authenticate, you will be redirected to a localhost URL with a `code` query parameter that contains the authentication code. This code needs to be copied back to the terminal where `cht fetch-forms-from-google-drive` is running.


