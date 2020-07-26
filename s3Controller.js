//Get the AWS SDK
var AWS = require('aws-sdk');

var credentials = {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey : process.env.SECRET_ACCESS_KEY
};

AWS.config.update({credentials: credentials, region: 'us-east-1'});

//Initalize S3
var s3 = new AWS.S3();

const PUTCOMMAND = "putObject";
const GETCOMMAND = "getObject";
const BUCKETNAME = process.env.BUCKET_NAME;

async function getAllDisplayUrl() {
  const { Contents } = await listObjects();

  let signedUrls = [];
  let promises = Contents.map(content => getSignedDisplayUrl(content.Key));

  return Promise.all(promises).then((results) => results)
}

function listObjects() {
  const params = {
    Bucket: BUCKETNAME,
  }

  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    })
  });
}

async function getSignedDisplayUrl(key) {
    const params = {
        Bucket: BUCKETNAME,
        Key: key,
        Expires: 500,
    }

    return s3.getSignedUrlPromise(GETCOMMAND, params).then(res => res)
}

async function deleteObject(KEY) {
    const params = {
        Bucket: BUCKETNAME,
        Key: KEY
    }

    const promise = new Promise((resolve, reject) => {
        s3.deleteObject(params, (error, data) => {
            if (error) {
                reject(error);
            }else {
                resolve(data);
            }
        })
    })

    return promise
}

module.exports = {
    getSignedDisplayUrl,
    deleteObject,
    listObjects,
    getAllDisplayUrl
}