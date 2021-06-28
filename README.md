# Google Drive CMS

[This shared Google Drive folder](https://drive.google.com/drive/folders/1smalxMj6mvavnxE_w7IcATZc-GVPSUd1) serves as the backend for [this sample webpage](https://google-drive-cms.herokuapp.com/).

Quick links: [Github](https://github.com/nathanbabcock/google-drive-cms) / [NPM](https://www.npmjs.com/package/google-drive-cms) / [Dockerhub](https://hub.docker.com/r/nathanbabcock/google-drive-cms) / [Heroku](https://google-drive-cms.herokuapp.com/)

## NPM

```sh
npm i google-drive-cms
```

## Run local demo

```sh
npm i
npm start
```

*Note:* The local demo app connects to a remote backend deployed on Heroku. To run your own backend and connect to your own Google Drive, you will need to create your own API credentials by following the steps in the next section.

## Connecting to Google APIs via Service account credentials

### Create a new Google Cloud project
- Go to [Google Cloud Platform Console](https://console.cloud.google.com/)
- Create a [new project](https://console.cloud.google.com/projectcreate)

### Enable Google APIs for the project
- Double check that your new project is selected (dropdown in top left)
- Go to [APIs and Services](https://console.cloud.google.com/apis/dashboard)
- Enable [Google Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com)
- Enable [Google Sheets API](https://console.cloud.google.com/marketplace/product/google/sheets.googleapis.com)

### Generate Service Account credentials
- Go to [Credentials](https://console.cloud.google.com/apis/credentials)
- "Create Credentials" > "Service account"
  1. Choose a name and email for the account
  2. Skip step 2
  3. Give your primary google account admin rights to manage this service account
- Select the Service account you just created
- Go to the KEYS tab
  - "ADD KEY" > Create new key
  - Use key type "JSON" and download the credentials `.json` file
  - **Rename** the file to `credentials.json` and **move** it to `/secret/credentials.json` in this repo.

## Node.js usage

```js
const GoogleDriveCMS = require('google-drive-cms')
const cms = new GoogleDriveCMS();
cms.getDoc('1UC7Ah...').then(console.log);
```

## Express server

```sh
node node_modules/google-drive-cms/express.js
```

## Docker image

Get the image on [Docker Hub](https://hub.docker.com/r/nathanbabcock/google-drive-cms).

```sh
# pull from docker hub
docker pull nathanbabcock/google-drive-cms

# or build locally:
docker build . -t nathanbabcock/google-drive-cms

# run container, passing in CLIENT_EMAIL and PRIVATE_KEY 
docker run \
  --name google-drive-cms \
  --restart=always \
  --log-opt max-size=100m \
  --log-opt max-file=5 \
  -e CLIENT_EMAIL=your-client-email-here@npm-drive-cms.iam.gserviceaccount.com \
  -e PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n entire private keyfile here \n-----END PRIVATE KEY-----\n" \
  -v cache:/usr/src/app/cache \
  -p 80:80 \
  -d \
  nathanbabcock/google-drive-cms
```
