import AWS from 'aws-sdk';

let s3;

export function initialize() {
  // TODO don't commit these, pull them from env variables
  // in DEV, and from the AMI thing on the aws deployment.

  // For `uqdraw-test` IAM user
  const accessKeyId = 'AKIAJ7MLTCTWVMXAAJOA';
  const secretAccessKey = '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';

  AWS.config.update({
    accessKeyId,
    secretAccessKey,
  });
  AWS.config.region = 'ap-southeast-2';

  s3 = new AWS.S3({
    params: {
      Bucket: 'uqdraw',
    }
  });
}

export function uploadResponse(presentationId, questionId,
  responseId, repsonseImg) {
  if (!s3) initialize();

  // TODO probably need a contentType
  s3.upload({
    Key: `${presentationId}/${questionId}/${responseId}`,
    Body: repsonseImg
  }, function() {
    // Place it in the database.
  });

  return new Promise((resolve, reject) => {

  });
}
