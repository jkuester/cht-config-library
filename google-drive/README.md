# Google Drive integration

`cht-conf` supports pulling forms from Google Drive. This is useful for organizations that use Google Drive to store their forms (instead of storing the `.xlsx` files in their SCM).

The workflow demonstrated by this subproject is one where the forms are stored in Google Drive (in the shared [`default` forms](https://drive.google.com/drive/folders/1g5r430ek-uF7YP8kRvtvMc_pNx8xtbFM?usp=drive_link) directory), and the NPM scripts automatically call `cht fetch-forms-from-google-drive` to download the latest version of the forms before compiling them. The .gitignore file is set to ignore the `/forms` directory, so they are not tracked by git.

## Usage

See the [CHT Docs](https://docs.communityhealthtoolkit.org/apps/guides/forms/google-drive/) for additional information, but basically to connect `cht-conf` with Google Drive, you need to follow [these steps](https://developers.google.com/drive/activity/v2/guides/project) to:

- Create a Google Cloud project
- Enable the Drive API on that project
- Create OAuth credentials

When creating the OAuth credentials, you will need to first create an OAuth consent screen. Then you will be able to use the "CREATE CREDENTIALS" button to create an "OAuth client ID". You can select "Desktop app" as the application type. Then, you will be able to download the credentials as a JSON file. This file contains the `client_id`, `client_secret`, and `redirect_uris` that need to be copied to your `.gdrive.secrets.json` file.

Alternatively, instead of the `.gdrive.secrets.json` file, you can set the following environment variables:

- `GOOGLE_CLIENT_ID` 
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`

When running `cht fetch-forms-from-google-drive` for the first time, it will prompt you to open a link in your browser to authenticate with Google Drive. After you authenticate, you will be redirected to a localhost URL with a `code` query parameter that contains the authentication code. This code needs to be copied back to the terminal where `cht fetch-forms-from-google-drive` is running.

## CI Setup

OAuth flows make automated CI runs difficult. To work around this, you can use a Google service account. In your Google Cloud project, create a service account. Make sure the account has the `Service Account Token Creator` role and has access to the files on Google Drive. (Note that service accounts are technically not members of an organization. So, files only shared with the organization will not be accessible to the service account. If you are an organization admin, you can grant `Domain-wide Delegation` to your service account, otherwise just share the files/directories directly with your service account email address.) 

Then you can configure your CI workflow to log in with the service account. This will allow for bypassing the normal consent screen which requires manual input. For GitHub actions, the `google-github-actions/auth` action supports authenticating with the service account key and getting back an OAuth access token. Save this token in `.gdrive.session.json` and set the `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI` environment variables. Then cht-conf will use the provided credentials to access Google Drive. See the [GitHub workflow config](../.github/workflows/build.yml) for this repo for more details.

## Local development

Running the tests for this project locally requires a Google account and manual user input (copying the authorization token from browser to complete the OAuth flow). Because of this, tests for this project are not run locally by default (when running tests for all projects via the root `test` script). If you want to run the tests locally, you can run the npm `test` script in this `google-drive` directory, or you can set the `CI` envar when executing the root `test` script. The tests for this project are always run in CI.

```shell
CI=true npm run test
```
