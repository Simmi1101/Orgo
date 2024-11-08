const aws = require('aws-sdk');
const crypto = require('crypto');
const util = require('util');
require("dotenv").config();

const randomBytes = util.promisify(crypto.randomBytes);

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESSKEYID;
const secretAccessKey = process.env.AWS_SECRETACCESSKEY;
const bucketName = process.env.AWS_BUCKETNAME;
// console.log("bucketName",bucketName)


const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4"
})
const generateFileUrl = async() => {
    const bytes = await randomBytes(16);
    const imageName = bytes.toString('hex');

    const params = {
        Bucket:bucketName,
        key: imageName,
        Expires: 60
    }

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    return signedUrl;
}

module.exports = generateFileUrl;