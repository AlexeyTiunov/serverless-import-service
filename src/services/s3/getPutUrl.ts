import { ListObjectsV2CommandOutput, S3 } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getPutUrl(key: string): Promise<string | null> {
  const client: S3 = new S3({ region: "eu-west-1" });
  try {
    const listParams = {
      Bucket: process.env.IMPORT_BUCKET,
      Key: process.env.UPLOAD_FOLDER,
    };
    const bucketItems: ListObjectsV2CommandOutput = await client.listObjectsV2(listParams);
    const isKeyExist = bucketItems.Contents.findIndex((item) => item.Key === process.env.UPLOAD_FOLDER + "/" + key.toLowerCase());
    if (isKeyExist < 0) {
      const params: PutObjectCommandInput = {
        Bucket: process.env.IMPORT_BUCKET,
        Key: process.env.UPLOAD_FOLDER + "/" + key.toLowerCase(),
      };
      const putC = new PutObjectCommand(params);
      return await getSignedUrl(client, putC);
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}
