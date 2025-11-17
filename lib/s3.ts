import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadQRToS3(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: `qr-codes/${fileName}`,
    Body: buffer,
    ContentType: 'image/png',
    // ACL: 'public-read',
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 Upload Error:', error);
    throw new Error('Failed to upload QR to S3');
  }
}