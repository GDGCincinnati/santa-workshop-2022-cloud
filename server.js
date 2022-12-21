const express = require('express');
const app = express();
const { Storage } = require('@google-cloud/storage');

const storage = new Storage();

/////////////////////////////////////////////////
// SET CONFIG
const BUCKET = 'shared-santa-app.appspot.com'
/////////////////////////////////////////////////

app.get('/', (req, res) => {
  res.send("Hello from Shared-Santa-App! This will be the API for Santa's workshop!");
});

app.get('/v1/getAllImages', (req, res) => {
    listFiles('shared-santa-app.appspot.com').then( files => {
      res.send(JSON.stringify(files));
    })
  });

app.get('/viewWishlist', (req, res) => {
    listFiles('shared-santa-app.appspot.com').then( imgUrls => {
      res.send(genWishListHtml(imgUrls));
    })
  });

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

function genWishListHtml(imgUrls){
  let s = ''
  for(const imgUrl of imgUrls) {
    s += `<img src="${imgUrl}" style="width: 400px; height: auto;"><br /><br />`
  }
  return `
    <html>
      <head>
        <title>My Wishlist</title>
      </head>
      <body>
        <center>
          ${s}
        </center>
      </body>
    </html>
  `
}

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