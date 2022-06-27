const s3 = require('../../config/aws-s3/s3.config.js');
const environment = require('../../config/environment.js');

exports.download = (req, res) => {
  // download the file via aws s3 here
  const {dir, id, key} = req.params;
  const fileKey = dir + '/' + id + '/' + key;
  // console.log('Trying to download file', fileKey);
  const options = {
    Bucket: environment.BUCKET,
    Key: fileKey,
  };
  const s3Client = s3.s3Client;
  res.attachment(fileKey);
  const fileStream = s3Client.getObject(options).createReadStream();
  fileStream.pipe(res);
};
exports.downloadChat = (req, res) => {
  // download the file via aws s3 here
  const {key, fileName} = req.query;
  const fileKey = key;
  // console.log('Trying to download file', fileKey);
  const options = {
    Bucket: environment.BUCKET,
    Key: fileKey,
  };
  const s3Client = s3.s3Client;
  const params = {
    ...options,
    Expires: 3600,
    ResponseContentDisposition: `attachment; filename=${fileName}`,
  };
  const url = s3Client.getSignedUrl('getObject', params);
  return res.status(200).json({url: url});
};
