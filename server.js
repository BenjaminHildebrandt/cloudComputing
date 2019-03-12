var express = require('express');
var config = require('./config');
var msRestAzure = require('ms-rest-azure');
var msMng = require('azure-arm-mediaservices');
var msRest = require('ms-rest');
var azureStorage = require('azure-storage');
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var async = require('async');
var request = require('request');


var app = express();
var port = 3000;

// Variables
const encodingTransform = "mediaEncoding";

// Database connection
const sequelize = new Sequelize(config.db, 'cloudComp19', 'cloudComp2019', {
  host: config.dbHost,
  dialect: 'mssql',
  dialectOptions: {
    encrypt: true
  },
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Import DB models
app.Video = sequelize.import("./App/Models/Video.js");
app.User = sequelize.import("./App/Models/User.js");

// Set associations between models
app.Video.belongsTo(app.User); // Adds a field user_id to video
app.User.hasMany(app.Video, { as: 'Videos' }); // Need to check what this does

// Create the tables if not set up
app.Video.sync();
app.User.sync();

// Create the connection to Azure
msRestAzure.loginWithServicePrincipalSecret(
  config.aadClientId, //appId
  config.aadSecret, //secret
  config.aadTenantId, //tenant
  (err, credentials) => {
    if (err) {
      console.log("Error while connecting to azure");
    }
    amsClient = new msMng(credentials, config.subscriptionId, config.armEndpoint, {noRetryPolicy: true});
  }
)

// Send index page
app.get('/', (req, res) => {

});


app.get('/Assets', (req, res) => {
  res.end({ "data": "hello world" });
});

app.post('/createAssets', (req, res) => {
  res.send({ "data": "success" });
});



// Start server
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
})

async function createOutputAsset(assetName) {
  return await amsClient.assets.createOrUpdate(config.resourceGroup, config.accountName, assetName, {});
}

// Create asset from a file
async function createInputAsset(assetName, file) {
  var asset = await amsClient.assets.createOrUpdate(config.resourceGroup, config.accountName, assetName, {});
  var date = new Date();
  date.setHours(date.getHours() + 1);
  var input = {
    permissions: "ReadWrite",
    expiryTime: date
  }
  var response = await amsClient.assets.listContainerSas(config.resourceGroup, config.accountName, assetName, input);
  let uploadSasUrl = response.assetContainerSasUrls[0] || null;
  let fileName = path.basename(fileToUpload);
  let sasUri = url.parse(uploadSasUrl);
  let sharedBlobService = azureStorage.createBlobServiceWithSas(sasUri.host, sasUri.search);
  let containerName = sasUri.pathname.replace(/^\/+/g, '');
  let randomInt = Math.round(Math.random() * 100);
  blobName = fileName + randomInt;
  console.log("uploading to blob...");
  function createBlobPromise() {
    return new Promise(function (resolve, reject) {
      sharedBlobService.createBlockBlobFromLocalFile(containerName, blobName, fileToUpload, resolve);
    });
  }
  await createBlobPromise();
  return asset;
}

// Create a streaminglocator
async function createStreamingLocator(resourceGroup, accountName, assetName, locatorName)
{
  let streamingLocator = {
    assetName: assetName,
    streamingPolicyName: "Predefined_ClearStreamingOnly"
  };

  let locator = await amsClient.streamingLocators.create(
      config.resourceGroup,
      config.accountName,
      locatorName,
      streamingLocator);

  return locator;
}

// Get urls for streaming content
async function getStreamingUrls(resourceGroup, accountName, locatorName) {
  let streamingEndpoint = await azureMediaServicesClient.streamingEndpoints.get(resourceGroup, accountName, "default");

  let paths = await azureMediaServicesClient.streamingLocators.listPaths(resourceGroup, accountName, locatorName);

  for (let i = 0; i < paths.streamingPaths.length; i++) {
    let path = paths.streamingPaths[i].paths[0];
    console.log("https://" + streamingEndpoint.hostName + "//" + path);
  }
}
