const functions = require("firebase-functions");
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

/////////////////////////////////////////////////
// SET CONFIG
const BUCKET = 'shared-santa-app.appspot.com'
/////////////////////////////////////////////////

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// Can be invoked: https://us-central1-shared-santa-app.cloudfunctions.net/helloFromNorthPole
exports.helloFromNorthPole = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from the North Pole! This is a Firebase GCF!");
});

// This is the open web version.
// Can be invoked: https://us-central1-shared-santa-app.cloudfunctions.net/getAllImagesWeb
exports.getAllImagesWeb = functions.https.onRequest((request, response) => {
    listFiles('shared-santa-app.appspot.com').then( files => {
        response.send(JSON.stringify(files));
      })
});

// This is the 'callable function' version.
// Can only be invoked by Firebase app
exports.getAllImages = functions.https.onCall((data, context) => {
    return listFiles('shared-santa-app.appspot.com').then(files => {
        return files
    })
});

async function listFiles(bucketName) {
    // Lists files in the bucket
    const [files] = await storage.bucket(bucketName).getFiles();
  
    // Uncomment this block to print the image filenames to console
    // console.log('Files:');
    // for(const file of files) {
    //   console.log(file.name);
    // }
  
    return files.map(file => `https://storage.googleapis.com/${BUCKET}/${file.name}`);
}